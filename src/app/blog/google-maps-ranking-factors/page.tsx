import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'The 12 Google Maps Ranking Factors That Actually Matter in 2026',
    description: 'Discover the proven factors that determine who shows up in the Google Maps 3-Pack. Based on real data and testing, not theory.',
    keywords: ['google maps ranking factors', 'how to rank on google maps', 'local pack ranking factors', 'google business profile ranking'],
    alternates: { canonical: `${siteConfig.url}/blog/google-maps-ranking-factors` },
    openGraph: {
      title: 'The 12 Google Maps Ranking Factors That Actually Matter in 2026',
      description: 'Discover the proven factors that determine who shows up in the Google Maps 3-Pack.',
      url: `${siteConfig.url}/blog/google-maps-ranking-factors`,
    },
  }
}

export default function GoogleMapsRankingFactorsPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'google-maps-ranking-factors' }) })
}
