import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles } from '../../utils/articles';

export async function GET(context: APIContext) {
  const articles = await getArticles('zh');
  return rss({
    title: 'AIoTFun — 刘伟',
    description: '刘伟的 AI + IoT 折腾园 —— 项目、笔记和正在进行的实验。',
    site: context.site!,
    items: articles.map((a) => ({
      title: a.title,
      description: a.description,
      pubDate: new Date(a.date),
      link: `/zh/writing/${a.slug}/`,
      categories: a.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}
