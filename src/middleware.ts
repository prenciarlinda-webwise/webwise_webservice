import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Old WordPress patterns that should return 410 Gone (content permanently removed)
const gonePatterns = [
  /^\/category(\/|$)/,
  /^\/author(\/|$)/,
  /^\/20\d{2}(\/|$)/,
  /^\/feed(\/|$)/,
  /\/feed\/?$/,
  /^\/home(\/|$)/,
  /^\/woocommerce-placeholder(\/|$)/,
  /^\/blog\/page(\/|$)/,
]

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname
  const searchParams = url.searchParams

  // 410 Gone for old WordPress patterns
  for (const pattern of gonePatterns) {
    if (pattern.test(pathname)) {
      return new NextResponse(null, { status: 410 })
    }
  }

  // Redirect WordPress attachment URLs (?attachment_id=XXX) to homepage
  if (searchParams.has('attachment_id')) {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  // Redirect WordPress page ID URLs (?p=XXX or ?page_id=XXX) to homepage
  if (searchParams.has('p') || searchParams.has('page_id')) {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  // Redirect WordPress search URLs (?s=XXX) to homepage
  if (searchParams.has('s')) {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths that might have query parameters or need 410 handling
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|api/).*)',
  ],
}
