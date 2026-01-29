import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'How Long Does SEO Take to Work? Realistic Timeline for Local Businesses',
    description: 'Set realistic expectations for your SEO investment. Learn the typical timeline for local businesses to see results.',
    keywords: ['seo timeline', 'how long does seo take', 'seo results timeline', 'local business seo'],
    alternates: { canonical: `${siteConfig.url}/blog/seo-timeline` },
    openGraph: {
      title: 'How Long Does SEO Take to Work? Realistic Timeline for Local Businesses',
      description: 'Set realistic expectations for your SEO investment. Learn the typical timeline for local businesses to see results.',
      url: `${siteConfig.url}/blog/seo-timeline`,
    },
  }
}

export default function SEOTimelinePage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'how-long-does-seo-take-to-work' }) })
}
