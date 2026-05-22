import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Electrician SEO Services - Get More Service Calls From Google',
    description: 'We help electricians rank for emergency calls, EV charger installations, and residential services. Google Maps leads that convert.',
    keywords: ['electrician seo services', 'seo for electricians', 'electrician marketing agency', 'electrical contractor seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/electricians` },
    openGraph: {
      title: 'Electrician SEO Services - Get More Service Calls From Google',
      description: 'We help electricians rank for emergency calls and residential services.',
      url: `${siteConfig.url}/local-seo/electricians`,
    },
  }
}

export default function ElectriciansSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'electrician-seo-guide' }) })
}
