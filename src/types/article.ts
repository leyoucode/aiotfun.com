export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
  readingTime: number;
  lang: 'en' | 'zh';
  pinned?: boolean;
  tags: string[];
}

export type ProjectStatus = 'active' | 'shipped' | 'open-source' | 'paused' | 'archived';

export interface Project {
  slug: string;
  title: string;
  oneLiner: string;
  status: ProjectStatus;
  techStack: string[];
  cover?: string;
  startDate: string;
  endDate?: string;
  repoUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  lang: 'en' | 'zh';
  tags: string[];
  order?: number;
}
