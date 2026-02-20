import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    cover: z.string(),
    category: z.enum(['products', 'boards', 'builds', 'models', 'signals']),
    agent: z.enum(['scout', 'editor', 'writer']),
    readingTime: z.number(),
    lang: z.enum(['en', 'zh']),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string()),
  }),
});

export const collections = { articles };
