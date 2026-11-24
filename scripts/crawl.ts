// 从 GitHub 搜索开源 AIoT 项目，写入候选池 data/projects/*.json。
// 用法：node scripts/crawl.ts [--pages 3]
// GitHub API 免费；鉴权用本机 gh 登录的 token。
import { execFileSync } from 'node:child_process';
import { repoToId, type ProjectGithub, type ProjectRecord } from '../src/lib/taxonomy.ts';
import { argValue, log, readAllProjects, readReadme, sleep, writeProject, writeReadme } from './lib.ts';

const QUERIES = [
  'esp32 llm',
  'esp32 chatgpt',
  'esp32 openai',
  'esp32 gemini',
  'esp32 voice assistant',
  'esp32 ai',
  'esp32-s3 ai',
  'esp32 camera ai',
  'esp32 tinyml',
  'esp32 语音',
  'esp32 大模型',
  'xiaozhi esp32',
  'esp32 mcp',
  'esp32 whisper',
  'esp32 robot ai',
  'esp32 smart glasses',
  'm5stack ai',
  'esphome voice assistant',
  'topic:esp32 topic:ai',
  'topic:esp32 topic:llm',
  'topic:esp32 topic:chatgpt',
  'topic:esp32 topic:machine-learning',
  'arduino llm',
  'arduino chatgpt',
  'arduino tinyml',
  'raspberry pi llm robot',
  'raspberry pi robot ai',
  'raspberry pi voice assistant llm',
  'raspberry pi ai camera',
  'jetson robot llm',
];

const MIN_STARS = 30;
const PER_PAGE = 100;
const SEARCH_INTERVAL_MS = 2500; // 搜索接口限流：鉴权后每分钟 30 次

const pages = Number(argValue('pages') ?? 3);
const since = new Date(Date.now() - 2 * 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);
const token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'aiotfun-crawler',
};

interface SearchItem {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
  language: string | null;
  homepage: string | null;
  license: { spdx_id: string | null } | null;
}

function toGithub(item: SearchItem): ProjectGithub {
  return {
    stars: item.stargazers_count,
    license: item.license!.spdx_id!,
    pushedAt: item.pushed_at,
    description: item.description ?? '',
    topics: item.topics ?? [],
    language: item.language,
    homepage: item.homepage || null,
  };
}

// 只收能识别出开源 License 的仓库；NOASSERTION 表示 GitHub 识别不出，按无 License 处理
const hasLicense = (item: SearchItem) => !!item.license?.spdx_id && item.license.spdx_id !== 'NOASSERTION';

async function search(query: string, page: number): Promise<SearchItem[]> {
  const q = `${query} stars:>=${MIN_STARS} pushed:>=${since} fork:false archived:false`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${PER_PAGE}&page=${page}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`search ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const body = (await res.json()) as { items: SearchItem[] };
  return body.items;
}

async function fetchReadme(fullName: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
    headers: { ...headers, Accept: 'application/vnd.github.raw' },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`readme ${res.status}`);
  return res.text();
}

const existing = new Map((await readAllProjects()).map((p) => [p.id, p]));
const seen = new Map<string, SearchItem>();
let searchCalls = 0;

for (const query of QUERIES) {
  let hits = 0;
  try {
    for (let page = 1; page <= pages; page++) {
      if (searchCalls > 0) await sleep(SEARCH_INTERVAL_MS);
      searchCalls++;
      const items = await search(query, page);
      hits += items.length;
      for (const item of items) if (hasLicense(item)) seen.set(item.full_name, item);
      if (items.length < PER_PAGE) break;
    }
    log.info(`搜索「${query}」命中 ${hits} 个，累计去重后 ${seen.size} 个`);
  } catch (e) {
    log.error(`搜索「${query}」失败`, e);
  }
}

let added = 0;
let updated = 0;
let readmeMissing = 0;
for (const item of seen.values()) {
  const id = repoToId(item.full_name);
  const old = existing.get(id);
  try {
    if (old) {
      await writeProject({ ...old, github: toGithub(item) });
      updated++;
    } else {
      const record: ProjectRecord = { id, repo: item.full_name, status: 'candidate', github: toGithub(item), ai: null, reviewedAt: null };
      await writeProject(record);
      added++;
    }
    if (!(await readReadme(id))) {
      const readme = await fetchReadme(item.full_name);
      if (readme) await writeReadme(id, readme);
      else readmeMissing++;
    }
  } catch (e) {
    log.error(`处理 ${item.full_name} 失败`, e);
  }
}

log.info(`完成：搜索请求 ${searchCalls} 次；新增候选 ${added} 个，更新 ${updated} 个，无 README ${readmeMissing} 个`);
