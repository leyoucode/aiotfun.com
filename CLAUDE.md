# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIoTFun.com is **Wei Liu's personal indie hacker site** — a bilingual (EN/ZH) static site built with Astro 5. It hosts:

- A **Projects** section: case studies of things Wei has built (production systems, side projects, hardware tinkering, this site itself).
- A **Writing** section: debugging notes, technical investigations, project retrospectives, opinions.
- A **Now** page: what Wei is currently working on.
- An **About** page: Wei's story, tech stack, project timeline, contact info.

**Goal**: hiring credibility — a recruiter or potential collaborator should "get" Wei within 30 seconds.

**Theme**: AI + IoT + Fun. The writing voice is "engineer talking to engineers in plain language," not corporate marketing or AI summary.

> **History**: This site started life as an "AI-agent-operated AIoT news magazine" (RSS scraping → AI scoring → automated writeups). It was rebuilt in 2026-04 into the current personal site. The pre-rebuild snapshot lives on the `archive/news-site` branch.

## Commands

```bash
pnpm dev        # Dev server at localhost:4321
pnpm build      # Production build → dist/ (static pages + RSS feeds + Pagefind index)
pnpm preview    # Preview built site
```

No test framework is configured. Validate Astro changes with `pnpm build`.

## Architecture

- **Framework**: Astro 5 (SSG) + Tailwind CSS 3 + MDX content collections
- **Search**: Pagefind (build-time index, lazy-loaded UI)
- **Comments**: Giscus (GitHub Discussions backed)
- **Deployment**: Cloudflare Pages, auto-deployed on `git push` to master via `wrangler.toml`
- **Package manager**: pnpm

### Directory Structure

```
aiotfun.com/
├── astro.config.mjs       # Astro config (i18n, mdx, sitemap, tailwind)
├── tailwind.config.mjs    # Tailwind config (darkMode:'class', CSS variable colors)
├── wrangler.toml          # Cloudflare Pages deployment
├── public/                # Static assets (favicon, logo, og-default, robots.txt)
├── src/
│   ├── components/        # Astro components — see Key Components
│   ├── content/
│   │   ├── articles/      # MDX writing: [lang]/slug.mdx
│   │   └── projects/      # MDX project case studies: [lang]/slug.mdx
│   ├── i18n/              # en.json, zh.json
│   ├── layouts/           # BaseLayout, ArticleLayout, ProjectLayout
│   ├── pages/             # Routes — see Routing
│   ├── styles/            # global.css (CSS vars, .article-body styles)
│   ├── types/             # Article + Project types
│   └── utils/             # i18n.ts, articles.ts, projects.ts, image.ts
└── .claude/skills/        # write-article skill
```

### Routing

All pages are language-prefixed: `/en/*` and `/zh/*`. Root `/` redirects to `/en/`.

| Route | File | Notes |
|-------|------|-------|
| `/` | `pages/index.astro` | Redirect to `/en/` |
| `/[lang]/` | `pages/[lang]/index.astro` | Personal home: Hero + Featured Projects + Recent Writing |
| `/[lang]/about/` | `pages/[lang]/about.astro` | About page |
| `/[lang]/now/` | `pages/[lang]/now.astro` | Now page (manually updated) |
| `/[lang]/projects/` | `pages/[lang]/projects/index.astro` | Project listing |
| `/[lang]/projects/[slug]/` | `pages/[lang]/projects/[slug].astro` | Project case study |
| `/[lang]/writing/` | `pages/[lang]/writing/index.astro` | Writing list |
| `/[lang]/writing/[slug]/` | `pages/[lang]/writing/[slug].astro` | Article detail |
| `/rss.xml`, `/zh/rss.xml` | `pages/rss.xml.ts`, `pages/zh/rss.xml.ts` | RSS — feeds writing only |

Dynamic routes use `getStaticPaths()` to generate at build time.

### Content System

Two MDX content collections, both validated with Zod (see `src/content.config.ts`):

#### `articles` — writing

