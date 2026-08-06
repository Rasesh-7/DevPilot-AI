import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { RepoAnalysisCard } from '@/components/dashboard/repo-analysis-card'
import { AnalyticsCards } from '@/components/dashboard/analytics-cards'
import { RepoHealthChart } from '@/components/dashboard/repo-health-chart'
import { RecentReviewsTable } from '@/components/dashboard/recent-reviews-table'

export const metadata: Metadata = {
  title: 'Dashboard — DevPilot AI',
  description:
    'Analyze repositories, track code quality, and review AI-generated insights in the DevPilot AI dashboard.',
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="animate-fade-up">
          <p className="text-sm text-muted-foreground">Welcome back, Alex</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
          <RepoAnalysisCard />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
          <AnalyticsCards />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '180ms' }}>
          <RepoHealthChart />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <RecentReviewsTable />
        </div>
      </div>
    </DashboardShell>
  )
}
