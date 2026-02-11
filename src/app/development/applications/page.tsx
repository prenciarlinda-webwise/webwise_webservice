import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['development/applications']
  return {
    title: seoData?.title || 'Web Application Development',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/development/applications` },
    openGraph: {
      title: seoData?.title || 'Web Application Development',
      description: seoData?.description,
      url: `${siteConfig.url}/development/applications`,
    },
  }
}

export default function WebApplicationsPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'web-development', subslug: 'web-applications' }) })
}
