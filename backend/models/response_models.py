"""
Pydantic models for the /analyze response.
"""

from __future__ import annotations
from pydantic import BaseModel, Field


class RepoMeta(BaseModel):
    """Basic repository metadata fetched from GitHub."""
    owner: str
    repo: str
    full_name: str = ""
    description: str = ""
    language: str = "Unknown"
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    default_branch: str = "main"
    last_pushed: str = ""
    total_files: int = 0
    lines_of_code: int = 0
    languages: dict[str, int] = Field(default_factory=dict)


class BugItem(BaseModel):
    severity: str = "medium"          # critical | high | medium | low
    title: str = ""
    description: str = ""
    file: str = ""
    line: int | None = None


class SecurityItem(BaseModel):
    severity: str = "medium"
    category: str = ""                # vulnerability | dependency_risk | secret
    title: str = ""
    description: str = ""
    file: str = ""


class CodeSmellItem(BaseModel):
    category: str = ""                # duplicated_blocks | long_functions | deep_nesting | magic_numbers
    title: str = ""
    description: str = ""
    file: str = ""
    count: int = 1


class PerformanceSuggestion(BaseModel):
    title: str = ""
    description: str = ""
    file: str = ""


class TestSuggestion(BaseModel):
    function_name: str = ""
    file: str = ""
    suggestion: str = ""


class AnalysisResult(BaseModel):
    """The full analysis payload returned by POST /analyze."""
    id: str = ""
    repo_meta: RepoMeta
    quality_score: int = 0
    summary: str = ""
    tags: list[str] = Field(default_factory=list)
    bugs: list[BugItem] = Field(default_factory=list)
    security_issues: list[SecurityItem] = Field(default_factory=list)
    code_smells: list[CodeSmellItem] = Field(default_factory=list)
    performance_suggestions: list[PerformanceSuggestion] = Field(default_factory=list)
    test_suggestions: list[TestSuggestion] = Field(default_factory=list)
    documentation_snippet: str = ""
    analyzed_at: str = ""
