# AIoTFun.com — 完整开发文档

> 本文档是 AIoTFun.com 项目的完整开发指南，供 Claude Code 进行开发时参考。

---

## 1. 项目概述

### 1.1 品牌定位

- **名称**: AIoTFun（AI + IoT + Fun）
- **英文 Slogan**: Discover Fun Things in AI & IoT
- **中文 Slogan**: 发现 AI + IoT 里那些有趣的东西
- **定位**: 不是资讯站、不是评测站、不是教程站 — 是「发现感 + 好玩 + 工程师审美」的 AIoT 聚合地
- **差异化**: 全球首个由 AI Agent 团队运营的 AIoT 媒体，网站本身就是 AIoT 的活案例
- **内容调性**: "卧槽这也行" > "专业测评"，发现感、奇思妙想、玩儿就完了
- **内容边界**: 产品 / 开发板 / Hack项目 / 失败实验 / 无用但有趣 — 有趣就写

### 1.2 双模块架构

项目由两个独立模块组成：

| 模块 | 说明 | 技术栈 | 部署 |
|------|------|--------|------|
| **Module A: 信源采集器** | 多渠道自动采集 + 主动选题搜索 | Python + SQLite | Mac Mini M4 Pro · Cron |
| **Module B: Astro 网站** | 全站中英双语、静态生成 | Astro + Tailwind + MDX | Cloudflare Pages |

---

## 2. 设计规范（基于最终确认的设计图）

### 2.1 设计参考图

项目根目录下 `/design/homepage.png` 为最终确认的首页设计图。以下规范从该设计图中提取。

### 2.2 色彩系统

```css
:root {
  /* 基础 */
  --color-bg: #F6F5F1;           /* 温暖米白底色，像高级纸张 */
  --color-bg-alt: #F0EFEB;       /* 区域区分底色（如 Weekly Radar 区域） */
  --color-text: #1A1A1A;         /* 主文字，浓郁近黑 */
  --color-text-muted: #6B7280;   /* 辅助文字 */
  --color-border: #E8E6E1;       /* 边框和分割线 */

  /* 主题强调色 */
  --color-accent: #10B981;       /* 青绿色，AI 状态指示色 */

  /* 分类色 */
  --color-products: #DC6843;     /* 产品 - 暖红 */
  --color-boards: #CA8A04;       /* 开发板 - 深琥珀 */
  --color-builds: #0D9488;       /* 创造 - 青绿 */
  --color-models: #7C3AED;       /* 模型 - 靛蓝 */
  --color-signals: #6B7280;      /* 风向 - 灰蓝 */

  /* 深色模式（后期实现） */
  --color-bg-dark: #0F1117;
  --color-text-dark: #E2E8F0;
}
```

### 2.3 字体系统

```css
:root {
  /* 标题 - 编辑式衬线体，杂志封面感 */
  --font-display: 'Instrument Serif', 'Playfair Display', 'Noto Serif SC', serif;

  /* 元数据/标签/代码 - 等宽字体，工程师感 */
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;

  /* 正文 - 清爽无衬线 */
  --font-body: 'Inter', 'Noto Sans SC', -apple-system, sans-serif;

  /* Logo */
  --font-logo: 'Space Grotesk', 'Inter', sans-serif;
}
```

**使用规则**：
- 文章标题、大标题：`--font-display`
- 日期、阅读时间、分类标签、Agent名称、状态栏：`--font-mono`
- 正文、摘要、导航链接：`--font-body`

### 2.4 Logo

- 导航栏左侧显示 "AIoTFun" 文字标识
- "AIoT" 为黑色，"Fun" 为青绿色（`--color-accent`）
- 使用 `--font-logo`，bold weight
- Favicon：设计一个简化的图标版本（后续提供）

### 2.5 布局规范

- 最大内容宽度：`1200px`
- 导航栏高度：`64px`
- 卡片圆角：`8px`
- 卡片边框：`1px solid var(--color-border)`
- 卡片阴影：极淡，`0 1px 3px rgba(0,0,0,0.04)`
- 间距系统：`8px` 为基本单位，常用 `16px / 24px / 32px / 48px / 64px`
- 响应式断点：`768px`（移动端）、`1024px`（平板）、`1440px`（桌面端）

---

## 3. 技术架构

### 3.1 网站技术栈

```
框架:       Astro v5
样式:       Tailwind CSS v3
内容:       MDX (Markdown + JSX 组件)
国际化:     Astro 原生 i18n 路由
SEO:        @astrojs/sitemap（自动生成 sitemap）
部署:       Cloudflare Pages（Git 自动部署）
评论:       Giscus (GitHub Discussions)
统计:       Cloudflare Web Analytics
包管理:     pnpm
```

### 3.2 项目目录结构

