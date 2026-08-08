# DevPilot AI - Product Specification

## 1. Product Overview

### Product Name
DevPilot AI

### Tagline
Your AI Code Review Partner

### Purpose
DevPilot AI is an AI-powered developer assistant that helps developers review, understand, and improve their source code and software projects.

The application allows users to submit code through multiple input methods, including GitHub repository URLs, uploaded ZIP files, and code snippets.

DevPilot AI analyzes the submitted code and provides useful feedback such as:
* Code quality issues
* Bugs and potential errors
* Code smells
* Security vulnerabilities
* Maintainability issues
* Improvement suggestions
* Code explanations
* Repository structure analysis
* Documentation suggestions
* Unit test suggestions
* Dependency and framework identification
* Code quality scoring

The goal is to provide developers with a lightweight AI-powered code review and repository analysis workflow without requiring them to manually inspect every part of their project.

---

## 2. Problem Statement

Developers often spend significant time reviewing code, identifying bugs, understanding unfamiliar functions, and maintaining code quality.

Traditional code review can be:
* Time consuming
* Dependent on manual inspection
* Difficult for beginners
* Inconsistent across projects
* Difficult when working with unfamiliar repositories

Developers may also struggle to quickly understand:
* Large project structures
* Complex code
* Security risks
* Dependencies
* Maintainability problems
* Missing documentation
* Potential bugs

DevPilot AI addresses this problem by providing an automated AI-assisted code review and repository analysis workflow.

---

## 3. Target Users

DevPilot AI is designed for:
1. Students learning software development
2. Individual developers
3. Hackathon participants
4. Small development teams
5. Developers working with unfamiliar repositories
6. Developers who want quick AI-assisted code feedback

---

## 4. Implementation Status

This document defines the product requirements and intended MVP behavior for DevPilot AI.

Implementation status has been verified against the actual repository codebase (`frontend/` Next.js dashboard & `backend/` FastAPI service).

Features are classified as:
* **Implemented** - Working in the current application
* **In Progress** - Currently being developed or integrated
* **Planned** - Defined as part of the MVP but not yet implemented
* **Future** - Not required for the current hackathon MVP

### Status Matrix

