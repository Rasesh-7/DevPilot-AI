"""
Prompt builder — crafts a structured prompt for the Gemini AI model.
"""

from __future__ import annotations

from typing import Any


def build_analysis_prompt(
    meta: dict[str, Any],
    stats: dict[str, Any],
    code_summary: str,
) -> str:
    """
    Build the system + user prompt that asks the AI to perform a full
    code-quality analysis and return structured JSON.
    """
    language_list = ", ".join(
        f"{lang} ({count} files)" for lang, count in stats.get("languages", {}).items()
    )

    return f"""You are DevPilot AI, an expert code reviewer.
Analyze the following GitHub repository and return your findings as **valid JSON only** — no markdown, no extra text.

## Repository Info
- **Name:** {meta.get('full_name', 'unknown')}
- **Description:** {meta.get('description', 'N/A')}
- **Primary language:** {meta.get('language', 'Unknown')}
- **Languages found:** {language_list or 'Unknown'}
- **Total source files:** {stats.get('total_files', 0)}
- **Lines of code (sampled):** {stats.get('lines_of_code', 0)}

## Source Code (sampled)
{code_summary}

## Required JSON Schema
Return EXACTLY this structure (populate with real values):
{{
  "quality_score": <int 0-100>,
  "summary": "<2-4 sentence narrative about the codebase>",
  "tags": ["<tag1>", "<tag2>", ...],
  "bugs": [
    {{
      "severity": "critical|high|medium|low",
      "title": "<short title>",
      "description": "<explanation>",
      "file": "<file path>",
      "line": <line number or null>
    }}
  ],
  "security_issues": [
    {{
      "severity": "critical|high|medium|low",
      "category": "vulnerability|dependency_risk|secret",
      "title": "<short title>",
      "description": "<explanation>",
      "file": "<file path>"
    }}
  ],
  "code_smells": [
    {{
      "category": "duplicated_blocks|long_functions|deep_nesting|magic_numbers|unused_code|poor_naming",
      "title": "<short title>",
      "description": "<explanation>",
      "file": "<file path>",
      "count": <int>
    }}
  ],
  "performance_suggestions": [
    {{
      "title": "<short title>",
      "description": "<actionable suggestion>",
      "file": "<file path or empty>"
    }}
  ],
  "test_suggestions": [
    {{
      "function_name": "<function>",
      "file": "<file path>",
      "suggestion": "<what to test>"
    }}
  ],
  "suggested_commit_messages": [
    "feat(core): <conventional commit summary>",
    "fix(security): <conventional commit fix summary>",
    "docs: <conventional commit documentation summary>"
  ],
  "documentation_snippet": "Write a clean, professional, and easy-to-understand developer guide in Markdown format for this repository. Include these exact sections:\n# [Repository Name] Developer Guide\n\n## 1. Executive Summary\nClear, simple explanation of what this project does and its main purpose.\n\n## 2. Architecture & Tech Stack\nHigh-level system design, primary language, frameworks, and key design patterns.\n\n## 3. Core File Map & Key Roles\nList the most important files found in the code and explain what each file does.\n\n## 4. Quick Start & Developer Setup\nProvide exact step-by-step commands (using code blocks ```bash ... ```) to clone, install dependencies, run, and test the application."
}}

Be thorough, clear, and professional. Prioritize real findings in the code.
Return ONLY the JSON object — no extra text outside the JSON.
"""
