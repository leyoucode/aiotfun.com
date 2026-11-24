import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { projectIds } from '../../../lib/projects.ts';

export const prerender = false;

const WRITES_PER_HOUR = 60;
const HOUR_MS = 3600_000;
const ANON_ID = /^[A-Za-z0-9-]{8,64}$/;

async function hashIp(ip: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function countOf(id: string): Promise<number> {
  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM likes WHERE project_id = ?').bind(id).first<{ n: number }>();
  return row?.n ?? 0;
}

// POST 点赞、DELETE 取消；两者共用校验、限流和返回格式
async function handle(params: Record<string, string | undefined>, request: Request, like: boolean): Promise<Response> {
  const id = params.id ?? '';
  if (!projectIds.has(id)) return Response.json({ error: 'not_found' }, { status: 404 });

  let anonId: unknown;
  try {
    ({ anonId } = (await request.json()) as { anonId?: unknown });
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  if (typeof anonId !== 'string' || !ANON_ID.test(anonId)) return Response.json({ error: 'bad_request' }, { status: 400 });

  if (!env.IP_SALT) {
    console.error('[likes] 缺少 IP_SALT 配置');
    return Response.json({ error: 'internal' }, { status: 500 });
  }

  try {
    const now = Date.now();
    const ipHash = await hashIp(request.headers.get('CF-Connecting-IP') ?? 'unknown', env.IP_SALT);
    const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM like_events WHERE ip_hash = ? AND created_at > ?')
      .bind(ipHash, now - HOUR_MS)
      .first<{ n: number }>();
    if ((recent?.n ?? 0) >= WRITES_PER_HOUR) return Response.json({ error: 'rate_limited' }, { status: 429 });

    await env.DB.batch([
      like
        ? env.DB.prepare('INSERT OR IGNORE INTO likes (project_id, anon_id, created_at) VALUES (?, ?, ?)').bind(id, anonId, now)
        : env.DB.prepare('DELETE FROM likes WHERE project_id = ? AND anon_id = ?').bind(id, anonId),
      env.DB.prepare('INSERT INTO like_events (ip_hash, created_at) VALUES (?, ?)').bind(ipHash, now),
      env.DB.prepare('DELETE FROM like_events WHERE created_at < ?').bind(now - HOUR_MS),
    ]);
    return Response.json({ count: await countOf(id) });
  } catch (e) {
    console.error(`[likes] 写入失败 project=${id}`, e);
    return Response.json({ error: 'internal' }, { status: 500 });
  }
}

export const POST: APIRoute = ({ params, request }) => handle(params, request, true);
export const DELETE: APIRoute = ({ params, request }) => handle(params, request, false);
