import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Roofing Companies - Generate More Leads',
    description: 'We help roofing contractors dominate local search and generate high-value leads. Our proven SEO strategies deliver roof replacement inquiries and emergency repair calls.',
    keywords: ['roofing seo services', 'seo for roofers', 'roofing marketing agency', 'roofer seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/roofing` },
    openGraph: {
      title: 'SEO Services for Roofing Companies - Generate More Leads',
      description: 'We help roofing contractors dominate local search and generate high-value leads.',
      url: `${siteConfig.url}/local-seo/roofing`,
    },
  }
}

export default function RoofingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'roofing-company-seo-strategy' }) })
}
