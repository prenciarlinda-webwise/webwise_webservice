'use client'

import { useState } from 'react'
import { Flame, AlertTriangle, CheckCircle, Loader2, ArrowRight, Zap, Smartphone, Shield, Clock, Search, XCircle } from 'lucide-react'
import Link from 'next/link'

interface RoastResult {
  score: number
  performance: number
  mobile: number
  seo: number
  ssl: boolean
  loadTime: number
  issues: {
    type: string
    severity: 'critical' | 'warning' | 'good'
    roast: string
    detail: string
  }[]
}

const loadingMessages = [
  "Warming up the roast pit...",
  "Gathering ammunition...",
  "Preparing brutal honesty...",
  "Analyzing your digital presence...",
  "Finding all the skeletons...",
  "Sharpening our wit...",
  "This might hurt a little...",
]

const getRoastEmoji = (score: number) => {
  if (score >= 90) return '🏆'
  if (score >= 70) return '👍'
  if (score >= 50) return '😬'
  if (score >= 30) return '💀'
  return '🪦'
}

const getRoastVerdict = (score: number) => {
  if (score >= 90) return { title: "Actually... Not Bad!", subtitle: "We're impressed. Your site is doing great." }
  if (score >= 70) return { title: "Room for Improvement", subtitle: "You're close, but leaving money on the table." }
  if (score >= 50) return { title: "Houston, We Have Problems", subtitle: "Your competitors are definitely beating you." }
  if (score >= 30) return { title: "This Needs CPR", subtitle: "Your website is on life support." }
  return { title: "RIP Your Online Presence", subtitle: "We're genuinely concerned for your business." }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-500 bg-red-50'
    case 'warning': return 'text-yellow-600 bg-yellow-50'
    case 'good': return 'text-green-500 bg-green-50'
    default: return 'text-gray-500 bg-gray-50'
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical': return <XCircle size={20} />
    case 'warning': return <AlertTriangle size={20} />
    case 'good': return <CheckCircle size={20} />
    default: return <AlertTriangle size={20} />
  }
}

export default function WebsiteRoast() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [result, setResult] = useState<RoastResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)

    // Validate URL
    let cleanUrl = url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl
    }

    try {
      new URL(cleanUrl)
    } catch {
      setError('Please enter a valid website URL')
      return
    }

    setLoading(true)

    // Cycle through loading messages
    let messageIndex = 0
    setLoadingMessage(loadingMessages[0])
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length
      setLoadingMessage(loadingMessages[messageIndex])
    }, 2000)

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze website')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again!')
    } finally {
      clearInterval(messageInterval)
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-6 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full text-orange-600 text-sm font-medium mb-4">
              <Flame size={16} className="animate-pulse" />
              Free Website Roast
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-4">
              Is Your Website Costing You Customers?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Enter your URL below for a brutally honest analysis. No sugar-coating, just the truth your competitors hope you never discover.
            </p>
          </div>

          {/* Input Form */}
          {!result && (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter your website URL..."
                    className="w-full px-6 py-4 rounded-xl bg-bg-secondary border border-border text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Roasting...
                    </>
                  ) : (
                    <>
                      <Flame size={20} />
                      Roast My Site
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-4 text-red-400 text-center">{error}</p>
              )}
            </form>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-50 rounded-full border border-orange-200">
                <Loader2 size={24} className="animate-spin text-orange-500" />
                <span className="text-text-secondary text-lg">{loadingMessage}</span>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Score Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-center">
                <div className="text-6xl mb-4">{getRoastEmoji(result.score)}</div>
                <div className="text-8xl font-black text-white mb-2">{result.score}</div>
                <div className="text-white/60 text-lg mb-4">out of 100</div>
                <h3 className="text-2xl font-bold text-white">{getRoastVerdict(result.score).title}</h3>
                <p className="text-white/70">{getRoastVerdict(result.score).subtitle}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-bg-secondary">
                <div className="text-center p-4 bg-white rounded-xl">
                  <Zap size={24} className={`mx-auto mb-2 ${result.performance >= 70 ? 'text-green-500' : result.performance >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
                  <div className="text-2xl font-bold text-primary">{result.performance}</div>
                  <div className="text-sm text-text-muted">Speed</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl">
                  <Smartphone size={24} className={`mx-auto mb-2 ${result.mobile >= 70 ? 'text-green-500' : result.mobile >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
                  <div className="text-2xl font-bold text-primary">{result.mobile}</div>
                  <div className="text-sm text-text-muted">Mobile</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl">
                  <Search size={24} className={`mx-auto mb-2 ${result.seo >= 70 ? 'text-green-500' : result.seo >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
                  <div className="text-2xl font-bold text-primary">{result.seo}</div>
                  <div className="text-sm text-text-muted">SEO</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl">
                  <Shield size={24} className={`mx-auto mb-2 ${result.ssl ? 'text-green-500' : 'text-red-500'}`} />
                  <div className="text-2xl font-bold text-primary">{result.ssl ? 'Yes' : 'No'}</div>
                  <div className="text-sm text-text-muted">SSL</div>
                </div>
              </div>

              {/* Issues List */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Flame size={20} className="text-orange-500" />
                  The Roast
                </h4>
                <div className="space-y-4">
                  {result.issues.map((issue, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-4 ${issue.severity === 'critical' ? 'border-red-500 bg-red-50' : issue.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${getSeverityColor(issue.severity).split(' ')[0]}`}>
                          {getSeverityIcon(issue.severity)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-primary mb-1">{issue.roast}</p>
                          <p className="text-sm text-text-secondary">{issue.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="p-6 bg-gradient-to-r from-accent to-accent-dark text-center">
                <h4 className="text-xl font-bold text-white mb-2">Had Enough Roasting?</h4>
                <p className="text-white/80 mb-4">Let us fix these issues and turn your website into a lead-generating machine.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-bold rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Get Your Free Fix-It Plan
                    <ArrowRight size={18} />
                  </Link>
                  <button
                    onClick={() => {
                      setResult(null)
                      setUrl('')
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Roast Another Site
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}