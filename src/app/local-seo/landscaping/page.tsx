import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Landscapers - Grow Your Client Base',
    description: 'We help landscaping and lawn care businesses generate year-round leads. Our seasonal SEO strategies keep your schedule full from spring cleanup to snow removal.',
    keywords: ['landscaping seo services', 'lawn care marketing agency', 'landscaper seo', 'landscaping marketing'],
    alternates: { canonical: `${siteConfig.url}/local-seo/landscaping` },
    openGraph: {
      title: 'SEO Services for Landscapers - Grow Your Client Base',
      description: 'We help landscaping and lawn care businesses generate year-round leads.',
      url: `${siteConfig.url}/local-seo/landscaping`,
    },
  }
}

export default function LandscapingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'landscaping-seo-grow-your-business' }) })
}
