'use client'

import { useState } from 'react'
import { BookOpen, Copy, Check, Download, Code2, Eye, Sparkles } from 'lucide-react'

interface DocumentationCardProps {
  snippet: string
  repoName?: string
}

export function DocumentationCard({ snippet, repoName = 'repository' }: DocumentationCardProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleDownload = () => {
    const blob = new Blob([snippet], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${repoName.toLowerCase()}-README.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="glass rounded-xl border border-border p-6 transition-colors hover:border-primary/40">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <BookOpen className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Generated Documentation & Developer Guide
            </h3>
            <p className="text-xs text-muted-foreground">
              AI-compiled architecture notes, core file roles, and quick-start reference
            </p>
          </div>
        </div>

        {/* Actions & Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Selector */}
          <div className="flex rounded-lg bg-secondary/80 p-0.5 border border-border">
            <button
              onClick={() => setActiveTab('formatted')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === 'formatted'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === 'raw'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-secondary hover:border-primary/30"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy README</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="mt-6">
        {activeTab === 'raw' ? (
          <div className="rounded-lg border border-border bg-background/90 p-4 font-mono text-xs text-foreground/90 leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {snippet}
          </div>
        ) : (
          <FormattedMarkdownRenderer content={snippet} />
        )}
      </div>
    </section>
  )
}

/**
 * Formatted Markdown Renderer Component
 * Accurately parses headers, code blocks, lists, blockquotes, bold text, and inline code.
 */
function FormattedMarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: { type: 'h1' | 'h2' | 'h3' | 'blockquote' | 'code' | 'ul' | 'ol' | 'p'; text: string; codeLang?: string }[] = []
  
  let inCodeBlock = false
  let codeBuffer: string[] = []
  let codeLang = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        blocks.push({
          type: 'code',
          text: codeBuffer.join('\n'),
          codeLang: codeLang || 'text',
        })
        codeBuffer = []
        inCodeBlock = false
        codeLang = ''
      } else {
        // Start of code block
        inCodeBlock = true
        codeLang = trimmed.substring(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      continue
    }

    if (!trimmed) continue

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', text: trimmed.substring(2).trim() })
    } else if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.substring(3).trim() })
    } else if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.substring(4).trim() })
    } else if (trimmed.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: trimmed.substring(2).trim() })
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.push({ type: 'ul', text: trimmed.substring(2).trim() })
    } else if (/^\d+\.\s/.test(trimmed)) {
      blocks.push({ type: 'ol', text: trimmed.replace(/^\d+\.\s/, '').trim() })
    } else {
      blocks.push({ type: 'p', text: trimmed })
    }
  }

  // Handle unclosed code block safely
  if (inCodeBlock && codeBuffer.length > 0) {
    blocks.push({
      type: 'code',
      text: codeBuffer.join('\n'),
      codeLang: codeLang || 'text',
    })
  }

  return (
    <div className="space-y-4 text-sm">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1 key={idx} className="border-b border-border/80 pb-2 text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                {renderInlineMarkdown(block.text)}
              </h1>
            )
          case 'h2':
            return (
              <h2 key={idx} className="mt-5 text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {renderInlineMarkdown(block.text)}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={idx} className="mt-3 text-sm font-semibold text-foreground/90">
                {renderInlineMarkdown(block.text)}
              </h3>
            )
          case 'blockquote':
            return (
              <blockquote key={idx} className="rounded-r-lg border-l-3 border-primary/70 bg-primary/5 p-3 italic text-muted-foreground">
                {renderInlineMarkdown(block.text)}
              </blockquote>
            )
          case 'code':
            return (
              <div key={idx} className="relative rounded-lg border border-border/80 bg-background/90 p-4 font-mono text-xs text-foreground overflow-x-auto">
                <div className="absolute right-3 top-2.5 text-[10px] font-mono uppercase text-muted-foreground">
                  {block.codeLang || 'code'}
                </div>
                <pre className="leading-relaxed whitespace-pre font-mono">{block.text}</pre>
              </div>
            )
          case 'ul':
            return (
              <div key={idx} className="ml-4 flex items-start gap-2 text-foreground/90 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                <div>{renderInlineMarkdown(block.text)}</div>
              </div>
            )
          case 'ol':
            return (
              <div key={idx} className="ml-4 flex items-start gap-2 text-foreground/90 leading-relaxed">
                <span className="font-mono text-xs font-bold text-primary">·</span>
                <div>{renderInlineMarkdown(block.text)}</div>
              </div>
            )
          default:
            return (
              <p key={idx} className="leading-relaxed text-muted-foreground text-sm">
                {renderInlineMarkdown(block.text)}
              </p>
            )
        }
      })}
    </div>
  )
}

/**
 * Inline Markdown Parser (Bold **text** and Inline `code`)
 */
function renderInlineMarkdown(text: string) {
  // Simple inline parser for **bold** and `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-xs text-primary border border-border/60">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}
