'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { GithubIcon } from '@/components/brand-icons'

export function RepoAnalysisCard() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    // In a real app this would call the backend; here we just simulate a delay.
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <section
      aria-labelledby="repo-analysis-title"
      className="glass glow-primary rounded-xl border border-border p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="repo-analysis-title"
            className="text-lg font-semibold tracking-tight"
          >
            Analyze a Repository
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a GitHub URL to start a new AI code review.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <GithubIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            aria-label="GitHub repository URL"
            className="h-11 w-full rounded-lg border border-border bg-input/60 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Start Analysis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>
    </section>
  )
}
