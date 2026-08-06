'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Check } from 'lucide-react'
import { ScanIllustration } from '@/components/analyze/scan-illustration'
import { AnalysisTerminal } from '@/components/analyze/analysis-terminal'

const STEPS = [
  'Connecting to GitHub...',
  'Cloning Repository...',
  'Reading Files...',
  'Parsing Source Code...',
  'Running AI Code Review...',
  'Detecting Bugs...',
  'Detecting Security Vulnerabilities...',
  'Finding Code Smells...',
  'Calculating Code Quality Score...',
  'Generating Documentation...',
  'Creating Unit Tests...',
  'Preparing Final Report...',
] as const

type TerminalLine = {
  id: number
  text: string
  tone: 'muted' | 'primary' | 'success'
}

// One or more log lines emitted as each step begins.
const STEP_LOGS: { text: string; tone: TerminalLine['tone'] }[][] = [
  [{ text: 'Connecting to github.com/acme/payments-api...', tone: 'primary' }],
  [{ text: 'Cloning repository...', tone: 'muted' }],
  [
    { text: '324 files loaded', tone: 'success' },
    { text: 'Indexing project tree...', tone: 'muted' },
  ],
  [{ text: 'Parsing source code (TypeScript, 41k LOC)...', tone: 'muted' }],
  [{ text: 'Running static analysis...', tone: 'primary' }],
  [{ text: 'AI reviewing code... 3 bugs detected', tone: 'muted' }],
  [{ text: 'Scanning dependencies for CVEs... 1 issue', tone: 'muted' }],
  [{ text: 'Detecting code smells... 12 findings', tone: 'muted' }],
  [{ text: 'Quality score computed: 87 / 100', tone: 'success' }],
  [{ text: 'Documentation generated successfully...', tone: 'success' }],
  [{ text: 'Unit tests created — 96% coverage', tone: 'success' }],
  [{ text: 'Compiling final report...', tone: 'primary' }],
]

export function AnalysisLoader() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [lines, setLines] = useState<TerminalLine[]>([])
  const emittedRef = useRef<Set<number>>(new Set())
  const lineIdRef = useRef(0)
  const doneRef = useRef(false)

  // Drive the progress bar smoothly toward 100%.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const remaining = 100 - prev
        // ease-out: slower as it approaches the end, with slight jitter
        const step = Math.max(0.4, remaining * 0.03 + Math.random() * 0.8)
        return Math.min(100, prev + step)
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Derive the active step and emit terminal logs as thresholds are crossed.
  useEffect(() => {
    const index = Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length))
    setStepIndex(index)

    for (let i = 0; i <= index; i++) {
      if (!emittedRef.current.has(i)) {
        emittedRef.current.add(i)
        const logs = STEP_LOGS[i] ?? []
        setLines((prev) => [
          ...prev,
          ...logs.map((l) => ({ id: lineIdRef.current++, text: l.text, tone: l.tone })),
        ])
      }
    }

    if (progress >= 100 && !doneRef.current) {
      doneRef.current = true
      const timeout = setTimeout(() => router.push('/dashboard'), 1100)
      return () => clearTimeout(timeout)
    }
  }, [progress, router])

  const rounded = Math.round(progress)
  const isComplete = rounded >= 100

  return (
    <main className="relative min-h-svh overflow-hidden">
      {/* backdrop: grid + radial glow, matching the hero */}
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
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] max-w-full -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(88,166,255,0.16), transparent 70%)',
        }}
      />

      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 py-12 md:px-6">
        <div className="mx-auto mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">DevPilot AI · Repository Analysis</span>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {/* left: illustration + progress */}
          <section
            aria-label="Analysis progress"
            className="glass glow-primary flex flex-col items-center justify-center rounded-xl border border-border p-8 text-center"
          >
            <ScanIllustration />

            <h1 className="mt-8 text-balance text-2xl font-bold tracking-tight md:text-3xl">
              {isComplete ? 'Analysis Complete' : 'Analyzing Repository'}
            </h1>

            {/* current step */}
            <div
              aria-live="polite"
              className="mt-3 flex min-h-6 items-center justify-center gap-2 font-mono text-sm text-primary"
            >
              {isComplete ? (
                <>
                  <Check className="h-4 w-4 text-[#3fb950]" />
                  <span className="text-[#3fb950]">Redirecting to your report...</span>
                </>
              ) : (
                <span className="animate-fade-up" key={stepIndex}>
                  {STEPS[stepIndex]}
                </span>
              )}
            </div>

            {/* percentage */}
            <div className="mt-6 font-mono text-5xl font-bold tabular-nums text-foreground md:text-6xl">
              {rounded}
              <span className="text-2xl text-muted-foreground md:text-3xl">%</span>
            </div>

            {/* progress bar */}
            <div className="mt-5 w-full max-w-md">
              <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-border bg-input/60">
                <div
                  className="relative h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
                  style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 12px 1px rgba(88,166,255,0.6)',
                  }}
                >
                  <span className="absolute inset-0 overflow-hidden">
                    <span className="animate-bar-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  </span>
                </div>
              </div>
              <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
                <span>
                  Step {Math.min(stepIndex + 1, STEPS.length)} of {STEPS.length}
                </span>
                <span>{isComplete ? 'Done' : 'Working...'}</span>
              </div>
            </div>
          </section>

          {/* right: terminal */}
          <AnalysisTerminal lines={lines} />
        </div>
      </div>
    </main>
  )
}
