import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['services/seo/international-seo']
  return {
    title: seoData?.title || 'International SEO Services',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/international-seo` },
    openGraph: {
      title: seoData?.title || 'International SEO Services',
      description: seoData?.description,
      url: `${siteConfig.url}/international-seo`,
    },
  }
}

export default function InternationalSEOPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'seo', subslug: 'international-seo' }) })
}
