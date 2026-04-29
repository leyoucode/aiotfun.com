import en from '../i18n/en.json';
import zh from '../i18n/zh.json';

type Locale = 'en' | 'zh';

const translations: Record<Locale, typeof en> = { en, zh };

/** 从 URL 路径中提取语言 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locale === 'zh') return 'zh';
  return 'en';
}

/** 获取翻译对象 */
export function useTranslations(locale: Locale) {
  return translations[locale];
}

/** 获取语言切换 URL */
export function getLanguageSwitchUrl(url: URL): string {
  const locale = getLocaleFromUrl(url);
  const targetLocale = locale === 'en' ? 'zh' : 'en';
  const hasLocalePrefix = url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`;
  if (!hasLocalePrefix) {
    return `/${targetLocale}${url.pathname === '/' ? '/' : url.pathname}`;
  }
  const path = url.pathname.replace(`/${locale}`, `/${targetLocale}`);
  return path || `/${targetLocale}/`;
}

/** 生成带语言前缀的路径 */
export function localePath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}

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
