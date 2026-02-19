"""AI scoring module using Ollama via OpenAI-compatible API."""

import json
import logging

from openai import OpenAI

from collector.config import ScoringConfig
from collector.models import FeedItem, ScoredItem

logger = logging.getLogger(__name__)

SCORING_PROMPT = """You are an editorial AI for AIoTFun.com, a bilingual (EN/ZH) media site covering fun AI + IoT discoveries.

Given the following article info, evaluate it and respond with ONLY a JSON object (no markdown, no extra text):

Title: {title}
Source: {source}
Language: {language}
Summary: {summary}

Respond with this exact JSON structure:
{{
  "novelty": <1-10 score for novelty/uniqueness>,
  "fun": <1-10 score for fun/wow factor>,
  "relevance": <1-10 score for AI+IoT relevance>,
  "suggested_category": "<one of: products, boards, builds, models, signals>",
  "suggested_tags": ["tag1", "tag2", "tag3"],
  "title_zh": "<Chinese translation of the title, or original if already Chinese>",
  "reason": "<brief scoring rationale in Chinese>"
}}

Category guidelines:
- products: Consumer AI/IoT products, gadgets, smart devices
- boards: Development boards, SBCs, microcontrollers, chips
- builds: DIY projects, maker builds, hacks, tutorials
- models: AI models, LLMs, ML frameworks, algorithms
- signals: Industry trends, funding, policy, market analysis

Tags should be kebab-case, 3-5 tags."""


class AIScorer:
    """Score feed items using Ollama (OpenAI-compatible API)."""

    def __init__(self, config: ScoringConfig):
        self.config = config
        self.client: OpenAI | None = None
        self._available = False
        self._init_client()

    def _init_client(self) -> None:
        """Initialize OpenAI client and check connectivity."""
        try:
            self.client = OpenAI(
                base_url=self.config.ollama_base_url,
                api_key="ollama",  # Ollama doesn't need a real key
            )
            # Quick connectivity check
            self.client.models.list()
            self._available = True
            logger.info(f"AI scorer connected: {self.config.model}")
        except Exception as e:
            logger.warning(f"AI scorer unavailable: {e}")
            self._available = False

    def score_batch(
        self, items: list[FeedItem], date_str: str = ""
    ) -> list[ScoredItem]:
        """Score a batch of items. Falls back gracefully if AI is unavailable."""
        scored: list[ScoredItem] = []
        from datetime import datetime

        if not date_str:
            date_str = datetime.utcnow().strftime("%Y%m%d")

        for idx, item in enumerate(items, start=1):
            item_id = f"src_{date_str}_{idx:03d}"
            collected_at = item.collected_at.isoformat() + "Z"

            if not self._available:
                scored.append(
                    ScoredItem(
                        id=item_id,
                        title=item.title,
                        title_zh=item.title if item.language == "zh" else "",
                        source=item.source,
                        channel=item.channel,
                        url=item.url,
                        summary=item.summary,
                        tags=[],
                        suggested_category="signals",
                        score=0.0,
                        score_detail={},
                        score_reason="AI scoring unavailable",
                        collected_at=collected_at,
                    )
                )
                continue

            try:
                result = self._score_single(item)
                novelty = result.get("novelty", 5)
                fun = result.get("fun", 5)
                relevance = result.get("relevance", 5)
                avg_score = round((novelty + fun + relevance) / 3, 1)

                scored.append(
                    ScoredItem(
                        id=item_id,
                        title=item.title,
                        title_zh=result.get("title_zh", ""),
                        source=item.source,
                        channel=item.channel,
                        url=item.url,
                        summary=item.summary,
                        tags=result.get("suggested_tags", []),
                        suggested_category=result.get(
                            "suggested_category", "signals"
                        ),
                        score=avg_score,
                        score_detail={
                            "novelty": novelty,
                            "fun": fun,
                            "relevance": relevance,
                        },
                        score_reason=result.get("reason", ""),
                        collected_at=collected_at,
                    )
                )
                logger.info(
                    f"Scored [{avg_score}] {item.title[:60]}"
                )
            except Exception as e:
                logger.error(f"Scoring failed for {item.title[:60]}: {e}")
                scored.append(
                    ScoredItem(
                        id=item_id,
                        title=item.title,
                        title_zh=item.title if item.language == "zh" else "",
                        source=item.source,
                        channel=item.channel,
                        url=item.url,
                        summary=item.summary,
                        tags=[],
                        suggested_category="signals",
                        score=0.0,
                        score_detail={},
                        score_reason=f"Scoring error: {e}",
                        collected_at=collected_at,
                    )
                )

        logger.info(f"Scored {len(scored)} items total")
        return scored

    def _score_single(self, item: FeedItem) -> dict:
        """Score a single item via the AI model."""
        prompt = SCORING_PROMPT.format(
            title=item.title,
            source=item.source,
            language=item.language,
            summary=item.summary[:300] if item.summary else "(no summary)",
        )

        response = self.client.chat.completions.create(
            model=self.config.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        content = response.choices[0].message.content.strip()

        # Try to extract JSON from response (handle markdown code blocks)
        if content.startswith("```"):
            lines = content.split("\n")
            json_lines = []
            in_block = False
            for line in lines:
                if line.startswith("```") and not in_block:
                    in_block = True
                    continue
                elif line.startswith("```") and in_block:
                    break
                elif in_block:
                    json_lines.append(line)
            content = "\n".join(json_lines)

        return json.loads(content)
