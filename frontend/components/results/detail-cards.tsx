import {
  Bug,
  ShieldAlert,
  Sparkles,
  Zap,
  KeyRound,
  PackageX,
  ShieldX,
} from 'lucide-react'

/* ---------------- AI Summary ---------------- */

export function AiSummaryCard() {
  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Sparkles className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold tracking-tight">AI Summary</h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        The codebase is well-structured with strong typing and clear module
        boundaries. Core payment flows are robust, but a handful of async
        handlers lack error boundaries and a few endpoints skip input
        validation. Test coverage is healthy at{' '}
        <span className="font-medium text-foreground">96%</span>, though several
        utility modules remain untested. Addressing the flagged security and
        performance issues would raise the quality score into the low 90s.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {['Well-typed', 'Modular', 'High coverage', 'Needs input validation'].map(
          (tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ),
        )}
      </div>
    </section>
  )
}

/* ---------------- Bug Detection ---------------- */

const bugLevels = [
  { label: 'Critical', value: 2, tint: 'text-destructive', bar: 'bg-destructive' },
  { label: 'High', value: 4, tint: 'text-[#f0883e]', bar: 'bg-[#f0883e]' },
  { label: 'Medium', value: 6, tint: 'text-[#d29922]', bar: 'bg-[#d29922]' },
  { label: 'Low', value: 9, tint: 'text-primary', bar: 'bg-primary' },
]

export function BugDetectionCard() {
  const total = bugLevels.reduce((s, b) => s + b.value, 0)
  const max = Math.max(...bugLevels.map((b) => b.value))
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
        {bugLevels.map((b) => (
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
    </section>
  )
}

/* ---------------- Security Analysis ---------------- */

const securityItems = [
  { label: 'Vulnerabilities', value: 3, icon: ShieldX, tint: 'text-destructive' },
  { label: 'Dependency Risks', value: 5, icon: PackageX, tint: 'text-[#d29922]' },
  { label: 'Secrets Detected', value: 1, icon: KeyRound, tint: 'text-[#f0883e]' },
]

export function SecurityAnalysisCard() {
  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d29922]/10 text-[#d29922] ring-1 ring-[#d29922]/20">
          <ShieldAlert className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold tracking-tight">Security Analysis</h3>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3">
        {securityItems.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3"
            >
              <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Icon className={`h-4 w-4 ${s.tint}`} />
                {s.label}
              </span>
              <span className={`font-mono text-lg font-bold tabular-nums ${s.tint}`}>
                {s.value}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Code Smells ---------------- */

const smells = [
  { label: 'Duplicated blocks', value: 11 },
  { label: 'Long functions', value: 7 },
  { label: 'Deep nesting', value: 6 },
  { label: 'Magic numbers', value: 4 },
]

export function CodeSmellsCard() {
  const total = smells.reduce((s, x) => s + x.value, 0)
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
        {smells.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{s.label}</span>
            <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------- Performance Suggestions ---------------- */

const perf = [
  'Memoize expensive selectors in the checkout reducer',
  'Add pagination to the transactions list endpoint',
  'Debounce the search input to cut redundant re-renders',
  'Lazy-load the reporting dashboard chunk',
]

export function PerformanceCard() {
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
        {perf.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="leading-relaxed text-muted-foreground">{p}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