```
aiotfun.com/
├── astro.config.mjs          # Astro 配置（含 i18n）
├── tailwind.config.mjs       # Tailwind 配置（含自定义色彩/字体）
├── package.json
├── wrangler.toml              # Cloudflare Pages 部署配置
├── public/
│   ├── favicon.ico            # 优化后 16x16+32x32 ICO（~2KB）
│   ├── logo.png               # 导航栏 Logo（48KB）
│   ├── logo-512.png           # 关于页 Logo 原图（330KB，作为 WebP fallback）
│   ├── logo-512.webp          # 关于页 Logo WebP 版（3KB）
│   ├── og-default.jpg         # 默认 Open Graph 图片（1200×630，70KB）
│   ├── robots.txt             # 搜索引擎爬虫规则
│   └── images/                # 静态图片资源
├── src/
│   ├── components/           # 通用组件
│   │   ├── BaseHead.astro    # <head> 公共部分（SEO/字体异步加载/Unsplash预连接/LCP preload）
│   │   ├── Header.astro      # 导航栏（含语言切换）
│   │   ├── Footer.astro      # 页脚
│   │   ├── AgentStatusBar.astro  # Agent 状态条
│   │   ├── ArticleCard.astro     # 文章卡片组件（4种变体）
│   │   ├── CategoryTag.astro     # 分类标签组件
│   │   ├── FormatTag.astro       # 内容形式标签组件
│   │   ├── AgentAvatar.astro     # Agent 几何头像组件
│   │   ├── HeroSection.astro     # 首页 Hero 轮播区
│   │   ├── DiscoveryStream.astro # 最新发现流（文章网格）
│   │   ├── WeeklyRadar.astro     # 每周雷达区块
│   │   ├── AIRoundtable.astro    # AI 圆桌区块
│   │   ├── OptimizedImage.astro  # 响应式图片组件（自动 WebP/AVIF + srcset + sizes）
│   │   └── Newsletter.astro      # 邮件订阅组件
│   ├── data/                     # Mock 数据（后期迁移到 MDX content collections）
│   │   ├── mockArticles.ts       # 文章数据（中英各12篇） + 查询函数
│   │   ├── mockArticleBodies.ts  # 文章 HTML 正文（4篇完整 + 占位）
│   │   ├── mockAgents.ts         # Agent 团队资料（关于页用）
│   │   ├── mockRadar.ts          # 每周雷达条目
│   │   └── mockRoundtable.ts     # AI 圆桌讨论数据
│   ├── layouts/
│   │   ├── BaseLayout.astro      # 基础页面布局（Header + slot + Footer）
│   │   └── ArticleLayout.astro   # 文章详情布局（包裹 BaseLayout）
│   ├── pages/
│   │   ├── index.astro           # 根路径重定向（检测语言偏好）
│   │   ├── en/
│   │   │   ├── index.astro       # 英文首页
│   │   │   ├── about.astro       # 英文关于页
│   │   │   └── [category]/       # 动态路由（5个分类统一处理）
│   │   │       ├── index.astro   # 分类列表页（含 formatTag 筛选）
│   │   │       └── [slug].astro  # 文章详情页
│   │   └── zh/
│   │       ├── index.astro       # 中文首页
│   │       ├── about.astro       # 中文关于页
│   │       └── [category]/       # 同上
│   │           ├── index.astro
│   │           └── [slug].astro
│   ├── content/                  # 文章内容（MDX，Phase 2 使用）
│   │   ├── en/
│   │   └── zh/
│   ├── i18n/                     # 国际化翻译文件
│   │   ├── en.json               # 英文 UI 文案（含 article_detail/category_page/about）
│   │   └── zh.json               # 中文 UI 文案
│   ├── styles/
│   │   └── global.css            # 全局样式 + .article-body 排版样式
│   └── utils/
│       ├── i18n.ts               # i18n 工具函数
│       └── image.ts              # Unsplash 图片 URL 优化工具（auto=format/srcset 生成）
├── design/                       # 设计参考文件
│   └── homepage.png              # 最终确认的首页设计图
└── workflow/                     # AI Agent 工作流目录（见第6节）
    ├── topics/
    ├── inbox/
    ├── review/
    ├── drafts/
    ├── images/
    ├── ready/
    └── published/
```

