import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Roofers - Roofing SEO Services',
    description: 'We help roofing contractors rank in Google Maps and local search. High-value roof replacement and emergency repair leads. Free audit.',
    keywords: ['roofing seo services', 'seo for roofers', 'roofing marketing agency', 'roofer seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/roofing` },
    openGraph: {
      title: 'SEO for Roofers - Roofing SEO Services',
      description: 'We help roofing contractors rank in Google Maps and local search. High-value leads.',
      url: `${siteConfig.url}/local-seo/roofing`,
    },
  }
}

export default function RoofingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'roofing-company-seo-strategy' }) })
}
