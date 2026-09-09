'use client'

import { useState } from 'react'

interface Faq {
  question: string
  answer: string
}

/**
 * Accordion FAQ list. Expand affordance is a plain "+"/"–" text glyph, not an
 * icon, matching the site-wide no-icons rule and the same character pair the
 * mobile nav submenus use.
 */
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className="wise-card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex items-center justify-between gap-4 w-full text-left px-6 py-5"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-primary">{faq.question}</span>
              <span className="shrink-0 text-accent text-2xl font-light w-6 text-center leading-none">
                {isOpen ? '–' : '+'}
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="text-text-secondary px-6 pb-5 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
