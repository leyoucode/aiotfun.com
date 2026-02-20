import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles } from '../utils/articles';

export async function GET(context: APIContext) {
  const articles = await getArticles('en');
  return rss({
    title: 'AIoTFun',
    description: 'Discover Fun Things in AI & IoT',
    site: context.site!,
    items: articles.map((a) => ({
      title: a.title,
      description: a.description,
      pubDate: new Date(a.date),
      link: `/en/${a.category}/${a.slug}/`,
      categories: [a.category, ...a.tags],
    })),
    customData: '<language>en</language>',
  });
}
