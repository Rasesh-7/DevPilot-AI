import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AnalysisLoader } from '@/components/analyze/analysis-loader'

export const metadata: Metadata = {
  title: 'Analyzing Repository · DevPilot AI',
  description:
    'DevPilot AI is reviewing your repository — detecting bugs, scanning for vulnerabilities, and generating documentation and tests.',
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>}>
      <AnalysisLoader />
    </Suspense>
  )
}
