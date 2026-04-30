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
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Noto Sans SC', 'sans-serif'],
      },
      maxWidth: {
        content: '1600px',
        prose: '960px',
      },
      boxShadow: {
        card: 'none',
      },
      borderRadius: {
        card: '6px',
      },
    },
  },
  plugins: [],
};
