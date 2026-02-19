"""Dedup engine: 4-layer filtering for feed items."""

import hashlib
import logging

from collector.config import DedupConfig
from collector.models import FeedItem

from .simhash import compute_simhash, similarity
from .store import DedupStore

logger = logging.getLogger(__name__)


class DedupEngine:
    """Filters duplicate items using 4-layer checking:
    1. URL exact match
    2. SimHash title similarity
    3. Content summary hash
    4. Time window (only compare within N days)
    """

    def __init__(self, config: DedupConfig, db_path: str = "data/collector.db"):
        self.config = config
        self.store = DedupStore(db_path)

    def filter(self, items: list[FeedItem]) -> list[FeedItem]:
        """Filter out duplicate items, returning only unique ones."""
        # Pre-load recent data for batch checking
        recent_simhashes = self.store.get_recent_simhashes(
            self.config.time_window_days
        )
        recent_content_hashes = self.store.get_recent_content_hashes(
            self.config.time_window_days
        )

        unique: list[FeedItem] = []
        seen_urls_this_batch: set[str] = set()

        for item in items:
            # Layer 1: URL exact match (DB + current batch)
            if item.url in seen_urls_this_batch:
                logger.debug(f"Dedup (batch URL): {item.title}")
                continue
            if self.store.url_exists(item.url):
                logger.debug(f"Dedup (DB URL): {item.title}")
                continue

            # Layer 2: SimHash title similarity
            item_simhash = compute_simhash(item.title)
            is_similar = False
            for _url, existing_hash in recent_simhashes:
                sim = similarity(item_simhash, existing_hash)
                if sim >= self.config.simhash_threshold:
                    logger.debug(
                        f"Dedup (SimHash {sim:.2f}): {item.title}"
                    )
                    is_similar = True
                    break
            if is_similar:
                continue

            # Layer 3: Content summary hash
            content_hash = _compute_content_hash(item.summary)
            if content_hash and content_hash in recent_content_hashes:
                logger.debug(f"Dedup (content hash): {item.title}")
                continue

            # Passed all checks — item is unique
            unique.append(item)
            seen_urls_this_batch.add(item.url)

            # Record in store for future dedup
            self.store.add_item(
                url=item.url,
                title_simhash=item_simhash,
                content_hash=content_hash,
                source=item.source,
            )

            # Also add to in-memory recent lists for batch dedup
            recent_simhashes.append((item.url, item_simhash))
            if content_hash:
                recent_content_hashes.add(content_hash)

        logger.info(
            f"Dedup: {len(items)} items → {len(unique)} unique"
        )
        return unique

    def close(self) -> None:
        self.store.close()


def _compute_content_hash(text: str) -> str:
    """Compute MD5 hash of normalized content text."""
    if not text:
        return ""
    normalized = text.strip().lower()
    return hashlib.md5(normalized.encode("utf-8")).hexdigest()
