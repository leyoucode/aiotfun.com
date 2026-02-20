---
name: write-models
description: Category overlay for Models articles. Read write-article first, then this file for Models-specific guidance.
---

# Models — "This Changes What's Possible"

## Scope

Models covers the **software layer of AIoT** — anything that changes what devices can do or how developers build for them:

- Edge AI models and inference engines (TFLite, ONNX Runtime, llama.cpp)
- Device operating systems (AsteroidOS, Zephyr, RIOT OS)
- AI frameworks and toolchains for embedded/IoT
- Novel architectures enabling new device capabilities
- Cloud-to-edge deployment pipelines

**Not** limited to "AI models" in the LLM sense. If it's software that makes AIoT devices smarter or more capable, it belongs here.

## Angle

**Possibility expansion** — What could you NOT do before this existed? What can you do now? The article should leave the reader with a shifted understanding of what's achievable.

## Hook Formula

**Lead with what changed, not what shipped.**

| Good Hook | Why It Works |
|-----------|-------------|
| "AsteroidOS started in 2016 as a pipe dream. Eight years later, version 2.0 runs on 30 devices — and it's actually usable as a daily driver." | Time + scale + surprise at maturity |
| "Running a language model on a microcontroller used to be a joke. This framework makes it work in 256KB of RAM." | Impossibility reversed |

| Bad Hook | Why It Fails |
|----------|-------------|
| "AsteroidOS 2.0 has been released with support for 30 smartwatches." | News announcement. No "so what?" |
| "A new framework for running AI models on edge devices." | Generic. Which models? What devices? Why should I care? |

## Structure

1. **What this makes possible** — Hook with the capability shift. Before vs. after. What was impossible/impractical and now isn't?
2. **Technical substance** — How does it actually work? Benchmarks with context, device support specifics, performance characteristics. Engineers want to know if the claims hold up.
3. **Developer experience** — What's it like to actually use this? API quality, documentation, getting-started friction, toolchain integration. "pip install and run" vs. "three days of build system wrestling."
4. **Ecosystem and maturity** — Community size, corporate backing (or lack thereof), update cadence, production deployments. Is this a weekend project or a sustainable platform?
5. **Where this is heading** — Roadmap, trajectory, what the next version might enable. Connect to larger trends in AIoT.

## What to Emphasize

- **The possibility shift** — Every models article should answer: "What can I build tomorrow that I couldn't build yesterday?" Make this concrete, not abstract.
- **Honest benchmarks** — Raw numbers with context. "Runs GPT-2 at 5 tokens/sec on a Raspberry Pi 4" is useful. "Fast inference on edge devices" is not.
- **Developer experience truth** — Is the documentation good? Are there examples? Does the getting-started guide actually work? Engineers will find out anyway — earn trust by being honest upfront.
- **Sustainability signals** — One-person GitHub project vs. Linux Foundation project matters. Active commits vs. last update 6 months ago matters. Report these without judgment but clearly.

## What to Avoid

- **Category confusion** — If it's a physical device, it probably belongs in products or boards. Models is for software, frameworks, and the AI/OS layer. A smartwatch is products; the OS that runs on it is models.
- **Press release tone** — "We're excited to announce" / "This groundbreaking framework." Let the capabilities speak for themselves.
- **Ignoring limitations** — Every framework has them. "Only supports ARM64" or "Requires at least 512MB RAM" are important context. Hiding limitations erodes trust.
- **Benchmark theater** — Cherry-picked benchmarks on ideal hardware. If it only runs well on one specific board, say so. If the benchmarks are from the vendor with no independent verification, note that.

## ZH-Specific Notes

- Framework/model names stay in English (TensorFlow Lite, AsteroidOS, Zephyr)
- Chinese AI ecosystem has its own landscape — reference Paddle Lite, MNN, NCNN, MindSpore Lite where relevant for comparison
- "开箱即用" (out-of-box) is a natural ZH phrase for good developer experience
- Chinese developer community signals: GitHub stars from CN developers, 知乎 discussions, CSDN tutorials presence

## Reference Article

**AsteroidOS 2.0** (`models/asteroidos-2-smartwatch-os`) — Study its:
- Persistence narrative hook (8 years of development)
- Honest ecosystem assessment (what works, what doesn't)
- Self-aware category note ("Why Models?")
- Forward-looking close connecting to open-source hardware movement
