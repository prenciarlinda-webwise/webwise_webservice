import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Plumbers - Plumber SEO Services',
    description: 'We get plumbing companies to the top of Google Maps and local search. 290%+ traffic increases. Emergency call leads, not DIY traffic.',
    keywords: ['plumber seo services', 'seo for plumbers', 'plumber marketing agency', 'plumber google ranking', 'plumbing seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/plumbers` },
    openGraph: {
      title: 'SEO for Plumbers - Plumber SEO Services',
      description: 'We get plumbing companies to the top of Google Maps and local search. 290%+ traffic increases. Emergency call leads.',
      url: `${siteConfig.url}/local-seo/plumbers`,
    },
  }
}

export default function PlumbersSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'local-seo-for-plumbers-complete-guide' }) })
}
