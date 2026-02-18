/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#F6F5F1',
        'bg-alt': '#F0EFEB',
        text: '#1A1A1A',
        'text-muted': '#6B7280',
        border: '#E8E6E1',
        accent: '#10B981',
        products: '#DC6843',
        boards: '#CA8A04',
        builds: '#0D9488',
        models: '#7C3AED',
        signals: '#6B7280',
      },
      fontFamily: {
        display: ['Instrument Serif', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
        body: ['Inter', 'Noto Sans SC', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
        prose: '720px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
};
