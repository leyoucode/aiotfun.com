"""JSON file output to workflow/inbox/."""

import json
import logging
from datetime import datetime
from pathlib import Path

from collector.config import OutputConfig
from collector.models import ScoredItem

logger = logging.getLogger(__name__)


class InboxWriter:
    """Write scored items to daily JSON files in the inbox directory."""

    def __init__(self, config: OutputConfig):
        self.inbox_dir = Path(config.inbox_dir)
        self.inbox_dir.mkdir(parents=True, exist_ok=True)

    def write(self, items: list[ScoredItem]) -> Path | None:
        """Write items to today's inbox JSON file.

        If the file already exists, merges new items (dedup by id).
        Items are sorted by score descending.

        Returns the path to the written file, or None if no items.
        """
        if not items:
            logger.info("No items to write")
            return None

        date_str = datetime.utcnow().strftime("%Y-%m-%d")
        file_path = self.inbox_dir / f"{date_str}.json"

        # Load existing data if file exists
        existing_items: dict[str, dict] = {}
        if file_path.exists():
            try:
                with open(file_path) as f:
                    data = json.load(f)
                for item in data.get("items", []):
                    existing_items[item["id"]] = item
                logger.info(
                    f"Merging with existing file ({len(existing_items)} items)"
                )
            except (json.JSONDecodeError, KeyError) as e:
                logger.warning(f"Could not read existing file: {e}")

        # Add new items (new ones override existing with same id)
        for item in items:
            existing_items[item.id] = item.model_dump()

        # Sort by score descending
        all_items = sorted(
            existing_items.values(), key=lambda x: x.get("score", 0), reverse=True
        )

        # Build output structure per §7.6
        output = {
            "date": date_str,
            "total": len(all_items),
            "items": all_items,
        }

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

        logger.info(f"Wrote {len(all_items)} items to {file_path}")
        return file_path
