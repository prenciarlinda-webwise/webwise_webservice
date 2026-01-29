import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO Services for HVAC Companies - Year-Round Leads',
    description: 'We help HVAC companies generate consistent leads through every season. Our SEO strategies keep your schedule full whether it\'s AC repair in summer or furnace emergencies in winter.',
    keywords: ['hvac seo services', 'seo for hvac companies', 'hvac marketing agency', 'heating cooling seo'],
    alternates: { canonical: `${siteConfig.url}/local-seo/hvac` },
    openGraph: {
      title: 'SEO Services for HVAC Companies - Year-Round Leads',
      description: 'We help HVAC companies generate consistent leads through every season. Our SEO strategies keep your schedule full.',
      url: `${siteConfig.url}/local-seo/hvac`,
    },
  }
}

export default function HVACSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'hvac-seo-complete-guide' }) })
}
