import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Construction Companies - Win More Bids',
    description: 'We help construction companies and general contractors generate high-value project inquiries. Our SEO strategies bring in residential, commercial, and specialty construction leads.',
    keywords: ['construction seo services', 'general contractor marketing agency', 'contractor seo', 'construction company marketing'],
    alternates: { canonical: `${siteConfig.url}/local-seo/construction` },
    openGraph: {
      title: 'SEO Services for Construction Companies - Win More Bids',
      description: 'We help construction companies and general contractors generate high-value project inquiries.',
      url: `${siteConfig.url}/local-seo/construction`,
    },
  }
}

export default function ConstructionSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'construction-company-seo-strategy' }) })
}
