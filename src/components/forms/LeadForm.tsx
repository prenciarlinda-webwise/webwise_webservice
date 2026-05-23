'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

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

const SERVICES = [
  { id: 'ai-search-optimization', label: 'AI Search Optimization (AEO / GEO)' },
  { id: 'local-seo',         label: 'Local SEO' },
  { id: 'technical-seo',     label: 'Technical SEO' },
  { id: 'ecommerce-seo',     label: 'E-commerce SEO' },
  { id: 'international-seo', label: 'International SEO' },
  { id: 'website-dev',       label: 'Website Design & Development' },
  { id: 'ecommerce-store',   label: 'E-commerce Store' },
  { id: 'web-app',           label: 'Web Application' },
  { id: 'digital-marketing', label: 'Digital Marketing (PPC / Social / Content)' },
] as const

type ServiceId = typeof SERVICES[number]['id']

type FormData = {
  firstName: string; lastName: string; email: string
  service: ServiceId | ''
  // shared
  websiteUrl: string
  // local-seo
  hasWebsite: string; city: string; seoBudget: string
  // technical-seo
  mainConcern: string
  // ecommerce-seo
  ecPlatform: string; ecProductCount: string
  // international-seo
  targetRegions: string
  // website-dev
  devProjectType: string; devIndustry: string; devFeatures: string[]
  // ecommerce-store
  storeProjectType: string; storePlatform: string; storeProductCount: string; storeIndustry: string
  // web-app
  appDescription: string; appIndustry: string; hasDesigns: string
  // digital-marketing
  dmType: string; dmBudget: string
}

const EMPTY: FormData = {
  firstName: '', lastName: '', email: '', service: '',
  websiteUrl: '', hasWebsite: '', city: '', seoBudget: '',
  mainConcern: '', ecPlatform: '', ecProductCount: '', targetRegions: '',
  devProjectType: '', devIndustry: '', devFeatures: [],
  storeProjectType: '', storePlatform: '', storeProductCount: '', storeIndustry: '',
  appDescription: '', appIndustry: '', hasDesigns: '',
  dmType: '', dmBudget: '',
}

interface LeadFormProps {
  heading?: string
  subheading?: string
  ctaLabel?: string
  source: string
  defaultService?: string
  // legacy — no longer functional
  variant?: 'audit' | 'contact'
}

const field = 'w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

