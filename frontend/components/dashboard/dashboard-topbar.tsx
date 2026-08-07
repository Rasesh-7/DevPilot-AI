'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Menu, Search } from 'lucide-react'

export function DashboardTopbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    // If it looks like a GitHub URL, start analysis directly
    if (query.includes('github.com/')) {
      router.push(`/analyze?url=${encodeURIComponent(query.trim())}`)
    } else {
      // Default to analyzing a GitHub repo with the query as owner/repo
      router.push(`/analyze?url=${encodeURIComponent(`https://github.com/${query.trim()}`)}`)
    }
  }

  return (
    <header className="glass sticky top-0 z-30 border-b border-border">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form onSubmit={handleSearch} className="relative flex-1 md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or enter repo (e.g. owner/repo)..."
            aria-label="Search repositories"
            className="h-10 w-full rounded-lg border border-border bg-input/60 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => alert('All notifications are up to date! DevPilot AI active.')}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 py-1 pl-1 pr-3 transition-colors hover:border-primary/40"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary ring-1 ring-primary/30">
              AK
            </span>
            <span className="hidden text-sm font-medium sm:inline">Alex Kim</span>
          </button>
        </div>
      </div>
    </header>
  )
}
