// 数据脚本（crawl / enrich / review）共用的读写和日志工具。
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ProjectRecord } from '../src/lib/taxonomy.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const PROJECTS_DIR = join(ROOT, 'data/projects');
export const CACHE_DIR = join(ROOT, '.cache');
export const README_DIR = join(CACHE_DIR, 'readme');

export const log = {
  info: (...args: unknown[]) => console.info('[INFO]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};

export async function readAllProjects(): Promise<ProjectRecord[]> {
  await mkdir(PROJECTS_DIR, { recursive: true });
  const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith('.json')).sort();
  return Promise.all(files.map(async (f) => JSON.parse(await readFile(join(PROJECTS_DIR, f), 'utf8')) as ProjectRecord));
}

export async function writeProject(p: ProjectRecord): Promise<void> {
  await mkdir(PROJECTS_DIR, { recursive: true });
  await writeFile(join(PROJECTS_DIR, `${p.id}.json`), JSON.stringify(p, null, 2) + '\n');
}

export async function readReadme(id: string): Promise<string | null> {
  try {
    return await readFile(join(README_DIR, `${id}.md`), 'utf8');
  } catch {
    return null;
  }
}

export async function writeReadme(id: string, text: string): Promise<void> {
  await mkdir(README_DIR, { recursive: true });
  await writeFile(join(README_DIR, `${id}.md`), text);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function argValue(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
