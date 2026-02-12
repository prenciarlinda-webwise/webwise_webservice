import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for HVAC Companies - HVAC SEO Services',
    description: 'Year-round HVAC leads through Google Maps and local search. AC repair in summer, furnace calls in winter. Seasonal SEO that works.',
    keywords: ['hvac seo services', 'seo for hvac companies', 'hvac marketing agency', 'heating cooling seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/hvac` },
    openGraph: {
      title: 'SEO for HVAC Companies - HVAC SEO Services',
      description: 'Year-round HVAC leads through Google Maps and local search. Seasonal SEO strategies that work.',
      url: `${siteConfig.url}/local-seo/hvac`,
    },
  }
}

export default function HVACSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'hvac-seo-complete-guide' }) })
}
