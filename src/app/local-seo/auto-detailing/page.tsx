import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Auto Detailers - Book More Appointments',
    description: 'We help auto detailing businesses fill their booking calendars. Our SEO strategies bring in ceramic coating clients, mobile detailing appointments, and recurring customers.',
    keywords: ['auto detailing seo services', 'car detailing marketing agency', 'detailing business seo', 'mobile detailing seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/auto-detailing` },
    openGraph: {
      title: 'SEO Services for Auto Detailers - Book More Appointments',
      description: 'We help auto detailing businesses fill their booking calendars with ceramic coating and detailing clients.',
      url: `${siteConfig.url}/local-seo/auto-detailing`,
    },
  }
}

export default function AutoDetailingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'auto-detailing-seo-get-more-customers' }) })
}
