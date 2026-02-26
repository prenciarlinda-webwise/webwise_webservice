import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Plumbers - Get More Emergency Calls From Google',
    description: 'We help plumbing companies dominate Google Maps and local search with proven SEO strategies. Emergency plumber keywords, Map Pack rankings, and 290%+ traffic increases.',
    keywords: ['seo for plumbers', 'plumber seo', 'local seo for plumbers', 'plumbing seo', 'seo for plumbing companies', 'plumber seo services', 'plumbing marketing agency', 'plumber seo company', 'plumber seo agency', 'seo services for plumbers'],
    alternates: { canonical: `${siteConfig.url}/local-seo/plumbers` },
    openGraph: {
      title: 'SEO for Plumbers - Get More Emergency Calls From Google',
      description: 'We help plumbing companies dominate Google Maps and local search with proven SEO strategies. Emergency plumber keywords, Map Pack rankings, and 290%+ traffic increases.',
      url: `${siteConfig.url}/local-seo/plumbers`,
    },
  }
}

export default function PlumbersSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'local-seo-for-plumbers-complete-guide' }) })
}
