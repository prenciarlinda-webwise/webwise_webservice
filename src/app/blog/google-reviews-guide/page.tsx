import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'How to Get More Google Reviews for Your Business in 2026',
    description: 'Proven strategies to generate consistent Google reviews that boost your rankings and build trust. Includes templates and scripts that actually work.',
    keywords: ['how to get google reviews', 'google reviews SEO', 'review generation', 'get more reviews'],
    alternates: { canonical: `${siteConfig.url}/blog/google-reviews-guide` },
    openGraph: {
      title: 'How to Get More Google Reviews for Your Business in 2026',
      description: 'Proven strategies to generate consistent Google reviews that boost your rankings and build trust.',
      url: `${siteConfig.url}/blog/google-reviews-guide`,
    },
  }
}

export default function GoogleReviewsGuidePage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'google-reviews-guide' }) })
}
