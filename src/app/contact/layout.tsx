import RecaptchaProvider from '@/components/providers/RecaptchaProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get A Free Quote',
  description: 'Get in touch with WebWise for a free consultation about your web development and SEO needs. We respond within 24 hours.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RecaptchaProvider>{children}</RecaptchaProvider>
}
