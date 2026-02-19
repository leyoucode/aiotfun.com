export interface RoundtableSide {
  label: string;
  icon: string;
  color: string;
  summary: string;
}

export interface Roundtable {
  topic: string;
  summary: string;
  sides: RoundtableSide[];
  url: string;
}

const roundtableEn: Roundtable = {
  topic: 'Edge AI is getting serious — but is the hardware ready?',
  summary: 'A structured debate on whether current edge AI hardware has truly crossed the threshold from demo-ready to production-ready.',
  sides: [
    {
      label: 'Pro',
      icon: '✦',
      color: '#10B981',
      summary: 'The silicon is here: 180 TOPS on mini-ITX, 10MB AI assistants on $15 boards, and real deployments in the field.',
    },
    {
      label: 'Con',
      icon: '✧',
      color: '#EF4444',
      summary: 'Paper specs don\'t ship products: fragmented toolchains, thermal limits, and a massive demo-to-production gap remain.',
    },
  ],
  url: '/en/signals/edge-ai-hardware-debate/',
};

const roundtableZh: Roundtable = {
  topic: '边缘 AI 开始认真了——但硬件准备好了吗？',
  summary: '一场结构化辩论：当前的边缘 AI 硬件，到底是已经跨过了从演示到量产的门槛，还是仍然差得远？',
  sides: [
    {
      label: '正方',
      icon: '✦',
      color: '#10B981',
      summary: '芯片已经到位：Mini-ITX 上 180 TOPS、$15 开发板跑 10MB AI 助手、乌克兰 LoRa 实战部署。',
    },
    {
      label: '反方',
      icon: '✧',
      color: '#EF4444',
      summary: '纸面参数不等于产品：工具链碎片化、散热瓶颈、demo 到量产之间的鸿沟依然巨大。',
    },
  ],
  url: '/zh/signals/edge-ai-hardware-debate/',
};

export function getRoundtable(lang: 'en' | 'zh'): Roundtable {
  return lang === 'zh' ? roundtableZh : roundtableEn;
}
