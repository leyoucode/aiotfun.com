"""RSS feed fetcher using feedparser + httpx."""

import logging
from datetime import datetime

import feedparser
import httpx
from dateutil import parser as dateparser

from collector.config import FeedConfig
from collector.models import FeedItem

from .base import BaseFetcher

logger = logging.getLogger(__name__)


class RSSFetcher(BaseFetcher):
    """Fetch items from an RSS/Atom feed."""

    def __init__(self, feed_config: FeedConfig, timeout: float = 30.0):
        super().__init__(feed_config)
        self.timeout = timeout

    def fetch(self) -> list[FeedItem]:
        """Fetch and parse RSS feed, returning FeedItem list."""
        url = self.feed_config.url
        name = self.feed_config.name
        logger.info(f"Fetching RSS: {name} ({url})")

        try:
            resp = httpx.get(url, timeout=self.timeout, follow_redirects=True)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch {name}: {e}")
            return []

        feed = feedparser.parse(resp.text)

        if feed.bozo and not feed.entries:
            logger.warning(f"Feed parse error for {name}: {feed.bozo_exception}")
            return []

        items: list[FeedItem] = []
        now = datetime.utcnow()

        for entry in feed.entries:
            title = entry.get("title", "").strip()
            link = entry.get("link", "").strip()

            if not title or not link:
                continue

            # Extract summary from various possible fields
            summary = ""
            if hasattr(entry, "summary"):
                summary = entry.summary
            elif hasattr(entry, "description"):
                summary = entry.description

            # Strip HTML tags from summary (simple approach)
            summary = _strip_html(summary).strip()
            # Truncate long summaries
            if len(summary) > 500:
                summary = summary[:497] + "..."

            # Parse published date
            published_at = None
            for date_field in ("published", "updated", "created"):
                raw_date = entry.get(date_field)
                if raw_date:
                    try:
                        published_at = dateparser.parse(raw_date)
                        break
                    except (ValueError, TypeError):
                        continue

            items.append(
                FeedItem(
                    title=title,
                    url=link,
                    summary=summary,
                    source=self.feed_config.name,
                    channel=self.feed_config.channel,
                    language=self.feed_config.language,
                    published_at=published_at,
                    collected_at=now,
                )
            )

        logger.info(f"Fetched {len(items)} items from {name}")
        return items


def _strip_html(text: str) -> str:
    """Remove HTML tags from text (simple regex-free approach)."""
    result = []
    in_tag = False
    for ch in text:
        if ch == "<":
            in_tag = True
        elif ch == ">":
            in_tag = False
        elif not in_tag:
            result.append(ch)
    return "".join(result)
