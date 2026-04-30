# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIoTFun.com 是 **Seek 的极简技术博客**（单语中文站），基于 Astro 5。结构极简：

- **首页 `/`**：Hero（自我介绍）+ 直接展示文章列表（无区块标题）
- **文章详情 `/writing/[slug]/`**：每篇文章独立 URL（继承自旧路由命名习惯）
- **`/about/`**：自我介绍、技术栈、联系方式

**目标**：技术博客 / 个人 IP 站。GitHub 风极简视觉 + 强代码块体验。

**主线**：AI + IoT + Fun。语气是「工程师跟工程师讲人话」，不是 marketing 不是 AI 摘要。

> **历史**：本站最初是 AI Agent 自动运营的 AIoT 资讯站。2026-04 重构为个人站，单语化，删 EN 路由 + i18n 双语机制。后续清空所有项目（公司隐私），最终演变为极简博客。完整历史快照在 `archive/news-site` 分支。

## Commands

```bash
pnpm dev        # Dev server at localhost:4321（hot reload）
pnpm build      # Production build → dist/（静态页 + RSS + Pagefind 索引）
pnpm preview    # 预览生产构建
```

无测试框架。Astro 改动用 `pnpm build` 验证。

## Architecture

- **框架**：Astro 5 (SSG) + Tailwind CSS 3 + MDX
- **代码块**：`astro-expressive-code`（GitHub 双主题 + 复制 / 行号 / 高亮 / diff / 折叠 / 文件名）
- **搜索**：Pagefind（build 时索引，运行时懒加载）
- **评论**：Giscus（GitHub Discussions）
- **部署**：Cloudflare Pages，`git push` 自动构建（`wrangler.toml`）
- **包管理**：pnpm
- **语言**：单语中文（`<html lang="zh-CN">` 写死）

### Directory Structure

```
aiotfun.com/
├── astro.config.mjs       # Astro config（含 expressive-code 集成）
├── tailwind.config.mjs
├── wrangler.toml
├── public/                # 静态资源
├── src/
│   ├── components/        # 见 Key Components
│   ├── content/articles/  # 写作 MDX：slug.mdx
│   ├── i18n/zh.json       # 唯一文案文件
│   ├── layouts/           # BaseLayout / ArticleLayout
│   ├── pages/             # 见 Routing
│   ├── styles/            # global.css（GitHub 调色板 + 排版）
│   ├── types/             # Article 类型
│   └── utils/             # i18n.ts / articles.ts / image.ts
└── .claude/skills/        # write-article skill
```

### Routing

| Route | File | Notes |
|-------|------|-------|
| `/` | `pages/index.astro` | Hero + 文章列表（首页就是文章列表） |
| `/writing/[slug]/` | `pages/writing/[slug].astro` | 文章详情 URL |
| `/about/` | `pages/about.astro` | 关于页 |
| `/rss.xml` | `pages/rss.xml.ts` | RSS feed |
| 404 | `pages/404.astro` | 自定义 404 |

注意：没有 `/writing/` 列表页（合并到首页）；没有 `/projects/` 路由（已删）；没有 `/now/` 路由（已删）。`/writing/[slug]/` 保留只是为了文章详情 URL 命名好看，不需要列表页。

### Content System

只有一个 MDX collection（`src/content.config.ts`）：

#### `articles`

```yaml
title: ""
description: ""        # < 60 个汉字
date: "YYYY-MM-DD"
cover: ""              # 可选 Unsplash URL
readingTime: 0         # 估算：~300 chars/分钟（中文）
pinned: false          # 可选，但当前首页是按日期降序排，pinned 字段保留备用
tags: []               # 3-5 个 kebab-case tag
```

不再有 `category` / `agent` / `lang` 字段。

#### Helper functions

- `src/utils/articles.ts`：`getArticles()` / `getLatestArticles(n)` / `getPinnedArticles()` / `getRelatedArticles(article)` / `getArticleEntry(slug)` / `entryToArticle(entry)`

### i18n（其实只是文案集中管理）

虽然单语，UI 文案仍集中在 `src/i18n/zh.json`：

```astro
import { t } from '../utils/i18n';
<h2>{t.about.intro_title}</h2>
<p>{(t as any).article_detail.tags}</p>
```

`src/utils/i18n.ts` 仅 export `t`（直接 import zh.json）。

### Layouts

- `BaseLayout.astro` — Header + main + Footer + ReadingProgress + BackToTop + SearchModal；`<html lang="zh-CN">`
- `ArticleLayout.astro` — 写作详情布局，含 TOC / Giscus / 相关写作

### Key Components

- `PersonalHero.astro` — 首页 Hero（标题 + 角色 + 简介 + GitHub/X + Now CTA）
- `ArticleCard.astro` — 文章卡（variants: `large` / `medium` / `small` / `list`）；首页列表用 `list` 形态
- `Header.astro` — sticky 导航：仅 `近况 / 关于`，再加搜索 + 主题切换 + 移动端汉堡。Logo → `/`（即文章列表）
- `Footer.astro` — GitHub / X / RSS + copyright
- `BaseHead.astro` — 主题 FOUC 守护、字体（Inter + JetBrains Mono + Noto Sans SC）、SEO meta、OG、RSS 自动发现
- `OptimizedImage.astro` — 响应式 WebP/AVIF
- `GiscusComments.astro` — GitHub Discussions，主题感知
- `ReadingProgress.astro` / `TableOfContents.astro` / `BackToTop.astro` / `SearchModal.astro`

