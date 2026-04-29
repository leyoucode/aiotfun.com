import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Article } from '../types/article';

/** CollectionEntry → Article 转换 */
export function entryToArticle(entry: CollectionEntry<'articles'>): Article {
  const { data } = entry;
  // entry.id 是去除 .mdx 后缀的相对路径
  const slug = entry.id.split('/').pop()!;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    cover: data.cover,
    readingTime: data.readingTime,
    pinned: data.pinned,
    tags: data.tags,
  };
}

/** 所有文章（按日期降序、slug 字母序稳定排序） */
export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection('articles');
  return entries
    .map(entryToArticle)
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.slug.localeCompare(b.slug);
    });
}

/** 最新文章 */
export async function getLatestArticles(count = 6): Promise<Article[]> {
  const articles = await getArticles();
  return articles.slice(0, count);
}

/** Pinned 文章 */
export async function getPinnedArticles(): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.pinned);
}

/** 按 slug 查找 */
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}

/** 按 tag 筛选 */
export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.tags.includes(tag));
}

/** 所有唯一 tags */
export async function getAllTags(): Promise<string[]> {
  const articles = await getArticles();
  return [...new Set(articles.flatMap((a) => a.tags))];
}

/** 相关文章（按共享 tag 数量打分） */
export async function getRelatedArticles(article: Article, count = 3): Promise<Article[]> {
  const all = (await getArticles()).filter((a) => a.slug !== article.slug);
  const withScore = all.map((a) => ({
    article: a,
    score: a.tags.filter((tag) => article.tags.includes(tag)).length,
  }));
  withScore.sort((a, b) => b.score - a.score || new Date(b.article.date).getTime() - new Date(a.article.date).getTime());
  return withScore.slice(0, count).map((w) => w.article);
}

/** 获取 CollectionEntry（用于 render()） */
export async function getArticleEntry(slug: string): Promise<CollectionEntry<'articles'> | undefined> {
  const entries = await getCollection('articles');
  return entries.find((entry) => entry.id.split('/').pop() === slug);
}
