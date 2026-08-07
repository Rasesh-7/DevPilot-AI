"""
Utility helpers — URL parsing, configuration, and misc.
"""

import os
import re

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def get_env(key: str, default: str = "") -> str:
    """Read an environment variable with an optional default."""
    return os.getenv(key, default)


# ── GitHub URL parsing ──────────────────────────────────────────────

_GH_PATTERN = re.compile(
    r"(?:https?://)?(?:www\.)?github\.com/(?P<owner>[^/]+)/(?P<repo>[^/\s#?]+)"
)


def parse_github_url(url: str) -> tuple[str, str]:
    """
    Extract (owner, repo) from a GitHub URL.
    Raises ValueError if the URL doesn't match.
    """
    match = _GH_PATTERN.match(url.strip())
    if not match:
        raise ValueError(f"Invalid GitHub URL: {url}")
    owner = match.group("owner")
    repo = match.group("repo").removesuffix(".git")
    return owner, repo


def is_valid_github_url(url: str) -> bool:
    """Return True if *url* looks like a valid GitHub repository URL."""
    try:
        parse_github_url(url)
        return True
    except ValueError:
        return False


# ── File-type heuristics ────────────────────────────────────────────

# Extensions we consider "source code" worth feeding to the AI.
CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".tsx", ".jsx", ".java", ".go", ".rs", ".rb",
    ".c", ".cpp", ".h", ".hpp", ".cs", ".swift", ".kt", ".kts",
    ".php", ".vue", ".svelte", ".astro", ".html", ".css", ".scss",
    ".sql", ".sh", ".bash", ".zsh", ".yaml", ".yml", ".toml", ".json",
    ".md", ".mdx", ".txt", ".cfg", ".ini", ".env", ".dockerfile",
}

# Paths / directory names to always skip.
SKIP_DIRS = {
    "node_modules", ".git", "__pycache__", ".next", ".nuxt",
    "dist", "build", "out", ".venv", "venv", "vendor",
    ".idea", ".vscode", ".cache", "coverage",
}

# Files to always skip.
SKIP_FILES = {
    "package-lock.json", "pnpm-lock.yaml", "yarn.lock",
    "poetry.lock", "Pipfile.lock", "composer.lock",
}


def is_code_file(path: str) -> bool:
    """Return True if *path* looks like a source-code file we care about."""
    basename = path.rsplit("/", 1)[-1]
    if basename in SKIP_FILES:
        return False
    parts = path.split("/")
    if any(p in SKIP_DIRS for p in parts):
        return False
    ext = "." + basename.rsplit(".", 1)[-1] if "." in basename else ""
    return ext.lower() in CODE_EXTENSIONS
