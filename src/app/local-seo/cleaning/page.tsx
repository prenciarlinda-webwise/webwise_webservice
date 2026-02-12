import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Cleaning Companies - Cleaning SEO Services',
    description: 'We help cleaning companies stand out in a crowded market. Residential, commercial, and specialty cleaning leads through Google search.',
    keywords: ['cleaning company seo services', 'house cleaning marketing agency', 'janitorial seo', 'cleaning service marketing'],
    alternates: { canonical: `${siteConfig.url}/local-seo/cleaning` },
    openGraph: {
      title: 'SEO for Cleaning Companies - Cleaning SEO Services',
      description: 'We help cleaning companies generate leads through Google search.',
      url: `${siteConfig.url}/local-seo/cleaning`,
    },
  }
}

export default function CleaningSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'cleaning-company-seo-guide' }) })
}
