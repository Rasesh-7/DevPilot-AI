'use client'

import { useEffect, useState } from 'react'
import { ScanSearch, Bug, ShieldCheck, FileText, type LucideIcon } from 'lucide-react'
import { loadHistory } from '@/lib/api'

type Stat = {
  icon: LucideIcon
  label: string
  value: string
  subtitle: string
}

export function AnalyticsCards() {
  const [stats, setStats] = useState<Stat[]>([
    {
      icon: ScanSearch,
      label: 'Repositories Analyzed',
      value: '0',
      subtitle: 'Real-time scans completed',
    },
    {
      icon: Bug,
      label: 'Bugs Identified',
      value: '0',
      subtitle: 'Code errors detected',
    },
    {
      icon: ShieldCheck,
      label: 'Security Issues',
      value: '0',
      subtitle: 'Vulnerabilities flagged',
    },
    {
      icon: FileText,
      label: 'Docs Compiled',
      value: '0',
      subtitle: 'Developer guides created',
    },
  ])

  useEffect(() => {
    const history = loadHistory()
    const totalReviews = history.length
    const totalBugs = history.reduce((sum, h) => sum + (h.bugs?.length || 0), 0)
    const totalVulns = history.reduce((sum, h) => sum + (h.security_issues?.length || 0), 0)
    const totalDocs = history.filter((h) => !!h.documentation_snippet).length

    setStats([
      {
        icon: ScanSearch,
        label: 'Repositories Analyzed',
        value: totalReviews.toLocaleString(),
        subtitle: totalReviews === 1 ? '1 scan stored in history' : `${totalReviews} scans stored in history`,
      },
      {
        icon: Bug,
        label: 'Bugs Identified',
        value: totalBugs.toLocaleString(),
        subtitle: 'Across all scanned repos',
      },
      {
        icon: ShieldCheck,
        label: 'Security Issues',
        value: totalVulns.toLocaleString(),
        subtitle: 'Across all scanned repos',
      },
      {
        icon: FileText,
        label: 'Docs Compiled',
        value: totalDocs.toLocaleString(),
        subtitle: 'Ready to export as README.md',
      },
    ])
  }, [])

  return (
    <section aria-label="Analytics overview">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <article
              key={stat.label}
              className="glass group rounded-xl border border-border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_32px_-12px_rgba(88,166,255,0.25)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 font-mono text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-foreground/90">
                {stat.label}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {stat.subtitle}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
