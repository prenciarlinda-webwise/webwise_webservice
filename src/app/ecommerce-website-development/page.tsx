import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/components/service-pages/SubslugServicePage'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['ecommerce-website-development']
  return {
    title: seoData?.title || 'Ecommerce Website Development',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/ecommerce-website-development` },
    openGraph: {
      title: seoData?.title || 'Ecommerce Website Development',
      description: seoData?.description,
      url: `${siteConfig.url}/ecommerce-website-development`,
    },
  }
}

export default function EcommerceWebsiteDevelopmentPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'web-development', subslug: 'ecommerce-development' }) })
}
