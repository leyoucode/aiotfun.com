---
name: write-products
description: Category overlay for Products articles. Read write-article first, then this file for Products-specific guidance.
---

# Products — "Wait, That Exists?"

## Angle

**Discovery journalism**, not product review. We don't rate products on a scale of 1-10. We show readers things they didn't know existed and make them go "holy crap, someone actually ships that?"

The reader should walk away knowing: what this thing is, why it's wild that it exists, and who would actually want one.

## Hook Formula

**Lead with the most absurd or impressive constraint/achievement.**

| Good Hook | Why It Works |
|-----------|-------------|
| "They crammed a complete software-defined radio into an M.2 2230 module — the same slot your laptop uses for WiFi." | Physical absurdity + familiar reference |
| "A thermal camera that fits on your phone and costs less than dinner for two." | Accessibility shock |

| Bad Hook | Why It Fails |
|----------|-------------|
| "Wavelet Lab has released a new SDR module called xSDR." | Press release. Nobody cares about company announcements. |
| "The xSDR is a versatile software-defined radio platform." | Marketing copy. Tells us nothing surprising. |

## Structure

1. **"This exists?!"** — The hook. Make the reader's eyebrows go up. Lead with the most surprising aspect.
2. **What it actually does** — Not a spec sheet. What can you *do* with this? Paint scenarios, not bullet points. "You could scan every radio frequency from FM to 5G without swapping hardware."
3. **How it compares** — Contextualize through feel, not tables. "Most SDRs that cover this range cost as much as a used car and need their own desk. This one disappears into an M.2 slot." Avoid comparison tables.
4. **Community reaction** — What are people saying? Reddit excitement? HN skepticism? GitHub issues revealing real-world usage? This is where the product stops being a press release and becomes real.
5. **Who actually wants this** — Specific use cases, specific people. Not "professionals and hobbyists alike" (that means nothing) but "radio astronomers on a budget" or "pentesters who need a portable RF toolkit."

## The Spec-Listing Trap

Products articles are the most vulnerable to "spec sheet syndrome." Every spec must serve the narrative.

**Anti-pattern (from xSDR article):**
```markdown
## Hardware at a Glance
- **FPGA:** Xilinx Artix-7 (XC7A50T)
- **Frequency Range:** 70 MHz – 6 GHz
- **Bandwidth:** Up to 61.44 MHz instantaneous
```

**Better approach:**
> The xSDR packs a Xilinx Artix-7 FPGA — the same family used in test equipment that costs 10x more — into an M.2 2230 card. It covers 70 MHz to 6 GHz, which means everything from FM radio to 5G in a single module.

Rules:
- No bulleted spec lists unless you're comparing 3+ products
- Every number needs a "so what?" in the same sentence or the next
- If a spec doesn't change the reader's understanding, cut it
- Comparison should feel organic, not tabular

## What to Emphasize

- **The "impossible" aspect** — What makes this product surprising? Size? Price? capability combination? Lead with it and keep reinforcing it.
- **Real-world use scenarios** — Paint pictures of who uses this and how. Be specific: "A ham radio operator scanning for emergency signals during a hurricane" not "various RF applications."
- **Price context** — Always compare to something familiar. "$499" means nothing. "Less than a RTL-SDR + a decent laptop" means something.
- **Availability and maturity** — Can you actually buy this? Is it shipping? Pre-order? Crowdfunding vaporware? Be honest.

## What to Avoid

- **Review tone** — "The build quality is excellent" / "We were impressed by" / "4 out of 5 stars." We don't review. We discover.
- **Press release language** — "X company is proud to announce" / "The product features" / "designed for professionals." Rewrite from the reader's perspective.
- **Exhaustive spec coverage** — You don't need to mention every feature. Pick the 3-4 that make this product remarkable and go deep on those.
- **Missing community voice** — A product without community reaction feels like an ad. Find what real users or potential buyers are saying.

## ZH-Specific Notes

- Price comparisons should use ZH-native references: "一杯奶茶的钱" (bubble tea money), "一顿火锅" (hotpot dinner), "一个月视频会员" (one month streaming subscription)
- Tech products in China have their own context — if a competing product is well-known in the ZH market, reference it
- Avoid translating Western brand comparisons literally; find equivalents that resonate

## Anti-Reference

**xSDR article** (`products/xsdr-m2-sdr-fpga`) — Study this as what to improve:
- Hook is decent but could be punchier
- "Hardware at a Glance" section is pure spec list (violation of spec-listing rule)
- No community voice at all
- "Who Needs This" section is too generic ("RF engineers, researchers, hobbyists")
- Missing the visceral "I can't believe this exists" energy
