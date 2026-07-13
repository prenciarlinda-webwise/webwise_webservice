interface DoodleProps {
  className?: string
}

/** Hand-drawn underline squiggle, decorative only. */
export function DoodleUnderline({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <path
        d="M2 9C32 3 62 13 92 7C122 1 152 11 198 6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Loose hand-drawn circle, meant to sit behind or around a short word/number. */
export function DoodleCircle({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 80"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <path
        d="M80 6C34 2 6 24 8 42C10 62 44 76 82 74C120 72 152 56 150 36C148 18 116 4 78 8C46 12 18 26 18 42"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Hand-drawn pipe run with elbow joints, decorative background flourish for trade pages. */
export function DoodlePipe({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 180"
      className={className}
      fill="none"
    >
      <path
        d="M6 30C40 26 78 34 104 31C122 29 130 40 129 58C128 82 126 100 144 104C170 110 206 100 232 106C252 111 268 122 296 120"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="129" cy="58" r="9" stroke="currentColor" strokeWidth="4" />
      <circle cx="144" cy="104" r="9" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}

/** Loose dry-brush strokes with a couple of paint drips, decorative background flourish for painter pages. */
export function DoodlePaintStroke({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 140"
      className={className}
      fill="none"
    >
      <path
        d="M20 36C60 27 100 41 150 32C185 25 215 34 255 29"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M28 56C68 49 106 60 158 52C192 47 220 54 250 50"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M16 76C52 70 88 80 130 74"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="134" cy="92" r="4" fill="currentColor" />
      <circle cx="100" cy="100" r="3" fill="currentColor" />
    </svg>
  )
}

/** Hand-drawn roofline zigzag, decorative background flourish for roofing pages. */
export function DoodleRoofline({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 140"
      className={className}
      fill="none"
    >
      <path
        d="M6 100C30 98 46 42 70 40C94 38 106 96 132 98C156 100 172 30 198 28C224 26 238 94 264 96C282 97 296 70 314 66"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Abstract notched key-cut line, decorative background flourish for locksmith pages. */
export function DoodleKeyCut({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 100"
      className={className}
      fill="none"
    >
      <path
        d="M6 54H44V32H76V64H108V28H142V58H176V40H208V54H244V24H278V54H314"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Loose website wireframe sketch, decorative background flourish for web development pages. */
export function DoodleWireframe({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 200"
      className={className}
      fill="none"
    >
      <path d="M20 24H300V176H20V24Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <path d="M20 62H300" stroke="currentColor" strokeWidth="4" />
      <circle cx="38" cy="43" r="7" stroke="currentColor" strokeWidth="4" />
      <path d="M42 98H190" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M42 122H230" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M42 146H150" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

/** Loose connected-node system diagram, decorative background flourish for web application pages. */
export function DoodleFlow({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 200"
      className={className}
      fill="none"
    >
      <path d="M47 99C80 80 105 66 133 54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M47 108C80 128 105 142 133 150" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M148 53C185 68 225 82 255 96" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M148 148C185 132 225 116 255 104" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="40" cy="103" r="8" stroke="currentColor" strokeWidth="4" />
      <circle cx="140" cy="50" r="8" stroke="currentColor" strokeWidth="4" />
      <circle cx="140" cy="152" r="8" stroke="currentColor" strokeWidth="4" />
      <circle cx="262" cy="100" r="8" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}

/** Abstract torn-edge receipt with line items, decorative background flourish for e-commerce pages. */
export function DoodleReceipt({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 210"
      className={className}
      fill="none"
    >
      <path
        d="M40 30C40 20 46 14 56 14H144C154 14 160 20 160 30V190L148 178L136 190L124 178L112 190L100 178L88 190L76 178L64 190L52 178L40 190V30Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M60 60H140" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 85H140" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 110H100" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

/** Ascending bar chart with a trend line, decorative background flourish for PPC/ads pages. */
export function DoodleTrendLine({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 160"
      className={className}
      fill="none"
    >
      <path d="M40 120V140" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M100 100V140" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M160 85V140" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M220 60V140" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M280 35V140" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path
        d="M40 118C70 108 90 100 100 98C130 90 150 84 160 82C190 70 210 62 220 58C250 45 265 38 280 33"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Hand-drawn curved arrow, used to point at a nearby CTA or badge. */
export function DoodleArrow({ className = '' }: DoodleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 90"
      className={className}
      fill="none"
    >
      <path
        d="M8 4C10 34 20 58 46 74"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M26 68L46 76L40 54"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
