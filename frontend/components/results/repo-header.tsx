import { Code2, FileCode, GitBranch, GitCommitHorizontal, User } from 'lucide-react'
import { GithubIcon } from '@/components/brand-icons'

const meta = [
  { label: 'Owner', value: 'acme-labs', icon: User },
  { label: 'Language', value: 'TypeScript', icon: Code2 },
  { label: 'Total Files', value: '324', icon: FileCode },
  { label: 'Branch', value: 'main', icon: GitBranch },
  { label: 'Last Commit', value: '2h ago', icon: GitCommitHorizontal },
]

export function RepoHeader() {
  return (
    <header className="glass animate-fade-up rounded-xl border border-border p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/70 ring-1 ring-border">
            <GithubIcon className="h-6 w-6 text-foreground" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                payments-api
              </h1>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-primary/20">
                Analyzed
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              github.com/acme-labs/payments-api
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {meta.map((m) => {
          const Icon = m.icon
          return (
            <div
              key={m.label}
              className="rounded-lg border border-border bg-secondary/40 p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {m.label}
              </div>
              <p className="mt-1.5 truncate text-sm font-semibold text-foreground">
                {m.value}
              </p>
            </div>
          )
        })}
      </div>
    </header>
  )
}
