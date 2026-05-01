import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Cleaning Service SEO: Get More Clients From Google in 2026'
  const description = 'SEO for cleaning companies that turns Google search into recurring residential and commercial contracts. Rank for "cleaning service near me" and stop relying on Thumbtack.'
  return {
    title,
    description,
    keywords: ['cleaning service seo', 'seo for cleaning company', 'cleaning company seo', 'carpet cleaning seo', 'house cleaning seo company', 'cleaning company seo experts', 'seo for carpet cleaners'],
    alternates: { canonical: `${siteConfig.url}/local-seo/cleaning` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/local-seo/cleaning`,
    },
  }
}

export default function CleaningSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'cleaning-company-seo-guide' }) })
}
