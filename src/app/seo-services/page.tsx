import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import ServicePage from '@/app/services/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['services/seo']
  return {
    title: seoData?.title || 'SEO Services',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/seo-services` },
    openGraph: {
      title: seoData?.title || 'SEO Services',
      description: seoData?.description,
      url: `${siteConfig.url}/seo-services`,
    },
  }
}

export default function SEOServicesPage() {
  return ServicePage({ params: Promise.resolve({ slug: 'seo' }) })
}
