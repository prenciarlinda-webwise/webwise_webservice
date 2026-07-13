'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

const FORMSPREE = 'https://formspree.io/f/xqejanba'
const RECAPTCHA_V2_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || '6LfVr_csAAAAADPeG_7F4GqzmFutEY0W2iOLyzdP'

declare global {
  interface Window {
    grecaptcha?: {
      getResponse: (widgetId?: number) => string
      reset: (widgetId?: number) => void
      render: (container: HTMLElement, params: { sitekey: string }) => number
    }
  }
}

type ReferralData = {
  referrerName: string
  referrerContact: string
  referredBusiness: string
  referredContact: string
  serviceNeeded: string
  notes: string
}

const EMPTY: ReferralData = {
  referrerName: '',
  referrerContact: '',
  referredBusiness: '',
  referredContact: '',
  serviceNeeded: '',
  notes: '',
}

const field = 'w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

export default function ReferralForm({ source }: { source: string }) {
  const [data, setData] = useState<ReferralData>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const captchaContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (document.querySelector('script[src*="recaptcha/api.js"]')) return
    const s = document.createElement('script')
    s.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    s.async = true
    s.defer = true
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    let cancelled = false
    const tryRender = () => {
      if (cancelled || widgetIdRef.current !== null || !captchaContainerRef.current) return
      if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
        setTimeout(tryRender, 150)
        return
      }
      widgetIdRef.current = window.grecaptcha.render(captchaContainerRef.current, {
        sitekey: RECAPTCHA_V2_SITE_KEY,
      })
    }
    tryRender()
    return () => {
      cancelled = true
    }
  }, [])

  const set = (k: keyof ReferralData, v: string) => setData(p => ({ ...p, [k]: v }))

  const formOK =
    data.referrerName.trim() !== '' &&
    data.referrerContact.trim() !== '' &&
    data.referredBusiness.trim() !== '' &&
    data.referredContact.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formOK) return

    const wid = widgetIdRef.current ?? undefined
    const recaptchaToken = window.grecaptcha?.getResponse(wid) || ''
    if (!recaptchaToken) {
      setErrorMsg('Please confirm you are not a robot.')
      setStatus('error')
      return
    }

    setStatus('submitting'); setErrorMsg('')
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        redirect: 'manual',
        body: JSON.stringify({
          _formType: 'Referral submission',
          'Referred by (name)': data.referrerName,
          'Referrer contact (for payout)': data.referrerContact,
          'Business being referred': data.referredBusiness,
          'Referred business contact': data.referredContact,
          'Service they need': data.serviceNeeded,
          Notes: data.notes,
          'g-recaptcha-response': recaptchaToken,
          _source: source,
          _pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      const isRedirect = res.type === 'opaqueredirect'
      const json: Record<string, unknown> = isRedirect ? {} : await res.json().catch(() => ({}))
      const succeeded = isRedirect || res.ok || json.ok === true || typeof json.next === 'string'

      if (succeeded) {
        setStatus('success')
        return
      }

      if (widgetIdRef.current !== null) window.grecaptcha?.reset(widgetIdRef.current)
      const errors = Array.isArray(json.errors) ? (json.errors as Array<{ message?: string }>) : null
      const message =
        (errors && errors.map(e => e.message).filter(Boolean).join(', ')) ||
        (typeof json.error === 'string' ? json.error : null) ||
        'Something went wrong. Please try again.'
      setErrorMsg(message)
      setStatus('error')
    } catch {
      if (widgetIdRef.current !== null) window.grecaptcha?.reset(widgetIdRef.current)
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="text-green-600" size={22} />
        </div>
        <p className="font-semibold text-primary mb-1">Referral received.</p>
        <p className="text-sm text-text-secondary">
          We have your name on file against this referral so we can pay you once it converts. We will reach out to {data.referredBusiness || 'the business'} directly.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-primary mb-1">Refer a business</h3>
        <p className="text-sm text-text-secondary">
          Tell us who you are and who you are referring. We log every referral against your name so you get paid when it closes.
        </p>
      </div>

      {status === 'error' && (
        <p className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errorMsg}</p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <div className="p-3 bg-bg-secondary rounded-lg border border-border">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-3">Your details (so we can pay you)</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Your name *</label>
              <input type="text" required value={data.referrerName}
                onChange={e => set('referrerName', e.target.value)} placeholder="Jane Smith" className={field} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Your email or phone *</label>
              <input type="text" required value={data.referrerContact}
                onChange={e => set('referrerContact', e.target.value)} placeholder="jane@email.com or +1 555 123 4567" className={field} />
            </div>
          </div>
        </div>

        <div className="p-3 bg-bg-secondary rounded-lg border border-border">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-3">Who you are referring</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Business name *</label>
              <input type="text" required value={data.referredBusiness}
                onChange={e => set('referredBusiness', e.target.value)} placeholder="e.g. Smith Plumbing" className={field} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Their contact (email, phone, or name) *</label>
              <input type="text" required value={data.referredContact}
                onChange={e => set('referredContact', e.target.value)} placeholder="Owner's name, email, or phone" className={field} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">What do they need</label>
              <select value={data.serviceNeeded} onChange={e => set('serviceNeeded', e.target.value)} className={`${field} bg-white`}>
                <option value="">Not sure, let us find out</option>
                <option value="local-seo">Local SEO</option>
                <option value="website">A new website</option>
                <option value="both">Website and SEO</option>
                <option value="other">Something else</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Anything else we should know</label>
          <textarea rows={2} value={data.notes} onChange={e => set('notes', e.target.value)}
            placeholder="Optional" className={`${field} resize-none`} />
        </div>

        <div ref={captchaContainerRef} className="pt-1" />

        <button type="submit" disabled={!formOK || status === 'submitting'}
          className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {status === 'submitting' ? 'Sending…' : 'Submit Referral'}
          {status !== 'submitting' && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  )
}
