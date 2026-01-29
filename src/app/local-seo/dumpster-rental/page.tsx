import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Dumpster Rental Companies - More Rentals',
    description: 'We help dumpster rental companies dominate local search and capture more rental inquiries. Our SEO strategies bring in contractors, homeowners, and commercial clients.',
    keywords: ['dumpster rental seo services', 'waste management seo', 'roll off dumpster marketing', 'dumpster company seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/dumpster-rental` },
    openGraph: {
      title: 'SEO Services for Dumpster Rental Companies - More Rentals',
      description: 'We help dumpster rental companies dominate local search and capture more rental inquiries.',
      url: `${siteConfig.url}/local-seo/dumpster-rental`,
    },
  }
}

export default function DumpsterRentalSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'dumpster-rental-seo-dominate-local-search' }) })
}
