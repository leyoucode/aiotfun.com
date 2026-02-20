---
name: write-boards
description: Category overlay for Boards articles. Read write-article first, then this file for Boards-specific guidance.
---

# Boards — "New Toy for Engineers"

## Angle

**Engineer's new toy unboxing** — not a datasheet summary, not a review. The reader is an engineer who wants to know: "What can I build with this? Is the ecosystem ready? Should I order one tonight?"

Boards articles bridge hardware specs and creative possibility. The board itself is just a starting point — what matters is what it enables.

## Hook Formula

**Lead with the most extreme capability or constraint.**

| Good Hook | Why It Works |
|-----------|-------------|
| "Most AI assistants need a gigabyte of RAM. PicoClaw needs less than 10MB." | Extreme contrast, immediately intriguing |
| "A $8 board that runs Linux, has WiFi 6, and fits on your thumbnail." | Triple surprise in one sentence |

| Bad Hook | Why It Fails |
|----------|-------------|
| "The new PicoClaw board features a RISC-V processor and 10MB of RAM." | Datasheet language. No surprise, no context. |
| "Today we're looking at an interesting new development board." | Empty setup. Get to the point. |

## Structure

1. **The absurd capability claim** — Hook with the most extreme thing this board can do (or how little it needs to do it).
2. **What's on the board** — Quick tour of hardware, but every component earns its mention by connecting to what you can build. "The built-in microphone array means voice commands work out of the box — no external HAT needed."
3. **What you can build with it** — Concrete project ideas. Not "IoT applications" but "a doorbell that recognizes your family members" or "a weather station that runs for a year on two AA batteries."
4. **Ecosystem maturity** — SDK quality, community size, documentation state, available libraries. A board without software is a paperweight. Be honest: "The SDK is rough but functional" or "Documentation is excellent, with 50+ example projects."
5. **Getting started** — Price, availability, what else you need. "Order the board ($15), flash the firmware (5 minutes), run the demo (immediate gratification)" — make the path to first blink obvious.

## What to Emphasize

- **Extreme contrasts** — The interesting thing about a board is usually how much it does for how little (cost, power, size) or how it makes the previously impossible possible. Find that contrast and hammer it.
- **Build possibilities** — Engineers read boards articles to fantasize about projects. Give them at least 2-3 concrete project ideas that this board uniquely enables.
- **Ecosystem honesty** — Nothing kills trust faster than overselling a board's ecosystem. If the SDK is alpha-quality, say so. If the community is 12 people on a Discord, say so. Engineers appreciate honest assessments.
- **Comparison to familiar boards** — "Think Arduino Nano but with 100x the AI inference capability" gives instant understanding. Reference boards the reader already knows.

## What to Avoid

- **Datasheet transcription** — Copying specs from the product page into bullet points is not an article. Every spec needs narrative context.
- **Ignoring the ecosystem** — A 200 TOPS NPU means nothing if the SDK only supports three models. Always cover software support.
- **Tutorial tone** — "First, install the toolchain. Then, flash the firmware." That's a builds article. Boards articles describe what's possible and whether the ecosystem is ready — they don't walk through steps.
- **Vendor marketing language** — "Industry-leading performance" / "Best-in-class efficiency." Translate marketing claims into real-world meaning or cut them.

## ZH-Specific Notes

- Board names stay in English (PicoClaw, Raspberry Pi, ESP32)
- Chinese maker community references: "淘宝上已经有第三方扩展板了" (Taobao ecosystem signal), "B 站上已经有人做了测评" (Bilibili community signal)
- Price in both currencies where helpful: "$15（约 ¥110）"
- Chinese engineers have their own board ecosystem context — reference Allwinner, Rockchip, Milk-V where relevant

## Reference Article

**PicoClaw** (`boards/picoclaw-risc-v-ai-assistant`) — Study its:
- Extreme constraint hook (10MB RAM)
- Numbers with familiar comparisons ("98% cheaper", "less RAM than a browser tab")
- "The Numbers Are Wild" section that makes specs feel visceral
- "How to Get Started" that shows clear path to first experience
