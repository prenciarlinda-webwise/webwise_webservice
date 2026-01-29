import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Local SEO in the UK vs USA: Key Differences You Need to Know',
    description: 'Understanding the differences between local SEO strategies in the UK and USA. Optimize for your specific market.',
    keywords: ['local seo uk', 'local seo usa', 'uk vs usa seo', 'international local seo'],
    alternates: { canonical: `${siteConfig.url}/blog/local-seo-uk-vs-usa` },
    openGraph: {
      title: 'Local SEO in the UK vs USA: Key Differences You Need to Know',
      description: 'Understanding the differences between local SEO strategies in the UK and USA. Optimize for your specific market.',
      url: `${siteConfig.url}/blog/local-seo-uk-vs-usa`,
    },
  }
}

export default function LocalSEOUKvsUSAPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'local-seo-uk-vs-usa-differences' }) })
}
