# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIoTFun.com 是 **Seek的个人 Indie Hacker 站** —— 单语中文站，基于 Astro 5。包含：

- **Projects**：Seek做过的项目案例（生产系统、副业实验、硬件折腾、本站自身等）
- **Writing**：调试笔记、技术探究、项目复盘、观点
- **Now**：当前在做什么
- **About**：自我介绍、技术栈、项目时间线、联系方式

**目标**：招聘背书 —— 招聘方/合作方 30 秒内 get 到「这个人能做什么」。

**主线**：AI + IoT + Fun。语气是「工程师跟工程师讲人话」，不是 marketing，不是 AI 摘要。

> **历史**：本站最初是「AI Agent 自动运营的 AIoT 资讯站」（RSS 抓取 → AI 评分 → 自动写稿）。2026-04 重构为个人站。再之后改为单语中文站，删除全部 EN 路由 / EN 内容 / i18n 双语机制。完整历史快照保留在 `archive/news-site` 分支。

## Commands

```bash
pnpm dev        # Dev server at localhost:4321
pnpm build      # Production build → dist/ (静态页 + RSS + Pagefind 索引)
pnpm preview    # Preview built site
```

无测试框架。Astro 改动用 `pnpm build` 验证。

## Architecture

- **框架**：Astro 5 (SSG) + Tailwind CSS 3 + MDX content collections
- **搜索**：Pagefind（build 时生成索引，运行时懒加载）
- **评论**：Giscus（GitHub Discussions）
- **部署**：Cloudflare Pages，`git push` 自动构建（`wrangler.toml`）
- **包管理**：pnpm
- **语言**：单语中文（`<html lang="zh-CN">`），不再有双语切换、hreflang、locale path 前缀

### Directory Structure

```
aiotfun.com/
├── astro.config.mjs       # Astro config（无 i18n 块）
├── tailwind.config.mjs
├── wrangler.toml
├── public/                # 静态资源
├── src/
│   ├── components/        # 组件 — 见 Key Components
│   ├── content/
│   │   ├── articles/      # 写作 MDX：slug.mdx
│   │   └── projects/      # 项目案例 MDX：slug.mdx
│   ├── i18n/zh.json       # 唯一文案文件
│   ├── layouts/           # BaseLayout / ArticleLayout / ProjectLayout
│   ├── pages/             # 路由 — 见 Routing
│   ├── styles/            # global.css
│   ├── types/             # Article + Project 类型
│   └── utils/             # i18n.ts / articles.ts / projects.ts / image.ts
└── .claude/skills/        # write-article skill
```

### Routing

URL 全是干净的根路径，无 locale 前缀。

| Route | File |
|-------|------|
| `/` | `pages/index.astro` — Hero + Featured Projects + Recent Writing |
| `/about/` | `pages/about.astro` |
| `/now/` | `pages/now.astro` —（手动维护）|
| `/projects/` | `pages/projects/index.astro` |
| `/projects/[slug]/` | `pages/projects/[slug].astro` |
| `/writing/` | `pages/writing/index.astro` |
| `/writing/[slug]/` | `pages/writing/[slug].astro` |
| `/rss.xml` | `pages/rss.xml.ts` —（只 feed writing）|
| `/404` | `pages/404.astro` |

动态路由用 `getStaticPaths()` 在 build 时生成。

### Content System

两个 MDX collections，Zod 校验（见 `src/content.config.ts`）：

#### `articles` —— 写作

```yaml
title: ""
description: ""
date: "YYYY-MM-DD"
cover: ""           # 可选 Unsplash URL，建议 w=800&h=450&fit=crop
readingTime: 0
pinned: false       # 可选，首页可置顶
tags: []
```

#### `projects` —— 项目案例

```yaml
title: ""
oneLiner: ""
status: "active" | "shipped" | "open-source" | "paused" | "archived"
techStack: []
cover: ""           # 可选
startDate: "YYYY-MM"
endDate: "YYYY-MM"  # 可选
repoUrl: ""         # 可选
liveUrl: ""         # 可选
featured: false     # 至多 4 个，会显示在首页 Featured 区
order: 1            # 可选，越小越靠前（featured 用 1-4）
tags: []
```

**关键改动**：不再有 `category` / `agent` / `lang` 字段。Tags 是唯一的扁平分类。

#### Helper functions

- `src/utils/articles.ts`：`getArticles()` / `getLatestArticles(n)` / `getPinnedArticles()` / `getRelatedArticles(article)` / `getArticleEntry(slug)` / `entryToArticle(entry)`
- `src/utils/projects.ts`：`getProjects()` / `getFeaturedProjects(n)` / `getProjectEntry(slug)` / `entryToProject(entry)`

所有函数**不再接受 lang 参数**。

### i18n（其实只是文案集中管理）

虽然是单语站，但 UI 文案仍集中在 `src/i18n/zh.json`，方便统一改文案。

用法：
```astro
import { t } from '../utils/i18n';
// 使用
<h2>{t.home.featured_projects}</h2>
<p>{(t as any).projects.subtitle}</p>
```

`src/utils/i18n.ts` 仅提供：
- `t` —— 直接 import zh.json 的对象
- `getStatusColor(status)` —— 项目状态颜色映射

### Layouts

- `BaseLayout.astro` — Header + main + Footer + ReadingProgress + BackToTop + SearchModal；`<html lang="zh-CN">` 写死
- `ArticleLayout.astro` — 写作详情布局，含 TOC / Giscus / 相关写作
- `ProjectLayout.astro` — 项目案例布局，含状态徽章 / 技术栈 / repo&live 链接 / Giscus

### Key Components

