import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Project } from '../types/article';

export function entryToProject(entry: CollectionEntry<'projects'>): Project {
  const { data } = entry;
  const slug = entry.id.split('/').pop()!;
  return {
    slug,
    title: data.title,
    oneLiner: data.oneLiner,
    status: data.status,
    techStack: data.techStack,
    cover: data.cover,
    startDate: data.startDate,
    endDate: data.endDate,
    repoUrl: data.repoUrl,
    liveUrl: data.liveUrl,
    featured: data.featured,
    tags: data.tags,
    order: data.order,
  };
}

/** 所有项目（order 升序优先，否则 startDate 降序） */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects');
  return entries
    .map(entryToProject)
    .sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      const dateDiff = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.slug.localeCompare(b.slug);
    });
}

export async function getFeaturedProjects(count = 4): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured).slice(0, count);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getProjectEntry(slug: string): Promise<CollectionEntry<'projects'> | undefined> {
  const entries = await getCollection('projects');
  return entries.find((entry) => entry.id.split('/').pop() === slug);
}
