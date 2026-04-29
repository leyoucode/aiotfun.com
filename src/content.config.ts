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

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    oneLiner: z.string(),
    status: z.enum(['active', 'shipped', 'open-source', 'paused', 'archived']),
    techStack: z.array(z.string()).default([]),
    cover: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    repoUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string()).default([]),
    order: z.number().optional(),
  }),
});

export const collections = { articles, projects };