### 3.3 Astro 配置要点

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aiotfun.com',
  compressHTML: true,             // 压缩 HTML 输出
  integrations: [tailwind(), mdx(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: true,  // /en/xxx 和 /zh/xxx
    },
  },
});
```

### 3.4 文章 Frontmatter 规范

每篇文章的 MDX 文件头部：

```yaml
---
title: "The First ESP32 Project That Actually Understands Your Voice Commands"
description: "This open-source build uses a local LLM on a tiny edge device for real-time speech processing without the cloud."
date: 2026-02-09
cover: "/images/articles/esp32-voice/cover.jpg"
category: "builds"        # products | boards | builds | models | signals
formatTag: "spotlight"    # spotlight | radar | under-the-hood | roundtable | fun-but-useless
agent: "writer"           # scout | editor | writer
readingTime: 6            # 分钟
lang: "en"                # en | zh
pairSlug: "esp32-voice-commands"  # 中英文章配对标识
featured: true            # 是否首页精选
tags: ["esp32", "voice", "llm", "edge-ai"]
---
```

---

## 4. 页面结构详解

### 4.1 首页（当前实现）

```
┌─────────────────────────────────────────────────┐
│ [Header] AIoTFun · Products·Boards·Builds·      │
│          Models·Signals·About    EN/中文 · 🌙    │
├─────────────────────────────────────────────────┤
│ [Agent Status Bar]                               │
│ 🟢 Scout is monitoring 127 sources · Last        │
│    discovery: 3 min ago                          │
├─────────────────────────────────────────────────┤
│ [Hero - ViewPager 轮播]                          │
│      "Discover Fun Things in AI & IoT"（居中）    │
│ ┌──────────────────────────────────────────┐    │
│ │  全幅图片铺满卡片                          │    │
│ │  ████████████████████████████████████████ │    │
│ │  ▓▓ 底部渐变遮罩 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │    │
│ │  [标签] 标题（单行截断）                    │    │
│ │  摘要（单行截断）· 日期 · 阅读时间  ● ● ● ● │    │
│ └──────────────────────────────────────────┘    │
│  共4张卡片，鼠标/触摸左右滑动，右下角圆点指示器     │
├─────────────────────────────────────────────────┤
│ [Discovery Stream - 最新发现]                     │
│ ┌────────┐ ┌────────┐ ┌────────┐               │
│ │ 封面图 │ │ 封面图 │ │ 封面图 │               │
│ │ 标题…  │ │ 标题…  │ │ 标题…  │  等高卡片      │
│ │ 摘要…  │ │ 摘要…  │ │ 摘要…  │  标题/摘要单行  │
│ │ meta   │ │ meta   │ │ meta   │               │
│ └────────┘ └────────┘ └────────┘               │
├──────────────────────┬──────────────────────────┤
│ [Weekly Radar]       │ [AI Roundtable]           │
│ 1. ...               │ 话题标题                   │
│ 2. ...               │ ●Scout ▲Editor ◆Writer   │
│ 3. ...               │ 讨论摘要                   │
│ See full radar →     │ Read discussion →         │
├──────────────────────┴──────────────────────────┤
│ [Newsletter]                                     │
│ Get the weekly dose of AIoT fun.                │
│ [email input] [Subscribe]                        │
├─────────────────────────────────────────────────┤
│ [Footer]                                         │
│ AIoTFun    RSS · GitHub · Powered by AI Agents 🟢│
└─────────────────────────────────────────────────┘
```

### 4.2 文章列表页

- URL: `/en/products/`, `/zh/boards/` 等
- 顶部：分类名称 + 描述
- 筛选栏：按内容形式标签过滤（All / Spotlight / Radar / Under the Hood / ...）
- 文章网格：非对称布局，与首页 Discovery Stream 风格一致
- 分页：简洁的 "← Previous / Next →"

### 4.3 文章详情页

- URL: `/en/builds/esp32-voice-commands/`
- 结构：
  - 分类标签 + 形式标签
  - 标题（大号衬线体）
  - 元信息行：日期 · 阅读时间 · **语言切换（ZH ⟷ EN）**
  - 封面大图
  - 正文（最大宽度 720px，居中，优化阅读体验）
  - 文章标签
  - 相关文章（3张横向卡片）
  - 评论区（Giscus）

### 4.4 关于页

- URL: `/en/about/`, `/zh/about/`
- 品牌故事
- **Meet the Crew** — AI Agent 团队介绍（每个Agent一张卡片：几何头像 + 名称 + 角色 + 一句话简介）
- Workflow 可视化（简洁流程图）
- 创始人简介
- 联系方式 + RSS + GitHub

---

## 5. 导航与内容架构

### 5.1 顶级导航（用户看到的）

| 导航项 | 英文 | 中文 | 说明 |
|--------|------|------|------|
| Products | Products | 产品 | 成品设备、智能硬件、消费级AI产品 |
| Boards | Boards | 开发板 | 芯片、模组、开发套件、计算平台 |
| Builds | Builds | 创造 | DIY项目、Hack、实验、创客作品 |
| Models | Models | 模型 | 端侧AI模型、推理框架、工具链 |
| Signals | Signals | 风向 | 趋势、行业事件、融资、生态变化 |
| About | About | 关于 | 品牌故事 + AI Agent 团队 |

### 5.2 内容形式标签（附着在文章上）

| 标签 | 英文 | 中文 | 说明 |
|------|------|------|------|
| spotlight | Spotlight | 焦点 | 深入一个让人「哇」的东西 |
| radar | Weekly Radar | 风向 | 一周发现速览 |
| under-the-hood | Under the Hood | 技术拆解 | 工程师视角拆解 |
| roundtable | AI Roundtable | AI 圆桌 | 多Agent讨论热点 |
| fun-but-useless | Fun But Useless? | 没啥用但是… | 让人会心一笑的存在 |

### 5.3 文章卡片示例

一张文章卡片同时展示**分类**和**形式标签**：

```
┌─────────────────────────────┐
│ [封面图]                     │
│ ┌────────┐ ┌───────────┐   │
│ │ Builds │ │ Spotlight  │   │
│ └────────┘ └───────────┘   │
│ 标题：Someone Built a       │
│ Talking Plant Waterer...    │
│ 一行摘要文字...              │
│ May 14 · 6 min              │
└─────────────────────────────┘
```

- 分类标签（Builds）：实色背景，白色文字，使用分类色
- 形式标签（Spotlight）：描边或淡背景
- Agent署名已移除（文章由 AI 生成，UI 不展示作者信息）

---

## 6. AI Agent 团队与工作流

### 6.1 Agent 角色

| Agent | 角色 | 几何图标 | 颜色 | 职责 |
|-------|------|---------|------|------|
| Scout | 发现者 | ● (圆) | `#10B981` 青绿 | 管理采集器 + 补充搜索 + 执行主动选题采集 |
| Editor | 主编 | ▲ (三角) | `#6366F1` 靛蓝 | 从信源池中筛选选题，分配分类和标签 |
| Writer | 讲述者 | ◆ (菱形) | `#F59E0B` 琥珀 | 撰写文章，中英双语，保持AIoTFun调性 |
| Designer | 视觉 | — | — | 人类创始人 + Gemini Pro（人工节点） |
| Publisher | 发布者 | ■ (方) | `#8B5CF6` 紫 | SEO优化、格式校验、最终排版 |

