# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIoTFun.com is a bilingual (EN/ZH) static site built with Astro 5, covering fun AI + IoT discoveries. It positions itself as the first AI Agent-operated AIoT media — not a news/review/tutorial site, but a "discovery + fun + engineer aesthetics" aggregator.

- **Content tone**: "Wow, that actually works!" over formal reviews ("卧槽这也行" > "专业测评")
- **Content scope**: Products / dev boards / hack projects / failed experiments / fun-but-useless builds — if it's interesting, we write about it
- **Bilingual**: Full EN/ZH, independent writing per language (not machine translation)

## Commands

```bash
# Astro website (Module B)
pnpm dev        # Dev server at localhost:4321
pnpm build      # Production build → dist/ (~80 static pages + 2 RSS feeds + Pagefind index)
pnpm preview    # Preview built site

# Python collector (Module A)
cd collector && source .venv/bin/activate
python -m collector   # Run RSS → dedup → AI score → inbox JSON
```

No test framework is configured. Validate Astro changes with `pnpm build`.

## Architecture

**Module B (Website):** Astro 5 (SSG) + Tailwind CSS 3 + MDX content collections
**Module A (Collector):** Python 3 + Pydantic + feedparser + httpx + Ollama (local AI)
**Deployment:** Cloudflare Pages (auto-deploy on push to master via `wrangler.toml`)
**Package manager:** pnpm (website), pip/venv (collector)

### Directory Structure

```
aiotfun.com/
├── astro.config.mjs          # Astro config (i18n, mdx, sitemap, tailwind)
├── tailwind.config.mjs       # Tailwind config (darkMode:'class', CSS variable colors, fonts)
├── wrangler.toml              # Cloudflare Pages deployment
├── collector/                 # Module A: Python collector
│   ├── config.yaml            # RSS feeds + scoring params
│   ├── requirements.txt
│   └── collector/             # Python package
│       ├── __main__.py        # Entry: python -m collector
│       ├── config.py          # Pydantic config from YAML
│       ├── models.py          # FeedItem, ScoredItem
│       ├── feeds/             # RSS fetcher (feedparser + httpx)
│       ├── dedup/             # 4-layer dedup engine (SQLite)
│       ├── scoring/           # Ollama AI scoring
│       └── output/            # JSON writer → workflow/inbox/
├── public/                    # Static assets (favicon, logo, og-default, robots.txt)
├── src/
│   ├── components/            # Astro components (see Key Components)
│   ├── content/
│   │   └── articles/          # MDX articles: [lang]/[category]/slug.mdx
│   ├── data/                  # Data files (mockAgents, mockRoundtable; mockRadar unused)
│   ├── i18n/                  # en.json, zh.json
│   ├── layouts/               # BaseLayout.astro, ArticleLayout.astro
│   ├── pages/                 # Route pages (en/, zh/, index.astro)
│   ├── styles/                # global.css (:root/:dark CSS vars, .article-body styles)
│   └── utils/                 # i18n.ts, articles.ts, image.ts
├── design/                    # Design reference (homepage.png)
└── workflow/                  # AI Agent workflow directories
    ├── topics/                # Active topic research (YAML)
    ├── inbox/                 # Collector output (daily JSON)
    ├── review/                # Topics pending confirmation
    ├── drafts/                # Writer drafts (en.mdx + zh.mdx)
    ├── images/                # Pending cover images
    ├── ready/                 # Publisher-formatted, ready to publish
    └── published/             # Archived by year/month
```

### Routing

All pages are language-prefixed: `/en/*` and `/zh/*`. Root `/` redirects to `/en/`.

- `src/pages/[lang]/index.astro` — Home page
- `src/pages/[lang]/about.astro` — About page
- `src/pages/[lang]/[category]/index.astro` — Category listing (6 categories, including weekly)
- `src/pages/[lang]/[category]/[slug].astro` — Article detail
- `src/pages/[lang]/tags/[tag].astro` — Tag aggregation page

Dynamic routes use `getStaticPaths()` to generate pages at build time.

### Content System

Articles are MDX files in `src/content/articles/[lang]/[category]/`. Schema defined in `src/content.config.ts` with Zod validation:

- **Categories:** products, boards, builds, models, signals, weekly
- **Agents:** scout, editor, writer (kept in data, not displayed in UI)

