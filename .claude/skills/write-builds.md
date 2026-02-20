---
name: write-builds
description: Category overlay for Builds articles. Read write-article first, then this file for Builds-specific guidance.
---

# Builds — "Someone Actually Built That"

## The Soul of AIoTFun

Builds is AIoTFun's signature category. This is where AI meets hardware through human hands — real people solving real problems (or beautifully pointless ones) by building things. Every builds article should make the reader think: "I want to try that" or "I can't believe someone pulled that off."

## Angle

**Human-first storytelling.** The builder and their motivation come before the technology. We celebrate the person, then explain the craft.

Not: "This project uses Meshtastic to connect Home Assistant over LoRa."
But: "When most of us lose internet, we just wait it out. In Ukraine, that's not an option."

## Hook Formula

**Start with the person's situation, not the technology.**

| Good Hook | Why It Works |
|-----------|-------------|
| "When most of us lose internet, we just wait it out. In Ukraine, one maker found a way to keep their smart home running — no internet, no cloud, no grid." | Human stakes first, technology is the payoff |
| "A retired teacher in rural Japan wanted to monitor her garden. Commercial sensors cost too much. So she built her own." | Relatable motivation, then surprise |

| Bad Hook | Why It Fails |
|----------|-------------|
| "This project uses Meshtastic to connect Home Assistant over LoRa" | Technology first, no human context |
| "In this article, we look at an interesting build using ESP32" | Generic, no story |

## Structure

1. **The person and the problem** — Who built this? What drove them? Set up the "why" before the "what."
2. **How they built it** — Walk through the build, emphasizing the cleverest decisions. What trade-offs did they make? What failed first?
3. **The smartest technical choice** — Zoom in on the one decision that makes this build special. Explain why it's clever, not just what it is.
4. **Community and impact** — How did others react? Has anyone replicated or extended it? What does this enable?
5. **Why this hits different** — Connect to a larger theme. Why should someone who'll never build this still care?

## What to Emphasize

- **The builder's voice** — Use their words from blog posts, READMEs, Reddit/HN comments, forum posts. Let them tell their own story.
- **Clever trade-offs** — The interesting part of a build is rarely the BOM; it's the decisions. "Why LoRa instead of WiFi mesh?" is more interesting than "uses LoRa."
- **Real-world deployment** — Is this running in someone's house/farm/workshop right now? That matters more than a bench demo.
- **Reproducibility signals** — Is the code open? Are the parts available? Does the README actually help? Engineers want to know if they can try this.

## What to Avoid

- **Tutorial tone** — "Step 1: Flash the firmware..." This is not Instructables. We report on builds, we don't teach how to replicate them step-by-step.
- **Technology-first framing** — Always establish the human context before diving into specs. The reader needs to care before they'll read the details.
- **Missing builder voice** — If you can't find any words from the actual builder (README, blog, forum post, comment), the article feels secondhand. Dig harder or pick a different topic.
- **BOM-as-content** — A parts list is not a paragraph. If you list components, each one should earn its mention by being interesting ("the solar panel that keeps it running through Ukrainian winters").

## ZH-Specific Notes

The Ukraine LoRa ZH article is the gold standard for builds in Chinese:
- "一顿外卖钱" instead of "less than a pizza" — culturally native cost reference
- "废土风" captures the aesthetic without literal translation
- Technical terms stay English where natural: LoRa, Home Assistant, Meshtastic, ESP32
- The emotional arc hits the same beats as EN but through ZH-native expressions

When writing builds in ZH, find the Chinese internet's voice for maker culture. Reference 少数派, V2EX, or sspai tone where appropriate.

## Reference Article

**Ukraine LoRa Home Assistant** (`builds/ukraine-lora-home-assistant`) — This is AIoTFun's benchmark article. Study its:
- Human-first hook (crisis → maker response)
- Hardware choices framed as stories, not specs
- "Why This Hits Different" closing that connects to universal themes
- Source attribution with Reddit + HN links