export default function LeadForm({
  heading,
  subheading,
  ctaLabel = 'Send My Request',
  source,
  defaultService,
}: LeadFormProps) {
  const validIds = SERVICES.map(s => s.id) as string[]
  const preselected = defaultService && validIds.includes(defaultService) ? defaultService as ServiceId : ''

  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>({ ...EMPTY, service: preselected })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const captchaContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  // Inject Google reCAPTCHA v2 script once per page
  useEffect(() => {
    if (document.querySelector('script[src*="recaptcha/api.js"]')) return
    const s = document.createElement('script')
    s.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    s.async = true
    s.defer = true
    document.head.appendChild(s)
  }, [])

  // Explicit render of the v2 widget once step 2 mounts and grecaptcha is loaded
  useEffect(() => {
    if (step !== 2) return
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
  }, [step])

  const set = (k: keyof FormData, v: string) => setData(p => ({ ...p, [k]: v }))
  const toggle = (f: string) =>
    setData(p => ({
      ...p,
      devFeatures: p.devFeatures.includes(f) ? p.devFeatures.filter(x => x !== f) : [...p.devFeatures, f],
    }))

  const step1OK = data.firstName.trim() !== '' && data.email.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.service) return

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
        body: JSON.stringify({
          ...data,
          devFeatures: data.devFeatures.join(', '),
          'g-recaptcha-response': recaptchaToken,
          _source: source,
          _pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (json.next) { window.location.href = json.next; return }
      if (res.ok) { setStatus('success'); return }
      if (widgetIdRef.current !== null) window.grecaptcha?.reset(widgetIdRef.current)
      setErrorMsg(json?.error || 'Something went wrong. Please try again.')
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
        <p className="font-semibold text-primary mb-1">Request sent!</p>
        <p className="text-sm text-text-secondary">We&apos;ll get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <div>
      {(heading || subheading) && (
        <div className="mb-5">
          {heading && <h3 className="text-lg font-bold text-primary mb-1">{heading}</h3>}
          {subheading && <p className="text-sm text-text-secondary">{subheading}</p>}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-accent' : 'bg-bg-tertiary'}`} />
        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-accent' : 'bg-bg-tertiary'}`} />
        <span className="text-xs text-text-muted flex-shrink-0">Step {step} of 2</span>
      </div>

      {status === 'error' && (
        <p className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errorMsg}</p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">First name *</label>
                <input type="text" required autoComplete="given-name" value={data.firstName}
                  onChange={e => set('firstName', e.target.value)} placeholder="John" className={field} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Last name</label>
                <input type="text" autoComplete="family-name" value={data.lastName}
                  onChange={e => set('lastName', e.target.value)} placeholder="Doe" className={field} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email address *</label>
              <input type="email" required autoComplete="email" value={data.email}
                onChange={e => set('email', e.target.value)} placeholder="you@company.com" className={field} />
            </div>
            <button type="button" disabled={!step1OK} onClick={() => setStep(2)}
              className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Service select */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Service needed *</label>
              <select value={data.service} onChange={e => set('service', e.target.value as ServiceId)}
                className={`${field} bg-white`}>
                <option value="">Select a service…</option>
                <optgroup label="SEO">
                  {SERVICES.slice(0, 4).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </optgroup>
                <optgroup label="Web Development">
                  {SERVICES.slice(4, 7).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </optgroup>
                <optgroup label="Marketing">
                  {SERVICES.slice(7).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </optgroup>
              </select>
            </div>

            {/* ── Local SEO ── */}
            {data.service === 'local-seo' && (<>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Do you have an existing website?</label>
                <div className="flex gap-2">
                  {[{v:'yes',l:'Yes'},{v:'no',l:'No'}].map(o => (
                    <button key={o.v} type="button" onClick={() => set('hasWebsite', o.v)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${data.hasWebsite===o.v?'border-accent bg-accent text-white':'border-border text-text-secondary hover:border-accent/50'}`}>
                      {o.l}</button>
                  ))}
                </div>
              </div>
              {data.hasWebsite === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Website URL</label>
                  <input type="url" value={data.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
                    placeholder="https://yourbusiness.com" className={field} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Your city / region</label>
                <input type="text" value={data.city} onChange={e => set('city', e.target.value)}
                  placeholder="e.g. London, Miami, New York" className={field} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Monthly budget</label>
                <select value={data.seoBudget} onChange={e => set('seoBudget', e.target.value)} className={`${field} bg-white`}>
                  <option value="">Select range</option>
                  <option value="under-500">Under €500/mo</option>
                  <option value="500-1000">€500 – €1,000/mo</option>
                  <option value="1000-2000">€1,000 – €2,000/mo</option>
                  <option value="2000+">€2,000+/mo</option>
                </select>
              </div>
            </>)}

            {/* ── Technical SEO ── */}
            {data.service === 'technical-seo' && (<>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Website URL *</label>
                <input type="url" required value={data.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
                  placeholder="https://yourbusiness.com" className={field} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Main concern</label>
                <select value={data.mainConcern} onChange={e => set('mainConcern', e.target.value)} className={`${field} bg-white`}>
                  <option value="">Select your main issue</option>
                  <option value="page-speed">Page speed / Core Web Vitals</option>
                  <option value="crawl">Crawl errors / Indexation</option>
                  <option value="structured-data">Structured data / Schema markup</option>
                  <option value="mobile">Mobile usability</option>
                  <option value="ranking-drop">Ranking drop / Manual penalty</option>
                  <option value="full-audit">Not sure — I need a full audit</option>
                </select>
              </div>
            </>)}

            {/* ── E-commerce SEO ── */}
            {data.service === 'ecommerce-seo' && (<>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Store URL *</label>
                <input type="url" required value={data.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
                  placeholder="https://yourstore.com" className={field} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Platform</label>
                  <select value={data.ecPlatform} onChange={e => set('ecPlatform', e.target.value)} className={`${field} bg-white`}>
                    <option value="">Select</option>
                    <option>Shopify</option><option>WooCommerce</option>
                    <option>Magento</option><option>BigCommerce</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">No. of products</label>
                  <select value={data.ecProductCount} onChange={e => set('ecProductCount', e.target.value)} className={`${field} bg-white`}>
                    <option value="">Select</option>
                    <option value="under-100">Under 100</option>
                    <option value="100-1000">100 – 1,000</option>
                    <option value="1000-10000">1,000 – 10,000</option>
                    <option value="10000+">10,000+</option>
                  </select>
                </div>
              </div>
            </>)}

            {/* ── International SEO ── */}
            {data.service === 'international-seo' && (<>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Website URL *</label>
                <input type="url" required value={data.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
                  placeholder="https://yourbusiness.com" className={field} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Target countries / regions</label>
                <input type="text" value={data.targetRegions} onChange={e => set('targetRegions', e.target.value)}
                  placeholder="e.g. UK, USA, Germany, France" className={field} />
              </div>
            </>)}

            {/* ── Website Design ── */}
            {data.service === 'website-dev' && (<>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">New website or update an existing one?</label>
                <div className="flex gap-2">
                  {[{v:'new',l:'New website'},{v:'redesign',l:'Redesign'}].map(o => (
                    <button key={o.v} type="button" onClick={() => set('devProjectType', o.v)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${data.devProjectType===o.v?'border-accent bg-accent text-white':'border-border text-text-secondary hover:border-accent/50'}`}>
                      {o.l}</button>
                  ))}
                </div>
              </div>
              {data.devProjectType === 'redesign' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Current website URL</label>
                  <input type="url" value={data.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
                    placeholder="https://yourcurrentsite.com" className={field} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Industry / niche</label>
                <input type="text" value={data.devIndustry} onChange={e => set('devIndustry', e.target.value)}
                  placeholder="e.g. Plumber, Roofing, Law Firm, Restaurant" className={field} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Features needed <span className="text-text-muted font-normal">(select all that apply)</span></label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Landing page','Blog / Content','Online booking','Contact form','Portfolio','Multi-location','SEO setup','Custom integrations'].map(f => (
                    <button key={f} type="button" onClick={() => toggle(f)}
                      className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors text-left ${data.devFeatures.includes(f)?'border-accent bg-accent/10 text-accent':'border-border text-text-secondary hover:border-accent/50'}`}>
                      {data.devFeatures.includes(f) && <Check size={10} className="flex-shrink-0" />}
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </>)}

            {/* ── E-commerce Store ── */}
            {data.service === 'ecommerce-store' && (<>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">New store or migration / redesign?</label>
                <div className="flex gap-2">
                  {[{v:'new',l:'New store'},{v:'migration',l:'Migration'}].map(o => (
                    <button key={o.v} type="button" onClick={() => set('storeProjectType', o.v)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${data.storeProjectType===o.v?'border-accent bg-accent text-white':'border-border text-text-secondary hover:border-accent/50'}`}>
                      {o.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Platform preference</label>
                <select value={data.storePlatform} onChange={e => set('storePlatform', e.target.value)} className={`${field} bg-white`}>
                  <option value="">Select</option>
                  <option>Shopify</option><option>WooCommerce</option>
                  <option value="custom">Custom (Next.js)</option><option value="no-preference">No preference</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Approx. products</label>
                  <select value={data.storeProductCount} onChange={e => set('storeProductCount', e.target.value)} className={`${field} bg-white`}>
                    <option value="">Select</option>
                    <option value="under-50">Under 50</option>
                    <option value="50-500">50 – 500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Industry / niche</label>
                  <input type="text" value={data.storeIndustry} onChange={e => set('storeIndustry', e.target.value)}
                    placeholder="e.g. Fashion, Tools" className={field} />
                </div>
              </div>
            </>)}

            {/* ── Web Application ── */}
            {data.service === 'web-app' && (<>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Brief description</label>
                <textarea rows={3} value={data.appDescription} onChange={e => set('appDescription', e.target.value)}
                  placeholder="e.g. A booking platform for my cleaning business — clients log in, pick slots, and pay online."
                  className={`${field} resize-none`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Industry</label>
                <input type="text" value={data.appIndustry} onChange={e => set('appIndustry', e.target.value)}
                  placeholder="e.g. Healthcare, Education, SaaS, Marketplace" className={field} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Existing designs / wireframes?</label>
                <div className="flex gap-2">
                  {[{v:'yes',l:'Yes'},{v:'no',l:'Not yet'}].map(o => (
                    <button key={o.v} type="button" onClick={() => set('hasDesigns', o.v)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${data.hasDesigns===o.v?'border-accent bg-accent text-white':'border-border text-text-secondary hover:border-accent/50'}`}>
                      {o.l}</button>
                  ))}
                </div>
              </div>
            </>)}

            {/* ── Digital Marketing ── */}
            {data.service === 'digital-marketing' && (<>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">What do you need?</label>
                <select value={data.dmType} onChange={e => set('dmType', e.target.value)} className={`${field} bg-white`}>
                  <option value="">Select</option>
                  <option value="ppc">PPC / Google Ads</option>
                  <option value="social">Social media management</option>
                  <option value="content">Content marketing</option>
                  <option value="full">Full digital marketing package</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Website URL</label>
                <input type="url" value={data.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
                  placeholder="https://yourbusiness.com" className={field} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Monthly budget</label>
                <select value={data.dmBudget} onChange={e => set('dmBudget', e.target.value)} className={`${field} bg-white`}>
                  <option value="">Select range</option>
                  <option value="under-1000">Under €1,000/mo</option>
                  <option value="1000-3000">€1,000 – €3,000/mo</option>
                  <option value="3000+">€3,000+/mo</option>
                </select>
              </div>
            </>)}

            <div ref={captchaContainerRef} className="pt-1" />

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-border rounded-lg text-sm text-text-secondary hover:border-accent/50 hover:text-accent transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <button type="submit" disabled={!data.service || status === 'submitting'}
                className="flex-1 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {status === 'submitting' ? 'Sending…' : ctaLabel}
                {status !== 'submitting' && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