```yaml
title: ""
description: ""
date: "YYYY-MM-DD"
cover: ""           # Optional Unsplash URL with w=800&h=450&fit=crop
readingTime: 0
lang: "en" | "zh"
pinned: false       # Optional, used for surfacing on home page
tags: []
```

#### `projects` — project case studies

```yaml
title: ""
oneLiner: ""
status: "active" | "shipped" | "open-source" | "paused" | "archived"
techStack: []
cover: ""           # Optional
startDate: "YYYY-MM"
endDate: "YYYY-MM"  # Optional
repoUrl: ""         # Optional
liveUrl: ""         # Optional
featured: false     # Up to 4 featured per language — shown on home page
order: 1            # Optional, smaller = earlier (featured uses 1-4)
lang: "en" | "zh"
tags: []
```

**Important**: there is no longer a `category` field, no `agent` field. Tags are the only flat taxonomy.

Articles and projects can be written in **just one language** — UI / About / Now / Home are mandatory bilingual; individual articles and case studies are not.

Helper functions:
- `src/utils/articles.ts` — `getArticles(lang)`, `getLatestArticles(lang, n)`, `getPinnedArticles(lang)`, `getRelatedArticles(article, lang)`, `getArticleEntry(slug, lang)`, `entryToArticle(entry)`
- `src/utils/projects.ts` — `getProjects(lang)`, `getFeaturedProjects(lang, n)`, `getProjectEntry(slug, lang)`, `entryToProject(entry)`

### i18n

- Translation files: `src/i18n/en.json` and `src/i18n/zh.json`
- Utilities in `src/utils/i18n.ts`: `getLocaleFromUrl()`, `useTranslations()`, `getLanguageSwitchUrl()`, `localePath()`, `getStatusColor()`
- Pattern in components:
  ```astro
  const locale = getLocaleFromUrl(Astro.url);
  const t = useTranslations(locale);
  ```
- Some i18n keys accessed via `(t as any)` — typed translations don't cover all nested groups yet.

### Layouts

- `BaseLayout.astro` — Header + main slot + Footer + reading progress + back-to-top + search modal
- `ArticleLayout.astro` — Writing detail layout (wraps BaseLayout): TOC + Giscus + related writing
- `ProjectLayout.astro` — Project case study layout: status + tech stack + repo/live links + Giscus

### Key Components

- `PersonalHero.astro` — Personal landing block (title + role + summary + social links + Now CTA)
- `FeaturedProjects.astro` — Home page featured projects grid (uses `getFeaturedProjects`)
- `RecentWriting.astro` — Home page recent writing list (uses `getLatestArticles`)
- `ProjectCard.astro` — Project card (variants: `featured`, `medium`)
- `ArticleCard.astro` — Article card (variants: `large`, `medium`, `small`, `list`)
- `Header.astro` — Sticky nav with theme toggle, search, lang switch, mobile menu
- `Footer.astro` — Social links + RSS + copyright
- `BaseHead.astro` — Theme FOUC guard, fonts, SEO meta, OG, Twitter Card, hreflang, RSS link
- `OptimizedImage.astro` — Responsive WebP/AVIF + srcset + sizes
- `GiscusComments.astro` — Giscus (GitHub Discussions, theme-aware via postMessage)
- `ReadingProgress.astro` — Article reading progress bar (top, accent color)
- `TableOfContents.astro` — Article TOC sidebar (xl only, sticky, IntersectionObserver)
- `BackToTop.astro` — Scroll-to-top button
- `SearchModal.astro` — Pagefind UI modal (Cmd+K)

### Navigation

| Nav | EN | ZH | Route |
|-----|----|----|-------|
| Projects | Projects | 项目 | `/[lang]/projects/` |
| Writing | Writing | 写作 | `/[lang]/writing/` |
| Now | Now | 近况 | `/[lang]/now/` |
| About | About | 关于 | `/[lang]/about/` |

## Design Tokens (Tailwind)

**Dark mode**: `darkMode: 'class'`. Theme persisted in `localStorage('theme')`, defaults to system preference. FOUC prevented by inline script in `BaseHead.astro` + restored on `astro:after-swap`.

