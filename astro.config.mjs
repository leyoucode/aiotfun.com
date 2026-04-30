import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://aiotfun.com',
  compressHTML: true,
  integrations: [
    tailwind(),
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => theme.name === 'github-light' ? false : '.dark',
      defaultProps: {
        wrap: false,
      },
      styleOverrides: {
        borderRadius: '6px',
        codeFontFamily: "'JetBrains Mono', 'IBM Plex Mono', monospace",
        codeFontSize: '0.875rem',
        codeLineHeight: '1.6',
        frames: {
          shadowColor: 'transparent',
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
});
