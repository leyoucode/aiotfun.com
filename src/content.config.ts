import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    cover: z.string().optional(),
    readingTime: z.number(),
    pinned: z.boolean().optional().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { articles };
