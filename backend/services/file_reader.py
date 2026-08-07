"""
File reader / aggregator — computes stats from the GitHub file tree and code contents.
"""

from __future__ import annotations

from collections import Counter
from typing import Any

from utils.helpers import is_code_file

# Map file extension → language name for display purposes.
_EXT_LANG: dict[str, str] = {
    ".py": "Python", ".js": "JavaScript", ".ts": "TypeScript",
    ".tsx": "TypeScript", ".jsx": "JavaScript", ".java": "Java",
    ".go": "Go", ".rs": "Rust", ".rb": "Ruby",
    ".c": "C", ".cpp": "C++", ".h": "C", ".hpp": "C++",
    ".cs": "C#", ".swift": "Swift", ".kt": "Kotlin",
    ".php": "PHP", ".vue": "Vue", ".svelte": "Svelte",
    ".html": "HTML", ".css": "CSS", ".scss": "SCSS",
    ".sql": "SQL", ".sh": "Shell", ".bash": "Shell",
    ".yaml": "YAML", ".yml": "YAML", ".toml": "TOML",
    ".json": "JSON", ".md": "Markdown",
}


def _ext(path: str) -> str:
    if "." not in path:
        return ""
    return "." + path.rsplit(".", 1)[-1].lower()


def compute_stats(
    tree: list[dict[str, Any]],
    code_files: dict[str, str],
) -> dict[str, Any]:
    """
    Given a file tree and downloaded source code, compute aggregate stats.

    Returns:
        total_files   – number of source-code blobs in the tree
        lines_of_code – sum of newline-delimited lines across downloaded files
        languages     – {language_name: file_count}
    """
    code_blobs = [f for f in tree if is_code_file(f["path"])]
    total_files = len(code_blobs)

    # Language breakdown by file count
    lang_counter: Counter[str] = Counter()
    for blob in code_blobs:
        ext = _ext(blob["path"])
        lang = _EXT_LANG.get(ext, "Other")
        lang_counter[lang] += 1

    # Lines of code from files we actually downloaded
    total_loc = 0
    for content in code_files.values():
        total_loc += content.count("\n") + 1

    return {
        "total_files": total_files,
        "lines_of_code": total_loc,
        "languages": dict(lang_counter.most_common(10)),
    }


def build_code_summary(code_files: dict[str, str], max_chars: int = 60_000) -> str:
    """
    Build a single string that concatenates file paths + contents,
    truncated to stay within *max_chars* (for the AI prompt).
    """
    parts: list[str] = []
    current_len = 0

    for path, content in code_files.items():
        header = f"\n\n--- FILE: {path} ---\n"
        segment = header + content
        if current_len + len(segment) > max_chars:
            remaining = max_chars - current_len
            if remaining > 200:
                parts.append(segment[:remaining] + "\n[...truncated]")
            break
        parts.append(segment)
        current_len += len(segment)

    return "".join(parts)
