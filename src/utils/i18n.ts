import zh from '../i18n/zh.json';

/** 站点文案 —— 单语中文站，集中管理 */
export const t = zh;

/** 项目状态对应的颜色（CSS 颜色值） */
const statusColors: Record<string, string> = {
  active: '#10B981',
  shipped: '#6366F1',
  'open-source': '#0D9488',
  paused: '#CA8A04',
  archived: '#6B7280',
};

export function getStatusColor(status: string): string {
  return statusColors[status] || '#6B7280';
}
