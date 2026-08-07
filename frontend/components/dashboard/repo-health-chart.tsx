'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { loadHistory } from '@/lib/api'

type DataPoint = {
  label: string
  value: number
  fullDate?: string
  name?: string
}

const DEFAULT_DATA: DataPoint[] = [
  { label: 'Wk 1', value: 58 },
  { label: 'Wk 2', value: 64 },
  { label: 'Wk 3', value: 61 },
  { label: 'Wk 4', value: 70 },
  { label: 'Wk 5', value: 68 },
  { label: 'Wk 6', value: 76 },
  { label: 'Wk 7', value: 79 },
  { label: 'Wk 8', value: 82 },
]

const W = 720
const H = 240
const PAD_X = 24
const PAD_Y = 24

export function RepoHealthChart() {
  const [chartData, setChartData] = useState<DataPoint[]>(DEFAULT_DATA)
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)
  const [trendDiff, setTrendDiff] = useState<number>(24)

  useEffect(() => {
    const history = loadHistory()
    if (history.length > 0) {
      // Sort history chronologically (oldest first)
      const sorted = [...history].sort(
        (a, b) => new Date(a.analyzed_at || 0).getTime() - new Date(b.analyzed_at || 0).getTime()
      )

      const mapped: DataPoint[] = sorted.slice(-8).map((item, idx) => {
        const d = item.analyzed_at ? new Date(item.analyzed_at) : new Date()
        const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        const name = item.repo_meta?.full_name || item.repo_meta?.repo || (item.source_type === 'zip' ? 'Zip Upload' : item.source_type === 'snippet' ? 'Snippet' : `Review #${idx + 1}`)
        return {
          label: label || `Scan #${idx + 1}`,
          value: item.quality_score || 75,
          fullDate: d.toLocaleString(),
          name,
        }
      })

      // Ensure at least 2 points for a nice line
      if (mapped.length === 1) {
        mapped.unshift({ label: 'Start', value: Math.max(40, mapped[0].value - 10), name: 'Baseline' })
      }

      setChartData(mapped)

      const firstVal = mapped[0].value
      const lastVal = mapped[mapped.length - 1].value
      setTrendDiff(lastVal - firstVal)
    }
  }, [])

  // Build SVG path calculations dynamically based on chartData
  const max = 100
  const min = 30
  const stepX = (W - PAD_X * 2) / Math.max(1, chartData.length - 1)

  const points = chartData.map((d, i) => {
    const x = PAD_X + i * stepX
    const y = PAD_Y + (1 - (d.value - min) / (max - min)) * (H - PAD_Y * 2)
    return { x, y, data: d }
  })

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${H - PAD_Y} L ${points[0].x.toFixed(1)} ${H - PAD_Y} Z`

  return (
    <section
      aria-labelledby="repo-health-title"
      className="glass rounded-xl border border-border p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 id="repo-health-title" className="text-lg font-semibold tracking-tight">
            Repository Health Trend
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Historical code quality scores across your recent scans.
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
          trendDiff > 0
            ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
            : trendDiff < 0
            ? 'bg-destructive/10 text-destructive ring-destructive/20'
            : 'bg-secondary text-muted-foreground ring-border'
        }`}>
          {trendDiff > 0 ? <TrendingUp className="h-4 w-4 text-emerald-400" /> : trendDiff < 0 ? <TrendingDown className="h-4 w-4 text-destructive" /> : <Minus className="h-4 w-4" />}
          {trendDiff > 0 ? `+${trendDiff} pts` : trendDiff < 0 ? `${trendDiff} pts` : '0 pts'}
        </span>
      </div>

      <div className="relative mt-6">
        {/* SVG Chart */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Line chart showing repository health scores"
        >
          <defs>
            <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = PAD_Y + t * (H - PAD_Y * 2)
            return (
              <line
                key={t}
                x1={PAD_X}
                x2={W - PAD_X}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray="3 5"
              />
            )
          })}

          <path d={area} fill="url(#healthFill)" />
          <path
            d={line}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {points.map((p, i) => {
            const isHovered = hoveredPoint === p.data
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7 : i === points.length - 1 ? 5 : 4}
                  fill="var(--background)"
                  stroke="var(--primary)"
                  strokeWidth={isHovered ? 3 : 2.5}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => {
                    setHoveredPoint(p.data)
                    setHoverPos({ x: p.x, y: p.y })
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null)
                    setHoverPos(null)
                  }}
                />
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && hoverPos && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border border-border bg-secondary/95 px-3 py-1.5 text-xs shadow-xl backdrop-blur animate-fade-up"
            style={{
              left: `${(hoverPos.x / W) * 100}%`,
              top: `${(hoverPos.y / H) * 100 - 45}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <p className="font-semibold text-foreground">{hoveredPoint.name || 'Analysis'}</p>
            <p className="font-mono font-bold text-primary">{hoveredPoint.value} / 100</p>
            {hoveredPoint.fullDate && (
              <p className="text-[10px] text-muted-foreground">{hoveredPoint.fullDate}</p>
            )}
          </div>
        )}

        {/* X-Axis Labels */}
        <div className="mt-3 flex justify-between px-2 text-xs text-muted-foreground">
          {chartData.map((d, idx) => (
            <span key={idx} className="truncate max-w-[60px] text-center">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