### Navigation

| Nav | Route |
|-----|-------|
| 文章 | `/`（即首页 = 文章列表） |
| 关于 | `/about/` |

Logo 也指向 `/`，与"文章"导航条目同址（标准博客模式）。Header 上 active 态：`/` 或 `/writing/*` 时 "文章" 高亮。

## Design Tokens (Tailwind)

**主题色板**（`global.css`，GitHub 风）：
- Light: bg `#ffffff`, text `#1f2328`, muted `#656d76`, border `#d1d9e0`, alt `#f6f8fa`
- Dark: bg `#0d1117`, text `#e6edf3`, muted `#8b949e`, border `#30363d`, alt `#161b22`
- Accent（不变）：`#10B981`

**字体**：
- `font-body` — Inter + 系统栈 + Noto Sans SC（主字体，标题正文都用）
- `font-mono` — JetBrains Mono + IBM Plex Mono（仅代码 / metadata）
- 不再有 `font-display`（衬线已移除）

**布局**：
- `max-w-content` 1600px（页面外容器最大宽度）
- `max-w-prose` 960px（文章正文最大宽度）
- `rounded-card` 6px、shadow `none`
- 主容器模式：`mx-auto w-full md:w-4/5 max-w-content px-4 md:px-6` —— mobile 全宽 + padding，md+ 用视口 80% 宽，最多 1600px

**Dark mode**：`darkMode: 'class'`，`localStorage('theme')` 持久化，inline script 防 FOUC + `astro:after-swap` 恢复。

## Conventions

- 路径硬编码（`/now/`, `/about/`, `/writing/[slug]/`）
- 无斜体；卡片标题/描述单行截断 + `title` hover 显示
- 文章正文样式在 `global.css` 的 `.article-body @layer components`
- 路径别名：`@/*` → `src/*`
- 文章排序：`date` 降序 → `slug` 字母序
- 相关文章：每个共享 tag +1 分，按分数+日期取前 3

## Code Block Capabilities (Expressive Code)

写文章时可以用：

| 功能 | 语法 |
|---|---|
| 文件名/标题 | ` ```ts title="utils.ts" ` |
| 行号 | ` ```ts showLineNumbers ` |
| 行高亮 | ` ```ts {1,3-5} ` 或 `mark={...}` |
| 插入行（绿） | ` ```ts ins={4-5} ` |
| 删除行（红） | ` ```ts del={3} ` |
| 字符串高亮 | ` ```ts "token" ` |
| 折叠 | ` ```ts collapse={1-6} ` |
| 双主题 | github-light / github-dark 自动切换 |

参考 `src/content/articles/code-block-demo.mdx` 的所有用法示例。

## Writing Guidelines

写文章时调用 **`/write-article` skill**。它包括：
- 写作语气（工程师对工程师，非 marketing 非 AI 摘要）
- 事实准确性铁律（不编造指标 / 引用 / 芯片型号 / 公司项目）
- Article frontmatter 模板
- 中文写作风格（无翻译腔）
- 发布前 checklist

## Deployment

- **GitHub repo**: `leyoucode/aiotfun.com`（master 分支）
- **Cloudflare project**: `aiotfun-com`
- **Live URL**: `https://aiotfun.com`
- **自动部署**: `git push` → Cloudflare 自动 build
- **Build command**: `pnpm build`，输出 `dist/`，配置在 `wrangler.toml`

**SEO & Feeds**:
- `@astrojs/sitemap` 自动生成 `sitemap-index.xml`
- `@astrojs/rss` 输出 `/rss.xml`
- `public/robots.txt` 允许所有爬虫，指向 sitemap
- `BaseHead.astro` 设置 canonical / OG（zh_CN）/ Twitter Card / RSS 自动发现
- 默认 OG 图：`public/og-default.jpg`
- Giscus：GitHub Discussions（`leyoucode/aiotfun.com`），pathname mapping，懒加载

## Notes

- `archive/news-site` 分支保留资讯站时代完整快照（collector / workflow / 6 大 category / Newsletter / AI Agent 团队页 / 20 篇 MDX 文章 / 双语 i18n）。
- View Transitions：模块 `<script>` 只跑一次，DOM 操作必须用 `document.addEventListener('astro:page-load', ...)` + `dataset.init` 守护；主题 class 通过 BaseHead 的 `astro:after-swap` 监听器恢复。
- `pagefind-ui.js` 是 IIFE（非 ESM）。`import('/pagefind/pagefind-ui.js')` 后通过 `window.PagefindUI` 访问。
- Pagefind 索引只覆盖带 `data-pagefind-body` 的页（当前：writing 详情）。
- 旧组件（HeroSection / Newsletter / AiotWeekly / AgentStatusBar / CategoryTag / DiscoveryStream / FeaturedProjects / RecentWriting / ProjectCard / ProjectLayout）和旧 utils（getLocaleFromUrl / useTranslations / getCategoryColor / getStatusColor / projects.ts）已全部移除。如果在旧 commit 看到引用，那是过期信息。
- 所有项目相关内容（mdx / route / nav / type / util）2026-04 已彻底移除：公司在做的产品属于隐私，不放公开博客。