Frontmatter schema:
```yaml
---
title: "Article Title"
description: "One-line description"
date: "2026-02-19"
cover: "https://images.unsplash.com/photo-xxx?w=800&h=450&fit=crop"
category: "builds"        # products | boards | builds | models | signals | weekly
agent: "writer"           # scout | editor | writer
readingTime: 6
lang: "en"                # en | zh
featured: true            # optional, default false
tags: ["tag1", "tag2"]
---
```

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
- **Language rules**: EN mode = pure English, no Chinese; ZH mode = Chinese primary, keep brand name AIoTFun, Agent names (Scout/Editor/Writer), and monospace metadata in English

### Layouts

- `BaseLayout.astro` — Header + main slot + Footer, wraps all pages
- `ArticleLayout.astro` — Article detail layout, wraps BaseLayout

### Key Components

- `HeroSection.astro` — ViewPager-style carousel with drag/swipe, dot indicators
- `ArticleCard.astro` — 4 variants: featured (full-bleed image + gradient overlay), large, medium, small
- `CategoryTag.astro` — Styled label with category colors
- `DiscoveryStream.astro` — Latest articles grid on home page
- `AiotWeekly.astro` — Queries `weekly` category articles, displays up to 5 as a list, links to `/weekly/`
- `AIRoundtable.astro` — Pro/Con debate format, data from `src/data/mockRoundtable.ts`
- `OptimizedImage.astro` — Responsive image component (auto WebP/AVIF + srcset + sizes)
- `GiscusComments.astro` — Giscus comments (GitHub Discussions, bilingual, theme-aware)
- `Newsletter.astro` — Email subscription component (UI shell, no backend yet)
- `ReadingProgress.astro` — Article reading progress bar (fixed top, z-60, accent color)
- `TableOfContents.astro` — Article TOC sidebar (xl only, sticky, IntersectionObserver)
- `BackToTop.astro` — Scroll-to-top button (fixed bottom-right, z-50, appears after 300px)
- `SearchModal.astro` — Full-site search modal (Pagefind, z-[70], lazy load, bilingual, Cmd+K shortcut)

### Navigation & Categories

| Nav Item | EN | ZH | Description |
|----------|----|----|-------------|
| Products | Products | 产品 | Finished devices, smart hardware, consumer AI products |
| Boards | Boards | 开发板 | Chips, modules, dev kits, compute platforms |
| Builds | Builds | 创造 | DIY projects, hacks, experiments, maker builds |
| Models | Models | 模型 | AIoT-related AI models and frameworks (edge + cloud, device-connected) |
| Signals | Signals | 风向 | Trends, industry events, funding, ecosystem changes |
| About | About | 关于 | Brand story + AI Agent team |

**Note:** `weekly` is a valid category but is NOT shown in the navigation bar. Weekly listing pages (`/en/weekly/`, `/zh/weekly/`) are generated by `[category]/index.astro` like all other categories.

### Collector System (Module A)

Python RSS collector in `collector/` — auto-fetches articles, deduplicates, AI-scores, outputs structured JSON.

**Data flow:** RSS feeds → feedparser → FeedItem list → DedupEngine (SQLite) → AIScorer (Ollama qwen2:7b) → InboxWriter → `workflow/inbox/YYYY-MM-DD.json`

**Config:** `collector/config.yaml` — 5 RSS sources (HN, Hackaday, CNX Software, 36Kr, 少数派), dedup thresholds, Ollama endpoint, output path.

**AI Scoring:** Uses local Ollama via OpenAI-compatible API (`http://localhost:11434/v1`). Scores each item on novelty/fun/relevance (1-10), suggests category + tags + Chinese title translation. Falls back gracefully (score=0) when Ollama is unavailable.

**Dedup engine:** 4 layers — URL exact match → SimHash (Hamming distance, CJK bigrams + Latin words) → content digest hash → 7-day time window. SQLite persistent storage.

**Inbox JSON format:**
```json
{
  "date": "2026-02-19",
  "total": 99,
  "items": [
    {
      "id": "src_20260219_001",
      "title": "...",
      "title_zh": "...",
      "source": "CNX Software",
      "channel": "rss",
      "url": "https://...",
      "summary": "...",
      "tags": ["tag1", "tag2"],
      "suggested_category": "boards",
      "score": 9.0,
      "score_detail": { "novelty": 9, "fun": 8, "relevance": 10 },
      "score_reason": "...",
      "collected_at": "2026-02-19T15:02:21Z"
    }
  ]
}
```

