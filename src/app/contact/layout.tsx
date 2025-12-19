import Script from 'next/script'
import RecaptchaProvider from '@/components/providers/RecaptchaProvider'
import { generateContactPageSchema } from '@/lib/schemas'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get A Free Quote',
  description: 'Get in touch with WebWise for a free consultation about your web development and SEO needs. We respond within 24 hours.',
}

const contactSchema = generateContactPageSchema()

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <RecaptchaProvider>{children}</RecaptchaProvider>
    </>
  )
}
