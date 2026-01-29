import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['services/web-development/ecommerce-development']
  return {
    title: seoData?.title || 'E-commerce Development',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/development/ecommerce` },
    openGraph: {
      title: seoData?.title || 'E-commerce Development',
      description: seoData?.description,
      url: `${siteConfig.url}/development/ecommerce`,
    },
  }
}

export default function EcommerceDevelopmentPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'web-development', subslug: 'ecommerce-development' }) })
}
