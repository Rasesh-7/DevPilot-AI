# DevPilot AI — Agents & Skills Specification

This document details the custom agent and custom skill implemented for DevPilot AI.

---

## 1. Custom Agent: `Code Auditor`

- **Location**: [`.agents/agents/code-auditor.md`](./.agents/agents/code-auditor.md)
- **Role**: Autonomous security and maintainability auditor for software repositories.
- **Trigger**: Initiated whenever a user submits a repository analysis request from the dashboard or landing page.
- **Capabilities**:
  - Performs deep static evaluation of sampled source code.
  - Identifies vulnerability patterns (OWASP Top 10, unhandled exceptions, resource leaks).
  - Assigns quality ratings and computes maintainability letter grades (A+ to F).

---

## 2. Custom Skill: `repository-reviewer`

- **Location**: [`.agents/skills/code-reviewer/SKILL.md`](./.agents/skills/code-reviewer/SKILL.md)
- **Description**: Specialized skill enabling agents to parse GitHub trees, sample source code files, detect bugs/smells, and build formatted developer documentation.
- **Features**:
  - Repository tree extraction & code filtering.
  - Multi-vector issue tagging (Bugs, Security, Code Smells, Performance, Unit Tests).
  - Executable setup guide compilation (`README.md`).

---

## 3. Directory Structure

```text
DevPilot-AI/
├── .agents/
│   ├── agents/
│   │   └── code-auditor.md         # Custom Agent definition
│   └── skills/
│       └── code-reviewer/
│           └── SKILL.md            # Custom Skill definition
├── AGENTS_AND_SKILLS.md            # This documentation file
└── AGENTS.md                       # Agent constitution & rules
```