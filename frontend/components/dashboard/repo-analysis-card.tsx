'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, FileArchive, Code2, Upload, X } from 'lucide-react'
import { GithubIcon } from '@/components/brand-icons'

type TabId = 'github' | 'zip' | 'snippet'

const TABS: { id: TabId; label: string; icon: typeof GithubIcon }[] = [
  { id: 'github', label: 'GitHub URL', icon: GithubIcon },
  { id: 'zip', label: 'Upload Zip', icon: FileArchive },
  { id: 'snippet', label: 'Code Snippet', icon: Code2 },
]

const LANGUAGES = [
  'Auto-detect', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Go',
  'Rust', 'C', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'Shell', 'SQL', 'HTML', 'CSS',
]

export function RepoAnalysisCard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('github')
  const [loading, setLoading] = useState(false)

  // GitHub state
  const [url, setUrl] = useState('')

  // Zip state
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Snippet state
  const [code, setCode] = useState('')
  const [snippetFilename, setSnippetFilename] = useState('')
  const [snippetLanguage, setSnippetLanguage] = useState('Auto-detect')

  // ── Handlers ────────────────────────────────────────────────

  function handleGithubSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    router.push(`/analyze?mode=github&url=${encodeURIComponent(url.trim())}`)
  }

  function handleZipSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!zipFile) return
    setLoading(true)
    // Store zip file in sessionStorage as base64 for the analysis loader
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      sessionStorage.setItem('devpilot_zip_file', base64)
      sessionStorage.setItem('devpilot_zip_filename', zipFile.name)
      router.push(`/analyze?mode=zip`)
    }
    reader.readAsDataURL(zipFile)
  }

  function handleSnippetSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    sessionStorage.setItem('devpilot_snippet_code', code)
    sessionStorage.setItem('devpilot_snippet_filename', snippetFilename || 'snippet')
    sessionStorage.setItem('devpilot_snippet_language',
      snippetLanguage === 'Auto-detect' ? '' : snippetLanguage)
    router.push(`/analyze?mode=snippet`)
  }

  // Drag & Drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setZipFile(file)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setZipFile(file)
  }, [])

  // ── Shared button ───────────────────────────────────────────

  const submitDisabled =
    loading ||
    (activeTab === 'github' && !url.trim()) ||
    (activeTab === 'zip' && !zipFile) ||
    (activeTab === 'snippet' && !code.trim())

  const handleSubmit =
    activeTab === 'github' ? handleGithubSubmit :
    activeTab === 'zip' ? handleZipSubmit :
    handleSnippetSubmit

  return (
    <section
      aria-labelledby="repo-analysis-title"
      className="glass glow-primary rounded-xl border border-border p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="repo-analysis-title"
            className="text-lg font-semibold tracking-tight"
          >
            Analyze Code
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose an input method to start a new AI code review.
          </p>
        </div>
      </div>

      {/* ── Tab Switcher ─────────────────────────────────── */}
      <div className="mt-5 flex gap-1 rounded-lg border border-border bg-secondary/40 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all sm:text-sm ${
              activeTab === id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ──────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="mt-5">
        {/* GitHub URL Tab */}
        {activeTab === 'github' && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <GithubIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                aria-label="GitHub repository URL"
                className="h-11 w-full rounded-lg border border-border bg-input/60 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>
        )}

        {/* Zip Upload Tab */}
        {activeTab === 'zip' && (
          <div className="flex flex-col gap-3">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : zipFile
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-border hover:border-primary/40 hover:bg-secondary/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Upload zip file"
              />
              {zipFile ? (
                <>
                  <FileArchive className="h-8 w-8 text-emerald-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{zipFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(zipFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setZipFile(null)
                    }}
                    className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">.zip files up to 10 MB</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Code Snippet Tab */}
        {activeTab === 'snippet' && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={snippetFilename}
                onChange={(e) => setSnippetFilename(e.target.value)}
                placeholder="filename (optional)"
                aria-label="Filename"
                className="h-9 flex-1 rounded-lg border border-border bg-input/60 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20 font-mono"
              />
              <select
                value={snippetLanguage}
                onChange={(e) => setSnippetLanguage(e.target.value)}
                aria-label="Language"
                className="h-9 rounded-lg border border-border bg-input/60 px-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              aria-label="Code snippet"
              rows={8}
              className="w-full resize-y rounded-lg border border-border bg-input/60 p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20 leading-relaxed"
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {code.length.toLocaleString()} / 100,000 characters
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitDisabled}
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                Start Analysis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  )
}
