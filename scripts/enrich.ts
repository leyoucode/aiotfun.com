// 用大模型把候选项目整理成结构化中文条目（摘要、分类、硬件清单、AI 能力）。
// 用法：node scripts/enrich.ts --limit 5
// 这是收费 API：每个项目调用 1 次，必须显式传 --limit。
// 密钥读环境变量 DASHSCOPE_API_KEY（可写在 ~/.zshrc 或项目根目录 .env）。
import {
  AI_WHERE, DIFFICULTY, HARDWARE_ROLES, PLATFORMS, SHELVES,
  type ProjectAi, type ProjectRecord,
} from '../src/lib/taxonomy.ts';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { argValue, CACHE_DIR, log, readAllProjects, readReadme, writeProject } from './lib.ts';

const FAILED_DIR = join(CACHE_DIR, 'enrich-failed');

// 换供应商时改这三项（DeepSeek：https://api.deepseek.com / deepseek-chat / DEEPSEEK_API_KEY）
const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const MODEL = 'qwen-plus';
const KEY_ENV = 'DASHSCOPE_API_KEY';

const README_MAX_CHARS = 12000;
const CONCURRENCY = 4;

try {
  process.loadEnvFile('.env');
} catch {
  // 没有 .env 就只用 shell 环境变量
}

const limitArg = argValue('limit');
if (!limitArg || !(Number(limitArg) > 0)) {
  log.error('必须指定 --limit N（每个项目调用 1 次收费 API）');
  process.exit(1);
}
const apiKey = process.env[KEY_ENV];
if (!apiKey) {
  log.error(`缺少环境变量 ${KEY_ENV}`);
  process.exit(1);
}

const enumList = (o: Record<string, string>) => Object.entries(o).map(([k, v]) => `${k}（${v}）`).join('、');

const SYSTEM_PROMPT = `你是一个 AIoT 开源项目编辑，负责把 GitHub 仓库整理成中文项目卡片。只根据给你的仓库信息和 README 写，README 没提到的不要编造。只输出一个 JSON 对象，字段如下：

- relevant：布尔值。项目和"AI + 硬件设备"直接相关时为 true：设备固件、硬件设计、设备端 AI 库或 SDK、专门给某类设备提供 AI 能力的服务端都算。与硬件无关的通用软件、与 AI 无关的硬件项目为 false。
- title：简短中文名，不超过 16 个字。项目名是专有名词时可以保留英文原名。
- summary：一句话说清它是什么、能干什么，不超过 60 个字。
- intro：2 到 4 段介绍，段落之间用 \\n\\n 分隔，每段不超过 120 个字。依次讲：它是什么；硬件和 AI 怎么配合工作；亮点；适合什么人做。
- shelf：主分类，只能取 ${enumList(SHELVES)} 中的 key。
- platform：主控平台，只能取 ${enumList(PLATFORMS)} 中的 key。
- hardware：数组，最多 10 项，列出 README 明确提到的关键外设。不要列主控芯片和开发板本身（它已经在 platform 里），也不要列线缆、转接头、电脑、手机。没有外设就给空数组。每项 {"name": 型号或通用名, "role": 角色}，role 只能取 ${enumList(HARDWARE_ROLES)} 中的 key。
- aiCapabilities：数组，1 到 5 项。每项 {"name": 不超过 8 个字的中文能力名，例如"语音对话""人脸识别""手势识别", "where": 运行位置}，where 只能取 ${enumList(AI_WHERE)} 中的 key。
- difficulty：动手难度，只能取 ${enumList(DIFFICULTY)} 中的 key。买现成开发板烧录即可用为 beginner；需要接线、改配置或自建服务端为 intermediate；需要画板、焊接、训练模型为 advanced。
- tags：3 到 6 个中文短标签，每个不超过 6 个字。`;

