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
  TestSuggestionsCard,
  CommitMessagesCard,
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

  const handleExportJson = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `devpilot-analysis-${result.repo_meta?.repo || 'repo'}-${result.id}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-muted-foreground">Loading results...</div>
      </div>
    )
  }

  const meta = result.repo_meta
  const isGithub = result.source_type === 'github' || (meta && meta.owner !== 'local')

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
          <div className="flex items-center gap-2">
            <span className="mr-2 rounded-full border border-border bg-secondary/80 px-3 py-1 text-xs font-medium text-primary">
              {result.source_type === 'zip' ? 'Zip Archive' : result.source_type === 'snippet' ? 'Code Snippet' : 'GitHub Repo'}
            </span>
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
            {isGithub && meta?.owner && meta?.repo && (
              <a
                href={`https://github.com/${meta.owner}/${meta.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
              >
                <ExternalLink className="h-4 w-4" />
                View on GitHub
              </a>
            )}
          </div>
        </div>

        {/* Repo header */}
        {meta && (
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
        )}

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

        {/* Test Suggestions Card */}
        <div className="animate-fade-up mt-6" style={{ animationDelay: '400ms' }}>
          <TestSuggestionsCard suggestions={result.test_suggestions} />
        </div>

        {/* Commit Message Suggestions */}
        {result.suggested_commit_messages && result.suggested_commit_messages.length > 0 && (
          <div className="animate-fade-up mt-6" style={{ animationDelay: '430ms' }}>
            <CommitMessagesCard messages={result.suggested_commit_messages} />
          </div>
        )}

        {/* Documentation snippet */}
        {result.documentation_snippet && (
          <div className="animate-fade-up mt-6" style={{ animationDelay: '460ms' }}>
            <DocumentationCard
              snippet={result.documentation_snippet}
              repoName={meta.repo}
            />
          </div>
        )}

        {/* Analysis metadata */}
        <div className="animate-fade-up mt-6 text-center" style={{ animationDelay: '520ms' }}>
          <p className="text-xs text-muted-foreground">
            Analysis ID: {result.id} · Analyzed at:{' '}
            {new Date(result.analyzed_at).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  )
}
