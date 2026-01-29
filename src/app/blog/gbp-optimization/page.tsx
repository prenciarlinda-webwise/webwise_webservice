import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Google Business Profile Optimization: The Ultimate Guide',
    description: 'Master your Google Business Profile and dominate the local map pack. Step-by-step guide for local service businesses.',
    keywords: ['google business profile optimization', 'gbp optimization', 'google my business seo', 'local map pack'],
    alternates: { canonical: `${siteConfig.url}/blog/gbp-optimization` },
    openGraph: {
      title: 'Google Business Profile Optimization: The Ultimate Guide',
      description: 'Master your Google Business Profile and dominate the local map pack. Step-by-step guide for local service businesses.',
      url: `${siteConfig.url}/blog/gbp-optimization`,
    },
  }
}

export default function GBPOptimizationPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'google-business-profile-optimization-guide' }) })
}