### Data Sources

- **Articles:** `src/content/articles/` (MDX, 6 per language, all with real content)
- **Mock data:** `src/data/mockAgents.ts` (about page), `mockRoundtable.ts` (AIRoundtable component); `mockRadar.ts` is unused (AiotWeekly queries content collection directly)
- **Collector inbox:** `workflow/inbox/` — daily JSON files from the collector

### AI Agent Team

| Agent | Role | Icon | Color | Responsibility |
|-------|------|------|-------|----------------|
| Scout | Discoverer | ● | `#10B981` teal | Manage collector + supplement search + active topic research |
| Editor | Chief Editor | ▲ | `#6366F1` indigo | Select topics from inbox, assign category and tags |
| Writer | Storyteller | ◆ | `#F59E0B` amber | Write articles, bilingual, maintain AIoTFun tone |
| Publisher | Publisher | ■ | `#8B5CF6` purple | SEO optimization, format validation, final layout |

**Workflow (directory-driven state machine):**
```
Passive: Collector → /inbox → Editor selects ─┐
                                                ├→ /review → /drafts → /images → /ready → /published
Active:  /topics → Scout searches ─────────────┘
```

## Design Tokens (Tailwind)

**Dark mode:** `darkMode: 'class'` — toggle adds/removes `.dark` on `<html>`. Theme persisted in `localStorage('theme')`, defaults to system preference. FOUC prevented by inline script in `BaseHead.astro`.

