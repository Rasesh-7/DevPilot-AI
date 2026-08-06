import {
  ScanSearch,
  Bug,
  ShieldCheck,
  FileText,
  type LucideIcon,
} from 'lucide-react'

type Stat = {
  icon: LucideIcon
  label: string
  value: string
  change: string
  positive: boolean
}

const stats: Stat[] = [
  {
    icon: ScanSearch,
    label: 'Total Reviews',
    value: '1,284',
    change: '+14%',
    positive: true,
  },
  {
    icon: Bug,
    label: 'Bugs Detected',
    value: '67',
    change: '-8%',
    positive: true,
  },
  {
    icon: ShieldCheck,
    label: 'Vulnerabilities',
    value: '12',
    change: '-23%',
    positive: true,
  },
  {
    icon: FileText,
    label: 'Docs Generated',
    value: '342',
    change: '+31%',
    positive: true,
  },
]

export function AnalyticsCards() {
  return (
    <section aria-label="Analytics overview">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <article
              key={stat.label}
              className="glass group rounded-xl border border-border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_32px_-12px_rgba(88,166,255,0.35)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                    stat.positive
                      ? 'bg-primary/10 text-primary ring-primary/20'
                      : 'bg-destructive/10 text-destructive ring-destructive/20'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 font-mono text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
