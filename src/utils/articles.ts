import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Article, Category } from '../types/article';

/** CollectionEntry → Article 转换 */
export function entryToArticle(entry: CollectionEntry<'articles'>): Article {
  const { data } = entry;
  // entry.id 格式: en/builds/esp32-voice-commands (去除 .mdx 后缀的路径)
  const slug = entry.id.split('/').pop()!;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    cover: data.cover,
    category: data.category,
    agent: data.agent,
    readingTime: data.readingTime,
    lang: data.lang,
    featured: data.featured,
    tags: data.tags,
  };
}

/** 获取指定语言的所有文章 */
export async function getArticles(lang: 'en' | 'zh'): Promise<Article[]> {
  const entries = await getCollection('articles', ({ data }) => data.lang === lang);
  return entries
    .map(entryToArticle)
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.slug.localeCompare(b.slug);
    });
}

/** 获取 featured 文章 */
export async function getFeaturedArticles(lang: 'en' | 'zh'): Promise<Article[]> {
  const articles = await getArticles(lang);
  return articles.filter((a) => a.featured);
}

/** 获取最新文章 */
export async function getLatestArticles(lang: 'en' | 'zh', count = 12): Promise<Article[]> {
  const articles = await getArticles(lang);
  return articles.slice(0, count);
}

/** 按 slug 查找文章 */
export async function getArticleBySlug(slug: string, lang: 'en' | 'zh'): Promise<Article | undefined> {
  const articles = await getArticles(lang);
  return articles.find((a) => a.slug === slug);
}

/** 按分类筛选文章（排除 weekly 标签文章，它们有独立列表页） */
export async function getArticlesByCategory(category: string, lang: 'en' | 'zh'): Promise<Article[]> {
  const articles = await getArticles(lang);
  return articles.filter((a) => a.category === category && !a.tags.includes('weekly'));
}

/** 获取相关文章（同分类或同标签） */
export async function getRelatedArticles(article: Article, lang: 'en' | 'zh', count = 3): Promise<Article[]> {
  const all = (await getArticles(lang)).filter((a) => a.slug !== article.slug);
  const withScore = all.map((a) => ({
    article: a,
    score: (a.category === article.category ? 10 : 0) +
      a.tags.filter((tag) => article.tags.includes(tag)).length,
  }));
  withScore.sort((a, b) => b.score - a.score);
  return withScore.slice(0, count).map((w) => w.article);
}

/** 获取指定标签的所有文章 */
export async function getArticlesByTag(tag: string, lang: 'en' | 'zh'): Promise<Article[]> {
  const articles = await getArticles(lang);
  return articles.filter((a) => a.tags.includes(tag));
}

/** 获取所有唯一标签 */
export async function getAllTags(lang: 'en' | 'zh'): Promise<string[]> {
  const articles = await getArticles(lang);
  return [...new Set(articles.flatMap((a) => a.tags))];
}

/** 返回所有分类 key */
export function getAllCategories(): Category[] {
  return ['products', 'boards', 'builds', 'models', 'signals'];
}

/** 获取 CollectionEntry（用于 render()） */
export async function getArticleEntry(slug: string, lang: 'en' | 'zh'): Promise<CollectionEntry<'articles'> | undefined> {
  const entries = await getCollection('articles', ({ data }) => data.lang === lang);
  return entries.find((entry) => entry.id.split('/').pop() === slug);
}
