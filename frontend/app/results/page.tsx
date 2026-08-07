'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import { loadAnalysis } from '@/lib/api'
import type { AnalysisResult } from '@/lib/api'
import { SiteNavbar } from '@/components/site-navbar'
import { RepoHeader } from '@/components/results/repo-header'
import { QualityScoreCard } from '@/components/results/quality-score-card'
import { DocumentationCard } from '@/components/results/documentation-card'
import {
  AiSummaryCard,
  BugDetectionCard,
  SecurityAnalysisCard,
  CodeSmellsCard,
  PerformanceCard,
} from '@/components/results/detail-cards'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const data = loadAnalysis()
    if (!data) {
      router.replace('/dashboard')
      return
    }
    setResult(data)
  }, [router])

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-muted-foreground">Loading results...</div>
      </div>
    )
  }

  const meta = result.repo_meta

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 md:px-6">
        {/* Top bar */}
        <div className="animate-fade-up mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Dashboard
          </button>
          <div className="flex gap-2">
            <a
              href={`https://github.com/${meta.owner}/${meta.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
            >
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Repo header */}
        <div className="animate-fade-up">
          <RepoHeader
            owner={meta.owner}
            repo={meta.repo}
            fullName={meta.full_name}
            description={meta.description}
            language={meta.language}
            totalFiles={meta.total_files}
            defaultBranch={meta.default_branch}
            lastPushed={meta.last_pushed}
            stars={meta.stars}
          />
        </div>

        {/* Score + AI Summary row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
            <QualityScoreCard score={result.quality_score} />
          </div>
          <div className="animate-fade-up lg:col-span-2" style={{ animationDelay: '120ms' }}>
            <AiSummaryCard
              summary={result.summary}
              tags={result.tags}
            />
          </div>
        </div>

        {/* Detail cards grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="animate-fade-up" style={{ animationDelay: '180ms' }}>
            <BugDetectionCard bugs={result.bugs} />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
            <SecurityAnalysisCard issues={result.security_issues} />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
            <CodeSmellsCard smells={result.code_smells} />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '360ms' }}>
            <PerformanceCard suggestions={result.performance_suggestions} />
          </div>
        </div>

        {/* Documentation snippet */}
        {result.documentation_snippet && (
          <div className="animate-fade-up mt-6" style={{ animationDelay: '420ms' }}>
            <DocumentationCard
              snippet={result.documentation_snippet}
              repoName={meta.repo}
            />
          </div>
        )}

        {/* Analysis metadata */}
        <div className="animate-fade-up mt-6 text-center" style={{ animationDelay: '480ms' }}>
          <p className="text-xs text-muted-foreground">
            Analysis ID: {result.id} · Analyzed at:{' '}
            {new Date(result.analyzed_at).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  )
}
