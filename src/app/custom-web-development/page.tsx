import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import ServicePage from '@/components/service-pages/ServiceHubPage'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['custom-web-development']
  return {
    title: seoData?.title || 'Custom Web Development Services',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/custom-web-development` },
    openGraph: {
      title: seoData?.title || 'Custom Web Development Services',
      description: seoData?.description,
      url: `${siteConfig.url}/custom-web-development`,
    },
  }
}

export default function CustomWebDevelopmentPage() {
  return ServicePage({ params: Promise.resolve({ slug: 'web-development' }) })
}
