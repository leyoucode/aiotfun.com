// 构建时读取已上架项目，并提供货架、相似推荐等查询。
import {
  DIFFICULTY, FEATURED_PLATFORMS, PLATFORMS, SHELVES,
  type PlatformKey, type ProjectAi, type ProjectRecord, type ShelfKey,
} from './taxonomy.ts';

export type Project = ProjectRecord & { ai: ProjectAi };

const modules = import.meta.glob<ProjectRecord>('../../data/projects/*.json', { eager: true, import: 'default' });

export const projects: Project[] = Object.values(modules)
  .filter((p): p is Project => p.status === 'approved' && p.ai !== null)
  .sort((a, b) => b.github.stars - a.github.stars || a.id.localeCompare(b.id));

export const projectIds = new Set(projects.map((p) => p.id));

export const owner = (p: Project) => p.repo.split('/')[0];

export const formatStars = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

// 货架：分类、平台、计算货架共用一个 key 空间（平台 key 与分类 key 不重名）
export interface ShelfDef {
  key: string;
  title: string;
  subtitle: string;
  items: Project[];
}

const byReviewedDesc = (a: Project, b: Project) => (b.reviewedAt ?? '').localeCompare(a.reviewedAt ?? '');

export function allShelves(): ShelfDef[] {
  const computed: ShelfDef[] = [
    { key: 'hot', title: '热门', subtitle: '按 GitHub Star 排序，社区最认可的项目。', items: projects },
    { key: 'beginner', title: '适合入门', subtitle: `难度为「${DIFFICULTY.beginner}」：买现成开发板，烧录就能玩。`, items: projects.filter((p) => p.ai.difficulty === 'beginner') },
    { key: 'recent', title: '最近上架', subtitle: '新收录的项目。', items: [...projects].sort(byReviewedDesc) },
  ];
  const categories: ShelfDef[] = (Object.keys(SHELVES) as ShelfKey[]).map((k) => ({
    key: k,
    title: SHELVES[k],
    subtitle: '',
    items: projects.filter((p) => p.ai.shelf === k),
  }));
  const platforms: ShelfDef[] = FEATURED_PLATFORMS.map((k: PlatformKey) => ({
    key: k,
    title: `基于 ${PLATFORMS[k]}`,
    subtitle: `主控是 ${PLATFORMS[k]} 的项目。`,
    items: projects.filter((p) => p.ai.platform === k),
  }));
  return [...computed, ...categories, ...platforms];
}

// 相似项目：共享标签每个 +2，同分类 +2，同平台 +1，硬件角色重合每个 +1
export function similarTo(p: Project, n: number): Project[] {
  const roles = new Set(p.ai.hardware.map((h) => h.role));
  return projects
    .filter((q) => q.id !== p.id)
    .map((q) => {
      let score = q.ai.tags.filter((t) => p.ai.tags.includes(t)).length * 2;
      if (q.ai.shelf === p.ai.shelf) score += 2;
      if (q.ai.platform === p.ai.platform) score += 1;
      score += new Set(q.ai.hardware.map((h) => h.role).filter((r) => roles.has(r))).size;
      return { q, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.q.github.stars - a.q.github.stars)
    .slice(0, n)
    .map((x) => x.q);
}

// 首页热门标签：出现次数最多的标签
export function topTags(n: number): string[] {
  const count = new Map<string, number>();
  for (const p of projects) for (const t of p.ai.tags) count.set(t, (count.get(t) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([t]) => t);
}
