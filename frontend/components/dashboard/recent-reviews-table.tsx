'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GitBranch, ScanSearch, ArrowRight } from 'lucide-react'
import { loadHistory, saveAnalysis } from '@/lib/api'
import type { AnalysisResult } from '@/lib/api'

type Review = {
  id?: string
  repo: string
  branch: string
  score: number
  issues: number
  status: 'Completed' | 'In Review' | 'Queued'
  date: string
  rawResult?: AnalysisResult
}

function scoreColor(score: number) {
  if (score >= 85) return 'text-[#3fb950]'
  if (score >= 70) return 'text-primary'
  if (score >= 50) return 'text-[#f0883e]'
  return 'text-destructive'
}

export function RecentReviewsTable() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const history = loadHistory()
    if (history.length > 0) {
      const mapped: Review[] = history.map((item) => {
        const totalIssues = (item.bugs?.length || 0) + (item.security_issues?.length || 0)
        const dateStr = item.analyzed_at
          ? new Date(item.analyzed_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Recent'

        const repoName = item.repo_meta?.full_name || 
          (item.repo_meta?.owner && item.repo_meta?.repo && item.repo_meta.owner !== 'local' ? `${item.repo_meta.owner}/${item.repo_meta.repo}` : null) ||
          item.repo_meta?.repo ||
          (item.source_type === 'zip' ? 'Zip Archive' : item.source_type === 'snippet' ? 'Code Snippet' : 'Repository')

        return {
          id: item.id,
          repo: repoName,
          branch: item.repo_meta?.default_branch || 'main',
          score: item.quality_score || 0,
          issues: totalIssues,
          status: 'Completed',
          date: dateStr,
          rawResult: item,
        }
      })
      setReviews(mapped)
    }
    setLoaded(true)
  }, [])

  function handleRowClick(review: Review) {
    if (review.rawResult) {
      saveAnalysis(review.rawResult)
      router.push('/results')
    }
  }

  function handleQuickScan(url: string) {
    router.push(`/analyze?url=${encodeURIComponent(url)}`)
  }

  return (
    <section
      aria-labelledby="recent-reviews-title"
      className="glass overflow-hidden rounded-xl border border-border"
    >
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3
            id="recent-reviews-title"
            className="text-lg font-semibold tracking-tight"
          >
            Recent AI Code Reviews
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            View past analysis reports and inspect code quality scores.
          </p>
        </div>
      </div>

      {loaded && reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <ScanSearch className="h-6 w-6" />
          </div>
          <h4 className="mt-4 text-base font-semibold text-foreground">No Repositories Scanned Yet</h4>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Paste any public GitHub repository URL into the box above to generate your first AI code review.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Quick test:</span>
            <button
              onClick={() => handleQuickScan('https://github.com/fastapi/fastapi')}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/80 px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              fastapi/fastapi <ArrowRight className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleQuickScan('https://github.com/pallets/flask')}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/80 px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              pallets/flask <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-6 py-3 font-medium">Repository</th>
                <th scope="col" className="px-6 py-3 font-medium">Quality Score</th>
                <th scope="col" className="px-6 py-3 font-medium">Issues Found</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium">Reviewed At</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, i) => (
                <tr
                  key={review.id || `${review.repo}-${i}`}
                  onClick={() => handleRowClick(review)}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{review.repo}</div>
                    <div className="mt-0.5 flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <GitBranch className="h-3 w-3" />
                      {review.branch}
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-mono font-bold ${scoreColor(review.score)}`}>
                    {review.score} / 100
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{review.issues} issues</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary ring-1 ring-primary/20">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{review.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
