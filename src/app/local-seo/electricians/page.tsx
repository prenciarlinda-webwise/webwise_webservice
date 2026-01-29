import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for Electricians - Get More Service Calls',
    description: 'We help electrical contractors dominate local search and generate consistent leads. From emergency calls to EV charger installations, our SEO drives the jobs you want.',
    keywords: ['electrician seo services', 'seo for electricians', 'electrician marketing agency', 'electrical contractor seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/electricians` },
    openGraph: {
      title: 'SEO Services for Electricians - Get More Service Calls',
      description: 'We help electrical contractors dominate local search and generate consistent leads.',
      url: `${siteConfig.url}/local-seo/electricians`,
    },
  }
}

export default function ElectriciansSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'electrician-seo-guide' }) })
}
