import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { clients, siteConfig, getWhatsAppUrl } from '@/data/site'
import { generateCollectionPageSchema, generateFAQSchema } from '@/lib/schemas'
import { portfolioFaqs } from '@/data/faqs'
import FAQSection from '@/components/sections/FAQSection'
import { pageSEO } from '@/data/seo'

// URL mappings for case studies
const caseStudyUrlMap: Record<string, string> = {
  'illyrian-group-plumbing-seo-web-development': '/case-studies/illyrian-group',
  'gimos-roofing-local-seo-website-design': '/case-studies/gimos-roofing',
  'albros-premium-detailing-seo-website-design': '/case-studies/albros-detailing',
  'northstar-home-improvement-seo-website-development': '/case-studies/northstar',
  '904-dumpster-rental-jacksonville-seo-website': '/case-studies/904-dumpster',
  'gjej-pro-marketplace-web-application-seo': '/case-studies/gjej-pro',
  'paint-techs-painting-contractor-seo-website-redesign': '/case-studies/paint-techs',
  'sunrise-auto-rent-car-rental-website-design': '/case-studies/sunrise-auto',
  'kn-flooring-contractor-website-design': '/case-studies/kn-flooring',
  'kryemadhi-car-rental-albania-website-design': '/case-studies/kryemadhi',
  'gnt-home-remodeling-contractor-website-design': '/case-studies/gnt-remodeling',
  'eli-taxi-durres-albania-website-design': '/case-studies/eli-taxi',
  'msc-certification-web-application-development': '/case-studies/msc-certification',
  'aaa-remodels-jacksonville-home-remodeling-seo-website': '/case-studies/aaa-remodels',
}

export const metadata = {
  title: pageSEO.portfolio.title,
  description: pageSEO.portfolio.description,
  keywords: pageSEO.portfolio.keywords,
  alternates: {
    canonical: `${siteConfig.url}/case-studies`,
  },
  openGraph: {
    title: pageSEO.portfolio.title,
    description: pageSEO.portfolio.description,
    url: `${siteConfig.url}/case-studies`,
  },
}

const pageSchema = generateCollectionPageSchema({
  name: pageSEO.portfolio.title,
  description: pageSEO.portfolio.description,
  url: `${siteConfig.url}/case-studies`,
})
const faqSchema = generateFAQSchema(portfolioFaqs)

export default function PortfolioPage() {
  const allClients = Object.entries(clients)

  return (
    <>
      <Script
        id="portfolio-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm mb-4">Case Studies</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient">Work</span>
            </h1>
            <p className="text-lg text-white/80">
              Real results for real businesses. Explore our portfolio of successful projects and see what we can do for you.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-bg-secondary">
        <div className="container px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${Object.keys(clients).length}+`, label: 'Clients Served' },
              { value: '340%', label: 'Avg. Traffic Growth' },
              { value: '500+', label: 'Keywords Ranked' },
              { value: '98%', label: 'Client Retention' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="container px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allClients.map(([key, client]) => (
              <div key={key} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow group">
                {/* Website Screenshot */}
                <div className="h-52 relative overflow-hidden bg-gradient-to-br from-bg-tertiary to-bg-secondary">
                  <img
                    src={client.image}
                    alt={`${client.name} website screenshot`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={caseStudyUrlMap[client.slug] || `/case-studies/${client.slug}`} className="px-5 py-2.5 bg-white text-primary font-semibold rounded-lg flex items-center gap-2 shadow-lg hover:bg-accent hover:text-white transition-colors">
                      View Case Study <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {client.industry}
                  </span>
                  <h3 className="text-lg font-bold text-primary mt-3 mb-2">{client.name}</h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{client.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {client.services.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-bg-secondary rounded-full text-text-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                  {client.results && (
                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">{client.results.trafficIncrease}</div>
                        <div className="text-xs text-text-muted">Traffic</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">{client.results.leadsIncrease}</div>
                        <div className="text-xs text-text-muted">Leads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">{client.results.rankingKeywords}</div>
                        <div className="text-xs text-text-muted">Keywords</div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <a href={client.url} target="_blank" rel={client.nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'} className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors">
                      <ExternalLink size={14} /> Visit Site
                    </a>
                    <Link href={caseStudyUrlMap[client.slug] || `/case-studies/${client.slug}`} className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:bg-bg-secondary rounded-lg transition-colors">
                      Case Study <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        faqs={portfolioFaqs}
        title="Portfolio FAQ"
        subtitle="Common questions about our work and results."
        background="gray"
      />

      {/* CTA */}
      <section className="py-24">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4">Want Results Like These?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Let&apos;s discuss how we can help transform your business with a custom website, SEO strategy, or marketing campaign.
              </p>
              <a href={getWhatsAppUrl("Hi, I'd like to discuss a project with WebWise!")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                Start Your Project
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
