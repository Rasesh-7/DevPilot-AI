"""
POST /analyze — Full repository analysis endpoint.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from models.request_models import AnalyzeRequest
from models.response_models import (
    AnalysisResult, RepoMeta, BugItem, SecurityItem,
    CodeSmellItem, PerformanceSuggestion, TestSuggestion,
)
from services.github_service import fetch_repo_data
from services.file_reader import compute_stats, build_code_summary
from services.prompt_builder import build_analysis_prompt
from services.ai_service import run_ai_analysis
from utils.helpers import is_valid_github_url

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResult)
async def analyze(request: AnalyzeRequest):
    """
    Receive a GitHub URL, fetch the repo, run AI analysis, and return
    structured results.
    """
    url = request.github_url.strip()

    # ── 1. Validate ──────────────────────────────────────────────
    if not is_valid_github_url(url):
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL.")

    # ── 2. Fetch from GitHub ─────────────────────────────────────
    try:
        repo_data = await fetch_repo_data(url)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch repository from GitHub: {e}",
        )

    meta = repo_data["meta"]
    tree = repo_data["tree"]
    code_files = repo_data["code_files"]

    # ── 3. Compute stats ─────────────────────────────────────────
    stats = compute_stats(tree, code_files)
    code_summary = build_code_summary(code_files)

    # ── 4. Build prompt & run AI analysis ────────────────────────
    prompt = build_analysis_prompt(meta, stats, code_summary)
    ai_result = await run_ai_analysis(
        prompt,
        meta=meta,
        stats=stats,
        tree=tree,
        code_files=code_files,
    )

    # ── 5. Assemble the response ─────────────────────────────────
    repo_meta = RepoMeta(
        owner=meta["owner"],
        repo=meta["repo"],
        full_name=meta["full_name"],
        description=meta["description"],
        language=meta["language"],
        stars=meta["stars"],
        forks=meta["forks"],
        open_issues=meta["open_issues"],
        default_branch=meta["default_branch"],
        last_pushed=meta["last_pushed"],
        total_files=stats["total_files"],
        lines_of_code=stats["lines_of_code"],
        languages=stats["languages"],
    )

    result = AnalysisResult(
        id=str(uuid.uuid4())[:8],
        repo_meta=repo_meta,
        quality_score=ai_result.get("quality_score", 0),
        summary=ai_result.get("summary", ""),
        tags=ai_result.get("tags", []),
        bugs=[BugItem(**b) for b in ai_result.get("bugs", [])],
        security_issues=[SecurityItem(**s) for s in ai_result.get("security_issues", [])],
        code_smells=[CodeSmellItem(**c) for c in ai_result.get("code_smells", [])],
        performance_suggestions=[
            PerformanceSuggestion(**p) for p in ai_result.get("performance_suggestions", [])
        ],
        test_suggestions=[TestSuggestion(**t) for t in ai_result.get("test_suggestions", [])],
        documentation_snippet=ai_result.get("documentation_snippet", ""),
        analyzed_at=datetime.now(timezone.utc).isoformat(),
    )

    return result