### 6.2 工作流 — 目录驱动状态机

文件在目录间流转即为状态流转，无需任何数据库：

```
双模式采集:

被动: 采集器 → /inbox → Editor筛选 ─┐
                                     ├→ /review ✋ → /drafts ✋ → /images ✋ → /ready ✋ → /published
主动: /topics → Scout主动搜索 ───────┘

✋ = 需要人工介入的节点
```

### 6.3 工作流目录说明

```
workflow/
├── topics/           # 主动选题（你创建 YAML 文件发起）
│   └── ai-children-camera.yaml
├── inbox/            # 被动采集器自动投递（JSON per day）
│   └── 2026-02-09.json
├── review/           # 待确认选题（被动+主动汇合点）
│   └── 2026-w07-topics.md
├── drafts/           # Writer 生成的中英文草稿
│   └── esp32-voice/
│       ├── en.mdx
│       └── zh.mdx
├── images/           # 待生成配图（含 Gemini prompt）
│   └── esp32-voice/
│       ├── prompt.md
│       └── cover.jpg  (你生成后放回)
├── ready/            # 发布就绪（Publisher 排版后）
│   └── esp32-voice/
│       ├── en.mdx
│       ├── zh.mdx
│       └── cover.jpg
└── published/        # 已发布归档（按年月）
    └── 2026/02/
```

### 6.4 主动选题文件格式

```yaml
# workflow/topics/ai-children-camera.yaml
title: "AI儿童相机"
title_en: "AI Camera for Kids"
status: collecting     # collecting → ready → assigned → done
priority: high
description: "调研全球AI儿童相机产品、技术方案、市场动态"

keywords:
  zh: ["AI儿童相机", "儿童智能相机", "AI拍照玩具"]
  en: ["AI camera for kids", "children AI camera", "AI toy camera"]

focus_sources:
  - kickstarter.com
  - indiegogo.com
  - producthunt.com

angles:
  - 市面上有哪些产品
  - 技术方案对比（端侧vs云端）
  - 用户评价和痛点
  - 定价和目标人群

collected: []           # 采集器自动填入搜索结果
```

---

## 7. 信源采集器（Module A）

> 采集器为独立 Python 项目，部署在 Mac Mini M4 Pro 上，Cron 定时调度。

### 7.1 双模式

| 模式 | 触发方式 | 采集行为 | 产出 |
|------|---------|---------|------|
| **被动** | Cron 定时 | 6渠道持续监控 | → /inbox (JSON) |
| **主动** | /topics 出现 `status: collecting` 文件 | 定向搜索 + 信源池回溯 | → 选题文件 collected 字段 |

### 7.2 被动采集 — 6个渠道

| 渠道 | 技术 | 频率 | 信源示例 |
|------|------|------|---------|
| RSS | feedparser | 每小时 | HN / Hackaday / Arduino / RPi / CNX / 36Kr / 爱范儿 / 少数派 |
| Gmail | Gmail API + Label过滤 | 实时 | TLDR AI / The Batch / Import AI / Product Hunt Daily |
| 网站爬取 | Playwright | 每日 | Product Hunt / Kickstarter / GitHub Trending |
| 官网监控 | RSS + 变更检测 | 每日 | Espressif / RPi / NVIDIA Jetson / Kendryte / RISC-V |
| 微信公众号 | 转发专用邮箱 → Gmail采集（后期RPA） | 每日 | 机器之心 / 量子位 / 稚晖君 / 嘉立创 |
| Reddit | Reddit RSS 原生 | 每小时 | r/raspberry_pi / r/arduino / r/esp32 / r/embedded / V2EX |

### 7.3 主动采集 — 4个搜索策略

