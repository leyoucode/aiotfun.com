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

/** 获取翻译函数 */
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

/** 分类色映射 */
const categoryColors: Record<string, string> = {
  products: '#DC6843',
  boards: '#CA8A04',
  builds: '#0D9488',
  models: '#7C3AED',
  signals: '#6B7280',
  weekly: '#10B981',
};

/** 获取分类对应的颜色值 */
export function getCategoryColor(category: string): string {
  return categoryColors[category] || '#6B7280';
}

/** 分类对应的 Tailwind 类名 */
export function getCategoryColorClass(category: string): string {
  const map: Record<string, string> = {
    products: 'bg-products',
    boards: 'bg-boards',
    builds: 'bg-builds',
    models: 'bg-models',
    signals: 'bg-signals',
    weekly: 'bg-weekly',
  };
  return map[category] || 'bg-signals';
}
