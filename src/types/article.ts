export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
  readingTime: number;
  pinned?: boolean;
  tags: string[];
}
