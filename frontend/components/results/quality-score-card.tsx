'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

export function QualityScoreCard({ score = 87 }: { score?: number }) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const duration = 1200
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * score))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [score])

  const size = 200
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const rating =
    score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'

  return (
    <section
      aria-labelledby="quality-score-title"
      className="glass glow-primary animate-fade-up rounded-xl border border-border p-6 text-center"
    >
      <h2
        id="quality-score-title"
        className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
      >
        Overall Code Quality
      </h2>

      <div className="relative mx-auto mt-5 h-[200px] w-[200px]">
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="#3fb950" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-6xl font-bold tabular-nums tracking-tight">
            {value}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
        <Sparkles className="h-4 w-4" />
        {rating} standing
      </div>
    </section>
  )
}
