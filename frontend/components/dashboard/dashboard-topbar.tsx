'use client'

import { Bell, Menu, Search } from 'lucide-react'

export function DashboardTopbar({ onMenu }: { onMenu: () => void }) {
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

        <div className="relative flex-1 md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search repositories..."
            aria-label="Search repositories"
            className="h-10 w-full rounded-lg border border-border bg-input/60 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </button>

          <button
            type="button"
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