1. **Web搜索**: 用国内大模型扩展关键词，生成多组搜索query
2. **信源池回溯**: 从 /inbox 历史 JSON 中匹配相关素材
3. **定向爬取**: 根据 focus_sources 指定网站搜索
4. **搜索引擎补充**: Google News / 知乎 / 小红书搜索

### 7.4 去重引擎

四层去重，使用 SQLite 存储：

1. **URL去重**: 同一URL直接跳过
2. **标题SimHash**: 相似度 > 0.85 判定为重复
3. **内容指纹**: 同一事件的不同报道合并，保留最优来源
4. **时间窗口**: 7天内已入池的相似主题自动降权

### 7.5 AI 评分

- 使用**本地 Ollama** 运行大模型，零成本，充分利用 Mac Mini M4 Pro
- 推荐模型：**Qwen2.5-7B-Instruct**（`ollama pull qwen2.5:7b-instruct`）
  - 7B 参数，M4 Pro 上推理流畅
  - 中英文双语能力强，适合中英混合信源
  - 指令遵循好，能稳定输出 JSON 结构化结果
  - 量化后约 4-5GB 内存占用
  - 备选：Qwen2.5-3B-Instruct（更快更轻，评分任务也够用）
- 调用方式：Ollama 兼容 OpenAI API 格式，`base_url: http://localhost:11434/v1`
- 批量打分（1-10），维度：新奇度 / 好玩度 / 话题性
- 同时输出建议分类（products/boards/builds/models/signals）和建议标签

### 7.6 信源池数据格式

```json
// workflow/inbox/2026-02-09.json
{
  "date": "2026-02-09",
  "total": 47,
  "items": [
    {
      "id": "src_20260209_001",
      "title": "Raspberry Pi 6 adds on-device LLM inference chip",
      "title_zh": "树莓派6新增端侧LLM推理芯片",
      "source": "Raspberry Pi Blog",
      "channel": "rss",
      "url": "https://...",
      "summary": "...",
      "tags": ["raspberry-pi", "edge-ai", "llm"],
      "suggested_category": "boards",
      "score": 9.2,
      "score_reason": "重大硬件发布，端侧AI里程碑",
      "collected_at": "2026-02-09T06:30:00Z"
    }
  ]
}
```

---

## 8. 国际化（i18n）

### 8.1 路由规则

- 英文: `/en/xxx`
- 中文: `/zh/xxx`
- 根路径 `/` 根据浏览器语言偏好自动重定向
- 每篇文章通过 `pairSlug` 字段关联中英文版本

### 8.2 UI 文案示例

```json
// src/i18n/en.json
{
  "nav": {
    "products": "Products",
    "boards": "Boards",
    "builds": "Builds",
    "models": "Models",
    "signals": "Signals",
    "about": "About"
  },
  "home": {
    "hero_title": "Discover Fun Things in AI & IoT",
    "discovery_stream": "Latest Discoveries",
    "view_all": "View all →",
    "weekly_radar": "Weekly Radar",
    "see_full_radar": "See full radar →",
    "ai_roundtable": "AI Roundtable",
    "read_discussion": "Read the discussion →",
    "newsletter_title": "Get the weekly dose of AIoT fun.",
    "newsletter_subtitle": "No spam, just cool stuff.",
    "subscribe": "Subscribe"
  },
  "agent_status": "Scout is monitoring {count} sources · Last discovery: {time} ago",
  "footer": {
    "powered_by": "Powered by AI Agents"
  }
}
```

```json
// src/i18n/zh.json
{
  "nav": {
    "products": "产品",
    "boards": "开发板",
    "builds": "创造",
    "models": "模型",
    "signals": "风向",
    "about": "关于"
  },
  "home": {
    "hero_title": "发现 AI + IoT 里那些有趣的东西",
    "discovery_stream": "最新发现",
    "view_all": "查看全部 →",
    "weekly_radar": "每周雷达",
    "see_full_radar": "查看完整雷达 →",
    "ai_roundtable": "AI 圆桌",
    "read_discussion": "阅读讨论 →",
    "newsletter_title": "每周一份 AIoT 好玩速递",
    "newsletter_subtitle": "不发垃圾邮件，只发好玩的。",
    "subscribe": "订阅"
  },
  "agent_status": "Scout 正在监控 {count} 个信源 · 最新发现：{time}前",
  "footer": {
    "powered_by": "由 AI Agents 驱动"
  }
}
```

### 8.3 语言切换规则

- **英文模式**: 绝不出现任何中文，所有文案纯英文
- **中文模式**: 以中文为主，品牌名 AIoTFun、Agent 角色英文名（Scout/Editor/Writer）、等宽元数据中的英文保留
- 语言切换按钮在导航栏右侧，格式 "EN / 中文" 或 "中文 / EN"

---

## 9. 开发进度与里程碑

### Phase 1: 网站骨架（核心页面已完成）

