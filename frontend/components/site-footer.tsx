import { Mail, Terminal } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'

const socials = [
  { label: 'GitHub', href: '#', icon: GithubIcon },
  { label: 'LinkedIn', href: '#', icon: LinkedinIcon },
  { label: 'Contact', href: '#', icon: Mail },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <a href="#home" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
            <Terminal className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            DevPilot <span className="text-primary">AI</span>
          </span>
        </a>

        <nav className="flex items-center gap-2">
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            )
          })}
        </nav>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DevPilot AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
