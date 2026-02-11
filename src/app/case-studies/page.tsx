import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import PortfolioPage from '@/app/portfolio/page'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['case-studies']
  return {
    title: seoData?.title || 'Case Studies',
    description: seoData?.description,
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/case-studies` },
    openGraph: {
      title: seoData?.title || 'Case Studies',
      description: seoData?.description,
      url: `${siteConfig.url}/case-studies`,
    },
  }
}

export default function CaseStudiesPage() {
  return PortfolioPage()
}
