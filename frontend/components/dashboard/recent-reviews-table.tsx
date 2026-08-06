import { GitBranch, ChevronRight } from 'lucide-react'

type Review = {
  repo: string
  branch: string
  score: number
  issues: number
  status: 'Completed' | 'In Review' | 'Queued'
  date: string
}

const reviews: Review[] = [
  {
    repo: 'acme/payments-api',
    branch: 'feat/webhooks',
    score: 82,
    issues: 6,
    status: 'Completed',
    date: '2h ago',
  },
  {
    repo: 'acme/web-dashboard',
    branch: 'main',
    score: 74,
    issues: 11,
    status: 'In Review',
    date: '5h ago',
  },
  {
    repo: 'acme/auth-service',
    branch: 'fix/session',
    score: 91,
    issues: 2,
    status: 'Completed',
    date: '1d ago',
  },
  {
    repo: 'acme/mobile-app',
    branch: 'release/2.4',
    score: 68,
    issues: 18,
    status: 'Queued',
    date: '1d ago',
  },
  {
    repo: 'acme/data-pipeline',
    branch: 'chore/refactor',
    score: 79,
    issues: 9,
    status: 'Completed',
    date: '2d ago',
  },
]

const statusStyles: Record<Review['status'], string> = {
  Completed: 'bg-primary/10 text-primary ring-primary/20',
  'In Review': 'bg-[#d29922]/10 text-[#d29922] ring-[#d29922]/20',
  Queued: 'bg-secondary text-muted-foreground ring-border',
}

function scoreColor(score: number) {
  if (score >= 85) return 'text-primary'
  if (score >= 70) return 'text-[#d29922]'
  return 'text-destructive'
}

export function RecentReviewsTable() {
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
            Recent AI Reviews
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest automated code reviews across your repositories.
          </p>
        </div>
        <a
          href="#"
          className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:inline-flex"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-6 py-3 font-medium">Repository</th>
              <th scope="col" className="px-6 py-3 font-medium">Quality</th>
              <th scope="col" className="px-6 py-3 font-medium">Issues</th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
              <th scope="col" className="px-6 py-3 font-medium">Reviewed</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.repo}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{review.repo}</div>
                  <div className="mt-0.5 flex items-center gap-1 font-mono text-xs text-muted-foreground">
                    <GitBranch className="h-3 w-3" />
                    {review.branch}
                  </div>
                </td>
                <td className={`px-6 py-4 font-semibold ${scoreColor(review.score)}`}>
                  {review.score}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{review.issues}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[review.status]}`}
                  >
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{review.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
