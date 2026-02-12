import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Construction Companies - Contractor SEO Services',
    description: 'We help construction companies and general contractors generate high-value project inquiries. Residential, commercial, and specialty leads.',
    keywords: ['construction seo services', 'general contractor marketing agency', 'contractor seo', 'construction company marketing'],
    alternates: { canonical: `${siteConfig.url}/local-seo/construction` },
    openGraph: {
      title: 'SEO for Construction Companies - Contractor SEO Services',
      description: 'We help construction companies generate high-value project inquiries.',
      url: `${siteConfig.url}/local-seo/construction`,
    },
  }
}

export default function ConstructionSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'construction-company-seo-strategy' }) })
}
