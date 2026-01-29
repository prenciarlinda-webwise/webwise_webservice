import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Cleaning Companies - Get More Clients',
    description: 'We help cleaning companies stand out in a crowded market. Our SEO strategies bring in residential, commercial, and specialty cleaning clients consistently.',
    keywords: ['cleaning company seo services', 'house cleaning marketing agency', 'janitorial seo', 'cleaning service marketing'],
    alternates: { canonical: `${siteConfig.url}/local-seo/cleaning` },
    openGraph: {
      title: 'SEO Services for Cleaning Companies - Get More Clients',
      description: 'We help cleaning companies stand out in a crowded market and get more clients.',
      url: `${siteConfig.url}/local-seo/cleaning`,
    },
  }
}

export default function CleaningSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'cleaning-company-seo-guide' }) })
}
