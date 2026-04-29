---
name: write-article
description: Personal-site writing skill for AIoTFun.com. Invoke this before writing any article — it establishes voice, structure, frontmatter, and bilingual rules for Wei Liu's indie hacker site.
---

# AIoTFun Writing — Personal Site Skill

## Voice & Identity

This site is Wei Liu's personal indie hacker site. The writer is Wei (the user), not an AI persona. You are helping Wei write — keep his voice, not yours.

**The voice**: An engineer talking to other engineers in plain language. Curious, specific, occasionally self-deprecating. No corporate gloss, no marketing voice, no "AI assistant" voice.

**Test every sentence**: Would Wei actually say this to a colleague over coffee? If it reads like a press release, a tutorial intro, or an AI summary, rewrite it.

## Factual Accuracy — Non-Negotiable

This is a hiring-credibility site. Fabrication is the worst possible failure mode.

### Hard rules

1. **No invented technical specifics**. Do not name specific chips, library versions, latency numbers, throughput, or production metrics unless Wei has confirmed them in this session or they are visible in the repo.
2. **No invented community quotes**. If you cite Reddit / HN / GitHub, the link must be real and the quote must be a faithful paraphrase or direct quote.
3. **No fabricated outcomes**. "Used by 10,000 merchants", "reduced latency by 70%" — never invent these. If unknown, write at the qualitative level ("live in production", "improved noticeably").
4. **Mark uncertainty plainly**. "I think the bottleneck was X" is fine. "The bottleneck was X" requires evidence.
5. **When in doubt, ask Wei or leave a TODO**. A TODO is better than a confident fabrication.

## When to Write Articles vs Project Pages

- **Project page** (`src/content/projects/{lang}/{slug}.mdx`): a stable case study of one project. Why it exists, key decisions, what was hard, current status. Updated occasionally.
- **Article** (`src/content/articles/{lang}/{slug}.mdx`): time-stamped writing — debugging notes, technical investigations, opinions, project retrospectives. Once published, generally not edited.

## Article Frontmatter

```yaml
---
title: ""                # Hook the reader, not "How to X" / "Tutorial"
description: ""          # One line, < 120 chars
date: "YYYY-MM-DD"       # Publication date on AIoTFun
cover: ""                # Optional. If present, Unsplash URL with w=800&h=450&fit=crop
readingTime: 0           # ~150 words/min EN, ~300 chars/min ZH
lang: ""                 # en | zh
pinned: false            # Use sparingly — at most 1-2 per language
tags: []                 # 3-5 kebab-case tags
---
```

**Cover is optional.** Most personal articles do not need one. If used, verify with `curl -sI <url>` returning HTTP 200 and `content-type: image/*`.

## Project Frontmatter

```yaml
---
title: ""                # Project's actual name
oneLiner: ""             # One sentence: who it is for + what it does
status: ""               # active | shipped | open-source | paused | archived
techStack: []            # 3-6 items max — show range, not exhaustive list
cover: ""                # Optional
startDate: "YYYY-MM"     # Or just "YYYY"
endDate: "YYYY-MM"       # Optional, for shipped/archived projects
repoUrl: ""              # Optional
liveUrl: ""              # Optional
featured: false          # Up to 4 featured per language — shown on home page
order: 0                 # Smaller = earlier in lists. Featured uses 1-4
lang: ""                 # en | zh
tags: []
---
```

## Article Structure

There is no fixed template. Write what fits the topic.

Common shapes that work:

- **Debugging note**: problem → what I tried → what actually worked → why I was wrong before
- **Investigation**: question I had → what I read / measured → what I concluded
- **Project retrospective**: what I built → what I would do differently → what surprised me
- **Opinion**: claim + reasons + counterexamples I considered

Length: usually 400–1500 words. Long enough to say something specific, short enough to read in 5 minutes.

## Project Case Study Structure

A reasonable default — adapt as needed:

1. **What it does** — one paragraph, clear and specific
2. **Why I built it** — the actual problem, not a marketing reframing
3. **Key decisions** — 2–4 bullets on the choices that defined the project
4. **Trade-offs / lessons** — what was hard, what surprised me
5. **Status** — current state, links

## Bilingual Rules

UI / About / Now / Home are mandatory bilingual. Articles and project case studies can be **either language only**.

If you write both versions:

### English

- Pure English. No Chinese characters.
- Natural conversational engineering English. Contractions fine.
- "I" and "we" are both fine — most personal articles will be "I".

### Chinese (ZH)

- Primary language. Keep brand names and code/identifiers in English.
- **No translation-ese (翻译腔)**. The ZH version should read like Wei wrote it directly in Chinese, not like a translation.
- Replace Western references with culturally native ones ("less than a pizza" → "一顿外卖钱").
- Read it aloud — if any sentence reads awkwardly, rewrite it.

## What NOT to write

- Tutorials, "step-by-step guides" — there are better tutorial sites
- Press-release-style product reviews
- AI-summarised news roundups
- Generic opinion takes that don't draw on personal experience
- Anything that doesn't have specific, hard-to-fake detail

## Pre-Publish Checklist

- [ ] Title is specific (not "How to X")
- [ ] Frontmatter passes Zod schema
- [ ] Cover URL verified with `curl -sI` (if used)
- [ ] No invented metrics, no invented quotes, no fabricated chip names
- [ ] All TODO markers resolved
- [ ] If bilingual: both versions written independently, not machine-translated
- [ ] `pnpm build` succeeds
- [ ] Slug is in kebab-case and matches across both languages (if bilingual)
