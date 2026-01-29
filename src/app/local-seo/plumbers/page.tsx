import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Plumbers - Get More Emergency Calls',
    description: 'We help plumbing companies dominate Google Maps and local search. Our proven SEO strategies deliver 290%+ traffic increases and fill your schedule with emergency calls.',
    keywords: ['plumber seo services', 'seo for plumbers', 'plumber marketing agency', 'plumber google ranking', 'plumbing seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/plumbers` },
    openGraph: {
      title: 'SEO Services for Plumbers - Get More Emergency Calls',
      description: 'We help plumbing companies dominate Google Maps and local search. Our proven SEO strategies deliver 290%+ traffic increases.',
      url: `${siteConfig.url}/local-seo/plumbers`,
    },
  }
}

export default function PlumbersSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'local-seo-for-plumbers-complete-guide' }) })
}
