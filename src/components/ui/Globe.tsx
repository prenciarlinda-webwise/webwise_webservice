'use client'

import { useEffect, useRef } from 'react'
import createGlobe, { type Marker, type Arc } from 'cobe'

interface GlobeProps {
  className?: string
  markers?: Marker[]
  arcs?: Arc[]
  /** Normalized RGB, 0 to 1 */
  baseColor?: [number, number, number]
  markerColor?: [number, number, number]
  glowColor?: [number, number, number]
  arcColor?: [number, number, number]
  dark?: number
  diffuse?: number
  mapSamples?: number
  mapBrightness?: number
  scale?: number
  theta?: number
  minZoom?: number
  maxZoom?: number
}

/**
 * Auto-rotating WebGL globe, drag to spin, scroll or pinch to zoom. Built on
 * cobe, no other dependencies. Colors default to the site's own navy/orange/green
 * palette rather than a stock demo look.
 */
export default function Globe({
  className = '',
  markers = [],
  arcs = [],
  baseColor = [0.145, 0.153, 0.302],
  markerColor = [0.13, 0.77, 0.37],
  glowColor = [0.94, 0.58, 0.25],
  arcColor = [0.13, 0.77, 0.37],
  dark = 1,
  diffuse = 1.2,
  mapSamples = 16000,
  mapBrightness = 6,
  scale = 0.72,
  theta = 0.28,
  minZoom = 0.45,
  maxZoom = 1.9,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const zoomRef = useRef(scale)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const pinchDistanceRef = useRef<number | null>(null)

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth
    }
    window.addEventListener('resize', onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta,
      dark,
      diffuse,
      mapSamples,
      mapBrightness,
      baseColor,
      markerColor,
      glowColor,
      scale: zoomRef.current,
      markers,
      arcs,
      arcColor,
      arcWidth: 1.2,
    })

    // cobe v2 has no internal render loop, we drive it frame by frame
    let animationFrame = 0
    const animate = () => {
      if (pointerInteracting.current === null) {
        phiRef.current += 0.0035
      }
      globe.update({
        phi: phiRef.current + pointerInteractionMovement.current,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        scale: zoomRef.current,
      })
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)

    const canvas = canvasRef.current
    requestAnimationFrame(() => {
      if (canvas) canvas.style.opacity = '1'
    })

    // Scroll-to-zoom. Attached as a native, non-passive listener because
    // React 17+ delegates its onWheel prop through a passive root listener,
    // which silently ignores preventDefault, so the page would scroll
    // underneath the globe instead of zooming it.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const next = zoomRef.current - e.deltaY * 0.0015
      zoomRef.current = Math.min(maxZoom, Math.max(minZoom, next))
    }
    canvas?.addEventListener('wheel', onWheel, { passive: false })

    // Pinch-to-zoom for touch, alongside the existing single-finger drag to rotate.
    const distance = (touches: TouchList) => {
      const [a, b] = [touches[0], touches[1]]
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    }
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) pinchDistanceRef.current = distance(e.touches)
    }
    const onTouchMovePinch = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchDistanceRef.current !== null) {
        e.preventDefault()
        const next = distance(e.touches)
        const delta = (next - pinchDistanceRef.current) * 0.004
        zoomRef.current = Math.min(maxZoom, Math.max(minZoom, zoomRef.current + delta))
        pinchDistanceRef.current = next
      }
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchDistanceRef.current = null
    }
    canvas?.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas?.addEventListener('touchmove', onTouchMovePinch, { passive: false })
    canvas?.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrame)
      globe.destroy()
      window.removeEventListener('resize', onResize)
      canvas?.removeEventListener('wheel', onWheel)
      canvas?.removeEventListener('touchstart', onTouchStart)
      canvas?.removeEventListener('touchmove', onTouchMovePinch)
      canvas?.removeEventListener('touchend', onTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`relative mx-auto aspect-square w-full ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
        }}
        onPointerUp={() => {
          pointerInteracting.current = null
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          pointerInteracting.current = null
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            pointerInteractionMovement.current = e.clientX - pointerInteracting.current
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0] && e.touches.length === 1) {
            pointerInteractionMovement.current = e.touches[0].clientX - pointerInteracting.current
          }
        }}
        style={{
          // Oversized and centered past the wrapper's own edges on purpose,
          // a canvas can only ever paint within its own box, so if it were
          // sized to exactly match the wrapper, zooming in would run the
          // globe straight into that boundary and visibly clip it. This
          // gives the sphere real room to grow into before that happens.
          position: 'absolute',
          inset: '-22%',
          width: '144%',
          height: '144%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 0.8s ease',
          touchAction: 'none',
        }}
      />
      <span className="pointer-events-none absolute bottom-2 right-2 text-[11px] text-white/40 select-none">
        Drag to rotate, scroll to zoom
      </span>
    </div>
  )
}
