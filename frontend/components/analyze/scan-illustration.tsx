import { GithubIcon } from '@/components/brand-icons'

export function ScanIllustration() {
  return (
    <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
      {/* pulsing rings */}
      <span
        aria-hidden="true"
        className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/40"
      />
      <span
        aria-hidden="true"
        className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/30"
        style={{ animationDelay: '0.8s' }}
      />
      <span
        aria-hidden="true"
        className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/20"
        style={{ animationDelay: '1.6s' }}
      />

      {/* rotating orbit rings */}
      <span
        aria-hidden="true"
        className="animate-spin-slow absolute inset-2 rounded-full border border-dashed border-primary/25"
      />
      <span
        aria-hidden="true"
        className="animate-spin-reverse absolute inset-8 rounded-full border border-dashed border-primary/20"
      />

      {/* glowing core with repo icon + scan sweep */}
      <div className="animate-float-core glass glow-primary relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-primary/30">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-primary/10"
        />
        {/* scanning line */}
        <span
          aria-hidden="true"
          className="animate-scan-sweep absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-primary/50 to-transparent"
        />
        <GithubIcon className="relative h-12 w-12 text-primary" />
      </div>
    </div>
  )
}
