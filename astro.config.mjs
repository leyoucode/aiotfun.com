// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aiotfun.com',
  // 不用 Astro 会话和图片处理，避免适配器自动创建 KV 和 Images 绑定
  session: false,
  adapter: cloudflare({ imageService: 'passthrough' }),

  vite: {
    plugins: [tailwindcss()]
  }
});
