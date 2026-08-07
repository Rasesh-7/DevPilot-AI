import type { Metadata } from 'next'
import { SiteNavbar } from '@/components/site-navbar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { ShowcaseSection } from '@/components/showcase-section'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'DevPilot AI — Your AI Code Review Partner',
  description:
    'Upload a GitHub repository and let AI review code, detect bugs, generate documentation, create unit tests, explain functions, and improve code quality.',
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
      </main>
      <SiteFooter />
    </div>
  )
}
