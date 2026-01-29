import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Pest Control Companies - More Calls',
    description: 'We help pest control companies dominate local search and capture more service calls. Our SEO strategies bring in emergency treatments and recurring prevention customers.',
    keywords: ['pest control seo services', 'exterminator marketing agency', 'pest control marketing', 'pest control seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/pest-control` },
    openGraph: {
      title: 'SEO Services for Pest Control Companies - More Calls',
      description: 'We help pest control companies dominate local search and capture more service calls.',
      url: `${siteConfig.url}/local-seo/pest-control`,
    },
  }
}

export default function PestControlSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'pest-control-seo-strategy' }) })
}
