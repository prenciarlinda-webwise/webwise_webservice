import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const searchParams = url.searchParams

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
    // Match all paths that might have query parameters
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|api/).*)',
  ],
}