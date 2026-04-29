import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles } from '../utils/articles';

export async function GET(context: APIContext) {
  const articles = await getArticles('en');
  return rss({
    title: 'AIoTFun — Wei Liu',
    description: "Wei Liu's AI + IoT playground — projects, notes, and works-in-progress.",
    site: context.site!,
    items: articles.map((a) => ({
      title: a.title,
      description: a.description,
      pubDate: new Date(a.date),
      link: `/en/writing/${a.slug}/`,
      categories: a.tags,
    })),
    customData: '<language>en</language>',
  });
}
