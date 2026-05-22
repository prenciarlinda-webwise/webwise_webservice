'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import LeadForm from '@/components/forms/LeadForm'

interface PricingCTAProps {
  source: string
  ctaLabel: string
  popular?: boolean
  defaultService?: string
  /** Extra Tailwind classes for the closed-state button */
  buttonClassName?: string
  /** Optional plan / tier name to pre-fill in the modal headline */
  planName?: string
}

export default function PricingCTA({
  source,
  ctaLabel,
  popular,
  defaultService = 'local-seo',
  buttonClassName,
  planName,
}: PricingCTAProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Portal target only available after mount (SSR safety)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll + ESC to close
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const base =
    'w-full py-3 text-center font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
  const style = buttonClassName
    ? buttonClassName
    : popular
      ? 'bg-accent text-white hover:bg-accent-dark'
      : 'bg-bg-secondary text-primary hover:bg-bg-tertiary'

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
    >
      {/* Backdrop — click to close */}
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close dialog"
        className="modal-backdrop absolute inset-0 bg-primary-dark/85 backdrop-blur-md"
      />

      {/* Modal card */}
      <div className="modal-card relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-white/30 p-8 lg:p-10">
        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-bg-secondary hover:bg-bg-tertiary text-text-secondary text-base transition-colors"
        >
          ✕
        </button>

        {/* Plan badge */}
        {planName && (
          <div className="inline-block font-mono text-[10px] uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded mb-4">
            {planName} plan
          </div>
        )}

        <LeadForm
          source={source}
          heading={planName ? `Start a ${planName} project` : 'Get a custom quote'}
          subheading="Tell us about your project. We will reply with a fixed quote and timeline within 24 hours."
          ctaLabel="Send My Request"
          defaultService={defaultService}
        />
      </div>
    </div>
  )

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${base} ${style}`}>
        {ctaLabel} →
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  )
}
