import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles } from '../../utils/articles';

export async function GET(context: APIContext) {
  const articles = await getArticles('zh');
  return rss({
    title: 'AIoTFun',
    description: 'AI 与 IoT 的有趣发现',
    site: context.site!,
    items: articles.map((a) => ({
      title: a.title,
      description: a.description,
      pubDate: new Date(a.date),
      link: `/zh/${a.category}/${a.slug}/`,
      categories: [a.category, ...a.tags],
    })),
    customData: '<language>zh-CN</language>',
  });
}
