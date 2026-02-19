"""Entry point: python -m collector"""

import logging
import sys
from datetime import datetime
from pathlib import Path

from collector.config import load_config
from collector.dedup.engine import DedupEngine
from collector.feeds.rss import RSSFetcher
from collector.output.writer import InboxWriter
from collector.scoring.scorer import AIScorer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("collector")


def main() -> None:
    logger.info("=== AIoTFun Collector starting ===")

    # Resolve paths relative to the collector/ directory
    base_dir = Path(__file__).resolve().parent.parent
    config_path = base_dir / "config.yaml"

    config = load_config(config_path)
    logger.info(f"Loaded config: {len(config.feeds)} feeds")

    # Initialize components with paths relative to base_dir
    db_path = base_dir / "data" / "collector.db"
    dedup = DedupEngine(config.dedup, db_path=str(db_path))

    scorer = AIScorer(config.scoring)

    # Resolve inbox_dir relative to base_dir
    inbox_dir = (base_dir / config.output.inbox_dir).resolve()
    config.output.inbox_dir = str(inbox_dir)
    writer = InboxWriter(config.output)

    # Phase 1: Fetch from all RSS sources
    all_items = []
    for feed_config in config.feeds:
        try:
            fetcher = RSSFetcher(feed_config)
            items = fetcher.fetch()
            all_items.extend(items)
        except Exception as e:
            logger.error(f"Error fetching {feed_config.name}: {e}")

    logger.info(f"Total fetched: {len(all_items)} items")

    if not all_items:
        logger.warning("No items fetched. Exiting.")
        dedup.close()
        return

    # Phase 2: Dedup
    unique_items = dedup.filter(all_items)
    dedup.close()

    if not unique_items:
        logger.info("All items were duplicates. Nothing to score.")
        return

    # Phase 3: AI Scoring
    date_str = datetime.utcnow().strftime("%Y%m%d")
    scored_items = scorer.score_batch(unique_items, date_str=date_str)

    # Phase 4: Write to inbox
    output_path = writer.write(scored_items)

    if output_path:
        logger.info(f"=== Done! Output: {output_path} ===")
    else:
        logger.info("=== Done! No output generated ===")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)
