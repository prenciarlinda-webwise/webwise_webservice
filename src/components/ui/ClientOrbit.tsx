'use client'

interface ClientOrbitProps {
  count?: number
  radius?: number
  tilt?: number
  className?: string
}

/**
 * Purely decorative, low-opacity background texture, a tilted ring of glass
 * "coins" slowly spinning behind a section's real content. Standing in for
 * the lightswind 3D glass coin carousel without a WebGL dependency. No
 * labels, no links, nothing to read, it's ambient motion, not a feature, so
 * it's plain aria-hidden with no accessible fallback needed, same treatment
 * as the glow-orb decorations elsewhere on the page.
 *
 * Pure CSS 3D transforms, the classic billboard-carousel technique: each
 * coin gets an equal and opposite rotateY animation to the ring itself, so
 * the two cancel out and every coin stays upright while its position still
 * sweeps around the tilted ellipse.
 */
export default function ClientOrbit({ count = 10, radius = 260, tilt = 58, className = '' }: ClientOrbitProps) {
  const items = Array.from({ length: count })

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      style={{ perspective: '1300px' }}
    >
      <div
        className="relative"
        style={{ width: radius * 2, height: radius * 2, transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg)` }}
      >
        <div className="orbit-ring-spin absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((_, i) => {
            const angle = (360 / count) * i
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                <div className="orbit-counter-spin" style={{ transformStyle: 'preserve-3d' }}>
                  <div style={{ transform: `rotateY(${-angle}deg) rotateX(${-tilt}deg)` }}>
                    <span className="block w-14 h-14 rounded-full border border-white/20 bg-gradient-to-br from-white/25 to-transparent" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
