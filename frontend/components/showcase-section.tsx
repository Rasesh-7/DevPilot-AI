import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '142', label: 'Files analyzed' },
  { value: '87%', label: 'Avg. quality score' },
  { value: '3.2s', label: 'Time to first insight' },
]

const points = [
  'Connect any public or private GitHub repository',
  'Reviews run in seconds, not hours',
  'Actionable, human-readable suggestions',
]

export function ShowcaseSection() {
  return (
    <section id="dashboard" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="glass grid grid-cols-1 gap-10 rounded-2xl border border-border p-8 md:grid-cols-2 md:p-12">
          <div id="about" className="scroll-mt-24">
            <span className="text-sm font-medium text-primary">Dashboard</span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              A command center for your codebase
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              DevPilot AI gives engineering teams a single place to understand,
              improve, and document their repositories. Built by developers, for
              developers — with a clean, GitHub-native experience.
            </p>

            <ul className="mt-6 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <Button className="group mt-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Analyze Repository
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-1">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col justify-center rounded-xl border border-border bg-background/60 p-6"
              >
                <span className="font-mono text-3xl font-bold text-primary">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
