import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import ServicePage from '@/app/services/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['development']
  return {
    title: seoData?.title || 'Web Design Services',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/development` },
    openGraph: {
      title: seoData?.title || 'Web Design Services',
      description: seoData?.description,
      url: `${siteConfig.url}/development`,
    },
  }
}

export default function WebDesignPage() {
  return ServicePage({ params: Promise.resolve({ slug: 'web-development' }) })
}
