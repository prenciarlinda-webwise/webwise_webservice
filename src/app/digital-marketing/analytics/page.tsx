import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['services/digital-marketing/analytics']
  return {
    title: seoData?.title || 'Analytics & Reporting',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/digital-marketing/analytics` },
    openGraph: {
      title: seoData?.title || 'Analytics & Reporting',
      description: seoData?.description,
      url: `${siteConfig.url}/digital-marketing/analytics`,
    },
  }
}

export default function AnalyticsPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'digital-marketing', subslug: 'analytics' }) })
}
