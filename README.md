# DevPilot AI — Autonomous Code Review & Repository Analysis Partner

DevPilot AI is an AI-powered code reviewer built with Next.js (App Router), React 19, FastAPI, and Google Gemini Flash AI. It provides real-time code auditing, vulnerability scanning, maintainability scoring, and automatic developer guide compilation for any public GitHub repository.

---

## 🏆 Hackathon Checkpoints Compliance

This repository satisfies all 5 required submission checkpoints:

1. 📑 **Architecture Document**: [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Describes stack, data models, API endpoints, and high-level design.
2. 📜 **Agent Rules & Constitution**: [`AGENTS.md`](./AGENTS.md) — Behavioral rules, audit principles, and issue severity thresholds.
3. ⚡ **Working Code**: Fully functional Next.js + FastAPI codebase with 0 build errors.
4. 🤖 **Custom Agent & Custom Skill**: Defined in `.agents/` and fully documented in [`AGENTS_AND_SKILLS.md`](./AGENTS_AND_SKILLS.md).
   - Custom Agent: `Code Auditor` ([`.agents/agents/code-auditor.md`](./.agents/agents/code-auditor.md))
   - Custom Skill: `repository-reviewer` ([`.agents/skills/code-reviewer/SKILL.md`](./.agents/skills/code-reviewer/SKILL.md))
5. 🚀 **Green CI/CD Pipeline**: GitHub Actions workflow configured at [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

---

## ⚡ Quick Start

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
*(Runs on `http://localhost:8000`)*

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

---

## 🧪 Testing

Run backend unit tests:
```bash
python -m unittest discover -s tests -p "test_*.py"
```

Build production frontend:
```bash
cd frontend
npm run build
```