function buildUserPrompt(p: ProjectRecord, readme: string | null): string {
  const cleaned = (readme ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // markdown 图片和徽章
    .replace(/<img[^>]*>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, README_MAX_CHARS);
  return [
    `仓库：${p.repo}`,
    `描述：${p.github.description || '（无）'}`,
    `Topics：${p.github.topics.join(', ') || '（无）'}`,
    `主要语言：${p.github.language ?? '未知'}`,
    `README：\n${cleaned || '（无 README）'}`,
  ].join('\n');
}

// 校验大模型输出；不合格返回错误原因，合格返回规整后的数据
function validate(raw: unknown): ProjectAi | string {
  if (typeof raw !== 'object' || raw === null) return '不是对象';
  const o = raw as Record<string, unknown>;
  const str = (k: string, max: number) => typeof o[k] === 'string' && (o[k] as string).trim().length > 0 && (o[k] as string).length <= max;
  if (typeof o.relevant !== 'boolean') return 'relevant 不是布尔值';
  if (!str('title', 24)) return 'title 缺失或过长';
  if (!str('summary', 100)) return 'summary 缺失或过长';
  if (!str('intro', 800)) return 'intro 缺失或过长';
  if (!(typeof o.shelf === 'string' && o.shelf in SHELVES)) return `shelf 非法：${o.shelf}`;
  if (!(typeof o.platform === 'string' && o.platform in PLATFORMS)) return `platform 非法：${o.platform}`;
  if (!(typeof o.difficulty === 'string' && o.difficulty in DIFFICULTY)) return `difficulty 非法：${o.difficulty}`;
  if (!Array.isArray(o.hardware)) return 'hardware 不是数组';
  for (const h of o.hardware) {
    if (typeof h?.name !== 'string') return `hardware 项非法：${JSON.stringify(h)}`;
    if (!(h.role in HARDWARE_ROLES)) h.role = 'other'; // 枚举外的角色（如 storage）归到"其他"
  }
  if (!Array.isArray(o.aiCapabilities)) return 'aiCapabilities 不是数组';
  // 与 AI 无关的项目允许没有 AI 能力，照样保存，审核时直接拒绝，避免付费重跑
  if (o.aiCapabilities.length === 0 && o.relevant) return 'aiCapabilities 为空';
  for (const a of o.aiCapabilities) {
    if (typeof a?.name !== 'string' || !(a?.where in AI_WHERE)) return `aiCapabilities 项非法：${JSON.stringify(a)}`;
  }
  if (!Array.isArray(o.tags) || o.tags.some((t) => typeof t !== 'string')) return 'tags 非法';
  return {
    relevant: o.relevant,
    title: (o.title as string).trim(),
    summary: (o.summary as string).trim(),
    intro: (o.intro as string).trim(),
    shelf: o.shelf as ProjectAi['shelf'],
    platform: o.platform as ProjectAi['platform'],
    hardware: (o.hardware as ProjectAi['hardware']).slice(0, 10).map((h) => ({ name: h.name.trim(), role: h.role })),
    aiCapabilities: (o.aiCapabilities as ProjectAi['aiCapabilities']).slice(0, 5).map((a) => ({ name: a.name.trim(), where: a.where })),
    difficulty: o.difficulty as ProjectAi['difficulty'],
    tags: (o.tags as string[]).map((t) => t.trim()).filter(Boolean).slice(0, 6),
  };
}

const usage = { prompt: 0, completion: 0, calls: 0 };

async function enrichOne(p: ProjectRecord): Promise<boolean> {
  const readme = await readReadme(p.id);
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(p, readme) },
      ],
    }),
  });
  usage.calls++;
  if (!res.ok) {
    log.error(`${p.repo} 调用失败 ${res.status}：${(await res.text()).slice(0, 300)}`);
    return false;
  }
  const body = (await res.json()) as {
    choices: { message: { content: string } }[];
    usage?: { prompt_tokens: number; completion_tokens: number };
  };
  usage.prompt += body.usage?.prompt_tokens ?? 0;
  usage.completion += body.usage?.completion_tokens ?? 0;
  let parsed: unknown;
  try {
    parsed = JSON.parse(body.choices[0].message.content);
  } catch {
    log.error(`${p.repo} 返回的不是合法 JSON`);
    return false;
  }
  const result = validate(parsed);
  if (typeof result === 'string') {
    // 原始输出留底，人工看过后可以手工修正写回，不必再付费调用
    await mkdir(FAILED_DIR, { recursive: true });
    await writeFile(join(FAILED_DIR, `${p.id}.json`), JSON.stringify(parsed, null, 2));
    log.error(`${p.repo} 校验失败：${result}（原始输出已存到 .cache/enrich-failed/）`);
    return false;
  }
  await writeProject({ ...p, ai: result });
  log.info(`${p.repo} → ${result.title}｜${SHELVES[result.shelf]}｜${result.relevant ? '相关' : '不相关'}`);
  return true;
}

const pending = (await readAllProjects())
  .filter((p) => p.status === 'candidate' && p.ai === null)
  .sort((a, b) => b.github.stars - a.github.stars)
  .slice(0, Number(limitArg));

log.info(`待整理 ${pending.length} 个项目，将调用收费 API ${pending.length} 次（模型 ${MODEL}）`);

let ok = 0;
const queue = [...pending];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let p = queue.shift(); p; p = queue.shift()) {
      try {
        if (await enrichOne(p)) ok++;
      } catch (e) {
        log.error(`${p.repo} 异常`, e);
      }
    }
  }),
);

log.info(`完成：实际调用 ${usage.calls} 次，成功 ${ok} 个；token 输入 ${usage.prompt}，输出 ${usage.completion}`);
