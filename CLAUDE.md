# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIoTFun.com is a bilingual (EN/ZH) static site built with Astro 5, covering fun AI + IoT discoveries. It positions itself as the first AI Agent-operated AIoT media — not a news/review/tutorial site, but a "discovery + fun + engineer aesthetics" aggregator. Content tone: "Wow, that actually works!" over formal reviews.

## Commands

```bash
# Astro website (Module B)
pnpm dev        # Dev server at localhost:4321
pnpm build      # Production build → dist/
pnpm preview    # Preview built site

# Python collector (Module A)
cd collector && source .venv/bin/activate
python -m collector   # Run RSS → dedup → AI score → inbox JSON
```

No test framework is configured. Validate Astro changes with `pnpm build` (generates ~64 static pages).

## Architecture

**Module B (Website):** Astro 5 (SSG) + Tailwind CSS 3 + MDX content collections
**Module A (Collector):** Python 3 + Pydantic + feedparser + httpx + Ollama (local AI)
**Deployment:** Cloudflare Pages (auto-deploy on push to master via `wrangler.toml`)
**Package manager:** pnpm (website), pip/venv (collector)

### Routing

All pages are language-prefixed: `/en/*` and `/zh/*`. Root `/` redirects to `/en/`.

- `src/pages/[lang]/index.astro` — Home page
- `src/pages/[lang]/about.astro` — About page
- `src/pages/[lang]/[category]/index.astro` — Category listing (5 categories: products/boards/builds/models/signals)
- `src/pages/[lang]/[category]/[slug].astro` — Article detail
- `src/pages/[lang]/tags/[tag].astro` — Tag aggregation page

Dynamic routes use `getStaticPaths()` to generate pages at build time.

### Content System

Articles are MDX files in `src/content/articles/[lang]/[category]/`. Schema defined in `src/content.config.ts` with Zod validation:

- **Categories:** products, boards, builds, models, signals
- **Format tags:** spotlight, radar, under-the-hood, roundtable, fun-but-useless
- **Agents:** scout, editor, writer (kept in data, not displayed in UI)

Article querying utilities in `src/utils/articles.ts` — all functions take `lang` parameter and return `Article` type. The `entryToArticle()` function converts collection entries; slug is extracted from the last segment of `entry.id`.

### i18n

- Translation files: `src/i18n/en.json` and `src/i18n/zh.json`
- Utilities in `src/utils/i18n.ts`: `getLocaleFromUrl()`, `useTranslations()`, `getLanguageSwitchUrl()`, `localePath()`
- Pattern in components:
  ```astro
  const locale = getLocaleFromUrl(Astro.url);
  const t = useTranslations(locale);
  ```
- Placeholder substitution: `t.key.replace('{count}', String(value))`
- Some i18n keys accessed via `(t as any)` — typed translations don't cover all nested groups yet

### Layouts

- `BaseLayout.astro` — Header + main slot + Footer, wraps all pages
- `ArticleLayout.astro` — Article detail layout, wraps BaseLayout

### Key Components

- `HeroSection.astro` — ViewPager-style carousel with drag/swipe, dot indicators
- `ArticleCard.astro` — 4 variants: featured (full-bleed image + gradient overlay), large, medium, small
- `CategoryTag.astro` / `FormatTag.astro` — Styled labels with category colors
- `DiscoveryStream.astro` — Latest articles grid on home page
- `WeeklyRadar.astro` / `AIRoundtable.astro` — Still using mock data from `src/data/`

### Collector System (Module A)

Python RSS collector in `collector/` — auto-fetches articles, deduplicates, AI-scores, outputs structured JSON.

```
collector/
├── config.yaml               # RSS feeds + scoring params
├── requirements.txt           # Python deps (pydantic, httpx, feedparser, openai, etc.)
├── collector/
│   ├── __main__.py            # Entry: python -m collector
│   ├── config.py              # Pydantic config from YAML
│   ├── models.py              # FeedItem, ScoredItem
│   ├── feeds/
│   │   ├── base.py            # Abstract fetcher base class
│   │   └── rss.py             # RSS fetcher (feedparser + httpx)
│   ├── dedup/
│   │   ├── engine.py          # 4-layer dedup (URL → SimHash → content hash → time window)
│   │   ├── simhash.py         # SimHash impl (CJK bigrams + Latin words)
│   │   └── store.py           # SQLite seen_items storage
│   ├── scoring/
│   │   └── scorer.py          # Ollama AI scoring via OpenAI SDK, graceful fallback
│   └── output/
│       └── writer.py          # JSON output to workflow/inbox/YYYY-MM-DD.json
└── data/
    └── collector.db           # SQLite dedup database (gitignored)
```

**Data flow:** RSS feeds → feedparser → FeedItem list → DedupEngine (SQLite) → AIScorer (Ollama qwen2:7b) → InboxWriter → `workflow/inbox/YYYY-MM-DD.json`

**Config:** `collector/config.yaml` — 5 RSS sources (HN, Hackaday, CNX Software, 36Kr, 少数派), dedup thresholds, Ollama endpoint, output path.

**AI Scoring:** Uses local Ollama via OpenAI-compatible API. Scores each item on novelty/fun/relevance (1-10), suggests category + tags + Chinese title translation. Falls back gracefully (score=0) when Ollama is unavailable.

### Data Sources

- **Articles:** `src/content/articles/` (MDX, 25 per language)
- **Mock data:** `src/data/mockAgents.ts`, `mockRadar.ts`, `mockRoundtable.ts` — used by home page sections and about page
- **Collector inbox:** `workflow/inbox/` — daily JSON files from the collector, format per AIOTFUN-DEV-DOC.md §7.6

## Design Tokens (Tailwind)

**Colors:** bg (#F6F5F1), accent (#10B981 teal), plus 5 category colors (products=#DC6843, boards=#CA8A04, builds=#0D9488, models=#7C3AED, signals=#6B7280)

**Fonts:** `font-display` (Instrument Serif — headings), `font-body` (Inter — body text), `font-mono` (JetBrains Mono — metadata/dates/tags)

**Layout:** `max-w-content` (1200px), `max-w-prose` (720px article body), `rounded-card` (8px), `shadow-card`

## Conventions

- No italics anywhere — titles use `font-bold`
- Card titles/descriptions are single-line truncated with `title` attribute for hover reveal
- Category listing pages use client-side JS for formatTag filtering and pagination (12 per page)
- Article body styling is in `src/styles/global.css` under `.article-body` class in `@layer components`
- Path alias: `@/*` maps to `src/*`
- Related articles algorithm: same category = +10 points, each shared tag = +1 point, top 3

## Current Status

Phase 1 (site skeleton) and Phase 2 (content system) fully complete. Phase 3 core skeleton (RSS collector MVP) complete — RSS fetching, dedup engine, AI scoring, and inbox JSON output all working end-to-end. Remaining Phase 3 work: Gmail channel, web crawling, active topic search, Cron scheduling. Phase 4 (dark mode, RSS output, newsletter) not started. Full roadmap in `AIOTFUN-DEV-DOC.md`.
