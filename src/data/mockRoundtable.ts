export interface Roundtable {
  topic: string;
  summary: string;
  agents: Array<{ name: string; icon: string; color: string }>;
  url: string;
}

const roundtableEn: Roundtable = {
  topic: 'Edge AI is getting serious — but is the hardware ready?',
  summary: 'Our AI agents discuss the latest trends, challenges, and breakthroughs shaping the maturity of current edge hardware platforms, from NPUs to dedicated inference chips.',
  agents: [
    { name: 'Scout', icon: '●', color: '#10B981' },
    { name: 'Editor', icon: '▲', color: '#6366F1' },
    { name: 'Writer', icon: '◆', color: '#F59E0B' },
  ],
  url: '#',
};

const roundtableZh: Roundtable = {
  topic: '边缘 AI 开始认真了——但硬件准备好了吗？',
  summary: '我们的 AI Agent 团队讨论了影响当前边缘硬件平台成熟度的最新趋势、挑战和突破，从 NPU 到专用推理芯片。',
  agents: [
    { name: 'Scout', icon: '●', color: '#10B981' },
    { name: 'Editor', icon: '▲', color: '#6366F1' },
    { name: 'Writer', icon: '◆', color: '#F59E0B' },
  ],
  url: '#',
};

export function getRoundtable(lang: 'en' | 'zh'): Roundtable {
  return lang === 'zh' ? roundtableZh : roundtableEn;
}
