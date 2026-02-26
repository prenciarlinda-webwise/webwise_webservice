import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cleaning Service SEO',
    description: 'We help cleaning companies rank higher on Google and generate consistent leads. From residential to commercial, our proven SEO strategies deliver real results.',
    keywords: ['seo for cleaning company', 'cleaning company seo', 'cleaning service seo', 'carpet cleaning seo', 'house cleaning seo company', 'cleaning company seo experts', 'seo for carpet cleaners'],
    alternates: { canonical: `${siteConfig.url}/local-seo/cleaning` },
    openGraph: {
      title: 'Cleaning Service SEO',
      description: 'We help cleaning companies rank higher on Google and generate consistent leads. Proven SEO strategies that deliver real results.',
      url: `${siteConfig.url}/local-seo/cleaning`,
    },
  }
}

export default function CleaningSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'cleaning-company-seo-guide' }) })
}
