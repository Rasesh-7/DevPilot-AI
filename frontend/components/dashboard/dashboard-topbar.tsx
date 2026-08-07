'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Menu, Search } from 'lucide-react'

export function DashboardTopbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(2)

  const notifications = [
    { id: 1, title: 'AI Engine Active', desc: 'Google Gemini 3.5 Flash is analyzing code in real-time.', time: 'Just now' },
    { id: 2, title: 'Upload Support Added', desc: 'You can now upload .zip files or paste code snippets directly.', time: '5m ago' },
  ]

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    let targetUrl = trimmed
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      const cleanPath = trimmed.replace(/^github\.com\//, '').replace(/^\/+|\/+$/g, '')
      targetUrl = `https://github.com/${cleanPath}`
    }
    router.push(`/analyze?url=${encodeURIComponent(targetUrl)}`)
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
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications)
                setUnreadCount(0)
              }}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              )}
            </button>

            {showNotifications && (
              <div className="glass absolute right-0 mt-2 w-80 rounded-xl border border-border p-4 shadow-xl z-50 animate-fade-up">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Notifications</h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                      <div className="flex items-center justify-between text-xs font-medium text-foreground">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
