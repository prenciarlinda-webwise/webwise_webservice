import Script from 'next/script'
import RecaptchaProvider from '@/components/providers/RecaptchaProvider'
import { generateContactPageSchema, generateFAQSchema } from '@/lib/schemas'
import { contactFaqs } from '@/data/faqs'
import { pageSEO } from '@/data/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: pageSEO.contact.title,
  description: pageSEO.contact.description,
  keywords: pageSEO.contact.keywords,
  openGraph: {
    title: pageSEO.contact.title,
    description: pageSEO.contact.description,
  },
}

const contactSchema = generateContactPageSchema()
const faqSchema = generateFAQSchema(contactFaqs)

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
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <RecaptchaProvider>{children}</RecaptchaProvider>
    </>
  )
}
