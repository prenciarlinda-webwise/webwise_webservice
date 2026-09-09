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
    // Prospects reach this grid from our own pitch, not organic search, and
    // it's the one page holding all the (now nofollowed) client links. Keep
    // it out of the index so it never reads as a link-scheme hub. `follow`
    // stays on so crawl equity still reaches the individual case studies.
    robots: { index: false, follow: true },
  }
}

export default function CaseStudiesPage() {
  return PortfolioPage()
}