**Colors (CSS variables, RGB space-separated format for alpha support):**
- Light: bg `246 245 241` (#F6F5F1), text `26 26 26`, card-bg `255 255 255`, border `232 230 225`
- Dark: bg `18 18 18` (#121212), text `232 230 225`, card-bg `26 26 26`, border `55 55 55`
- Tailwind usage: `bg-bg`, `text-text`, `bg-card-bg`, `text-text-muted`, `border-border` (all support `/<alpha>` modifier)
- Fixed colors (no dark variant): accent (#10B981), category colors (products=#DC6843, boards=#CA8A04, builds=#0D9488, models=#7C3AED, signals=#6B7280, weekly=#10B981)

**Fonts:** `font-display` (Instrument Serif — headings), `font-body` (Inter — body text), `font-mono` (JetBrains Mono — metadata/dates/tags), `font-logo` (Space Grotesk)

**Layout:** `max-w-content` (1200px), `max-w-prose` (720px article body), `rounded-card` (8px), `shadow-card` (CSS variable, lighter in light mode, darker in dark mode)

**Spacing:** 8px base unit, common: 16/24/32/48/64px

**Breakpoints:** 768px (mobile), 1024px (tablet), 1440px (desktop)

## Conventions

- No italics anywhere — titles use `font-bold`
- Card titles/descriptions are single-line truncated with `title` attribute for hover reveal
- Category listing pages use client-side JS for pagination (12 per page)
- Article body styling is in `src/styles/global.css` under `.article-body` class in `@layer components`
- Path alias: `@/*` maps to `src/*`
- Related articles algorithm: same category = +10 points, each shared tag = +1 point, top 3
- Article source links use `<a target="_blank" rel="noopener noreferrer">` to open in new tab
- Article `date` field = publication date on AIoTFun (when we wrote it), not original source date
- Article sorting: by date descending, then by slug alphabetically (ensures stable order across EN/ZH when dates are the same)

## Article Writing Guidelines

**When writing articles, invoke the `/write-article` skill** — it provides the full writing framework (voice, structure, frontmatter template, bilingual rules, spec-listing rules, community voice requirements) and directs you to the category-specific overlay.

Skills architecture:
```
.claude/skills/
├── write-article.md       # Base skill: voice, structure, frontmatter, bilingual rules
├── write-products.md      # Products: "Wait, that exists?" — discovery, not review
├── write-boards.md        # Boards: "New toy for engineers" — capability + ecosystem
├── write-builds.md        # Builds: "Someone actually built that" — human-first storytelling
├── write-models.md        # Models: "This changes what's possible" — software/framework layer
├── write-signals.md       # Signals: "The pattern, not the noise" — dot-connecting
└── write-weekly.md        # Weekly: "This week on AIoTFun" — site-internal article roundup
```

Quick reference (details in skills):
- **Factual accuracy**: 所有参数来自一手源，社区引用必须真实可追溯，禁止编造任何内容
- **Tone**: Discovery + fun + engineer aesthetics ("wow, that actually works!")
- **Structure**: Hook → technical substance → community voice (mandatory) → why it matters → source
- **Spec rule**: Every number must answer "so what?" with a familiar comparison
- **Community voice**: Mandatory (Reddit/HN/GitHub/forums)
- **Length**: 5-8 min read (300-600 words), varies by format tag
- **Cover**: Unsplash image URL with `w=800&h=450&fit=crop`; publish 前用 `curl -sI <url>` 验证图片返回 200 且 content-type 为 image/*
- **Bilingual**: Full independent writing per language (not mechanical translation); ZH uses culturally native comparisons
- **Source**: Every article ends with `---` + source link(s) in `<a target="_blank">` format

## Deployment

- **GitHub repo:** `leyoucode/aiotfun.com` (master branch)
- **Cloudflare project:** `aiotfun-com`
- **Live URL:** `https://aiotfun.com`
- **Auto-deploy:** `git push` → Cloudflare auto-build
- **Build command:** `pnpm build`, output `dist/`, configured via `wrangler.toml`

**SEO & Feeds:**
- `@astrojs/sitemap`: auto-generates `sitemap-index.xml`
- `@astrojs/rss`: bilingual RSS feeds — `/rss.xml` (EN), `/zh/rss.xml` (ZH)
- `public/robots.txt`: allows all crawlers, points to sitemap
- `BaseHead.astro`: canonical URL / hreflang / OG / Twitter Card / RSS auto-discovery
- Default OG image: `public/og-default.jpg` (1200x630)
- Giscus comments: GitHub Discussions (`leyoucode/aiotfun.com`), pathname mapping, lazy loading, bilingual UI, theme-aware

## Current Status

**Phase 1 (Site Skeleton):** Fully complete. All core pages, components, layouts, i18n, SEO, Cloudflare deployment.

**Phase 2 (Content System):** Fully complete. MDX content collections, category filtering, related articles, Giscus comments, tag aggregation pages.

**Phase 3 (Collector):** Core skeleton complete (RSS fetching, dedup engine, AI scoring, inbox JSON output). Real articles published (6 articles × 2 languages = 12 MDX files covering all 6 categories). Remaining: Gmail channel, web crawling, active topic search, Cron scheduling.

**Phase 4 (Polish):** Core complete. Dark mode, mobile polish, bilingual RSS feeds, View Transitions (SPA), reading progress bar, article TOC, back-to-top button, custom 404 page, full-site search (Pagefind). Remaining: newsletter backend integration.

**Current articles (6 real articles, each in EN + ZH):**

| Category | Slug | Topic | Featured |
|----------|------|-------|----------|
| boards | `picoclaw-risc-v-ai-assistant` | PicoClaw 10MB AI assistant | |
| boards | `olimex-esp32-p4-pc` | Olimex ESP32-P4-PC | |
| builds | `ukraine-lora-home-assistant` | Ukraine LoRa Home Assistant | **yes** |
| products | `xsdr-m2-sdr-fpga` | xSDR M.2 2230 SDR module | |
| products | `repebble-smartwatch-comeback` | rePebble smartwatch comeback | |
| models | `asteroidos-2-smartwatch-os` | AsteroidOS 2.0 open-source watch OS | |
| weekly | `aiot-weekly-2026-w08` | AIoT Weekly Feb 16-22 (7 items) | |
| signals | `edge-ai-hardware-debate` | Edge AI hardware Pro/Con debate | |

**Completed optimizations:**
- Font async loading, Unsplash CDN preconnect + responsive images, LCP preload
- Local image compression (logo WebP 3KB, favicon 2.4KB), HTML compression
- Logo rounded corners (20px), Hero title single-line responsive scaling
- Tag aggregation pages, root path direct render (no redirect blank page)
- AiotWeekly (formerly WeeklyRadar): from mock data to real content collection queries (tag="weekly")
- AIRoundtable: from Agent avatar discussion to Pro/Con debate card format
- OptimizedImage: CSS background 占位图 + onerror 回退 `/og-default.jpg`，防止封面图加载失败显示裂图
- Dark mode: Tailwind colors → CSS variables (RGB format), `.dark` class toggle, localStorage 持久化, FOUC 防闪, `astro:after-swap` 恢复 dark class
- Giscus 评论区跟随 dark mode 切换（inline script 初始化 + postMessage 运行时同步）
- 移动端汉堡菜单 body scroll lock + resize 重置
- 双语 RSS feeds (`/rss.xml` EN + `/zh/rss.xml` ZH)，Footer RSS 链接语言感知
- View Transitions (ClientRouter from `astro:transitions`)：全站 SPA 过渡，页面间导航平滑
- 阅读进度条 (ReadingProgress)：文章页顶部 accent 色细条，z-60，仅 `.article-body` 页面激活
- 文章目录 TOC (TableOfContents)：桌面端 xl (≥1280px) 侧边栏，IntersectionObserver 高亮当前章节
- 返回顶部按钮 (BackToTop)：滚动 300px 出现，bg-card-bg + border + shadow-card，dark mode 自适应
- 自定义 404 页面：独立页面（无 Header/Footer），navigator.language 自动中英文切换
- 全站搜索 (Pagefind)：build 时生成索引，SearchModal 懒加载 PagefindUI，Cmd+K 快捷键，双语索引，dark mode 适配
- 分类描述优化：去掉教程暗示（step-by-step/手把手/deployment guides）、具体型号（ESP32/Jetson），统一发现+聚合调性；Models 范围扩展为 AIoT 相关模型（不限边缘）
- formatTag 已移除（spotlight/radar/under-the-hood/roundtable/fun-but-useless），FormatTag 组件已删除，分类页筛选栏已移除
- WeeklyRadar 重命名为 AiotWeekly，weekly 升级为正式 category（不再用 tag hack）

**Notes:**
- `src/data/mockAgents.ts` used by About page; `mockRoundtable.ts` used by AIRoundtable component (Pro/Con debate format); `mockRadar.ts` is unused legacy
- AiotWeekly queries `weekly` category (up to 5), no mock data needed
- AIRoundtable uses Pro/Con debate format (RoundtableSide: label/icon/color/summary) instead of original Agent avatars
- i18n `article_detail`/`category_page`/`about` groups use `(t as any)` type assertion
- Client-side pagination works for current scale; consider Astro `paginate()` when articles exceed hundreds
- `agent` field kept in frontmatter data layer but not displayed in UI
- `collector/data/collector.db` and `collector/.venv/` are gitignored
- Collector needs local Ollama service; falls back gracefully when unavailable
- HeroSection relies on `featured: true` articles — always ensure at least one article per language is marked featured
- OptimizedImage 有 onerror 兜底，但 Unsplash 404 可能返回 text/html 不触发 onerror，所以封面图 URL 必须在发布前验证可用
- Dark mode 颜色通过 CSS 变量 (RGB 空格分隔) 实现，支持 Tailwind `text-text/90` 等透明度修饰符
- 新增组件/页面使用 `bg-card-bg` 代替 `bg-white`（HeroSection 的白色 dot 例外，它在深色背景上）
- `@astrojs/rss` 是工具库，不需要加到 `astro.config.mjs` integrations
- Header theme toggle 通过 `postMessage` 同步 Giscus iframe 主题，BaseHead inline script 防 FOUC
- View Transitions 下模块 `<script>` 只执行一次，DOM 操作需包在 `document.addEventListener('astro:page-load', ...)` 中，用 `dataset.init` 防 morph 后重复绑定
- `define:vars` 脚本（分类页）和 `is:inline` 脚本（BaseHead theme / GiscusComments）无需 `astro:page-load` 适配
- View Transitions 导航会重置 `<html>` 属性（包括 class），`is:inline` 同内容脚本不会重新执行，需用 `astro:after-swap` 事件恢复 dark class
- 404 页面是独立页面，不使用 BaseLayout，直接引入 global.css + inline dark mode 脚本
- Pagefind：build 脚本为 `astro build && npx pagefind --site dist`，索引只覆盖 `data-pagefind-body` 标记的文章页，SearchModal 用 `is:inline` 脚本 + `window.__searchInit` 防重复初始化
- SearchModal 的 PagefindUI JS 通过 `import('/pagefind/pagefind-ui.js')` 懒加载（首次打开搜索时），dev 模式下无索引会显示提示
- `pagefind-ui.js` 是 IIFE（非 ES module），`import()` 加载后通过 `window.PagefindUI` 访问，不能用模块导出
