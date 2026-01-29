import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'

// This page's generateMetadata takes precedence over the imported component's
export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['services/seo/local-seo']

  return {
    title: seoData?.title || 'Local SEO Services',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: {
      canonical: `${siteConfig.url}/local-seo`,
    },
    openGraph: {
      title: seoData?.title || 'Local SEO Services',
      description: seoData?.description,
      url: `${siteConfig.url}/local-seo`,
    },
  }
}

// Import the original subservice page component for rendering
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

// Render the original page with fixed params
export default function LocalSEOPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'seo', subslug: 'local-seo' }) })
}
