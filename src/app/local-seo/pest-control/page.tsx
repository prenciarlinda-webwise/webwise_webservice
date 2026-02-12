import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Pest Control - Pest Control SEO Services',
    description: 'We help pest control companies capture emergency calls and recurring prevention customers. Termite, bed bug, and general pest rankings.',
    keywords: ['pest control seo services', 'exterminator marketing agency', 'pest control marketing', 'pest control seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/pest-control` },
    openGraph: {
      title: 'SEO for Pest Control - Pest Control SEO Services',
      description: 'We help pest control companies capture more calls through Google.',
      url: `${siteConfig.url}/local-seo/pest-control`,
    },
  }
}

export default function PestControlSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'pest-control-seo-strategy' }) })
}
