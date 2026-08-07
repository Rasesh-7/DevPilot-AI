# DevPilot AI — System Architecture & Technical Design

DevPilot AI is an AI-powered code review platform that analyzes public GitHub repositories to detect bugs, identify security vulnerabilities, locate code smells, offer performance optimizations, calculate code quality metrics, and compile developer-ready documentation.

---

## 1. System Overview & Technology Stack

```
                     ┌─────────────────────────────────────────┐
                     │          User Web Browser               │
                     └────────────────────┬────────────────────┘
                                          │
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │   Frontend: Next.js App Router (React 19)│
                     │  Vanilla CSS / Tailwind, TypeScript     │
                     └────────────────────┬────────────────────┘
                                          │
                                  REST API (JSON)
                                          │
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │      Backend: FastAPI (Python 3.13)     │
                     │    Uvicorn Server / CORS Middleware     │
                     └─────────┬─────────────────────┬─────────┘
                               │                     │
                        GitHub API (v3)      Google Gemini API
                        (Tree & Raw Code)     (Flash Models)
```

### Stack Components

- **Frontend**: Next.js (App Router), React 19, TypeScript, Vanilla CSS + Tailwind, Lucide Icons.
- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic, HTTPX, Google Generative AI (`google-generativeai`).
- **AI Engine**: Google Gemini Flash (`gemini-flash-latest`, `gemini-2.0-flash`) with dynamic repository-aware fallback engine when offline.
- **Integrations**: GitHub REST API v3 for fetching repository metadata, file trees, and raw file contents.

---

## 2. High-Level Design & Data Flow

1. **User Submits Repository**: The user inputs a public GitHub repository URL (e.g. `https://github.com/fastapi/fastapi`) on the Dashboard.
2. **GitHub Fetching**:
   - The backend validates the URL and fetches metadata (`/repos/{owner}/{repo}`).
   - Fetches repository tree (`/repos/{owner}/{repo}/git/trees/{branch}?recursive=1`).
   - Samples representative source code files.
3. **Prompt Construction & AI Analysis**:
   - `file_reader.py` calculates language stats and lines of code metrics.
   - `prompt_builder.py` crafts a structured JSON analysis request.
   - `ai_service.py` sends the payload to Google Gemini AI.
4. **Result Processing & Formatting**:
   - Sanitizes quality score into an integer between 0 and 100.
   - Stores analysis in sessionStorage and localStorage history.
5. **Presentation**:
   - Renders animated score gauge with letter grade (A+, A, B, C, F) and breakdown metrics (Security, Maintainability, Reliability).
   - Formats developer guide with syntax-highlighted code blocks, copy, and download functions.

---

## 3. Data Models & Schemas

### `RepoMeta`
```json
{
  "owner": "string",
  "repo": "string",
  "full_name": "string",
  "description": "string",
  "language": "string",
  "stars": 1250,
  "forks": 140,
  "open_issues": 12,
  "default_branch": "main",
  "last_pushed": "2026-08-07T12:00:00Z",
  "total_files": 45,
  "lines_of_code": 3450,
  "languages": { "Python": 40, "HTML": 5 }
}
```

### `AnalysisResult`
```json
{
  "id": "string (UUID)",
  "repo_meta": "RepoMeta",
  "quality_score": 85,
  "summary": "string",
  "tags": ["string"],
  "bugs": [
    {
      "severity": "critical|high|medium|low",
      "title": "string",
      "description": "string",
      "file": "string",
      "line": 42
    }
  ],
  "security_issues": [
    {
      "severity": "critical|high|medium|low",
      "category": "vulnerability|dependency_risk|secret",
      "title": "string",
      "description": "string",
      "file": "string"
    }
  ],
  "code_smells": [
    {
      "category": "string",
      "title": "string",
      "description": "string",
      "file": "string",
      "count": 3
    }
  ],
  "performance_suggestions": [
    {
      "title": "string",
      "description": "string",
      "file": "string"
    }
  ],
  "test_suggestions": [
    {
      "function_name": "string",
      "file": "string",
      "suggestion": "string"
    }
  ],
  "documentation_snippet": "string (Markdown)",
  "analyzed_at": "2026-08-07T12:30:00Z"
}
```

---

## 4. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root endpoint returning backend status & version info. |
| `GET` | `/health` | Health check endpoint returning `{"status": "ok"}`. |
| `POST` | `/analyze` | Primary endpoint accepting `{"github_url": "..."}` and returning full `AnalysisResult`. |