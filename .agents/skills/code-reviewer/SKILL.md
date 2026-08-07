---
name: repository-reviewer
description: Performs automated code quality audits, vulnerability detection, and developer guide generation for software repositories.
---

# Repository Reviewer Skill

This custom skill equips DevPilot AI agents to analyze source code repositories, extract code metrics, detect security risks, and build comprehensive documentation.

## Capabilities

1. **Repository Parsing**:
   - Parses GitHub URLs, extracts owner/repo details, and traverses tree structures.
   - Filters source code files from non-code assets (lockfiles, binaries, hidden config).

2. **Multi-Vector Auditing**:
   - **Bugs**: Identifies null dereferences, unhandled exceptions, resource leaks.
   - **Security**: Scans for unsanitized inputs, hardcoded secrets, and dependency risks.
   - **Code Smells**: Highlights long functions, magic numbers, and duplicate logic blocks.
   - **Performance**: Recommends caching, O(1) data structure lookups, and async optimizations.

3. **Documentation Synthesis**:
   - Generates structured developer guides (`README.md`) complete with setup CLI commands and file roles.

## Usage Instructions

When reviewing a repository:
1. Inspect primary source code files sampled from the tree.
2. Formulate JSON analysis adhering strictly to `AnalysisResult` schema.
3. Compute sanitized integer `quality_score` (0–100).
