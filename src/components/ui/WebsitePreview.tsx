'use client'

import { useState } from 'react'
import { Monitor, Smartphone, ExternalLink } from 'lucide-react'

interface WebsitePreviewProps {
  url: string
  name: string
  nofollow?: boolean
}

// Generate screenshot URL using WordPress mshots
const getScreenshot = (url: string, width = 1280, height = 960) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${width}&h=${height}`

export default function WebsitePreview({ url, name, nofollow }: WebsitePreviewProps) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')

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
            rel={nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'}
            className="p-2 text-text-muted hover:text-accent transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Preview Container */}
      <div className={`relative bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ${
        view === 'desktop' ? 'p-6 min-h-[550px] lg:min-h-[700px]' : 'p-8 min-h-[750px]'
      }`}>
        {view === 'desktop' ? (
          /* Desktop Monitor Frame */
          <div className="flex flex-col items-center w-full max-w-6xl">
            {/* Monitor Screen */}
            <div className="bg-gray-900 rounded-xl p-3 shadow-2xl w-full">
              <div className="bg-white rounded-lg overflow-hidden w-full relative" style={{ height: '600px' }}>
                <img
                  src={getScreenshot(url, 1280, 960)}
                  alt={`${name} website preview`}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                {/* Overlay with link to visit */}
                <a
                  href={url}
                  target="_blank"
                  rel={nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'}
                  className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-6 py-3 rounded-lg shadow-lg font-semibold text-primary flex items-center gap-2">
                    <ExternalLink size={18} /> Visit Website
                  </span>
                </a>
              </div>
            </div>
            {/* Monitor Stand */}
            <div className="w-24 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-sm" />
            <div className="w-48 h-3 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-xl" />
          </div>
        ) : (
          /* iPhone-style Frame */
          <div className="relative">
            {/* Phone Outer Frame */}
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-[3rem] p-3 shadow-2xl">
              {/* Phone Inner Bezel */}
              <div className="relative bg-black rounded-[2.25rem] p-1">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-800" />
                </div>

                {/* Screen */}
                <div className="relative bg-white rounded-[2rem] overflow-hidden" style={{ width: '375px', height: '812px' }}>
                  <img
                    src={getScreenshot(url, 375, 812)}
                    alt={`${name} website preview - mobile`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  {/* Overlay with link to visit */}
                  <a
                    href={url}
                    target="_blank"
                    rel={nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'}
                    className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-lg shadow-lg font-semibold text-primary text-sm flex items-center gap-2">
                      <ExternalLink size={16} /> Visit Website
                    </span>
                  </a>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
              </div>
            </div>

            {/* Side Buttons */}
            <div className="absolute -left-1 top-28 w-1 h-8 bg-gray-700 rounded-l-sm" />
            <div className="absolute -left-1 top-44 w-1 h-12 bg-gray-700 rounded-l-sm" />
            <div className="absolute -left-1 top-60 w-1 h-12 bg-gray-700 rounded-l-sm" />
            <div className="absolute -right-1 top-36 w-1 h-16 bg-gray-700 rounded-r-sm" />
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
