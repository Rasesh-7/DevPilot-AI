'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
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
  href: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Analyze Repository', icon: ScanSearch, href: '/dashboard' },
  { label: 'Analysis Results', icon: Sparkles, href: '/results' },
]

export function DashboardSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

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
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <Terminal className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              DevPilot <span className="text-primary">AI</span>
            </span>
          </Link>
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
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <div className="glass rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live AI Engine</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Google Gemini Flash AI Active
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-time Code Review</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
