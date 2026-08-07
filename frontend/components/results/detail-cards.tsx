import {
  Bug,
  ShieldAlert,
  Sparkles,
  Zap,
  KeyRound,
  PackageX,
  ShieldX,
} from 'lucide-react'
import type { BugItem, SecurityItem, CodeSmellItem, PerformanceSuggestion } from '@/lib/api'

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
  // Group bugs by severity
  const levels = ['critical', 'high', 'medium', 'low'] as const
  const counts = levels.map((sev) => ({
    label: sev.charAt(0).toUpperCase() + sev.slice(1),
    value: bugs?.filter((b) => b.severity === sev).length ?? 0,
    ...severityConfig[sev],
  }))
  const total = counts.reduce((s, c) => s + c.value, 0)
  const max = Math.max(...counts.map((c) => c.value), 1)

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
            <Bug className="h-4 w-4" />
          </span>
          <h3 className="text-base font-semibold tracking-tight">Bug Detection</h3>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums">{total}</span>
      </div>
      <div className="mt-5 space-y-3">
        {counts.map((b) => (
          <div key={b.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{b.label}</span>
              <span className={`font-mono font-semibold ${b.tint}`}>{b.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full ${b.bar}`}
                style={{ width: `${(b.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bug details list */}
      {bugs && bugs.length > 0 && (
        <div className="mt-5 space-y-2 border-t border-border pt-4">
          {bugs.slice(0, 5).map((bug, i) => (
            <div key={i} className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold uppercase ${severityConfig[bug.severity]?.tint || 'text-muted-foreground'}`}>
                  {bug.severity}
                </span>
                <span className="text-sm font-medium text-foreground">{bug.title}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{bug.description}</p>
              {bug.file && (
                <p className="mt-1 font-mono text-xs text-primary/70">
                  {bug.file}{bug.line ? `:${bug.line}` : ''}
                </p>
              )}
            </div>
          ))}
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
  const displayIssues = issues ?? []

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d29922]/10 text-[#d29922] ring-1 ring-[#d29922]/20">
            <ShieldAlert className="h-4 w-4" />
          </span>
          <h3 className="text-base font-semibold tracking-tight">Security Analysis</h3>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums">{displayIssues.length}</span>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3">
        {displayIssues.length === 0 ? (
          <p className="text-sm text-muted-foreground">No security issues detected ✓</p>
        ) : (
          displayIssues.map((issue, i) => {
            const Icon = categoryIcons[issue.category] || ShieldAlert
            const tint = categorySeverityTint[issue.severity] || 'text-[#d29922]'
            return (
              <div
                key={i}
                className="rounded-lg border border-border bg-secondary/40 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Icon className={`h-4 w-4 ${tint}`} />
                    {issue.title}
                  </span>
                  <span className={`text-xs font-semibold uppercase ${tint}`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{issue.description}</p>
                {issue.file && (
                  <p className="mt-1 font-mono text-xs text-primary/70">{issue.file}</p>
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
          <h3 className="text-base font-semibold tracking-tight">Code Smells</h3>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums">{total}</span>
      </div>
      <ul className="mt-5 space-y-2.5">
        {displaySmells.length === 0 ? (
          <li className="text-sm text-muted-foreground">No code smells detected ✓</li>
        ) : (
          displaySmells.map((s, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <span className="text-foreground font-medium">{s.title}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
              </div>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-foreground shrink-0 ml-3">
                {s.count}
              </span>
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