| # | 任务 | 状态 | 说明 |
|---|------|------|------|
| 1 | Astro 项目初始化 + Tailwind + MDX | ✅ 已完成 | pnpm, Astro v5, Tailwind v3 |
| 2 | i18n 路由配置 | ✅ 已完成 | `/en/` + `/zh/`，根路径自动重定向 |
| 3 | 基础布局组件（Header / Footer / BaseLayout） | ✅ 已完成 | 含导航栏、页脚、BaseHead |
| 4 | Agent 状态条组件 | ✅ 已完成 | AgentStatusBar.astro |
| 5 | 首页开发 | ✅ 已完成 | 见下方「首页组件清单」 |
| 6 | 文章详情页开发 | ✅ 已完成 | ArticleLayout + 动态路由，见下方详情 |
| 7 | 分类列表页开发 | ✅ 已完成 | 动态路由 + 客户端 formatTag 筛选 |
| 8 | 关于页开发 | ✅ 已完成 | 品牌故事 + Agent 团队 + 工作流 + 创始人 |
| 9 | 部署到 Cloudflare Pages | ✅ 已完成 | GitHub 仓库 + Cloudflare 自动部署 + 自定义域名 |
| 10 | SEO 基础（sitemap / robots.txt / OG） | ✅ 已完成 | @astrojs/sitemap + robots.txt + OG 默认图片 |

**首页组件清单（全部已完成）：**

| 组件 | 文件 | 说明 |
|------|------|------|
| Hero 轮播 | `HeroSection.astro` | ViewPager 式轮播，4张文章卡片（featured+3张），鼠标/触摸拖拽滑动，右下角圆点指示器 |
| 文章卡片 | `ArticleCard.astro` | 4种变体：featured（全幅图+底部渐变叠加白色文字）/ large / medium / small；标题和摘要单行截断+title悬浮；不展示 Agent 作者 |
| 分类标签 | `CategoryTag.astro` | 实色背景，5种分类色 |
| 形式标签 | `FormatTag.astro` | 描边/淡背景 |
| Agent 头像 | `AgentAvatar.astro` | 几何图标 + 名称（仅关于页使用，文章卡片和详情页已移除） |
| 最新发现 | `DiscoveryStream.astro` | 3列等高网格，标题加粗 |
| 每周雷达 | `WeeklyRadar.astro` | 编号列表，标题加粗 |
| AI 圆桌 | `AIRoundtable.astro` | 话题 + Agent头像组 + 讨论摘要，标题加粗 |
| 响应式图片 | `OptimizedImage.astro` | 自动优化 Unsplash URL（WebP/AVIF + srcset + sizes），支持 loading/fetchpriority 配置 |
| 邮件订阅 | `Newsletter.astro` | 邮箱输入 + 订阅按钮 |

**首页样式规范（已落地）：**
- 全站不使用斜体（`italic`），标题统一加粗（`font-bold`）
- Hero 大标题居中显示
- 所有卡片标题/摘要单行截断（`truncate`），鼠标悬浮显示完整内容（`title` 属性），确保卡片等高
- Featured 卡片：图片 `absolute inset-0` 铺满，文字区 `absolute bottom-0` + `bg-gradient-to-t` 暗色渐变，白色文字

**内容数据：**

| 文件/目录 | 说明 |
|------|------|
| `src/content/en/*.mdx` | 英文文章（MDX content collections，25 篇） |
| `src/content/zh/*.mdx` | 中文文章（MDX content collections，25 篇） |
| `src/data/mockAgents.ts` | Agent 团队详细资料（Scout/Editor/Writer/Publisher），关于页用 |
| `src/data/mockRadar.ts` | 每周雷达条目（首页 WeeklyRadar 组件用） |
| `src/data/mockRoundtable.ts` | AI 圆桌讨论数据（首页 AIRoundtable 组件用） |

**文章详情页（#6，已完成）：**

| 文件 | 说明 |
|------|------|
| `src/layouts/ArticleLayout.astro` | 文章详情布局，包裹 BaseLayout |
| `src/pages/en/[category]/[slug].astro` | 英文文章详情动态路由 |
| `src/pages/zh/[category]/[slug].astro` | 中文文章详情动态路由 |

- 结构：返回分类链接 → 标签行（CategoryTag + FormatTag） → 大标题（font-display，3xl~5xl） → 元信息行（日期·阅读时间·语言切换） → 封面大图（max-h-480px） → 正文（`.article-body`，max-w-prose 居中，`set:html`） → 标签云（`#tag` 圆角胶囊） → 相关文章（3列 ArticleCard medium）
- 正文排版样式 `.article-body` 在 `global.css` 的 `@layer components` 中定义，覆盖 h2/h3/p/ul/ol/pre/code/figure/figcaption/blockquote/a/strong/em/hr
- body 数据独立在 `mockArticleBodies.ts`，页面层按需注入，避免 mockArticles.ts 膨胀
- 相关文章算法：同分类 +10 分，每个共同标签 +1 分，取前 3 篇

**分类列表页（#7，已完成）：**

| 文件 | 说明 |
|------|------|
| `src/pages/en/[category]/index.astro` | 英文分类列表动态路由 |
| `src/pages/zh/[category]/index.astro` | 中文分类列表动态路由 |

