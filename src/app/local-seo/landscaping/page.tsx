import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Landscaping SEO: Rank #1 & Stay Booked Year-Round (2026)'
  const description = 'SEO for landscapers and lawn care companies that keeps your schedule full from spring cleanup to snow removal. Rank on Google Maps, beat local competitors, generate qualified leads.'
  return {
    title,
    description,
    keywords: ['landscaping seo', 'seo for landscapers', 'landscaper seo', 'lawn care seo', 'seo for landscaping', 'landscaping seo services', 'landscaping seo company'],
    alternates: { canonical: `${siteConfig.url}/local-seo/landscaping` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/local-seo/landscaping`,
    },
  }
}

export default function LandscapingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'landscaping-seo-grow-your-business' }) })
}
