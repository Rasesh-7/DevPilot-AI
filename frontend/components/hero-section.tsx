'use client'

import Link from 'next/link'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GithubIcon } from '@/components/brand-icons'

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      {/* subtle grid + radial glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(48,54,61,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(48,54,61,0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] max-w-full -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(88,166,255,0.18), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI · Built for developers
          </span>

          <h1 className="animate-fade-up mt-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Review Your Code with{' '}
            <span className="text-primary">AI in Seconds</span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Upload a GitHub repository and let AI review code, detect bugs,
            generate documentation, create unit tests, explain functions, and
            improve code quality.
          </p>

          <div className="animate-fade-up mt-9 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              <Link href="/analyze">
                Analyze Repository
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 border-border bg-transparent text-foreground hover:bg-secondary sm:w-auto"
            >
              <Play className="h-4 w-4" />
              View Demo
            </Button>
          </div>

          {/* mock terminal / repo input */}
          <div className="animate-fade-up glass glow-primary mt-14 w-full max-w-2xl rounded-xl border border-border p-1.5 text-left">
            <div className="flex items-center gap-1.5 px-3 py-2">
              <span className="h-3 w-3 rounded-full bg-[#f85149]/70" />
              <span className="h-3 w-3 rounded-full bg-[#e3b341]/70" />
              <span className="h-3 w-3 rounded-full bg-[#3fb950]/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                devpilot — repo analysis
              </span>
            </div>
            <div className="rounded-lg bg-background/80 p-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GithubIcon className="h-4 w-4 shrink-0 text-foreground" />
                <span className="truncate">github.com/acme/payments-api</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs leading-relaxed">
                <p className="text-primary">→ Scanning 142 files…</p>
                <p className="text-muted-foreground">
                  ✓ 3 bugs detected · 12 suggestions · 87% quality score
                </p>
                <p className="text-[#3fb950]">✓ Documentation & tests generated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
