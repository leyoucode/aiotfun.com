"""Configuration loading from YAML."""

from pathlib import Path

import yaml
from pydantic import BaseModel


class FeedConfig(BaseModel):
    name: str
    url: str
    channel: str = "rss"
    language: str = "en"


class DedupConfig(BaseModel):
    simhash_threshold: float = 0.85
    time_window_days: int = 7


class ScoringConfig(BaseModel):
    ollama_base_url: str = "http://localhost:11434/v1"
    model: str = "qwen2:7b"
    batch_size: int = 5


class OutputConfig(BaseModel):
    inbox_dir: str = "../workflow/inbox"


class AppConfig(BaseModel):
    feeds: list[FeedConfig]
    dedup: DedupConfig = DedupConfig()
    scoring: ScoringConfig = ScoringConfig()
    output: OutputConfig = OutputConfig()


def load_config(path: str | Path = "config.yaml") -> AppConfig:
    """Load and validate configuration from a YAML file."""
    config_path = Path(path)
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path) as f:
        raw = yaml.safe_load(f)

    return AppConfig(**raw)
