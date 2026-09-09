'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
}

/**
 * Glass-carousel-style 3D tilt. The card leans toward the cursor with a
 * spring, plus a soft light sheen that tracks the pointer, standing in for
 * the "3D glass" carousel look without pulling in a Three.js dependency.
 * Reserved for the case-studies wall, this is one of the homepage's few
 * deliberately "moving" moments, not a pattern to spread everywhere.
 */
export default function TiltCard({ children, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(y, [0, 1], [9, -9]), { stiffness: 220, damping: 20 })
  const rotateY = useSpring(useTransform(x, [0, 1], [-9, 9]), { stiffness: 220, damping: 20 })
  const sheenX = useTransform(x, (v) => `${v * 100}%`)
  const sheenY = useTransform(y, (v) => `${v * 100}%`)
  const sheenBackground = useTransform(
    [sheenX, sheenY],
    ([sx, sy]) => `radial-gradient(circle at ${sx} ${sy}, rgba(255,255,255,0.35), transparent 55%)`
  )

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return
    x.set((e.clientX - bounds.left) / bounds.width)
    y.set((e.clientY - bounds.top) / bounds.height)
  }

  const reset = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: sheenBackground }}
      />
    </motion.div>
  )
}
