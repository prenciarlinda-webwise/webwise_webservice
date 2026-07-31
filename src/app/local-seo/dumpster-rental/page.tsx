import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Local SEO for Dumpster Rental - SEO Leads',
    description: 'We help dumpster rental companies capture more rental inquiries. Size-specific pages, city targeting, Google Maps visibility. Free audit.',
    keywords: ['dumpster rental seo services', 'waste management seo', 'roll off dumpster marketing', 'dumpster company seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/dumpster-rental` },
    openGraph: {
      title: 'Local SEO for Dumpster Rental - SEO Leads',
      description: 'We help dumpster rental companies capture more inquiries through Google.',
      url: `${siteConfig.url}/local-seo/dumpster-rental`,
    },
  }
}

export default function DumpsterRentalSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'dumpster-rental-seo-dominate-local-search' }) })
}
