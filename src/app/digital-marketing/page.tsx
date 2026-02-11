import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import ServicePage from '@/app/services/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['digital-marketing']
  return {
    title: seoData?.title || 'Digital Marketing Services',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/digital-marketing` },
    openGraph: {
      title: seoData?.title || 'Digital Marketing Services',
      description: seoData?.description,
      url: `${siteConfig.url}/digital-marketing`,
    },
  }
}

export default function DigitalMarketingPage() {
  return ServicePage({ params: Promise.resolve({ slug: 'digital-marketing' }) })
}
