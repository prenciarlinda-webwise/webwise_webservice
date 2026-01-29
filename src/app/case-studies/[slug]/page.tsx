import { Metadata } from 'next'
import { siteConfig, clients } from '@/data/site'
import CaseStudyPage from '@/app/portfolio/[slug]/page'

// Mapping from short slug to full portfolio slug
const slugMap: Record<string, string> = {
  'illyrian-group': 'illyrian-group-plumbing-seo-web-development',
  'gimos-roofing': 'gimos-roofing-local-seo-website-design',
  'albros-detailing': 'albros-premium-detailing-seo-website-design',
  'northstar': 'northstar-home-improvement-seo-website-development',
  '904-dumpster': '904-dumpster-rental-jacksonville-seo-website',
  'gjej-pro': 'gjej-pro-marketplace-web-application-seo',
  'paint-techs': 'paint-techs-painting-contractor-seo-website-redesign',
  'sunrise-auto': 'sunrise-auto-rent-car-rental-website-design',
  'kn-flooring': 'kn-flooring-contractor-website-design',
  'kryemadhi': 'kryemadhi-car-rental-albania-website-design',
  'gnt-remodeling': 'gnt-home-remodeling-contractor-website-design',
  'eli-taxi': 'eli-taxi-durres-albania-website-design',
  'msc-certification': 'msc-certification-web-application-development',
  'aaa-remodels': 'aaa-remodels-jacksonville-home-remodeling-seo-website',
}

export async function generateStaticParams() {
  return Object.keys(slugMap).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const fullSlug = slugMap[slug] || slug
  const client = Object.values(clients).find((c) => c.slug === fullSlug)

  if (!client) {
    return { title: 'Case Study Not Found' }
  }

  const title = `${client.name} Case Study`
  const description = client.results
    ? `See how we helped ${client.name} achieve ${client.results.trafficIncrease} traffic increase.`
    : `See how we helped ${client.name} with their ${client.services.join(', ').toLowerCase()}.`

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/case-studies/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/case-studies/${slug}`,
    },
  }
}

export default async function CaseStudyShortPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fullSlug = slugMap[slug] || slug
  return CaseStudyPage({ params: Promise.resolve({ slug: fullSlug }) })
}
