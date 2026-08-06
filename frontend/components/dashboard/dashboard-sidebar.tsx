'use client'

import {
  LayoutDashboard,
  ScanSearch,
  Sparkles,
  FileText,
  FlaskConical,
  Settings,
  Terminal,
  X,
  type LucideIcon,
} from 'lucide-react'

type NavItem = {
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Repository Analysis', icon: ScanSearch },
  { label: 'AI Reviews', icon: Sparkles },
  { label: 'Documentation', icon: FileText },
  { label: 'Unit Tests', icon: FlaskConical },
  { label: 'Settings', icon: Settings },
]

export function DashboardSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`glass fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <a href="#" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <Terminal className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              DevPilot <span className="text-primary">AI</span>
            </span>
          </a>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const active = index === 0
              return (
                <li key={item.label}>
                  <a
                    href="#"
                    aria-current={active ? 'page' : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <div className="glass rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Pro plan</p>
            <p className="mt-1 text-xs text-muted-foreground">
              320 / 500 analyses used this month.
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[64%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
