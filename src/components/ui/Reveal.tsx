'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger this element's reveal, in milliseconds. */
  delay?: number
}

/**
 * Fades + rises an element into place the first time it enters the viewport.
 * Plain IntersectionObserver, no animation library, respects prefers-reduced-motion
 * via the `.reveal` CSS itself (see globals.css).
 */
export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.transitionDelay = delay ? `${delay}ms` : ''
          node.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
