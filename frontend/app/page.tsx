import type { Metadata } from 'next'
import { AnalysisLoader } from '@/components/analyze/analysis-loader'

export const metadata: Metadata = {
  title: 'Analyzing Repository · DevPilot AI',
  description:
    'DevPilot AI is reviewing your repository — detecting bugs, scanning for vulnerabilities, and generating documentation and tests.',
}

export default function AnalyzePage() {
  return <AnalysisLoader />
}
