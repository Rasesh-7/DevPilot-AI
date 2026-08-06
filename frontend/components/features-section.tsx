import {
  ScanSearch,
  Bug,
  FileText,
  FlaskConical,
  Gauge,
  GitCommitHorizontal,
  type LucideIcon,
} from 'lucide-react'

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: ScanSearch,
    title: 'AI Code Review',
    description:
      'Line-by-line analysis with actionable feedback on style, structure, and best practices across your entire repository.',
  },
  {
    icon: Bug,
    title: 'Bug Detection',
    description:
      'Catch logical errors, security vulnerabilities, and edge cases before they ever reach production.',
  },
  {
    icon: FileText,
    title: 'Documentation Generator',
    description:
      'Turn undocumented code into clear, structured docs and READMEs that stay in sync with your source.',
  },
  {
    icon: FlaskConical,
    title: 'Unit Test Generator',
    description:
      'Automatically generate meaningful unit tests with edge-case coverage for functions and modules.',
  },
  {
    icon: Gauge,
    title: 'Code Quality Score',
    description:
      'Get a measurable quality score with maintainability, complexity, and readability insights.',
  },
  {
    icon: GitCommitHorizontal,
    title: 'Commit Message Generator',
    description:
      'Produce clean, conventional commit messages that describe your changes with precision.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium text-primary">Features</span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to ship better code
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            DevPilot AI works across your codebase to review, fix, document, and
            test — so you can focus on building.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="glass group rounded-xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_40px_-16px_rgba(88,166,255,0.5)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