- `PersonalHero.astro` — 首页 Hero（标题 + 角色 + 简介 + 社交链接 + Now CTA）
- `FeaturedProjects.astro` — 首页精选项目（最多 4，调用 `getFeaturedProjects`）
- `RecentWriting.astro` — 首页最近写作（最多 5，调用 `getLatestArticles`）
- `ProjectCard.astro` — 项目卡（variants: `featured` / `medium`）
- `ArticleCard.astro` — 文章卡（variants: `large` / `medium` / `small` / `list`）
- `Header.astro` — sticky 导航 + 主题切换 + 搜索 + 移动端汉堡（**不再有语言切换**）
- `Footer.astro` — GitHub / X / Email / RSS + copyright
- `BaseHead.astro` — 主题 FOUC 守护、字体、SEO meta、OG、Twitter Card、RSS 自动发现（**不再有 hreflang**）
- `OptimizedImage.astro` — 响应式 WebP/AVIF + srcset + sizes
- `GiscusComments.astro` — Giscus（GitHub Discussions），仍以 `locale="zh"` 调用
- `ReadingProgress.astro` / `TableOfContents.astro` / `BackToTop.astro` / `SearchModal.astro` —— 不变

### Navigation

| Nav | Route |
|-----|-------|
| 项目 | `/projects/` |
| 写作 | `/writing/` |
| 近况 | `/now/` |
| 关于 | `/about/` |

## Design Tokens (Tailwind)

**Dark mode**: `darkMode: 'class'`，`localStorage('theme')` 持久化，inline script 防 FOUC + `astro:after-swap` 恢复。

**Colors** （CSS 变量，RGB 空格分隔，支持透明度修饰符）：
- Light: bg `246 245 241` (#F6F5F1), text `26 26 26`, card-bg `255 255 255`, border `232 230 225`
- Dark: bg `18 18 18` (#121212), text `232 230 225`, card-bg `26 26 26`, border `55 55 55`
- Tailwind: `bg-bg`, `text-text`, `bg-card-bg`, `text-text-muted`, `border-border`（都支持 `/<alpha>`）
- 固定：accent `#10B981`

**Fonts**: `font-display` (Instrument Serif), `font-body` (Inter), `font-mono` (JetBrains Mono)，加载 Noto Sans SC 兜底中文

**Layout**: `max-w-content` (1200px), `max-w-prose` (720px), `rounded-card` (8px), `shadow-card`

**Project status colors** (from `src/utils/i18n.ts`):
- active: `#10B981`
- shipped: `#6366F1`
- open-source: `#0D9488`
- paused: `#CA8A04`
- archived: `#6B7280`

## Conventions

- 所有路径用 hard-coded 根路径（`/projects/`、`/writing/`、`/now/`...），不使用辅助函数生成
- 标题不用斜体；卡片标题/描述单行截断 + `title` hover 显示
- 文章正文样式在 `src/styles/global.css` 的 `.article-body @layer components`
- 路径别名：`@/*` → `src/*`
- 文章排序：`date` 降序 → `slug` 字母序
- 项目排序：`order` 升序（如有）→ `startDate` 降序 → `slug`
- 相关文章：每个共享 tag +1 分，按分数+日期取前 3

## Writing Guidelines

写文章或项目案例时调用 **`/write-article` skill**。它包括：

- 写作语气（工程师对工程师，非 marketing 非 AI 摘要）
- 事实准确性铁律（不编造指标、不编造引用、不编造芯片型号）
- Article / Project frontmatter 模板
- 单语中文写作风格规则
- 发布前 checklist

## Deployment

- **GitHub repo**: `leyoucode/aiotfun.com`（master 分支）
- **Cloudflare project**: `aiotfun-com`
- **Live URL**: `https://aiotfun.com`
- **自动部署**: `git push` → Cloudflare 自动 build
- **Build command**: `pnpm build`，输出 `dist/`，配置在 `wrangler.toml`

**SEO & Feeds**:
- `@astrojs/sitemap` 自动生成 `sitemap-index.xml`
- `@astrojs/rss` 输出 `/rss.xml`（中文，只 feed writing）
- `public/robots.txt` 允许所有爬虫，指向 sitemap
- `BaseHead.astro` 设置 canonical / OG（zh_CN）/ Twitter Card / RSS 自动发现
- 默认 OG 图：`public/og-default.jpg`（1200x630，可换成个人头像/logo）
- Giscus：GitHub Discussions（`leyoucode/aiotfun.com`），pathname mapping，懒加载，主题感知

## Notes

- `archive/news-site` 分支保留资讯站时代完整快照（collector / workflow / 6 大 category / Newsletter / AI Agent 团队页 / 20 篇 MDX 文章 / 双语 i18n）。需要旧内容回去翻。
- View Transitions：模块 `<script>` 只跑一次，DOM 操作必须用 `document.addEventListener('astro:page-load', ...)` + `dataset.init` 守护。
- View Transitions 重置 `<html>` 属性，主题 class 通过 BaseHead 的 `astro:after-swap` 监听器恢复。
- `pagefind-ui.js` 是 IIFE（非 ESM）。`import('/pagefind/pagefind-ui.js')` 后通过 `window.PagefindUI` 访问。
- Pagefind 索引只覆盖带 `data-pagefind-body` 的页（当前：writing 详情 + project 详情）。
- 旧组件（HeroSection 轮播 / Newsletter / AiotWeekly / AgentStatusBar / CategoryTag / DiscoveryStream）和旧 utils（getLocaleFromUrl / useTranslations / getLanguageSwitchUrl / localePath / getCategoryColor）已全部移除。如果在旧 commit 或外部文档中看到引用，那是过期信息。
- 单语化后 i18n 系统极简：`src/utils/i18n.ts` 仅 export `t` 和 `getStatusColor`。要加新文案就直接编辑 `src/i18n/zh.json`。
