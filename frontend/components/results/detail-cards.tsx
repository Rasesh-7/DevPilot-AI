import { useState } from 'react'
import {
  Bug,
  ShieldAlert,
  Sparkles,
  Zap,
  KeyRound,
  PackageX,
  ShieldX,
  FlaskConical,
  GitCommitHorizontal,
  Copy,
  Check,
} from 'lucide-react'
import type { BugItem, SecurityItem, CodeSmellItem, PerformanceSuggestion, TestSuggestion } from '@/lib/api'

/* ---------------- AI Summary ---------------- */

interface AiSummaryProps {
  summary?: string
  tags?: string[]
}

export function AiSummaryCard({ summary, tags }: AiSummaryProps) {
  const displaySummary = summary || 'The codebase is well-structured with strong typing and clear module boundaries.'
  const displayTags = tags?.length ? tags : ['Well-typed', 'Modular', 'High coverage', 'Needs input validation']

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40 h-full">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Sparkles className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold tracking-tight">AI Summary</h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {displaySummary}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Bug Detection ---------------- */

interface BugDetectionProps {
  bugs?: BugItem[]
}

const severityConfig: Record<string, { tint: string; bar: string }> = {
  critical: { tint: 'text-destructive', bar: 'bg-destructive' },
  high: { tint: 'text-[#f0883e]', bar: 'bg-[#f0883e]' },
  medium: { tint: 'text-[#d29922]', bar: 'bg-[#d29922]' },
  low: { tint: 'text-primary', bar: 'bg-primary' },
}

export function BugDetectionCard({ bugs }: BugDetectionProps) {
  const [selectedSev, setSelectedSev] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const displayBugs = bugs ?? []
  const levels = ['critical', 'high', 'medium', 'low'] as const
  const counts = levels.map((sev) => ({
    label: sev.charAt(0).toUpperCase() + sev.slice(1),
    severity: sev,
    value: displayBugs.filter((b) => b.severity === sev).length,
    ...severityConfig[sev],
  }))
  const total = counts.reduce((s, c) => s + c.value, 0)
  const max = Math.max(...counts.map((c) => c.value), 1)

  const filteredBugs = displayBugs.filter((bug) => {
    const matchesSev = selectedSev ? bug.severity === selectedSev : true
    const matchesSearch = searchTerm
      ? bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.file?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    return matchesSev && matchesSearch
  })

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
            <Bug className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight">Bug Detection</h3>
            <p className="text-xs text-muted-foreground">Click a severity bar to filter findings</p>
          </div>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums">{total}</span>
      </div>

      <div className="mt-5 space-y-2.5">
        {counts.map((b) => {
          const isSelected = selectedSev === b.severity
          return (
            <button
              key={b.label}
              type="button"
              onClick={() => setSelectedSev(isSelected ? null : b.severity)}
              className={`w-full text-left rounded-lg p-1.5 transition-colors ${
                isSelected ? 'bg-secondary/80 ring-1 ring-primary/40' : 'hover:bg-secondary/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">{b.label}</span>
                <span className={`font-mono font-semibold ${b.tint}`}>{b.value}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full ${b.bar}`}
                  style={{ width: `${(b.value / max) * 100}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* Bug details list with search & filter */}
      {displayBugs.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter bugs..."
              aria-label="Filter bugs"
              className="h-8 w-full rounded-md border border-border bg-input/60 px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
            />
            {selectedSev && (
              <button
                onClick={() => setSelectedSev(null)}
                className="shrink-0 text-[11px] text-primary hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredBugs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 text-center">No bugs match filter</p>
            ) : (
              filteredBugs.map((bug, i) => (
                <div key={i} className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                      bug.severity === 'critical' ? 'border-destructive/40 bg-destructive/10 text-destructive' :
                      bug.severity === 'high' ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' :
                      'border-primary/40 bg-primary/10 text-primary'
                    }`}>
                      {bug.severity}
                    </span>
                    <span className="text-xs font-medium text-foreground truncate">{bug.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{bug.description}</p>
                  {bug.file && (
                    <p className="mt-1 font-mono text-[11px] text-primary/70">
                      {bug.file}{bug.line ? `:${bug.line}` : ''}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  )
}

/* ---------------- Security Analysis ---------------- */

interface SecurityAnalysisProps {
  issues?: SecurityItem[]
}

const categoryIcons: Record<string, typeof ShieldX> = {
  vulnerability: ShieldX,
  dependency_risk: PackageX,
  secret: KeyRound,
}

const categorySeverityTint: Record<string, string> = {
  critical: 'text-destructive',
  high: 'text-destructive',
  medium: 'text-[#d29922]',
  low: 'text-[#f0883e]',
}

export function SecurityAnalysisCard({ issues }: SecurityAnalysisProps) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const displayIssues = issues ?? []

  const filteredIssues = selectedCat
    ? displayIssues.filter((i) => i.category === selectedCat)
    : displayIssues

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d29922]/10 text-[#d29922] ring-1 ring-[#d29922]/20">
            <ShieldAlert className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight">Security Analysis</h3>
            <p className="text-xs text-muted-foreground">Vulnerability & risk breakdown</p>
          </div>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums">{displayIssues.length}</span>
      </div>

      {/* Category filter tabs */}
      {displayIssues.length > 0 && (
        <div className="mt-4 flex gap-1 rounded-md bg-secondary/50 p-1 text-xs">
          {['all', 'vulnerability', 'dependency_risk', 'secret'].map((cat) => {
            const isAll = cat === 'all'
            const active = isAll ? !selectedCat : selectedCat === cat
            const label = isAll ? 'All' : cat === 'vulnerability' ? 'Vulns' : cat === 'dependency_risk' ? 'Deps' : 'Secrets'
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(isAll ? null : cat)}
                className={`flex-1 rounded py-1 font-medium transition-colors ${
                  active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredIssues.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No security issues found ✓</p>
        ) : (
          filteredIssues.map((issue, i) => {
            const Icon = categoryIcons[issue.category] || ShieldAlert
            const tint = categorySeverityTint[issue.severity] || 'text-[#d29922]'
            return (
              <div
                key={i}
                className="rounded-lg border border-border bg-secondary/40 px-3.5 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-medium text-foreground truncate">
                    <Icon className={`h-4 w-4 shrink-0 ${tint}`} />
                    {issue.title}
                  </span>
                  <span className={`text-[10px] font-bold uppercase shrink-0 ${tint}`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{issue.description}</p>
                {issue.file && (
                  <p className="mt-1 font-mono text-[11px] text-primary/70">{issue.file}</p>
                )}
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}

/* ---------------- Code Smells ---------------- */

interface CodeSmellsProps {
  smells?: CodeSmellItem[]
}

export function CodeSmellsCard({ smells }: CodeSmellsProps) {
  const displaySmells = smells ?? []
  const total = displaySmells.reduce((s, x) => s + x.count, 0)

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight">Code Smells</h3>
            <p className="text-xs text-muted-foreground">Maintainability & refactoring indicators</p>
          </div>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums">{total}</span>
      </div>
      <ul className="mt-5 space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {displaySmells.length === 0 ? (
          <li className="text-sm text-muted-foreground py-2">No code smells detected ✓</li>
        ) : (
          displaySmells.map((s, i) => (
            <li
              key={i}
              className="rounded-lg border border-border bg-secondary/30 p-3 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground font-medium">{s.title}</span>
                <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary shrink-0">
                  {s.count} {s.count === 1 ? 'instance' : 'instances'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
              {s.file && (
                <p className="mt-1 font-mono text-[11px] text-primary/70">{s.file}</p>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

/* ---------------- Performance Suggestions ---------------- */

interface PerformanceProps {
  suggestions?: PerformanceSuggestion[]
}

export function PerformanceCard({ suggestions }: PerformanceProps) {
  const displaySuggestions = suggestions ?? []

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Zap className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold tracking-tight">
          Performance Suggestions
        </h3>
      </div>
      <ul className="mt-5 space-y-3">
        {displaySuggestions.length === 0 ? (
          <li className="text-sm text-muted-foreground">No performance issues detected ✓</li>
        ) : (
          displaySuggestions.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <span className="font-medium text-foreground">{p.title}</span>
                <p className="leading-relaxed text-muted-foreground">{p.description}</p>
                {p.file && (
                  <p className="mt-0.5 font-mono text-xs text-primary/70">{p.file}</p>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

/* ---------------- Unit Test Suggestions ---------------- */

interface TestSuggestionsProps {
  suggestions?: TestSuggestion[]
}

export function TestSuggestionsCard({ suggestions }: TestSuggestionsProps) {
  const displaySuggestions = suggestions ?? []
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <FlaskConical className="h-4 w-4" />
          </span>
          <h3 className="text-base font-semibold tracking-tight">Unit Test Suggestions</h3>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums">{displaySuggestions.length}</span>
      </div>
      <div className="mt-5 space-y-3">
        {displaySuggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Test coverage recommendations complete ✓</p>
        ) : (
          displaySuggestions.map((t, i) => (
            <div key={i} className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {t.function_name ? `${t.function_name}()` : 'Target Routine'}
                  </span>
                  {t.file && <span className="font-mono text-[11px] text-muted-foreground">({t.file})</span>}
                </div>
                <button
                  onClick={() => handleCopy(`${t.function_name || 'test'}: ${t.suggestion}`, i)}
                  className="inline-flex shrink-0 items-center gap-1 rounded border border-border bg-secondary px-2 py-0.5 text-[11px] font-sans font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {copiedIndex === i ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-muted-foreground" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{t.suggestion}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

/* ---------------- Commit Messages Generator ---------------- */

interface CommitMessagesProps {
  messages?: string[]
}

export function CommitMessagesCard({ messages }: CommitMessagesProps) {
  const displayMessages = messages && messages.length > 0
    ? messages
    : [
        'feat(core): refine primary handling routines and improve validation',
        'fix(security): sanitize user-controlled parameters',
        'docs: add developer guide and setup instructions',
      ]

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <GitCommitHorizontal className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight">Suggested Commit Messages</h3>
            <p className="text-xs text-muted-foreground">Conventional commit messages ready to copy for your next PR</p>
          </div>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums">{displayMessages.length}</span>
      </div>
      <div className="mt-5 space-y-2.5">
        {displayMessages.map((msg, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3.5 py-2.5 font-mono text-xs text-foreground transition-colors hover:border-primary/30"
          >
            <span className="truncate">{msg}</span>
            <button
              onClick={() => handleCopy(msg, i)}
              className="inline-flex shrink-0 items-center gap-1 rounded border border-border bg-secondary px-2 py-1 text-[11px] font-sans font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {copiedIndex === i ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-muted-foreground" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
