---
name: write-signals
description: Category overlay for Signals articles. Read write-article first, then this file for Signals-specific guidance.
---

# Signals — "The Pattern, Not the Noise"

## Angle

**Pattern recognition** — A single event is not a signal. Multiple events forming a pattern is a signal. Signals articles connect dots that others haven't connected yet.

We don't report news ("Intel announced X"). We identify patterns ("Three companies shipped 100+ TOPS NPUs this month — the edge AI race just shifted from demo to production").

## Format Tags

| Format Tag | Usage | Frequency |
|------------|-------|-----------|
| `roundtable` | Pro/con debate on a polarizing trend | When a pattern demands debate |
| `spotlight` | Deep analysis of a significant pattern | When a single signal deserves full treatment |

**Note:** Weekly roundups have moved to the `weekly` category — see `.claude/skills/write-weekly.md`.

## Hook Formula

**Lead with the pattern, not the event.**

| Good Hook | Why It Works |
|-----------|-------------|
| "Three separate companies shipped 100+ TOPS NPU boards this month. The edge AI hardware war just went from 'someday' to 'right now.'" | Pattern + implication |
| "Five AIoT stories that caught our eye this week." (radar) | Curation promise, sets expectations |
| "Is edge AI hardware actually ready for production, or are we still in the 'impressive demo' phase?" (roundtable) | Provocative question everyone's wondering |

| Bad Hook | Why It Fails |
|----------|-------------|
| "Intel has announced a new Panther Lake processor." | Single event, no pattern |
| "This week in AI news..." | Generic, no editorial voice |

## Roundtable Structure

Both sides must be **steel-manned** — present each argument at its strongest, not as a straw man to knock down.

1. **The Question** — Frame it as a genuine tension, not a rhetorical question
2. **The Case For** — 2-3 strongest arguments with real evidence (benchmarks, deployments, trends)
3. **The Case Against** — 2-3 strongest arguments with real evidence (limitations, failures, counter-trends)
4. **Where We Land** — Nuanced synthesis. Not "both sides have a point" (that's a cop-out) but a specific, defensible position with caveats.

**Rules:**
- Use real examples as evidence (reference other AIoTFun articles, industry data, specific products)
- Both sides get equal depth and respect
- The conclusion must take a position, however qualified
- No false balance — if one side is clearly stronger, say so, but still give the other side its best shot

**Reference:** Edge AI Debate (`signals/edge-ai-hardware-debate`) — balanced, evidence-based, clear conclusion.

## Spotlight (for Signals)

When a single trend deserves deep treatment:
1. **The pattern** — What events combine to form this signal?
2. **The evidence** — Data points, examples, timelines
3. **What it means** — For builders, for users, for the industry
4. **What to watch** — Specific indicators that will confirm or refute this trend

## What to Emphasize

- **Dot-connecting** — The value of signals is seeing patterns others miss. Connect events across categories, across companies, across time.
- **Evidence over opinion** — Every claim needs support. "Edge AI is getting cheaper" needs "NPU boards dropped from $500 to $50 in 18 months."
- **Honest uncertainty** — "We think X, but we could be wrong if Y happens" is better than false confidence.
- **Actionable insight** — "If you're building Z, this matters because..." Give the reader something to do with the information.

## What to Avoid

- **News reporting** — "Company X announced Y" is news, not a signal. Add pattern, context, and implication or it doesn't belong here.
- **Unsupported predictions** — "AI will replace all edge computing by 2027." Based on what? Every prediction needs a evidence chain.
- **Debate bias** — In roundtables, if you can't make a compelling case for both sides, pick a different topic.
- **Hype amplification** — Signals should cut through hype, not add to it. "This is genuinely different because..." not "This is going to change everything!"

## ZH-Specific Notes

- Industry context differs between EN and ZH audiences:
  - EN readers may not know Chinese AIoT landscape (DJI, Tuya, BYD's AI integration)
  - ZH readers may not follow Western indie hardware scene as closely
- Adjust examples and comparisons accordingly — same pattern, different evidence
- Chinese tech media tends toward hype; AIoTFun ZH should be the calm, evidence-based counterpoint
- Policy signals (regulations, standards) may differ between markets — cover both when relevant
