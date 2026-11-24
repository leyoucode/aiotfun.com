// 星图布局（构建时计算）：每个分类一个圆团，团内的点按向日葵螺旋排列，Star 多的在中心。
import { SHELVES, type ShelfKey } from './taxonomy.ts';
import type { Project } from './projects.ts';

export interface MapCluster { key: ShelfKey; label: string; count: number; x: number; y: number; r: number }
export interface MapPoint { id: string; title: string; summary: string; x: number; y: number; size: number }

const SPACING = 16; // 相邻点的间距
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const GAP = 48; // 团与团之间的最小间隙（含标签空间）

export function layoutMap(projects: Project[]): { clusters: MapCluster[]; points: MapPoint[] } {
  const groups = (Object.keys(SHELVES) as ShelfKey[])
    .map((key) => ({ key, items: projects.filter((p) => p.ai.shelf === key).sort((a, b) => b.github.stars - a.github.stars) }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);

  const clusters: MapCluster[] = [];
  const points: MapPoint[] = [];
  const maxLogStars = Math.log10(Math.max(...projects.map((p) => p.github.stars), 10));

  for (const g of groups) {
    const r = SPACING * Math.sqrt(g.items.length + 1) * 0.95 + SPACING;
    // 贪心放置：从中心向外按螺旋试探，找到第一个不与已有圆团重叠的位置
    let x = 0;
    let y = 0;
    if (clusters.length) {
      outer: for (let d = 0; ; d += 12) {
        for (let k = 0; k < 36; k++) {
          const a = (k / 36) * Math.PI * 2 + d * 0.01;
          const cx = Math.cos(a) * d * 1.35; // 横向拉宽，适配宽屏
          const cy = Math.sin(a) * d;
          if (clusters.every((c) => Math.hypot(c.x - cx, c.y - cy) >= c.r + r + GAP)) {
            x = cx;
            y = cy;
            break outer;
          }
        }
      }
    }
    clusters.push({ key: g.key, label: SHELVES[g.key], count: g.items.length, x, y, r });
    g.items.forEach((p, i) => {
      const rr = SPACING * 0.95 * Math.sqrt(i + 0.5);
      const t = i * GOLDEN;
      points.push({
        id: p.id,
        title: p.ai.title,
        summary: p.ai.summary,
        x: x + Math.cos(t) * rr,
        y: y + Math.sin(t) * rr,
        size: 3 + (Math.log10(Math.max(p.github.stars, 10)) / maxLogStars) * 3.5,
      });
    });
  }
  return { clusters, points };
}