**Colors** (CSS variables, RGB space-separated for alpha support):
- Light: bg `246 245 241` (#F6F5F1), text `26 26 26`, card-bg `255 255 255`, border `232 230 225`
- Dark: bg `18 18 18` (#121212), text `232 230 225`, card-bg `26 26 26`, border `55 55 55`
- Tailwind usage: `bg-bg`, `text-text`, `bg-card-bg`, `text-text-muted`, `border-border` — all support `/<alpha>` modifier
- Fixed: accent `#10B981` (no dark variant)

**Fonts**: `font-display` (Instrument Serif), `font-body` (Inter), `font-mono` (JetBrains Mono), `font-logo` (Space Grotesk)

**Layout**: `max-w-content` (1200px), `max-w-prose` (720px), `rounded-card` (8px), `shadow-card`

**Project status colors** (from `src/utils/i18n.ts`):
- active: `#10B981` (accent green)
- shipped: `#6366F1` (indigo)
- open-source: `#0D9488` (teal)
- paused: `#CA8A04` (amber)
- archived: `#6B7280` (gray)

## Conventions

- No italics anywhere — titles use `font-bold`
- Card titles/descriptions are single-line truncated with `title` attribute for hover reveal
- Article body styling is in `src/styles/global.css` under `.article-body` class in `@layer components`
- Path alias: `@/*` maps to `src/*`
- Article sorting: by date descending, then by slug alphabetically
- Project sorting: by `order` ascending (when set), otherwise by `startDate` descending, then slug
- Related articles algorithm: each shared tag = +1 point, top 3 by score then date

## Writing Guidelines

When writing articles or project case studies, invoke the **`/write-article` skill**. It establishes:

- Voice (engineer to engineer, not marketing or AI summary)
- Factual accuracy rules (no invented metrics, no invented quotes, no fabricated chip names)
- Frontmatter templates for both articles and projects
- Bilingual rules (no translation-ese in ZH)
- Pre-publish checklist

Articles and projects can be in just one language — there is no longer a "must publish in both" rule.

## Deployment

- **GitHub repo**: `leyoucode/aiotfun.com` (master branch)
- **Cloudflare project**: `aiotfun-com`
- **Live URL**: `https://aiotfun.com`
- **Auto-deploy**: `git push` → Cloudflare auto-build
- **Build command**: `pnpm build`, output `dist/`, configured via `wrangler.toml`

**SEO & Feeds**:
- `@astrojs/sitemap` auto-generates `sitemap-index.xml`
- `@astrojs/rss` outputs bilingual RSS feeds — `/rss.xml` (EN), `/zh/rss.xml` (ZH); each feeds **writing only** (not projects)
- `public/robots.txt` allows all crawlers, points to sitemap
- `BaseHead.astro` sets canonical / hreflang / OG / Twitter Card / RSS auto-discovery
- Default OG image: `public/og-default.jpg` (1200x630)
- Giscus: GitHub Discussions (`leyoucode/aiotfun.com`), pathname mapping, lazy load, bilingual, theme-aware

## Notes

- The `archive/news-site` git branch holds the pre-rebuild snapshot (collector / workflow / 6 categories / 20 MDX articles / Newsletter / AI Agent team page) — recover from there if anything important was needed.
- View Transitions: module `<script>` only runs once. DOM operations must be wrapped in `document.addEventListener('astro:page-load', ...)` with `dataset.init` guard.
- View Transitions reset `<html>` attributes on navigation; theme class restored via `astro:after-swap` listener in BaseHead.
- `pagefind-ui.js` is an IIFE (not ESM). After `import('/pagefind/pagefind-ui.js')`, access via `window.PagefindUI`.
- Pagefind index only covers pages with `data-pagefind-body` (currently: writing detail + project detail pages).
- HeroSection.astro from the news-site era is gone — `PersonalHero.astro` is its replacement.
- Newsletter, AiotWeekly, AgentStatusBar, CategoryTag, DiscoveryStream — all removed. If you find references in old commits or other docs, those are stale.
