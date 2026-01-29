import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['services/seo/technical-seo']
  return {
    title: seoData?.title || 'Technical SEO Services',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/technical-seo` },
    openGraph: {
      title: seoData?.title || 'Technical SEO Services',
      description: seoData?.description,
      url: `${siteConfig.url}/technical-seo`,
    },
  }
}

export default function TechnicalSEOPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'seo', subslug: 'technical-seo' }) })
}
