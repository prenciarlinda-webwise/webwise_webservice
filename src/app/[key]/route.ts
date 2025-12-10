import { NextResponse } from 'next/server'

const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || ''

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  // Check if this is the IndexNow key file request
  if (key === `${INDEXNOW_KEY}.txt` && INDEXNOW_KEY) {
    return new NextResponse(INDEXNOW_KEY, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
