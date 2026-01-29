import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO vs PPC: Which Should Your Business Invest In?',
    description: 'An honest comparison of SEO and paid advertising for local businesses. Learn when to use each, costs over time, and how to combine them effectively.',
    keywords: ['seo vs ppc', 'seo or google ads', 'organic vs paid', 'should I do seo or ppc'],
    alternates: { canonical: `${siteConfig.url}/blog/seo-vs-ppc` },
    openGraph: {
      title: 'SEO vs PPC: Which Should Your Business Invest In?',
      description: 'An honest comparison of SEO and paid advertising for local businesses.',
      url: `${siteConfig.url}/blog/seo-vs-ppc`,
    },
  }
}

export default function SEOvsPPCPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'seo-vs-ppc' }) })
}
