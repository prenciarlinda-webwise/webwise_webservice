'use client'

import { useState } from 'react'
import { Monitor, Smartphone } from 'lucide-react'

interface WebsitePreviewProps {
  url: string
  name: string
  /** Set once we've confirmed the site doesn't send a frame-blocking header.
   * A manual flag, not runtime detection. No screenshot fallback, if a site
   * isn't embeddable yet this shows a plain message instead of an image. */
  embeddable?: boolean
}

export default function WebsitePreview({ url, name, embeddable = false }: WebsitePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const hostname = new URL(url).hostname.replace(/^www\./, '')
  // Every client link carries nofollow, this page draws prospects in from our own
  // pitch, not from search, so there's no reason to pass PageRank out through it.
  const relAttr = 'nofollow noopener noreferrer'
  const frameHeight = device === 'mobile' ? 'h-[680px]' : 'h-[600px]'

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <div className="inline-flex gap-1 rounded-full bg-bg-secondary p-1">
          {(['desktop', 'mobile'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDevice(option)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                device === option ? 'bg-accent text-white' : 'text-text-muted hover:text-primary'
              }`}
            >
              {option === 'desktop' ? <Monitor size={14} /> : <Smartphone size={14} />}
              {option === 'desktop' ? 'Desktop' : 'Mobile'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className={`relative w-full ${device === 'mobile' ? 'max-w-[375px]' : 'max-w-4xl'}`}>
          {/* Corner brackets, a restrained decorative accent, not chrome */}
          <span aria-hidden="true" className="pointer-events-none absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-accent sm:-left-4 sm:-top-4 sm:h-8 sm:w-8" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-accent sm:-right-4 sm:-top-4 sm:h-8 sm:w-8" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -left-3 h-6 w-6 border-b-2 border-l-2 border-accent sm:-bottom-4 sm:-left-4 sm:h-8 sm:w-8" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-3 h-6 w-6 border-b-2 border-r-2 border-accent sm:-bottom-4 sm:-right-4 sm:h-8 sm:w-8" />

          <div className="w-full overflow-hidden rounded-2xl border border-border bg-primary shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex shrink-0 gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              </div>
              <div className="flex flex-1 justify-center">
                <a
                  href={url}
                  target="_blank"
                  rel={relAttr}
                  className="inline-flex max-w-full items-center gap-1.5 truncate rounded-md bg-white/10 px-3 py-1 text-xs text-white/60 transition-colors hover:text-white/80"
                >
                  <LockIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{hostname}</span>
                </a>
              </div>
            </div>

            {embeddable ? (
              <iframe
                src={url}
                title={`${name} website, live`}
                loading="lazy"
                className={`w-full border-0 bg-white ${frameHeight}`}
              />
            ) : (
              <div className={`flex flex-col items-center justify-center gap-4 bg-bg-secondary px-6 text-center ${frameHeight}`}>
                <p className="max-w-xs text-text-secondary">
                  This site can&apos;t be embedded here yet. Visit it directly to see it live.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel={relAttr}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
