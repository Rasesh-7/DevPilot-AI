'use client'

import { useEffect, useRef } from 'react'

type TerminalLine = {
  id: number
  text: string
  tone: 'muted' | 'primary' | 'success'
}

const toneClass: Record<TerminalLine['tone'], string> = {
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-[#3fb950]',
}

export function AnalysisTerminal({ lines }: { lines: TerminalLine[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  return (
    <div className="glass glow-primary flex h-full min-h-[22rem] flex-col overflow-hidden rounded-xl border border-border">
      <div className="flex items-center gap-1.5 border-b border-border/70 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#f85149]/70" />
        <span className="h-3 w-3 rounded-full bg-[#e3b341]/70" />
        <span className="h-3 w-3 rounded-full bg-[#3fb950]/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          devpilot@ai — analysis.log
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto p-4 font-mono text-xs leading-relaxed md:text-sm"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`animate-fade-up flex gap-2 ${toneClass[line.tone]}`}
          >
            <span className="select-none text-primary/70">&gt;</span>
            <span className="text-pretty">{line.text}</span>
          </div>
        ))}
        <div className="flex gap-2 text-foreground">
          <span className="select-none text-primary/70">&gt;</span>
          <span className="animate-caret-blink inline-block h-4 w-2 bg-primary" />
        </div>
      </div>
    </div>
  )
}
