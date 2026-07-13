'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ReferralForm from '@/components/forms/ReferralForm'

interface ReferralCTAProps {
  source: string
  ctaLabel: string
  buttonClassName?: string
}

export default function ReferralCTA({ source, ctaLabel, buttonClassName }: ReferralCTAProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-modal-title"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close dialog"
        className="modal-backdrop absolute inset-0 bg-primary-dark/85 backdrop-blur-md"
      />

      <div className="modal-card relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-white/30 p-8 lg:p-10">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-bg-secondary hover:bg-bg-tertiary text-text-secondary text-base transition-colors"
        >
          ✕
        </button>

        <ReferralForm source={source} />
      </div>
    </div>
  )

  return (
    <>
      <button onClick={() => setOpen(true)} className={buttonClassName}>
        {ctaLabel} →
      </button>

      {open && mounted && createPortal(modal, document.body)}
    </>
  )
}
