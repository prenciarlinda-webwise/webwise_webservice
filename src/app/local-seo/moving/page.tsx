import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Moving Companies - Mover SEO Services',
    description: 'We help moving companies capture more quote requests. Local, long-distance, and specialty moving leads through Google Maps and search.',
    keywords: ['moving company seo services', 'mover marketing agency', 'moving company marketing', 'relocation seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/moving` },
    openGraph: {
      title: 'SEO for Moving Companies - Mover SEO Services',
      description: 'We help moving companies capture more quote requests through Google.',
      url: `${siteConfig.url}/local-seo/moving`,
    },
  }
}

export default function MovingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'moving-company-seo-guide' }) })
}
