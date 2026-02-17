/** Agent 团队详细资料（关于页用） */

export interface AgentProfile {
  id: string;
  name: string;
  role: { en: string; zh: string };
  icon: string;
  color: string;
  bio: { en: string; zh: string };
  status: 'online' | 'busy' | 'idle';
}

export const agentProfiles: AgentProfile[] = [
  {
    id: 'scout',
    name: 'Scout',
    role: {
      en: 'Source Monitor & Discovery',
      zh: '信源监控与发现',
    },
    icon: '●',
    color: '#10B981',
    bio: {
      en: 'Scout continuously monitors 127+ sources across GitHub, Hacker News, ArXiv, Reddit, and product launch platforms. When something interesting surfaces in the AI+IoT space, Scout flags it and creates a brief for the editorial team.',
      zh: 'Scout 持续监控 GitHub、Hacker News、ArXiv、Reddit 和产品发布平台等 127+ 个信源。当 AI+IoT 领域出现有趣的内容时，Scout 会标记它并为编辑团队创建简报。',
    },
    status: 'online',
  },
  {
    id: 'editor',
    name: 'Editor',
    role: {
      en: 'Content Curation & Quality',
      zh: '内容策划与质量把控',
    },
    icon: '▲',
    color: '#6366F1',
    bio: {
      en: 'Editor reviews Scout\'s discoveries, decides which topics deserve full coverage, assigns format tags (Spotlight, Radar, Under the Hood, etc.), and ensures every piece meets our quality bar before publication.',
      zh: 'Editor 审核 Scout 的发现，决定哪些话题值得深入报道，分配内容格式标签（聚光灯、雷达、引擎盖下等），并确保每篇文章在发布前达到我们的质量标准。',
    },
    status: 'busy',
  },
  {
    id: 'writer',
    name: 'Writer',
    role: {
      en: 'Article Writing & Research',
      zh: '文章撰写与调研',
    },
    icon: '◆',
    color: '#F59E0B',
    bio: {
      en: 'Writer transforms topics into engaging, well-researched articles. From deep technical dives to playful "Fun But Useless" features, Writer adapts tone and depth to match each format while keeping things accessible and fun.',
      zh: 'Writer 将话题转化为引人入胜、研究扎实的文章。从深度技术解析到轻松的"没啥用但是…"系列，Writer 会根据不同格式调整语调和深度，同时保持文章的可读性和趣味性。',
    },
    status: 'online',
  },
  {
    id: 'publisher',
    name: 'Publisher',
    role: {
      en: 'Publishing & Distribution',
      zh: '发布与分发',
    },
    icon: '■',
    color: '#EC4899',
    bio: {
      en: 'Publisher handles the final mile — formatting articles for the web, generating SEO metadata, creating social media snippets, and scheduling publications. Publisher also manages the weekly newsletter digest.',
      zh: 'Publisher 负责最后一公里——为网页排版文章、生成 SEO 元数据、创建社交媒体摘要以及安排发布时间表。Publisher 还负责管理每周的邮件通讯。',
    },
    status: 'idle',
  },
];
