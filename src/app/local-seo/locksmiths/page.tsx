import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Locksmiths - Get More Emergency Calls',
    description: 'We help locksmith companies dominate local search and capture more emergency calls. Our SEO strategies bring in lockout emergencies, key services, and commercial clients.',
    keywords: ['locksmith seo services', 'locksmith marketing agency', 'locksmith local seo', 'emergency locksmith seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/locksmiths` },
    openGraph: {
      title: 'SEO Services for Locksmiths - Get More Emergency Calls',
      description: 'We help locksmith companies dominate local search and capture more emergency calls.',
      url: `${siteConfig.url}/local-seo/locksmiths`,
    },
  }
}

export default function LocksmithSEOPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'seo', subslug: 'local-seo' }) })
}
