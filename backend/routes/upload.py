"""
POST /analyze/zip    — Zip file upload analysis endpoint.
POST /analyze/snippet — Code snippet analysis endpoint.
"""

from __future__ import annotations

import io
import os
import uuid
import zipfile
import tempfile
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, UploadFile, File

from models.request_models import SnippetAnalyzeRequest
from models.response_models import (
    AnalysisResult, RepoMeta, BugItem, SecurityItem,
    CodeSmellItem, PerformanceSuggestion, TestSuggestion,
)
from services.file_reader import compute_stats, build_code_summary
from services.prompt_builder import build_analysis_prompt
from services.ai_service import run_ai_analysis
from utils.helpers import is_code_file

router = APIRouter()

_MAX_ZIP_SIZE = 10 * 1024 * 1024   # 10 MB
_MAX_SNIPPET_SIZE = 100_000         # 100 KB
_MAX_FILES_FROM_ZIP = 25
_MAX_FILE_SIZE_BYTES = 80_000


def _ext_to_language(filename: str) -> str:
    """Infer language name from file extension."""
    ext_map = {
        ".py": "Python", ".js": "JavaScript", ".ts": "TypeScript",
        ".tsx": "TypeScript", ".jsx": "JavaScript", ".java": "Java",
        ".go": "Go", ".rs": "Rust", ".rb": "Ruby",
        ".c": "C", ".cpp": "C++", ".cs": "C#", ".swift": "Swift",
        ".kt": "Kotlin", ".php": "PHP", ".vue": "Vue",
        ".html": "HTML", ".css": "CSS", ".sql": "SQL",
        ".sh": "Shell", ".yaml": "YAML", ".yml": "YAML",
    }
    ext = os.path.splitext(filename)[1].lower()
    return ext_map.get(ext, "Unknown")


def _build_result(
    ai_result: dict,
    stats: dict,
    source_type: str,
    source_name: str,
    language: str,
) -> AnalysisResult:
    """Assemble an AnalysisResult from AI output (shared by zip and snippet)."""
    repo_meta = RepoMeta(
        owner="local",
        repo=source_name,
        full_name=source_name,
        description=f"Analyzed from {source_type} upload",
        language=language,
        total_files=stats["total_files"],
        lines_of_code=stats["lines_of_code"],
        languages=stats["languages"],
    )

    return AnalysisResult(
        id=str(uuid.uuid4())[:8],
        repo_meta=repo_meta,
        source_type=source_type,
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
        suggested_commit_messages=ai_result.get("suggested_commit_messages", []),
        documentation_snippet=ai_result.get("documentation_snippet", ""),
        analyzed_at=datetime.now(timezone.utc).isoformat(),
    )


# ── ZIP Upload ───────────────────────────────────────────────────────


@router.post("/analyze/zip", response_model=AnalysisResult)
async def analyze_zip(file: UploadFile = File(...)):
    """
    Receive a .zip file, extract code files, and run AI analysis.
    """
    # ── 1. Validate ──────────────────────────────────────────────
    if not file.filename or not file.filename.lower().endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only .zip files are accepted.")

    contents = await file.read()
    if len(contents) > _MAX_ZIP_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Zip file exceeds maximum size of {_MAX_ZIP_SIZE // (1024*1024)} MB.",
        )

    # ── 2. Extract code files ────────────────────────────────────
    try:
        zf = zipfile.ZipFile(io.BytesIO(contents))
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid or corrupted zip file.")

    code_files: dict[str, str] = {}
    tree: list[dict] = []

    for info in zf.infolist():
        if info.is_dir():
            continue
        # Normalize path: strip leading folder if all files share a common root
        path = info.filename
        # Skip hidden files and common non-code directories
        parts = path.split("/")
        if any(p.startswith(".") or p in ("node_modules", "__pycache__", "venv", ".git") for p in parts):
            continue

        tree.append({
            "path": path,
            "size": info.file_size,
            "type": "blob",
            "sha": "",
        })

        if is_code_file(path) and len(code_files) < _MAX_FILES_FROM_ZIP:
            if info.file_size <= _MAX_FILE_SIZE_BYTES:
                try:
                    raw = zf.read(info.filename)
                    code_files[path] = raw.decode("utf-8", errors="replace")
                except Exception:
                    continue

    zf.close()

    if not code_files:
        raise HTTPException(
            status_code=400,
            detail="No code files found in the zip archive.",
        )

    # ── 3. Compute stats & run AI ────────────────────────────────
    stats = compute_stats(tree, code_files)
    code_summary = build_code_summary(code_files)

    # Determine primary language
    languages = stats.get("languages", {})
    primary_lang = max(languages, key=languages.get) if languages else "Unknown"

    meta = {
        "full_name": file.filename.rsplit(".", 1)[0],
        "description": f"Code from uploaded zip: {file.filename}",
        "language": primary_lang,
    }

    prompt = build_analysis_prompt(meta, stats, code_summary)
    ai_result = await run_ai_analysis(
        prompt, meta=meta, stats=stats, tree=tree, code_files=code_files,
    )

    source_name = file.filename.rsplit(".", 1)[0]
    return _build_result(ai_result, stats, "zip", source_name, primary_lang)


# ── Code Snippet ─────────────────────────────────────────────────────


@router.post("/analyze/snippet", response_model=AnalysisResult)
async def analyze_snippet(request: SnippetAnalyzeRequest):
    """
    Receive a code snippet string and run AI analysis on it.
    """
    code = request.code.strip()

    # ── 1. Validate ──────────────────────────────────────────────
    if not code:
        raise HTTPException(status_code=400, detail="Code snippet cannot be empty.")

    if len(code) > _MAX_SNIPPET_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Snippet exceeds maximum size of {_MAX_SNIPPET_SIZE // 1000} KB.",
        )

    # ── 2. Build synthetic structures ────────────────────────────
    filename = request.filename or "snippet"
    # Add extension from language hint if filename has no extension
    if "." not in filename and request.language:
        lang_ext = {
            "python": ".py", "javascript": ".js", "typescript": ".ts",
            "java": ".java", "go": ".go", "rust": ".rs", "ruby": ".rb",
            "c": ".c", "cpp": ".cpp", "c++": ".cpp", "c#": ".cs",
            "csharp": ".cs", "swift": ".swift", "kotlin": ".kt",
            "php": ".php", "html": ".html", "css": ".css", "sql": ".sql",
            "shell": ".sh", "bash": ".sh",
        }
        ext = lang_ext.get(request.language.lower(), "")
        if ext:
            filename += ext

    code_files = {filename: code}
    tree = [{"path": filename, "size": len(code), "type": "blob", "sha": ""}]

    # ── 3. Compute stats & run AI ────────────────────────────────
    stats = compute_stats(tree, code_files)
    code_summary = build_code_summary(code_files)

    language = request.language or _ext_to_language(filename)

    meta = {
        "full_name": filename,
        "description": f"Code snippet: {filename}",
        "language": language,
    }

    prompt = build_analysis_prompt(meta, stats, code_summary)
    ai_result = await run_ai_analysis(
        prompt, meta=meta, stats=stats, tree=tree, code_files=code_files,
    )

    return _build_result(ai_result, stats, "snippet", filename, language)
