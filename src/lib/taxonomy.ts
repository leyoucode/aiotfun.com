// 分类与枚举的唯一来源：抓取脚本、大模型提示词、内容校验、页面展示都从这里取值。

export const SHELVES = {
  voice: '语音助手',
  vision: '视觉识别',
  robot: '机器人',
  home: '智能家居',
  wearable: '可穿戴',
  sensing: '环境监测',
  desk: '桌面玩具',
  tools: '开发板与工具',
  other: '其他',
} as const;
export type ShelfKey = keyof typeof SHELVES;

export const PLATFORMS = {
  esp32: 'ESP32',
  'esp32-s3': 'ESP32-S3',
  'esp32-c3': 'ESP32-C3',
  'esp32-c6': 'ESP32-C6',
  arduino: 'Arduino',
  rpi: 'Raspberry Pi',
  rp2040: 'RP2040',
  stm32: 'STM32',
  jetson: 'Jetson',
  k210: 'K210',
  other: '其他',
} as const;
export type PlatformKey = keyof typeof PLATFORMS;

// 首页「按平台浏览」展示的平台，顺序即展示顺序
export const FEATURED_PLATFORMS: PlatformKey[] = ['esp32', 'esp32-s3', 'arduino', 'rpi', 'rp2040', 'stm32', 'jetson'];

export const HARDWARE_ROLES = {
  'audio-in': '麦克风',
  'audio-out': '扬声器',
  camera: '摄像头',
  display: '屏幕',
  sensor: '传感器',
  actuator: '电机/舵机',
  light: '灯光',
  input: '按键/输入',
  comm: '通信模块',
  power: '电源',
  other: '其他',
} as const;
export type HardwareRole = keyof typeof HARDWARE_ROLES;

export const AI_WHERE = {
  device: '端侧',
  edge: '本地网关',
  cloud: '云端',
} as const;
export type AiWhere = keyof typeof AI_WHERE;

export const DIFFICULTY = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '硬核',
} as const;
export type Difficulty = keyof typeof DIFFICULTY;

export const STATUS = ['candidate', 'approved', 'rejected'] as const;
export type Status = (typeof STATUS)[number];

export interface ProjectAi {
  relevant: boolean;
  title: string;
  summary: string;
  intro: string;
  shelf: ShelfKey;
  platform: PlatformKey;
  hardware: { name: string; role: HardwareRole }[];
  aiCapabilities: { name: string; where: AiWhere }[];
  difficulty: Difficulty;
  tags: string[];
}

export interface ProjectGithub {
  stars: number;
  license: string;
  pushedAt: string;
  description: string;
  topics: string[];
  language: string | null;
  homepage: string | null;
}

export interface ProjectRecord {
  id: string;
  repo: string;
  status: Status;
  github: ProjectGithub;
  ai: ProjectAi | null;
  reviewedAt: string | null;
}

export const repoToId = (fullName: string) => fullName.replace('/', '--');
