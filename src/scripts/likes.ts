// 匿名点赞与本机收藏。localStorage 可能被禁用（隐私模式等），读写一律容错。
const ANON_KEY = 'aiotfun:anon';
const LIKED_KEY = 'aiotfun:liked';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 存不下就只在本次会话生效
  }
}

function anonId(): string {
  let id = read(ANON_KEY);
  if (!id) {
    id = crypto.randomUUID();
    write(ANON_KEY, id);
  }
  return id;
}

export function likedIds(): string[] {
  try {
    const v = JSON.parse(read(LIKED_KEY) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export const isLiked = (id: string) => likedIds().includes(id);

let counts: Promise<Record<string, number>> | null = null;
export function getCounts(): Promise<Record<string, number>> {
  counts ??= fetch('/api/likes')
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));
  return counts;
}

function paint(id: string, count: number) {
  for (const el of document.querySelectorAll<HTMLElement>(`[data-like-count="${CSS.escape(id)}"]`)) {
    el.querySelector('[data-num]')!.textContent = String(count);
    el.classList.toggle('hidden', count <= 0);
    el.classList.toggle('flex', count > 0);
  }
  for (const btn of document.querySelectorAll<HTMLElement>(`[data-like-btn="${CSS.escape(id)}"]`)) {
    btn.setAttribute('aria-pressed', String(isLiked(id)));
    const num = btn.querySelector('[data-num]');
    if (num) num.textContent = String(count);
  }
}

// 先改本机状态再请求接口；接口失败时本机收藏仍保留，只是计数不变
export async function setLiked(id: string, liked: boolean): Promise<void> {
  const set = new Set(likedIds());
  if (liked) set.add(id);
  else set.delete(id);
  write(LIKED_KEY, JSON.stringify([...set]));

  const current = (await getCounts())[id] ?? 0;
  paint(id, current);
  try {
    const res = await fetch(`/api/likes/${encodeURIComponent(id)}`, {
      method: liked ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonId: anonId() }),
    });
    if (!res.ok) return;
    const { count } = (await res.json()) as { count: number };
    (await getCounts())[id] = count;
    paint(id, count);
  } catch {
    // 网络失败：保留本机状态
  }
}

export async function paintAll() {
  const all = await getCounts();
  const ids = new Set<string>();
  for (const el of document.querySelectorAll<HTMLElement>('[data-like-count],[data-like-btn]')) {
    ids.add(el.dataset.likeCount ?? el.dataset.likeBtn!);
  }
  for (const id of ids) paint(id, all[id] ?? 0);
}

export function bindLikeButtons() {
  for (const btn of document.querySelectorAll<HTMLElement>('[data-like-btn]')) {
    btn.addEventListener('click', () => {
      const id = btn.dataset.likeBtn!;
      void setLiked(id, !isLiked(id));
    });
  }
}