- `getStaticPaths()` 返回 5 个分类路径（products/boards/builds/models/signals）
- 结构：分类名称（font-display） + 描述（从 i18n `category_page.descriptions` 取） + 文章数量 → 筛选栏（按 formatTag 过滤） → 3 列文章网格（复用 ArticleCard medium） → 分页导航 → 空状态提示
- **客户端分页**：每页 12 篇（`perPage: 12`），筛选+分页统一由客户端 JS 处理
  - 切换 formatTag 筛选时自动回到第 1 页，计数文案动态更新
  - 分页导航：`← 上一页` / 页码（7 页以内全部显示，超过则首尾+省略号） / `下一页 →`
  - 当前页高亮，首尾页按钮自动禁用，总页数 ≤1 时分页栏隐藏
  - 翻页后平滑滚动到网格顶部
- i18n 新增分页文案：`showing_count` / `prev` / `next` / `page_of`
- 设计决策：方案 B（客户端分页），所有文章一次性渲染到 DOM，JS 控制显隐。与 formatTag 筛选完美配合，数据量可预见（百篇级别）时 DOM 开销可接受

**关于页（#8，已完成）：**

| 文件 | 说明 |
|------|------|
| `src/pages/en/about.astro` | 英文关于页 |
| `src/pages/zh/about.astro` | 中文关于页 |

- 结构：品牌故事（3 段） → Meet the Crew（4 个 Agent 卡片网格：放大几何头像 + 名称 + 角色 + 简介 + 在线状态） → 工作流简图（Scout → Editor → Writer → Publisher 的 4 步流程卡片） → 创始人寄语（仅引用语，不显示姓名） → 联系链接（GitHub + Email）

**i18n 扩展（已完成）：**

`en.json` / `zh.json` 新增 3 个翻译分组：
- `article_detail`：related_articles / tags / back_to_category / reading_time / published / switch_lang
- `category_page`：all / no_articles / filter_by_format / article_count / descriptions（5 个分类描述）
- `about`：title / subtitle / story_title / story_p1~p3 / crew_title / crew_subtitle / workflow_title / workflow_desc / workflow_steps / founder_title / founder_bio / founder_name（i18n 保留但页面不展示） / contact_title / contact_desc

**构建验证：**

- `pnpm build` 成功生成 **64 个静态页面**（首页 3 + 文章详情 48 + 分类列表 10 + 关于 2 + 根重定向 1）
- 完整浏览链路已打通：首页卡片 → 文章详情 → 相关文章 → 分类列表（含分页） → 关于页
- 导航栏所有链接均指向有效页面
- 中英文切换在所有页面正常工作
- builds 分类 16 篇文章，分页效果正常（第 1 页 12 篇 + 第 2 页 4 篇）

### 下一步开发计划（新会话从这里开始）

> **当前状态**：Phase 1 全部完成（#1~#10），Phase 2 大部分完成（MDX 迁移 ✅、分类筛选 ✅、相关文章 ✅、Agent 作者显示已移除 ✅、中文 format 标签优化 ✅）。剩余：Giscus 评论集成。网站已部署到 Cloudflare Pages，自定义域名 `aiotfun.com` 已绑定。

**部署信息：**
- GitHub 仓库：`leyoucode/aiotfun.com`（master 分支）
- Cloudflare 项目名：`aiotfun-com`
- 线上地址：`https://aiotfun.com`
- 自动部署：`git push` → Cloudflare 自动构建发布
- 构建命令：`pnpm build`，输出 `dist/`，由 `wrangler.toml` 配置静态资源

**SEO 配置：**
- `@astrojs/sitemap`：构建时自动生成 `sitemap-index.xml`
- `public/robots.txt`：允许所有爬虫，指向 sitemap
- BaseHead.astro：canonical URL / hreflang / OG / Twitter Card / sitemap link
- 默认 OG 图片 `public/og-default.png`（1200×630 占位，后续替换为品牌设计图）

**已完成的优化：**
- ✅ 文章卡片和详情页移除 Agent 作者显示（AgentAvatar 组件保留，仅关于页使用）
- ✅ 中文 format 标签本地化优化：聚光灯→焦点、每周雷达→风向、引擎盖下→技术拆解
- ✅ MDX content collections 迁移完成，25 篇中英文文章
- ✅ 根路径消除重定向空白页，直接渲染英文首页
- ✅ Favicon 替换为多尺寸 ICO + Header 和关于页添加 Logo 图片
- ✅ Hero 标题精简为"发现 AI + IoT 里那些有趣的东西"，使用 `clamp()` 实现单行自适应缩放
- ✅ 导航菜单"信号"改为"风向"，分类描述文案全面升级为更专业有趣的风格
- ✅ 关于页创始人寄语移除创始人名称显示
- ✅ 新增标签聚合页：文章标签可点击跳转到对应标签文章列表
- ✅ 前端性能优化（Lighthouse Performance 55→75+ 目标）：
  - Google Fonts 异步加载：`media="print"` + `onload` 模式，消除 render-blocking（FCP -1~2s）
  - Unsplash CDN 预连接：`dns-prefetch` + `preconnect`，减少连接延迟（FCP -0.5~1s）
  - 响应式图片组件 `OptimizedImage.astro`：Unsplash 图片自动 `auto=format`（WebP/AVIF）+ `srcset` + `sizes` + `decoding="async"`（LCP -3~5s）
  - 首页 LCP 图片 `<link rel="preload">`：index.astro → BaseLayout → BaseHead 透传链路
  - 本地图片压缩：`logo-512.png` 330KB → WebP 3KB，`favicon.ico` 97KB → 2.4KB（减少 ~420KB）
  - `compressHTML: true` 压缩 HTML 输出
  - 图片工具 `src/utils/image.ts`：`optimizeImageUrl()` + `generateSrcset()` 函数

