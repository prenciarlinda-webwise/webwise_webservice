import { NextResponse } from 'next/server'

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  budget?: string
  message: string
  recaptchaToken: string
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('reCAPTCHA secret key not configured')
    return true // Allow form submission if reCAPTCHA not configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    return data.success && data.score >= 0.5 // Score threshold for v3
  } catch {
    console.error('reCAPTCHA verification failed')
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, phone, company, service, budget, message, recaptchaToken } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const isValid = await verifyRecaptcha(recaptchaToken)
      if (!isValid) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        )
      }
    }

    // Here you would typically:
    // 1. Send email notification
    // 2. Save to database
    // 3. Send to CRM
    // For now, we'll just log and return success

    console.log('Contact form submission:', {
      name,
      email,
      phone,
      company,
      service,
      budget,
      message,
      timestamp: new Date().toISOString(),
    })

    // TODO: Add your email sending logic here
    // Example with Resend, SendGrid, or Nodemailer

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
    })
  } catch {
    console.error('Contact form error')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
