/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        'bg-alt': 'rgb(var(--color-bg-alt) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        accent: '#10B981',
        'card-bg': 'rgb(var(--color-card-bg) / <alpha-value>)',
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
        card: 'var(--shadow-card)',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
};
