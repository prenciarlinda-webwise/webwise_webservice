import Image from 'next/image'

interface ScreenshotFrameProps {
  image: string
  alt: string
  className?: string
  rotate?: number
}

/**
 * Decorative browser-chrome frame around a static site screenshot.
 * No domain/label rendered and no outbound link by design, this is for
 * ambient proof (hero collages, background texture), never a way to jump
 * straight to a client's live site. Use WebsitePreview for that.
 */
export default function ScreenshotFrame({ image, alt, className = '', rotate = 0 }: ScreenshotFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-white rounded-xl border border-border shadow-lg overflow-hidden ${className}`}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-bg-secondary border-b border-border">
        <span className="w-2 h-2 rounded-full bg-red-300" />
        <span className="w-2 h-2 rounded-full bg-yellow-300" />
        <span className="w-2 h-2 rounded-full bg-green-300" />
      </div>
      <div className="relative aspect-[4/3] bg-bg-secondary">
        <Image src={image} alt={alt} fill unoptimized className="object-cover object-top" />
      </div>
    </div>
  )
}
