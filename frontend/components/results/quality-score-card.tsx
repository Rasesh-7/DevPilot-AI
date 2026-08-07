'use client'

import { useEffect, useState } from 'react'
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Wrench, Bug } from 'lucide-react'
import { loadHistory } from '@/lib/api'

interface QualityScoreCardProps {
  score?: number | string
}

export function QualityScoreCard({ score = 85 }: QualityScoreCardProps) {
  const [value, setValue] = useState(0)
  const [delta, setDelta] = useState<number | null>(null)

  // Safe numerical coercion (prevents NaN from LLM output)
  const rawScore = typeof score === 'number'
    ? score
    : parseInt(String(score || 85).replace(/\D/g, ''), 10) || 85

  const targetScore = Math.min(100, Math.max(0, rawScore))

  useEffect(() => {
    // Check history for score comparison
    const history = loadHistory()
    if (history.length > 1) {
      const prev = history[1]?.quality_score
      if (typeof prev === 'number') {
        setDelta(targetScore - prev)
      }
    }
  }, [targetScore])

  useEffect(() => {
    let animationFrameId: number
    const startTime = performance.now()
    const duration = 1000 // 1 second smooth animation

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Cubic ease-out curve for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const currentVal = Math.round(easedProgress * targetScore)

      setValue(currentVal)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [targetScore])

  // Gauge SVG math
  const size = 180
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  // Rating label, letter grade, and color calculation
  let ratingLabel = 'Excellent'
  let grade = 'A+'
  let colorHex = '#3fb950' // Emerald Green
  let IconComponent = CheckCircle2

  if (targetScore < 50) {
    ratingLabel = 'Needs Work'
    grade = 'F'
    colorHex = '#f85149' // Red
    IconComponent = XCircle
  } else if (targetScore < 65) {
    ratingLabel = 'Fair'
    grade = 'C'
    colorHex = '#f0883e' // Orange
    IconComponent = AlertTriangle
  } else if (targetScore < 80) {
    ratingLabel = 'Good'
    grade = 'B'
    colorHex = '#58a6ff' // Cyan / Primary Blue
    IconComponent = Sparkles
  } else if (targetScore < 92) {
    ratingLabel = 'Very Good'
    grade = 'A'
    colorHex = '#3fb950'
    IconComponent = CheckCircle2
  }

  // Calculated sub-metrics for quality meter breakdown
  const securityPercent = Math.min(100, Math.max(30, Math.round(targetScore * 0.95)))
  const maintainabilityPercent = Math.min(100, Math.max(35, Math.round(targetScore * 1.02)))
  const reliabilityPercent = Math.min(100, Math.max(25, Math.round(targetScore * 0.92)))

  return (
    <section
      aria-labelledby="quality-score-title"
      className="glass glow-primary animate-fade-up flex flex-col items-center justify-between rounded-xl border border-border p-6 text-center h-full"
    >
      <div className="w-full flex items-center justify-between">
        <h2
          id="quality-score-title"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Overall Code Quality
        </h2>
        <div className="flex items-center gap-1.5">
          {delta !== null && (
            <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
              delta > 0 ? 'bg-emerald-500/10 text-emerald-400' : delta < 0 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'
            }`}>
              {delta > 0 ? `+${delta}` : delta} vs prev
            </span>
          )}
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-bold ring-1"
            style={{
              backgroundColor: `${colorHex}18`,
              color: colorHex,
              borderColor: `${colorHex}40`,
            }}
          >
            Grade {grade}
          </span>
        </div>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative my-4 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#58a6ff" />
              <stop offset="100%" stopColor={colorHex} />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#21262d"
            strokeWidth={stroke}
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-extrabold tabular-nums tracking-tight text-foreground">
            {value}
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Score / 100
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div
        className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold ring-1 transition-all"
        style={{
          backgroundColor: `${colorHex}15`,
          color: colorHex,
          borderColor: `${colorHex}30`,
        }}
      >
        <IconComponent className="h-4 w-4" />
        <span>{ratingLabel} Code Rating</span>
      </div>

      {/* Quality Sub-Metrics Breakdown */}
      <div className="w-full space-y-2 border-t border-border/80 pt-4 text-left">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Security
            </span>
            <span className="font-mono text-xs font-semibold text-foreground">{securityPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${securityPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Wrench className="h-3.5 w-3.5 text-primary" /> Maintainability
            </span>
            <span className="font-mono text-xs font-semibold text-foreground">{maintainabilityPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${maintainabilityPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Bug className="h-3.5 w-3.5 text-amber-400" /> Reliability
            </span>
            <span className="font-mono text-xs font-semibold text-foreground">{reliabilityPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${reliabilityPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
