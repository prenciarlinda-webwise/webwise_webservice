'use client'

import { useState, useCallback } from 'react'
import { Monitor, Smartphone, ExternalLink, Globe } from 'lucide-react'

interface WebsitePreviewProps {
  url: string
  name: string
  nofollow?: boolean
}

export default function WebsitePreview({ url, name, nofollow }: WebsitePreviewProps) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')
  const [iframeError, setIframeError] = useState(false)
  const relAttr = nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'

  const handleIframeLoad = useCallback((e: React.SyntheticEvent<HTMLIFrameElement>) => {
    // Check if iframe loaded empty (blocked by X-Frame-Options)
    try {
      const iframe = e.currentTarget
      // If we can't access contentDocument due to CORS, that's expected and fine
      // The iframe loaded successfully
      if (iframe.contentDocument?.title === '') {
        setIframeError(true)
      }
    } catch {
      // CORS error means iframe loaded a cross-origin page — that's fine
    }
  }, [])

  const fallback = (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Globe className="w-8 h-8 text-primary" />
      </div>
      <p className="text-primary font-semibold text-lg mb-1">{name}</p>
      <p className="text-text-muted text-sm mb-4">Live preview unavailable for this site</p>
      <a
        href={url}
        target="_blank"
        rel={relAttr}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm"
      >
        <ExternalLink size={16} /> Visit Website
      </a>
    </div>
  )

  const renderIframe = (width: number, height: number) => (
    <iframe
      src={url}
      title={`${name} website preview${view === 'mobile' ? ' - mobile' : ''}`}
      className="absolute top-0 left-0 border-0 pointer-events-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: 'scale(var(--preview-scale))',
        transformOrigin: 'top left',
      }}
      loading="lazy"
      sandbox="allow-scripts allow-same-origin"
      onLoad={handleIframeLoad}
      onError={() => setIframeError(true)}
      ref={(el) => {
        if (el) {
          const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
              const containerWidth = entry.contentRect.width
              el.style.setProperty('--preview-scale', String(containerWidth / width))
            }
          })
          observer.observe(el.parentElement!)
        }
      }}
    />
  )

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-sm text-text-muted ml-2 hidden sm:inline">{name}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-bg-tertiary rounded-lg p-1">
            <button
              onClick={() => setView('desktop')}
              className={`p-2 rounded-md transition-colors ${
                view === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-primary'
              }`}
              title="Desktop view"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setView('mobile')}
              className={`p-2 rounded-md transition-colors ${
                view === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-primary'
              }`}
              title="Mobile view"
            >
              <Smartphone size={16} />
            </button>
          </div>

          {/* External Link */}
          <a
            href={url}
            target="_blank"
            rel={relAttr}
            className="p-2 text-text-muted hover:text-accent transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Preview Container */}
      <div className={`relative bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ${
        view === 'desktop' ? 'p-4 sm:p-6' : 'p-4 sm:p-8'
      }`}>
        {view === 'desktop' ? (
          /* Desktop Monitor Frame */
          <div className="flex flex-col items-center w-full max-w-6xl">
            {/* Monitor Screen */}
            <div className="bg-gray-900 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-2xl w-full">
              <div className="bg-white rounded-md sm:rounded-lg overflow-hidden w-full relative aspect-[16/10]">
                {iframeError ? fallback : renderIframe(1280, 800)}
                {/* Clickable overlay */}
                {!iframeError && (
                  <a
                    href={url}
                    target="_blank"
                    rel={relAttr}
                    className="absolute inset-0 z-10 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg font-semibold text-primary text-sm sm:text-base flex items-center gap-2">
                      <ExternalLink size={18} /> Visit Website
                    </span>
                  </a>
                )}
              </div>
            </div>
            {/* Monitor Stand */}
            <div className="w-16 sm:w-24 h-6 sm:h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-sm" />
            <div className="w-32 sm:w-48 h-2 sm:h-3 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-xl" />
          </div>
        ) : (
          /* iPhone-style Frame */
          <div className="relative w-full max-w-[280px] sm:max-w-[400px]">
            {/* Phone Outer Frame */}
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-[2rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl">
              {/* Phone Inner Bezel */}
              <div className="relative bg-black rounded-[1.5rem] sm:rounded-[2.25rem] p-0.5 sm:p-1">
                {/* Dynamic Island */}
                <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-5 sm:h-7 bg-black rounded-full z-20 flex items-center justify-center">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-gray-900 border border-gray-800" />
                </div>

                {/* Screen */}
                <div className="relative bg-white rounded-[1.25rem] sm:rounded-[2rem] overflow-hidden aspect-[375/812]">
                  {iframeError ? fallback : renderIframe(375, 812)}
                  {/* Clickable overlay */}
                  {!iframeError && (
                    <a
                      href={url}
                      target="_blank"
                      rel={relAttr}
                      className="absolute inset-0 z-10 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-lg shadow-lg font-semibold text-primary text-sm flex items-center gap-2">
                        <ExternalLink size={16} /> Visit Website
                      </span>
                    </a>
                  )}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-gray-600 rounded-full" />
              </div>
            </div>

            {/* Side Buttons */}
            <div className="absolute -left-0.5 sm:-left-1 top-[15%] w-0.5 sm:w-1 h-6 sm:h-8 bg-gray-700 rounded-l-sm" />
            <div className="absolute -left-0.5 sm:-left-1 top-[25%] w-0.5 sm:w-1 h-10 sm:h-12 bg-gray-700 rounded-l-sm" />
            <div className="absolute -left-0.5 sm:-left-1 top-[37%] w-0.5 sm:w-1 h-10 sm:h-12 bg-gray-700 rounded-l-sm" />
            <div className="absolute -right-0.5 sm:-right-1 top-[22%] w-0.5 sm:w-1 h-12 sm:h-16 bg-gray-700 rounded-r-sm" />
          </div>
        )}
      </div>

      {/* URL Bar */}
      <div className="px-4 py-3 border-t border-border bg-bg-secondary">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-border shadow-sm max-w-xl mx-auto">
          <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm text-text-secondary truncate">{url}</span>
        </div>
      </div>
    </div>
  )
}
