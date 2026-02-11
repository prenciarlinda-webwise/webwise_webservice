import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import SubservicePage from '@/app/services/[slug]/[subslug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['digital-marketing/social-management']
  return {
    title: seoData?.title || 'Social Media Marketing',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/digital-marketing/social-management` },
    openGraph: {
      title: seoData?.title || 'Social Media Marketing',
      description: seoData?.description,
      url: `${siteConfig.url}/digital-marketing/social-management`,
    },
  }
}

export default function SocialMediaPage() {
  return SubservicePage({ params: Promise.resolve({ slug: 'digital-marketing', subslug: 'social-media' }) })
}
