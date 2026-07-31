import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Local SEO for Electricians - SEO Leads',
    description: 'We help electricians rank for emergency calls, EV charger installations, and residential services. Google Maps leads that convert.',
    keywords: ['electrician seo services', 'seo for electricians', 'electrician marketing agency', 'electrical contractor seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/electricians` },
    openGraph: {
      title: 'Local SEO for Electricians - SEO Leads',
      description: 'We help electricians rank for emergency calls and residential services.',
      url: `${siteConfig.url}/local-seo/electricians`,
    },
  }
}

export default function ElectriciansSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'electrician-seo-guide' }) })
}
