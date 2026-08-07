'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles, Check } from 'lucide-react'
import { ScanIllustration } from '@/components/analyze/scan-illustration'
import { AnalysisTerminal } from '@/components/analyze/analysis-terminal'
import { checkBackendHealth, analyzeRepository, saveAnalysis } from '@/lib/api'
import type { AnalysisResult } from '@/lib/api'

const STEPS = [
  'Connecting to Backend & GitHub...',
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
  tone: 'muted' | 'primary' | 'success' | 'error'
}

export function AnalysisLoader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const repoUrl = searchParams.get('url') || 'https://github.com/acme/payments-api'
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [lines, setLines] = useState<TerminalLine[]>([])
  const lineIdRef = useRef(0)
  const doneRef = useRef(false)
  const analysisRef = useRef<AnalysisResult | null>(null)
  const backendDoneRef = useRef(false)

  // Helper to push a new terminal line
  const pushLine = (text: string, tone: TerminalLine['tone'] = 'muted') => {
    setLines((prev) => [
      ...prev,
      { id: lineIdRef.current++, text, tone },
    ])
  }

  // ── Call the real backend ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function runAnalysis() {
      // Step 1: Health check
      try {
        const health = await checkBackendHealth()
        if (cancelled) return
        pushLine(
          `✓ Backend connected — status: ${health.status}`,
          'success',
        )
      } catch {
        if (cancelled) return
        pushLine(
          '⚠ Could not reach backend at localhost:8000 — running in demo mode',
          'error',
        )
      }

      // Step 2: Full analysis
      pushLine(`→ Sending ${repoUrl} to backend for analysis...`, 'primary')
      try {
        const result = await analyzeRepository(repoUrl)
        if (cancelled) return

        analysisRef.current = result
        saveAnalysis(result)

        // Log real data into the terminal
        const meta = result.repo_meta
        pushLine(`✓ Repository: ${meta.full_name || `${meta.owner}/${meta.repo}`}`, 'success')
        pushLine(`  Language: ${meta.language} · ${meta.total_files} files · ${meta.lines_of_code.toLocaleString()} LOC`, 'muted')
        pushLine(`  ★ ${meta.stars} stars · ${meta.forks} forks`, 'muted')

        if (result.bugs.length > 0) {
          const critical = result.bugs.filter(b => b.severity === 'critical').length
          const high = result.bugs.filter(b => b.severity === 'high').length
          pushLine(`🐛 ${result.bugs.length} bugs detected (${critical} critical, ${high} high)`, 'primary')
        }
        if (result.security_issues.length > 0) {
          pushLine(`🛡 ${result.security_issues.length} security issues found`, 'primary')
        }
        if (result.code_smells.length > 0) {
          const total = result.code_smells.reduce((s, c) => s + c.count, 0)
          pushLine(`👃 ${total} code smell instances across ${result.code_smells.length} categories`, 'muted')
        }
        pushLine(`📊 Quality score: ${result.quality_score} / 100`, 'success')
        pushLine(`📝 Documentation generated`, 'success')
        pushLine(`✓ Analysis complete — preparing report...`, 'success')

        backendDoneRef.current = true
      } catch (err) {
        if (cancelled) return
        pushLine(
          `✗ Analysis failed: ${(err as Error).message}`,
          'error',
        )
        pushLine('  Running in demo mode with sample data...', 'muted')
        backendDoneRef.current = true
      }
    }

    runAnalysis()
    return () => { cancelled = true }
  }, [repoUrl])

  // ── Drive the progress bar ────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100

        // If backend is done, accelerate to 100%
        if (backendDoneRef.current && prev < 95) {
          return Math.min(100, prev + 3)
        }

        // Otherwise ease-out toward ~90%, waiting for backend
        const cap = backendDoneRef.current ? 100 : 88
        const remaining = cap - prev
        const step = Math.max(0.3, remaining * 0.025 + Math.random() * 0.6)
        return Math.min(cap, prev + step)
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // ── Derive step index from progress ───────────────────────────
  useEffect(() => {
    const index = Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length))
    setStepIndex(index)

    // Redirect when complete
    if (progress >= 100 && !doneRef.current) {
      doneRef.current = true
      const timeout = setTimeout(() => {
        // If we have real results, go to results page; otherwise dashboard
        if (analysisRef.current) {
          router.push('/results')
        } else {
          router.push('/dashboard')
        }
      }, 1100)
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
