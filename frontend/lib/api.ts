const PRIMARY_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const FALLBACK_API_URL = 'http://127.0.0.1:8000';

// ── Response Types ──────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  message: string;
}

export interface AnalyzeRequest {
  github_url: string;
}

export interface RepoMeta {
  owner: string;
  repo: string;
  full_name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  open_issues: number;
  default_branch: string;
  last_pushed: string;
  total_files: number;
  lines_of_code: number;
  languages: Record<string, number>;
}

export interface BugItem {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  line: number | null;
}

export interface SecurityItem {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'vulnerability' | 'dependency_risk' | 'secret';
  title: string;
  description: string;
  file: string;
}

export interface CodeSmellItem {
  category: string;
  title: string;
  description: string;
  file: string;
  count: number;
}

export interface PerformanceSuggestion {
  title: string;
  description: string;
  file: string;
}

export interface TestSuggestion {
  function_name: string;
  file: string;
  suggestion: string;
}

export interface AnalysisResult {
  id: string;
  repo_meta?: RepoMeta | null;
  source_type?: 'github' | 'zip' | 'snippet';
  quality_score: number;
  summary: string;
  tags: string[];
  bugs: BugItem[];
  security_issues: SecurityItem[];
  code_smells: CodeSmellItem[];
  performance_suggestions: PerformanceSuggestion[];
  test_suggestions: TestSuggestion[];
  suggested_commit_messages?: string[];
  documentation_snippet: string;
  analyzed_at: string;
}

// ── Helper for resilient fetching (tries localhost then 127.0.0.1) ───

async function fetchResilient(path: string, options?: RequestInit): Promise<Response> {
  let primaryResponse: Response | null = null;
  try {
    primaryResponse = await fetch(`${PRIMARY_API_URL}${path}`, options);
    if (primaryResponse.ok) return primaryResponse;
    if (primaryResponse.status < 500) {
      const errJson = await primaryResponse.json().catch(() => null);
      const message = errJson?.detail || `API error (${primaryResponse.status})`;
      throw new Error(message);
    }
  } catch (err) {
    if (err instanceof Error && !err.message.includes('fetch')) {
      throw err;
    }
    // Try fallback host if primary network connection failed
  }

  const resFallback = await fetch(`${FALLBACK_API_URL}${path}`, options);
  if (!resFallback.ok) {
    const errJson = await resFallback.json().catch(() => null);
    const text = errJson?.detail || (await resFallback.text().catch(() => ''));
    throw new Error(text || `API call to ${path} failed (${resFallback.status})`);
  }
  return resFallback;
}

// ── API Calls ───────────────────────────────────────────────────────

/**
 * Health check ping to FastAPI backend
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const res = await fetchResilient('/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
}

/**
 * Submit GitHub repository URL to FastAPI backend for full AI analysis.
 * Returns the complete AnalysisResult.
 */
export async function analyzeRepository(githubUrl: string): Promise<AnalysisResult> {
  try {
    const res = await fetchResilient('/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ github_url: githubUrl }),
    });
    return await res.json();
  } catch (error) {
    console.error('Repository analysis request failed:', error);
    throw error;
  }
}

/**
 * Upload a .zip file to the backend for AI analysis.
 */
export async function analyzeZip(file: File): Promise<AnalysisResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetchResilient('/analyze/zip', {
      method: 'POST',
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.error('Zip analysis request failed:', error);
    throw error;
  }
}

/**
 * Submit a code snippet to the backend for AI analysis.
 */
export async function analyzeSnippet(
  code: string,
  filename?: string,
  language?: string,
): Promise<AnalysisResult> {
  try {
    const res = await fetchResilient('/analyze/snippet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        filename: filename || 'snippet',
        language: language || '',
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('Snippet analysis request failed:', error);
    throw error;
  }
}

// ── Session Storage helpers ─────────────────────────────────────────

const ANALYSIS_KEY = 'devpilot_analysis';
const HISTORY_KEY = 'devpilot_history';

/**
 * Store the latest analysis result in sessionStorage.
 */
export function saveAnalysis(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ANALYSIS_KEY, JSON.stringify(result));
  // Also append to history in localStorage
  appendToHistory(result);
}

/**
 * Retrieve the latest analysis result from sessionStorage.
 */
export function loadAnalysis(): AnalysisResult | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(ANALYSIS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnalysisResult;
  } catch {
    return null;
  }
}

/**
 * Append a completed analysis to the persistent history (localStorage).
 */
function appendToHistory(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  const history = loadHistory();
  // Avoid duplicates by id
  const filtered = history.filter((r) => r.id !== result.id);
  filtered.unshift(result);
  // Keep only the last 20
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 20)));
}

/**
 * Load all past analyses from localStorage.
 */
export function loadHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AnalysisResult[];
  } catch {
    return [];
  }
}
