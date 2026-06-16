import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/components/service-pages/SubslugServicePage'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['web-application-development']
  return {
    title: seoData?.title || 'Web Application Development',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/web-application-development` },
    openGraph: {
      title: seoData?.title || 'Web Application Development',
      description: seoData?.description,
      url: `${siteConfig.url}/web-application-development`,
    },
  }
}

export default function WebApplicationDevelopmentPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'web-development', subslug: 'web-applications' }) })
}
