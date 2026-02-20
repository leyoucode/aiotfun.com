---
name: write-weekly
description: Category overlay for Weekly articles. Read write-article first, then this file for Weekly-specific guidance.
---

# Weekly — "This Week on AIoTFun"

## Angle

**Site-internal article roundup** — Weekly is not an external news aggregator. It curates and highlights articles published on AIoTFun during the week, giving readers a single entry point to catch up on everything they might have missed.

Each weekly issue showcases what we published, why each piece is worth reading, and connects the dots across the week's stories.

## Structure

| Section | Purpose |
|---------|---------|
| **Hook** | One-sentence summary of the week's theme or vibe. Set the tone. |
| **Items** | All articles published that week, each as a numbered section |
| **Closing** | "This week's thread" — a meta-observation connecting the dots across all items |

### Each Item

1. **Title as heading** — Use the article's key highlight, not just its title
2. **1-2 sentences** — Why this article is worth reading. Focus on the "wow" factor or the key takeaway.
3. **Link** — `<a href="/{lang}/{category}/{slug}/">` to the on-site article

**Important:** Items link to AIoTFun articles, NOT to external sources. The individual articles already cite their primary sources.

### Link Format

```html
<!-- EN -->
<a href="/en/{category}/{slug}/">Read the full story →</a>

<!-- ZH -->
<a href="/zh/{category}/{slug}/">阅读全文 →</a>
```

### Closing

The closing "This week's thread" section should:
- Identify a pattern or theme across the week's articles
- Be specific, not generic ("edge AI and wearables from opposite directions" > "lots of cool stuff")
- Be forward-looking — hint at what to watch next

## Hook Formula

**Lead with the week's variety and energy, not a formal summary.**

| Good Hook | Why It Works |
|-----------|-------------|
| "Seven stories, one thread — the hardware is getting ridiculous, and people are building ridiculous things with it." | Sets variety, tone, and the week's throughline |
| "This week: two boards that shouldn't be possible and a smartwatch that refused to die." | Teases specific highlights, creates curiosity |

| Bad Hook | Why It Fails |
|----------|-------------|
| "Here's what happened this week in AIoT." | Generic, no personality |
| "We published seven articles this week." | Factual but boring |

## Frontmatter

```yaml
---
title: "Keyword, Keyword, Keyword | AIoT Weekly Mon DD-DD"
# EN: pipe separator, 2-3 highlights + "AIoT Weekly" + date range
# ZH: "关键词、关键词 | AIoT 周刊 M.DD-M.DD"
description: "..."
date: "YYYY-MM-DD"  # The day the weekly is published
cover: "https://images.unsplash.com/photo-xxx?w=800&h=450&fit=crop"
category: "weekly"
agent: "scout"
readingTime: 4  # Typically 3-5 min
lang: ""
tags: []  # 4-6 tags reflecting the week's major themes, NOT "weekly"
---
```

**Slug convention:** `aiot-weekly-YYYY-wNN` (e.g., `aiot-weekly-2026-w08`)

**Tags:** Pick 4-6 tags that reflect the week's topics (e.g., `edge-ai`, `smartwatch`, `risc-v`). Do NOT include a "weekly" tag — the category already identifies this as a weekly article.

## What to Emphasize

- **Highlight variety** — A good weekly shows the breadth of AIoTFun's coverage
- **Tease, don't summarize** — Each item should make the reader want to click through, not feel like they've already read the article
- **Connect dots** — The closing section is the weekly's unique value; individual articles don't connect themselves
- **Consistent energy** — Every item should feel equally interesting, even if some articles are "bigger" than others

## What to Avoid

- **External source links** — Weekly items link to AIoTFun articles only
- **Repeating full articles** — The weekly is a highlight reel, not a reprint
- **Ranking or favoritism** — Don't call one article "the biggest" or "most important"
- **Generic closings** — "Exciting week!" is not an observation. Find the actual pattern.

## ZH-Specific Notes

- Use casual, conversational Chinese — the weekly is the most informal format on AIoTFun
- Item descriptions can use different phrasing/angles than the original ZH article
- The closing should reference Chinese tech context where relevant (e.g., compare to domestic trends)
- Avoid formal media language — this is a colleague catching you up over lunch

## Reference

AIoT Weekly W08 (`weekly/aiot-weekly-2026-w08`) — site-internal roundup covering 7 articles with thematic closing.
