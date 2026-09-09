interface HeroBackgroundProps {
  className?: string
  /** The subtle dot-grid overlay, on by default, off for heroes that already have their own texture. */
  dotGrid?: boolean
}

/**
 * The dark aurora recipe from the homepage hero, extracted so every dark
 * marketing hero across the site shares one decorative background instead
 * of each page hand-rolling its own flat gradient. Purely decorative
 * (aria-hidden, pointer-events-none), sits behind whatever content the
 * page renders after it, no server/client boundary needed.
 */
export default function HeroBackground({ className = '', dotGrid = true }: HeroBackgroundProps) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary-dark" />
      <div className="glow-orb aurora-drift -top-24 -left-24 w-[28rem] h-[28rem] bg-accent/25" />
      <div className="glow-orb aurora-drift -bottom-32 -right-16 w-[32rem] h-[32rem] bg-primary-light/50" style={{ animationDelay: '-7s' }} />
      {dotGrid && (
        <div
          className="hidden lg:block absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
            WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 0%, transparent 65%)',
            maskImage: 'radial-gradient(circle at 50% 40%, black 0%, transparent 65%)',
          }}
        />
      )}
    </div>
  )
}
