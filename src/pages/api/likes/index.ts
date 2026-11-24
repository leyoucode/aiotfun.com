import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

// 全量点赞计数：{ "<projectId>": n }
export const GET: APIRoute = async () => {
  try {
    const { results } = await env.DB.prepare('SELECT project_id, COUNT(*) AS n FROM likes GROUP BY project_id').all<{ project_id: string; n: number }>();
    const counts = Object.fromEntries(results.map((r) => [r.project_id, r.n]));
    return Response.json(counts, { headers: { 'Cache-Control': 'public, max-age=30' } });
  } catch (e) {
    console.error('[likes] 读取计数失败', e);
    return Response.json({ error: 'internal' }, { status: 500 });
  }
};
