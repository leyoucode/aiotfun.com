export interface RadarItem {
  id: number;
  title: string;
  source: string;
  url: string;
}

const radarEn: RadarItem[] = [
  { id: 1, title: 'IoT AI Released', source: 'Hacker News', url: '#' },
  { id: 2, title: 'Arduino Opta PLC Now Available', source: 'Arduino Blog', url: '#' },
  { id: 3, title: 'Matter 1.5 Specification Published', source: 'CSA', url: '#' },
  { id: 4, title: 'Edge Impulse Raises New Funding', source: 'TechCrunch', url: '#' },
  { id: 5, title: 'Raspberry Pi AI HAT+ Announced', source: 'Raspberry Pi', url: '#' },
];

const radarZh: RadarItem[] = [
  { id: 1, title: 'IoT AI 正式发布', source: 'Hacker News', url: '#' },
  { id: 2, title: 'Arduino Opta PLC 现已上市', source: 'Arduino Blog', url: '#' },
  { id: 3, title: 'Matter 1.5 规范正式发布', source: 'CSA', url: '#' },
  { id: 4, title: 'Edge Impulse 完成新一轮融资', source: 'TechCrunch', url: '#' },
  { id: 5, title: '树莓派 AI HAT+ 发布', source: 'Raspberry Pi', url: '#' },
];

export function getRadarItems(lang: 'en' | 'zh'): RadarItem[] {
  return lang === 'zh' ? radarZh : radarEn;
}
