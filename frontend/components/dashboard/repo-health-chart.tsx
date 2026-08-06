import { TrendingUp } from 'lucide-react'

const data = [
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
const H = 260
const PAD_X = 16
const PAD_Y = 24

function buildPaths() {
  const max = 100
  const min = 40
  const stepX = (W - PAD_X * 2) / (data.length - 1)
  const points = data.map((d, i) => {
    const x = PAD_X + i * stepX
    const y = PAD_Y + (1 - (d.value - min) / (max - min)) * (H - PAD_Y * 2)
    return { x, y }
  })

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${H - PAD_Y} L ${points[0].x.toFixed(1)} ${H - PAD_Y} Z`

  return { points, line, area }
}

export function RepoHealthChart() {
  const { points, line, area } = buildPaths()

  return (
    <section
      aria-labelledby="repo-health-title"
      className="glass rounded-xl border border-border p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 id="repo-health-title" className="text-lg font-semibold tracking-tight">
            Repository Health
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Overall health score across the last 8 weeks.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
          <TrendingUp className="h-4 w-4" />
          +24 pts
        </span>
      </div>

      <div className="mt-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Line chart showing repository health improving from 58 to 82 over eight weeks"
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

          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 5 : 3.5}
              fill="var(--background)"
              stroke="var(--primary)"
              strokeWidth={2.5}
            />
          ))}
        </svg>

        <div className="mt-3 flex justify-between px-2 text-xs text-muted-foreground">
          {data.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
