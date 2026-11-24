// 终端里逐条审核已整理的候选项目。
// 用法：node scripts/review.ts
// 按键：y 上架 / n 拒绝 / s 跳过 / o 浏览器打开 GitHub / q 退出
import { execFile } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { AI_WHERE, DIFFICULTY, HARDWARE_ROLES, PLATFORMS, SHELVES } from '../src/lib/taxonomy.ts';
import { log, readAllProjects, writeProject } from './lib.ts';

const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

const queue = (await readAllProjects())
  .filter((p) => p.status === 'candidate' && p.ai !== null)
  .sort((a, b) => Number(b.ai!.relevant) - Number(a.ai!.relevant) || b.github.stars - a.github.stars);

if (queue.length === 0) {
  log.info('没有待审核的项目（需要先运行 enrich.ts 整理）');
  process.exit(0);
}

if (!process.stdin.isTTY) {
  log.error('审核需要逐条按键，必须在交互式终端（Terminal / iTerm）里运行 pnpm review');
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const counts = { approved: 0, rejected: 0, skipped: 0 };
// 正常结束或 Ctrl+D 都走这里：汇总后退出（已审的条目每条按键后就已写盘）
rl.on('close', () => {
  log.info(`本次审核：上架 ${counts.approved}，拒绝 ${counts.rejected}，跳过 ${counts.skipped}`);
  process.exit(0);
});

review: for (const [i, p] of queue.entries()) {
  const ai = p.ai!;
  const url = `https://github.com/${p.repo}`;
  console.log('\n' + '─'.repeat(60));
  console.log(c.dim(`${i + 1}/${queue.length}`), c.bold(ai.title), c.dim(`${p.repo} · ★${p.github.stars} · ${p.github.license}`));
  if (!ai.relevant) console.log(c.red('⚠ 大模型判断与 AI + 硬件无关，建议拒绝'));
  console.log(ai.summary);
  console.log(c.dim(`分类 ${SHELVES[ai.shelf]} · 平台 ${PLATFORMS[ai.platform]} · 难度 ${DIFFICULTY[ai.difficulty]}`));
  console.log(c.dim('硬件 ') + (ai.hardware.map((h) => `${h.name}(${HARDWARE_ROLES[h.role]})`).join('、') || '无'));
  console.log(c.dim('AI   ') + ai.aiCapabilities.map((a) => `${a.name}(${AI_WHERE[a.where]})`).join('、'));
  console.log(c.dim('标签 ') + ai.tags.join('、'));
  console.log(c.dim(url));

  for (;;) {
    const key = (await rl.question('[y]上架 [n]拒绝 [s]跳过 [o]打开 [q]退出 > ')).trim().toLowerCase();
    if (key === 'o') {
      execFile('open', [url]);
      continue;
    }
    if (key === 'q') break review;
    if (key === 's') {
      counts.skipped++;
      break;
    }
    if (key === 'y' || key === 'n') {
      const status = key === 'y' ? 'approved' : 'rejected';
      await writeProject({ ...p, status, reviewedAt: new Date().toISOString() });
      counts[status]++;
      console.log(key === 'y' ? c.green('✓ 已上架') : c.red('✗ 已拒绝'));
      break;
    }
  }
}

rl.close();
