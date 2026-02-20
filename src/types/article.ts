export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover: string;
  category: 'products' | 'boards' | 'builds' | 'models' | 'signals';
  agent: 'scout' | 'editor' | 'writer';
  readingTime: number;
  lang: 'en' | 'zh';
  featured?: boolean;
  tags: string[];
  body?: string;
}

export type Category = Article['category'];
