import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['services/seo/ecommerce-seo']
  return {
    title: seoData?.title || 'E-commerce SEO Services',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/ecommerce-seo` },
    openGraph: {
      title: seoData?.title || 'E-commerce SEO Services',
      description: seoData?.description,
      url: `${siteConfig.url}/ecommerce-seo`,
    },
  }
}

export default function EcommerceSEOPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'seo', subslug: 'ecommerce-seo' }) })
}
