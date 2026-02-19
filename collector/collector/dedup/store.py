"""SQLite storage layer for dedup state."""

import sqlite3
from datetime import datetime
from pathlib import Path


class DedupStore:
    """Manages the seen_items SQLite table for deduplication."""

    def __init__(self, db_path: str | Path = "data/collector.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(str(self.db_path))
        self._init_table()

    def _init_table(self) -> None:
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS seen_items (
                url TEXT UNIQUE,
                title_simhash TEXT,
                content_hash TEXT,
                first_seen TEXT,
                source TEXT
            )
        """)
        self.conn.commit()

    def url_exists(self, url: str) -> bool:
        """Check if a URL has been seen before."""
        cur = self.conn.execute(
            "SELECT 1 FROM seen_items WHERE url = ?", (url,)
        )
        return cur.fetchone() is not None

    def get_recent_simhashes(self, days: int = 7) -> list[tuple[str, int]]:
        """Get (url, title_simhash) pairs from the last N days."""
        cutoff = datetime.utcnow().isoformat()[:10]  # rough cutoff
        cur = self.conn.execute(
            "SELECT url, title_simhash FROM seen_items WHERE first_seen >= date(?, ?)",
            (cutoff, f"-{days} days"),
        )
        return [(url, int(h, 16)) for url, h in cur.fetchall() if h]

    def get_recent_content_hashes(self, days: int = 7) -> set[str]:
        """Get content hashes from the last N days."""
        cutoff = datetime.utcnow().isoformat()[:10]
        cur = self.conn.execute(
            "SELECT content_hash FROM seen_items WHERE first_seen >= date(?, ?) AND content_hash IS NOT NULL",
            (cutoff, f"-{days} days"),
        )
        return {row[0] for row in cur.fetchall()}

    def add_item(
        self,
        url: str,
        title_simhash: int,
        content_hash: str,
        source: str,
    ) -> None:
        """Record a seen item."""
        self.conn.execute(
            """INSERT OR IGNORE INTO seen_items
               (url, title_simhash, content_hash, first_seen, source)
               VALUES (?, ?, ?, ?, ?)""",
            (url, format(title_simhash, 'x'), content_hash, datetime.utcnow().isoformat(), source),
        )
        self.conn.commit()

    def close(self) -> None:
        self.conn.close()
