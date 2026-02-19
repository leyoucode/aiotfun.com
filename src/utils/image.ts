/**
 * Unsplash 图片 URL 优化工具
 * 利用 Unsplash CDN 的 auto=format 自动返回 WebP/AVIF
 */

export function optimizeImageUrl(url: string, width = 800, quality = 75): string {
  if (!url.includes('unsplash.com')) return url;

  try {
    const u = new URL(url);
    u.searchParams.set('w', String(width));
    u.searchParams.set('q', String(quality));
    u.searchParams.set('auto', 'format');
    u.searchParams.set('fit', 'crop');
    return u.toString();
  } catch {
    return url;
  }
}

export function generateSrcset(
  url: string,
  widths = [400, 600, 800, 1200],
  quality = 75,
): string {
  if (!url.includes('unsplash.com')) return '';

  return widths
    .map((w) => `${optimizeImageUrl(url, w, quality)} ${w}w`)
    .join(', ');
}
