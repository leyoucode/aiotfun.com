"""Base class for feed fetchers."""

import abc

from collector.config import FeedConfig
from collector.models import FeedItem


class BaseFetcher(abc.ABC):
    """Abstract base for all feed channel fetchers."""

    def __init__(self, feed_config: FeedConfig):
        self.feed_config = feed_config

    @abc.abstractmethod
    def fetch(self) -> list[FeedItem]:
        """Fetch items from the source. Returns a list of FeedItem."""
        ...