| Feature Module | Feature / Component | Status | Verification & Codebase Reference |
| :--- | :--- | :--- | :--- |
| **5.1 GitHub Repository Analysis** | GitHub URL input, fetching tree, AI review, score generation | **Implemented** | [`POST /analyze`](file:///c:/Users/KIIT/DevPilot-AI/backend/routes/analyze.py), [`github_service.py`](file:///c:/Users/KIIT/DevPilot-AI/backend/services/github_service.py), [`hero-section.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/components/hero-section.tsx) |
| **5.2 ZIP File Upload & Review** | Drag-and-drop .zip upload, in-memory archive extraction, multi-file code audit | **Implemented** | [`POST /analyze/zip`](file:///c:/Users/KIIT/DevPilot-AI/backend/routes/upload.py), [`hero-section.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/components/hero-section.tsx) |
| **5.3 Code Snippet Review** | Multiline code editor, language selector hint, inline snippet auditing | **Implemented** | [`POST /analyze/snippet`](file:///c:/Users/KIIT/DevPilot-AI/backend/routes/upload.py), [`hero-section.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/components/hero-section.tsx) |
| **5.4 Code Explanation** | Natural language summary, key functions & execution flow breakdown | **Implemented** | [`ai_service.py`](file:///c:/Users/KIIT/DevPilot-AI/backend/services/ai_service.py), [`dashboard/page.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/app/dashboard/page.tsx) |
| **5.5 Improvement Suggestions** | Refactoring notes, performance optimizations, unit test generation, commit messages | **Implemented** | [`prompt_builder.py`](file:///c:/Users/KIIT/DevPilot-AI/backend/services/prompt_builder.py), [`dashboard/page.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/app/dashboard/page.tsx) |
| **5.6 Code Quality Score** | Dynamic 0–100 integer score evaluated across security, maintainability, bugs, and smells | **Implemented** | [`response_models.py`](file:///c:/Users/KIIT/DevPilot-AI/backend/models/response_models.py), [`dashboard-topbar.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/components/dashboard/dashboard-topbar.tsx) |
| **5.7 Repository Overview** | Language distribution, total file & LOC stats, stars/forks/branch metadata | **Implemented** | [`file_reader.py`](file:///c:/Users/KIIT/DevPilot-AI/backend/services/file_reader.py), [`dashboard/page.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/app/dashboard/page.tsx) |
| **5.8 Security Analysis** | Vulnerability scanning (Critical/High/Medium/Low), hardcoded secrets, XSS, unsanitized inputs | **Implemented** | [`SecurityItem`](file:///c:/Users/KIIT/DevPilot-AI/backend/models/response_models.py), [`dashboard/page.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/app/dashboard/page.tsx) |
| **5.9 Maintainability Analysis** | Cyclomatic complexity, code smells, long functions, dead code, duplicate logic | **Implemented** | [`CodeSmellItem`](file:///c:/Users/KIIT/DevPilot-AI/backend/models/response_models.py), [`dashboard/page.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/app/dashboard/page.tsx) |
| **5.10 Documentation Analysis** | README detection, missing comments/docstrings inspection, generated README setup guide | **Implemented** | `documentation_snippet` field in [`AnalysisResult`](file:///c:/Users/KIIT/DevPilot-AI/backend/models/response_models.py) |
| **5.11 Repository Explanation** | Architecture overview, execution flow, component responsibilities explanation | **Implemented** | [`ai_service.py`](file:///c:/Users/KIIT/DevPilot-AI/backend/services/ai_service.py) |
| **5.12 File-wise Analysis** | Granular per-file issue indexing, line-number tracking, target file fix suggestions | **Implemented** | `file_path` and `line` attributes in [`BugItem`](file:///c:/Users/KIIT/DevPilot-AI/backend/models/response_models.py), [`SecurityItem`](file:///c:/Users/KIIT/DevPilot-AI/backend/models/response_models.py), [`CodeSmellItem`](file:///c:/Users/KIIT/DevPilot-AI/backend/models/response_models.py) |
| **5.13 Interactive Dashboard** | Responsive UI, score gauges, filterable issue tables, tabs for Overview, Bugs, Security, Smells, Suggestions, Commit Messages, Docs | **Implemented** | Next.js 14 frontend dashboard components [`frontend/app/dashboard/page.tsx`](file:///c:/Users/KIIT/DevPilot-AI/frontend/app/dashboard/page.tsx) |

---

## 5. Core Features

### 5.1 GitHub Repository Analysis
Users can provide a GitHub repository URL.
The application sends the repository information to the analysis system and analyzes the available source code and project structure.

#### Expected output
The review includes:
* Overall code quality score
* Repository overview
* Project structure
* Programming languages used
* Frameworks and libraries detected
* Bugs
* Code smells
* Security concerns
* Maintainability issues
* Documentation issues
* Improvement suggestions
* Explanation of important issues

---

### 5.2 ZIP File Upload and Review
Users can upload a ZIP file containing a source-code project.
DevPilot AI processes the uploaded project and presents an analysis of the available source files.

#### Expected output
The system provides:
* Project overview
* Project structure
* Detected programming languages
* Detected frameworks and dependencies
* Detected issues
* Security findings
* Code quality feedback
* Maintainability feedback
* Documentation feedback
* Improvement suggestions
* Overall score

---

### 5.3 Code Snippet Review
Users can directly enter or paste source code into the application.
The system analyzes the submitted code and provides feedback.

#### Expected output
The review contains:
* Explanation of the code
* Potential bugs
* Code smells
* Security concerns
* Improvement suggestions
* Quality assessment
* Maintainability observations

---

### 5.4 Code Explanation
DevPilot AI helps users understand unfamiliar or complicated code.
The system explains:
* What the code does
* Important functions
* Important variables
* Overall execution flow
* Potentially confusing sections
* Relationships between important components

For repository-level analysis, the system also explains:
* Project purpose
* Main folders
* Important files
* Architecture overview
* Backend and frontend components when applicable
* Main execution flow

---

### 5.5 Improvement Suggestions
The application provides actionable recommendations.
Examples include:
* Simplifying complex functions
* Improving variable naming
* Removing duplicated code
* Improving error handling
* Improving maintainability
* Reducing unnecessary complexity
* Improving security
* Adding tests
* Adding documentation
* Refactoring poorly structured code

---

### 5.6 Code Quality Score
The application provides an easily understandable code quality score (0–100).
The score helps users quickly understand the overall health of the submitted code or project.
The score considers factors such as:
* Code quality
* Bugs
* Security
* Maintainability
* Documentation
* Complexity
* Code smells

The score is associated with the analyzed code or project.

---

### 5.7 Repository Overview
DevPilot AI generates a high-level overview of the submitted project.
The overview includes:
* Project structure
* Number of source files
* Programming languages used
* Framework detection
* Entry point identification when possible
* Major modules
* Important files
* Dependencies
* Libraries used

#### Expected output
* Repository summary
* Project architecture overview
* Language distribution
* Frameworks and libraries detected
* Dependency summary

---

### 5.8 Security Analysis
DevPilot AI identifies potential security risks in the submitted codebase.
The system detects issues such as:
* Hardcoded secrets
* Exposed API keys
* SQL Injection risks
* Command Injection risks
* Cross-Site Scripting (XSS)
* Unsafe file operations
* Weak authentication logic
* Insecure data handling
* Potentially dangerous coding practices
* Security-related dependency concerns

#### Expected output
* Security issue description
* Severity level (Critical, High, Medium, Low)
* Affected file and line number
* Explanation
* Recommended fix

Security findings are treated as AI-assisted observations and are not represented as guaranteed security certifications.

---

### 5.9 Maintainability Analysis
DevPilot AI evaluates how easy the submitted codebase is to maintain.
The analysis includes:
* Long functions
* Duplicate code
* Poor variable naming
* High cyclomatic complexity
* Dead code
* Deep nesting
* Large classes
* Excessive dependencies
* Poor separation of responsibilities

#### Expected output
* Maintainability score
* Problematic files or functions
* Explanation of maintainability issues
* Suggested improvements

---

### 5.10 Documentation Analysis
The system inspects the documentation quality of the submitted project.
It detects:
* Missing README
* Missing comments
* Missing docstrings
* Missing API documentation
* Poorly documented functions
* Missing project usage instructions

#### Expected output
* Documentation score / readiness assessment
* Missing documentation elements
* Documentation issues
* Suggested improvements & generated README documentation snippet

---

### 5.11 Repository Explanation
DevPilot AI explains the submitted repository in natural language.
The explanation includes:
* What the project does
* Project purpose
* Main folders
* Important files
* Architecture overview
* Main components
* Execution flow
* Important dependencies
* Potentially complex sections

This feature makes unfamiliar repositories easier for developers and students to understand.

---

### 5.12 File-wise Analysis
Instead of only providing an overall project report, DevPilot AI provides analysis for important source files individually.
Each analyzed file finding contains:
* File name and path
* File purpose / context
* Bug count & items
* Security findings
* Code smells
* Maintainability issues
* Line-specific improvement suggestions

This allows users to identify which files require the most attention.

---

### 5.13 Interactive Analysis Dashboard
The application presents analysis results through a clear and responsive dashboard.
The dashboard includes:
* Overall project score badge & radial meter
* Bug count and list
* Security issue count and severity filters
* Maintainability score and code smells
* Documentation score & generated README snippet
* Code quality score breakdown
* Number of files and lines of code stats
* Programming languages breakdown
* Frameworks detected
* Issue severity distribution
* File-wise scores and line links
* Improvement recommendations & test suggestions

The dashboard makes complex analysis results easy to understand.

---

## 6. User Stories and Acceptance Criteria

### User Story 1 - Analyze a GitHub Repository

#### User Story
As a developer, I want to submit a GitHub repository URL so that DevPilot AI can analyze my project and provide code review feedback.

#### Acceptance Criteria
* [x] **GH-AC-01:** The homepage contains a GitHub repository URL input.
* [x] **GH-AC-02:** The input is empty by default.
* [x] **GH-AC-03:** The user can enter a valid GitHub repository URL.
* [x] **GH-AC-04:** The user can start repository analysis.
* [x] **GH-AC-05:** A loading state is displayed while analysis is running.
* [x] **GH-AC-06:** Analysis results are displayed after successful processing.
* [x] **GH-AC-07:** Repository structure information is displayed when available.
* [x] **GH-AC-08:** Invalid repository URLs produce an appropriate error message.
* [x] **GH-AC-09:** Backend/API failures are handled gracefully.

---

### User Story 2 - Upload a ZIP Project

#### User Story
As a developer, I want to upload my project as a ZIP file so that I can receive an automated review without connecting a GitHub repository.

#### Acceptance Criteria
* [x] **ZIP-AC-01:** The user can select a ZIP file.
* [x] **ZIP-AC-02:** The selected file name is displayed.
* [x] **ZIP-AC-03:** The application validates that the uploaded file is a ZIP archive.
* [x] **ZIP-AC-04:** The user can start the review.
* [x] **ZIP-AC-05:** A loading state is displayed during analysis.
* [x] **ZIP-AC-06:** Review results are displayed after successful processing.
* [x] **ZIP-AC-07:** Project structure is analyzed when available.
* [x] **ZIP-AC-08:** Invalid files display a useful error message.

---

### User Story 3 - Review a Code Snippet

#### User Story
As a developer, I want to paste a code snippet into DevPilot AI so that I can quickly receive feedback on a small piece of code.

#### Acceptance Criteria
* [x] **CODE-AC-01:** The application provides a code input area.
* [x] **CODE-AC-02:** The user can paste or type source code.
* [x] **CODE-AC-03:** The user can select or specify the programming language when required.
* [x] **CODE-AC-04:** Empty submissions are rejected.
* [x] **CODE-AC-05:** The user can start code analysis.
* [x] **CODE-AC-06:** A loading state is displayed during analysis.
* [x] **CODE-AC-07:** The analysis result is displayed clearly.
* [x] **CODE-AC-08:** Errors are communicated to the user.

---

### User Story 4 - Understand Code Issues

#### User Story
As a developer, I want DevPilot AI to explain detected issues so that I understand why my code needs improvement.

#### Acceptance Criteria
* [x] **ISSUE-AC-01:** Detected issues are displayed separately.
* [x] **ISSUE-AC-02:** Each issue has a clear explanation.
* [x] **ISSUE-AC-03:** The application provides actionable improvement suggestions.
* [x] **ISSUE-AC-04:** Technical explanations are presented in a readable format.
* [x] **ISSUE-AC-05:** Affected files or code sections are identified when available.

---

### User Story 5 - View Code Quality

#### User Story
As a developer, I want to see an overall code quality score so that I can quickly understand the quality of my project.

#### Acceptance Criteria
* [x] **SCORE-AC-01:** A code quality score is displayed when analysis is available.
* [x] **SCORE-AC-02:** The score is visually distinguishable.
* [x] **SCORE-AC-03:** The result provides context about what the score represents.
* [x] **SCORE-AC-04:** The score is associated with the analyzed code/project.
* [x] **SCORE-AC-05:** Major factors affecting the score are displayed.

---

### User Story 6 - Handle Analysis Errors

#### User Story
As a user, I want clear error messages when analysis fails so that I know what went wrong and what I should do next.

#### Acceptance Criteria
* [x] **ERROR-AC-01:** Network/API failures are handled.
* [x] **ERROR-AC-02:** Invalid inputs display useful messages.
* [x] **ERROR-AC-03:** Failed analysis does not crash the application.
* [x] **ERROR-AC-04:** The user can retry the operation.

---

### User Story 7 - Understand a Repository

#### User Story
As a developer, I want DevPilot AI to explain an unfamiliar repository so that I can quickly understand its structure and functionality.

#### Acceptance Criteria
* [x] **REPO-AC-01:** The system generates a repository overview.
* [x] **REPO-AC-02:** Main folders and files are identified.
* [x] **REPO-AC-03:** Programming languages are identified when possible.
* [x] **REPO-AC-04:** Important components are explained.
* [x] **REPO-AC-05:** The general project flow is explained.
* [x] **REPO-AC-06:** Important dependencies are identified when available.

---

### User Story 8 - Identify Security Issues

#### User Story
As a developer, I want DevPilot AI to identify potential security vulnerabilities so that I can address them before they become problems.

#### Acceptance Criteria
* [x] **SEC-AC-01:** Security findings are displayed separately.
* [x] **SEC-AC-02:** Each finding has a severity level when available.
* [x] **SEC-AC-03:** The affected file is identified when possible.
* [x] **SEC-AC-04:** The issue is explained clearly.
* [x] **SEC-AC-05:** Recommended remediation is provided.

---

## 7. Functional Requirements

* **FR-01:** The system shall provide a homepage for submitting code for analysis.
* **FR-02:** The system shall support GitHub repository URL input.
* **FR-03:** The system shall support ZIP file uploads.
* **FR-04:** The system shall support direct code snippet submission.
* **FR-05:** The system shall communicate with the backend analysis API.
* **FR-06:** The system shall display analysis results in a readable interface.
* **FR-07:** The system shall display errors when an analysis request fails.
* **FR-08:** The system shall provide a loading state while analysis is in progress.
* **FR-09:** The system shall display code quality information when available.
* **FR-10:** The system should provide actionable recommendations to improve code.
* **FR-11:** The system shall generate a repository overview when analyzing a project.
* **FR-12:** The system shall identify programming languages used in the project when possible.
* **FR-13:** The system shall identify frameworks, libraries, and dependencies when possible.
* **FR-14:** The system shall provide security analysis for submitted code.
* **FR-15:** The system shall provide maintainability analysis.
* **FR-16:** The system shall provide documentation quality analysis.
* **FR-17:** The system shall provide file-wise analysis when sufficient source information is available.
* **FR-18:** The system shall provide repository architecture and structure information when possible.
* **FR-19:** The system shall present analysis results through an interactive dashboard.
* **FR-20:** The system shall provide explanations for detected issues.
* **FR-21:** The system shall provide recommendations for improving identified problems.

---

## 8. Non-Functional Requirements

### Performance
The interface provides immediate visual feedback when an analysis request is started.
The system processes submitted projects efficiently while respecting the limitations of the selected AI model and backend infrastructure.

### Usability
The application is simple enough for a developer to understand without additional instructions.
Analysis results are organized into clear, tabbed dashboard sections.

### Responsiveness
The application works seamlessly across desktop, tablet, and mobile screen sizes.

### Reliability
API failures and invalid user input do not cause the application to crash.
The system provides useful error messages and allows users to retry failed operations.

### Maintainability
The frontend uses modular Next.js 14 React components and Tailwind CSS / shadcn design patterns.
The backend uses a modular FastAPI service structure (`routes/`, `services/`, `models/`, `utils/`) enabling audit components to be modified independently.

### Security
User-submitted code and repository information are processed in-memory or safely extracted without exposing sensitive details.
The system avoids persisting sensitive user-submitted code snippets or keys.

---

## 9. MVP Scope

The hackathon MVP scope covers:
1. GitHub repository analysis
2. ZIP project upload
3. Code snippet analysis
4. AI-generated review feedback
5. Repository overview
6. Project structure analysis
7. Bug detection
8. Security analysis
9. Maintainability analysis
10. Documentation analysis
11. Code explanation
12. File-wise analysis
13. Code quality scoring
14. Interactive analysis dashboard
15. Error handling
16. Responsive user interface

---

## 10. Analysis Workflow

```text
GitHub URL / ZIP File / Code Snippet
                │
                ▼
         Input Validation
                │
                ▼
       Repository / Code Parser
                │
                ▼
      Project Structure Analysis
                │
                ▼
        Source Code Extraction
                │
                ▼
          AI Analysis Engine
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
     Bugs    Security  Quality
       │        │        │
       └────────┼────────┘
                ▼
       Maintainability &
       Documentation Analysis
                │
                ▼
          Scoring Engine
                │
                ▼
       Structured Analysis Data
                │
                ▼
       Interactive Dashboard
```
