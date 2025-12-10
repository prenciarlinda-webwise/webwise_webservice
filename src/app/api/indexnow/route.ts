import { NextResponse } from 'next/server'

const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || ''
const SITE_URL = 'https://www.websiteandseoagency.com'

export async function POST(request: Request) {
  try {
    const { urls } = await request.json()

    if (!INDEXNOW_KEY) {
      return NextResponse.json({ error: 'IndexNow API key not configured' }, { status: 500 })
    }

    // Submit to IndexNow (Bing, Yandex, etc.)
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: 'www.websiteandseoagency.com',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    })

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'URLs submitted to IndexNow' })
    } else {
      return NextResponse.json({ error: 'Failed to submit to IndexNow' }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Generate the key file route
export async function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
