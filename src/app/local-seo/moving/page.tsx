import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Moving Companies - Get More Quotes',
    description: 'We help moving companies capture more quote requests and book more moves. Our SEO strategies bring in local, long-distance, and specialty moving clients.',
    keywords: ['moving company seo services', 'mover marketing agency', 'moving company marketing', 'relocation seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/moving` },
    openGraph: {
      title: 'SEO Services for Moving Companies - Get More Quotes',
      description: 'We help moving companies capture more quote requests and book more moves.',
      url: `${siteConfig.url}/local-seo/moving`,
    },
  }
}

export default function MovingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'moving-company-seo-guide' }) })
}
