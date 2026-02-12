import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Auto Detailers - Detailing SEO Services',
    description: 'We help auto detailing businesses book more ceramic coating and paint correction jobs. Google Maps visibility that fills your calendar.',
    keywords: ['auto detailing seo services', 'car detailing marketing agency', 'detailing business seo', 'mobile detailing seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/auto-detailing` },
    openGraph: {
      title: 'SEO for Auto Detailers - Detailing SEO Services',
      description: 'We help auto detailing businesses book more appointments through Google.',
      url: `${siteConfig.url}/local-seo/auto-detailing`,
    },
  }
}

export default function AutoDetailingSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'auto-detailing-seo-get-more-customers' }) })
}
