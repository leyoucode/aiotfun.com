export interface RadarItem {
  id: number;
  title: string;
  source: string;
  url: string;
}

const radarEn: RadarItem[] = [
  { id: 1, title: 'Avalue Mini-ITX Board Packs 180 TOPS via Panther Lake-H', source: 'CNX Software', url: 'https://www.cnx-software.com/2026/02/13/avalue-emx-ptlp-a-thin-mini-itx-motherboard-powered-by-up-to-intel-core-ultra-7-358h-panther-lake-h-soc/' },
  { id: 2, title: 'Pebble Smartwatch Production Update — It\'s Really Happening', source: 'rePebble', url: 'https://repebble.com/blog/february-pebble-production-and-software-updates' },
  { id: 3, title: 'China 6G Fiber-Wireless Fusion Published in Nature', source: '36Kr', url: 'https://36kr.com/newsflashes/3689929747656326' },
  { id: 4, title: 'NVIDIA Teases "Never Before Seen" Chips at GTC 2026', source: '36Kr', url: 'https://36kr.com/newsflashes/3689739639320455' },
  { id: 5, title: 'Mimiclaw: OpenClaw-like AI Assistant for ESP32-S3', source: 'CNX Software', url: 'https://www.cnx-software.com/2026/02/13/mimiclaw-is-an-openclaw-like-ai-assistant-for-esp32-s3-boards/' },
];

const radarZh: RadarItem[] = [
  { id: 1, title: 'Avalue Mini-ITX 主板塞进 180 TOPS Panther Lake-H 算力', source: 'CNX Software', url: 'https://www.cnx-software.com/2026/02/13/avalue-emx-ptlp-a-thin-mini-itx-motherboard-powered-by-up-to-intel-core-ultra-7-358h-panther-lake-h-soc/' },
  { id: 2, title: 'Pebble 智能手表生产更新——真的要回来了', source: 'rePebble', url: 'https://repebble.com/blog/february-pebble-production-and-software-updates' },
  { id: 3, title: '中国 6G 光纤-无线融合通信论文登上 Nature', source: '36Kr', url: 'https://36kr.com/newsflashes/3689929747656326' },
  { id: 4, title: '英伟达预告 GTC 2026「前所未见」新芯片', source: '36Kr', url: 'https://36kr.com/newsflashes/3689739639320455' },
  { id: 5, title: 'Mimiclaw：面向 ESP32-S3 的 OpenClaw 类 AI 助手', source: 'CNX Software', url: 'https://www.cnx-software.com/2026/02/13/mimiclaw-is-an-openclaw-like-ai-assistant-for-esp32-s3-boards/' },
];

export function getRadarItems(lang: 'en' | 'zh'): RadarItem[] {
  return lang === 'zh' ? radarZh : radarEn;
}
