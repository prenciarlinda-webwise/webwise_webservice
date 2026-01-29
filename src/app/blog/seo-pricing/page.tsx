import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'How Much Does SEO Cost for a Small Business in 2026?',
    description: 'A comprehensive breakdown of SEO pricing for plumbers, roofers, detailers, and local service businesses. Learn what to expect and how to budget for SEO.',
    keywords: ['seo pricing', 'seo cost small business', 'seo packages pricing', 'local seo cost'],
    alternates: { canonical: `${siteConfig.url}/blog/seo-pricing` },
    openGraph: {
      title: 'How Much Does SEO Cost for a Small Business in 2026?',
      description: 'A comprehensive breakdown of SEO pricing for plumbers, roofers, detailers, and local service businesses.',
      url: `${siteConfig.url}/blog/seo-pricing`,
    },
  }
}

export default function SEOPricingPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'how-much-does-seo-cost-for-small-business' }) })
}
