import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Landscapers - Landscaping SEO Services',
    description: 'Seasonal SEO that keeps landscaping companies booked year-round. Spring cleanup to snow removal. Google Maps rankings that generate leads.',
    keywords: ['landscaping seo services', 'lawn care marketing agency', 'landscaper seo', 'landscaping marketing'],
    alternates: { canonical: `${siteConfig.url}/local-seo/landscaping` },
    openGraph: {
      title: 'SEO for Landscapers - Landscaping SEO Services',
      description: 'Seasonal SEO that keeps landscaping companies booked year-round.',
      url: `${siteConfig.url}/local-seo/landscaping`,
    },
  }
}

export default function LandscapingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'landscaping-seo-grow-your-business' }) })
}
