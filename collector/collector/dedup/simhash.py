"""SimHash implementation for near-duplicate title detection."""

import hashlib
import re


def _tokenize(text: str) -> list[str]:
    """Split text into tokens (words). Handles both CJK and Latin text."""
    # For CJK characters, use character bigrams
    # For Latin text, use word tokens
    tokens = []

    # Extract Latin words
    latin_words = re.findall(r"[a-zA-Z0-9]+", text.lower())
    tokens.extend(latin_words)

    # Extract CJK character bigrams
    cjk_chars = re.findall(r"[\u4e00-\u9fff\u3400-\u4dbf]", text)
    for i in range(len(cjk_chars) - 1):
        tokens.append(cjk_chars[i] + cjk_chars[i + 1])

    # Single CJK chars if only one
    if len(cjk_chars) == 1:
        tokens.append(cjk_chars[0])

    return tokens


def _hash_token(token: str) -> int:
    """Hash a token to a 64-bit integer."""
    digest = hashlib.md5(token.encode("utf-8")).hexdigest()
    return int(digest[:16], 16)


def compute_simhash(text: str, hash_bits: int = 64) -> int:
    """Compute SimHash fingerprint for given text.

    Returns an integer fingerprint.
    """
    tokens = _tokenize(text)
    if not tokens:
        return 0

    # Weighted bit vector
    v = [0] * hash_bits

    for token in tokens:
        token_hash = _hash_token(token)
        for i in range(hash_bits):
            if token_hash & (1 << i):
                v[i] += 1
            else:
                v[i] -= 1

    # Build fingerprint
    fingerprint = 0
    for i in range(hash_bits):
        if v[i] > 0:
            fingerprint |= 1 << i

    return fingerprint


def hamming_distance(hash1: int, hash2: int, hash_bits: int = 64) -> int:
    """Compute Hamming distance between two SimHash values."""
    xor = hash1 ^ hash2
    distance = 0
    while xor:
        distance += 1
        xor &= xor - 1
    return distance


def similarity(hash1: int, hash2: int, hash_bits: int = 64) -> float:
    """Compute similarity ratio (0.0 to 1.0) between two SimHash values."""
    dist = hamming_distance(hash1, hash2, hash_bits)
    return 1.0 - dist / hash_bits