**接下来的优先级排序：**

#### 1. 视觉打磨与体验优化
- 浏览器中实际浏览所有页面，检查排版、间距、响应式表现
- 优化移动端体验（文章详情页、分类列表页、关于页）
- 检查中英文排版细节（字体渲染、行高、间距）
- 替换 `og-default.png` 为品牌设计的正式 OG 图片

#### 2. 完成 Phase 2 剩余
- 集成 Giscus 评论系统
- 创建第一批真实文章（利用采集器获取素材）

#### 3. 进入 Phase 3：采集器
- Python 项目初始化 + RSS 采集模块
- 去重引擎（SQLite + SimHash）
- AI 评分模块（本地 Ollama）
- 主动选题采集 + Cron 调度

**注意事项**：
- 文章数据已从 mock 迁移到 `src/content/` 下的 MDX 文件，但 `src/data/mock*.ts` 文件仍保留（部分首页组件如 WeeklyRadar/AIRoundtable 仍引用）
- i18n 翻译中 `article_detail` / `category_page` / `about` 分组使用了 `(t as any)` 类型断言访问，后续可考虑统一类型定义
- 分类列表页的 formatTag 筛选和分页均为纯客户端 JS，文章增长到几百篇以上时可考虑迁移到 Astro `paginate()` 静态分页
- MDX frontmatter 中的 `agent` 字段保留（数据层不删），但 UI 不再展示作者信息

### Phase 2: 内容系统

| # | 任务 | 状态 | 说明 |
|---|------|------|------|
| 1 | MDX 文章模板和 frontmatter 规范落地 | ✅ 已完成 | mock 数据已迁移到 MDX content collections，25 篇中英文文章 |
| 2 | 文章卡片组件（含分类标签+形式标签） | ✅ 已完成 | Phase 1 提前完成；Agent署名已移除 |
| 3 | 分类筛选和标签过滤功能 | ✅ 已完成 | Phase 1 #7 中实现，客户端 JS 按 formatTag 显隐 |
| 4 | 相关文章推荐逻辑 | ✅ 已完成 | Phase 1 #6 中实现，同分类+标签交集评分算法 |
| 5 | Giscus 评论集成 | 待开始 | — |

### Phase 3: 采集器

| # | 任务 | 状态 |
|---|------|------|
| 1 | Python 项目初始化 | 待开始 |
| 2 | RSS 采集模块 | 待开始 |
| 3 | Gmail 采集模块 | 待开始 |
| 4 | 去重引擎（SQLite + SimHash） | 待开始 |
| 5 | AI 评分模块（本地 Ollama） | 待开始 |
| 6 | 主动选题采集模块 | 待开始 |
| 7 | Cron 调度配置 | 待开始 |
| 8 | 采集结果 → workflow/inbox 输出 | 待开始 |

### Phase 4: 完善

| # | 任务 | 状态 |
|---|------|------|
| 1 | 深色模式 | 待开始 |
| 2 | 响应式移动端适配 | 待开始 |
| 3 | RSS 输出（让读者可订阅） | 待开始 |
| 4 | 邮件订阅功能接入 | 待开始 |
| 5 | 性能优化 | ✅ 已完成 | 字体异步加载、Unsplash 预连接+图片响应式优化、LCP preload、本地图片压缩、HTML 压缩 |

---

## 10. OpenClaw 全自动运营

原先需要每周2小时的手动协作流程，现在通过 OpenClaw 实现全自动化。
详细方案见 `AIOTFUN-OPENCLAW-PLAN.md`。

### 核心 API

| 能力 | 方案 | 说明 |
|------|------|------|
| 信源评分 | 本地 Ollama · Qwen2.5-7B-Instruct | 免费 |
| 文章撰写 | 千问 API 或豆包 API | OpenAI 兼容格式，极低成本 |
| 封面配图 | 即梦 API（火山引擎） | 低成本 |
| Agent Runtime | OpenClaw | 免费开源，部署在 Mac Mini |
| 网站部署 | Cloudflare Pages | 免费，git push 自动构建 |

### 你的每周操作（~15分钟，在手机上完成）

```
1. 审批选题（2min）→ Telegram 回复 approve
2. 审批终稿（10min）→ 浏览预览，回复 approve 或修改意见
3. 审批雷达（2min）→ Telegram 回复 approve
4. 随时可发起主动选题 → 发一句话即可
```
