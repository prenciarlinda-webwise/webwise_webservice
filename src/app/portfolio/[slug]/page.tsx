import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { ArrowRight, ExternalLink, Target, Zap, Star, Check } from 'lucide-react'
import { clients, siteConfig } from '@/data/site'
import { generateBreadcrumbSchema } from '@/lib/schemas'
import WebsitePreview from '@/components/ui/WebsitePreview'

export async function generateStaticParams() {
  return Object.values(clients).map((client) => ({ slug: client.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const client = Object.values(clients).find((c) => c.slug === slug)
  if (!client) return { title: 'Case Study Not Found' }
  return {
    title: `${client.name} Case Study`,
    description: client.results
      ? `See how we helped ${client.name} achieve ${client.results.trafficIncrease} traffic increase.`
      : `See how we helped ${client.name} with their ${client.services.join(', ').toLowerCase()}.`,
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const client = Object.values(clients).find((c) => c.slug === slug)

  if (!client) {
    notFound()
  }

  const otherClients = Object.values(clients).filter((c) => c.slug !== slug && c.results).slice(0, 3)

  const pageUrl = `${siteConfig.url}/portfolio/${slug}`
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Portfolio', url: `${siteConfig.url}/portfolio` },
    { name: client.name, url: pageUrl },
  ])
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}/#casestudy`,
    headline: `${client.name} Case Study`,
    description: client.results
      ? `See how we helped ${client.name} achieve ${client.results.trafficIncrease} traffic increase.`
      : `See how we helped ${client.name} with their ${client.services.join(', ').toLowerCase()}.`,
    url: pageUrl,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
  }

  return (
    <>
      <Script
        id="casestudy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="container px-6">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-white">Portfolio</Link>
            <span>/</span>
            <span className="text-white">{client.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-sm mb-4">
                {client.industry}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">{client.name}</h1>
              <p className="text-lg text-white/80 mb-6">{client.description}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {client.services.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
                    {s}
                  </span>
                ))}
              </div>
              <a href={client.url} target="_blank" rel={client.nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'} className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
                Visit Website <ExternalLink size={18} />
              </a>
            </div>
            {client.results && (
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{client.results.trafficIncrease}</div>
                  <div className="text-sm text-white/70">Traffic Increase</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{client.results.leadsIncrease}</div>
                  <div className="text-sm text-white/70">Lead Growth</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{client.results.rankingKeywords}</div>
                  <div className="text-sm text-white/70">Keywords Ranked</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="py-24">
        <div className="container px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <Target size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary">The Challenge</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {client.name} came to us struggling with low online visibility and minimal organic traffic.
                Despite offering excellent services in the {client.industry.toLowerCase()} space, they were losing
                potential customers to competitors who ranked higher in search results. Their existing website wasn&apos;t
                optimized for search engines or conversions.
              </p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary">Our Solution</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">
                We took careful consideration from the ground up - planning the website structure for easy navigation,
                optimal indexing, and SEO optimization, combined with a perfect design tailored to {client.name}&apos;s
                requirements. We built a solid technical SEO foundation with comprehensive on-page optimization,
                and implemented ongoing monthly SEO strategies to continuously grow their local visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Website Preview */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Live Preview</span>
            <h2 className="text-3xl font-bold text-primary mb-4">See the Website in Action</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Toggle between desktop and mobile views to see how the website looks across different devices.
              This is a live preview that reflects the current state of the website.
            </p>
          </div>
          <WebsitePreview url={client.url} name={client.name} nofollow={client.nofollow} />
        </div>
      </section>

      {/* What We Delivered */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Scope of Work</span>
            <h2 className="text-3xl font-bold text-primary">What We Delivered</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {client.services.map((service, i) => {
              const workItems: { [key: string]: string[] } = {
                'Local SEO': ['Google Business optimization', 'Local citation building', 'Monthly SEO strategies', 'Local visibility growth'],
                'Website Design': ['Strategic site structure', 'Easy navigation planning', 'SEO-optimized design', 'Mobile-first approach'],
                'SEO': ['Technical SEO structure', 'On-page optimization', 'Indexing optimization', 'Monthly SEO strategies'],
                'Web Development': ['Careful site architecture', 'CMS integration', 'Performance optimization', 'Clean code structure'],
                'PPC': ['Campaign setup', 'Ad copywriting', 'Bid optimization', 'Conversion tracking'],
                'Content Marketing': ['Strategic content plan', 'Service pages', 'Local content', 'Link building'],
                'Web Application': ['Custom features', 'Database design', 'API integration', 'User authentication'],
                'Review Management': ['Review generation', 'Response strategy', 'Reputation monitoring', 'Review widgets'],
                'Google Ads': ['Search campaigns', 'Display ads', 'Remarketing', 'Performance max'],
              }
              const items = workItems[service] || ['Research & analysis', 'Strategy development', 'Implementation', 'Ongoing optimization']
              return (
                <div key={i} className="bg-white rounded-xl p-6 border border-border">
                  <h4 className="font-semibold text-primary mb-4">{service}</h4>
                  <div className="space-y-2">
                    {items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                        <Check size={14} className="text-accent" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">The Journey</span>
            <h2 className="text-3xl font-bold text-primary">Results Timeline</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Month 1-2', desc: 'Foundation building: audit, strategy development, and initial optimizations.' },
              { step: '2', title: 'Month 3-4', desc: 'Early wins: first page rankings for key terms, traffic starting to grow.' },
              { step: '3', title: 'Month 5-6', desc: 'Momentum: significant traffic increase, leads growing consistently.' },
              { step: '4', title: 'Month 6+', desc: client.results ? `Scaling: dominant rankings, ${client.results.trafficIncrease} traffic growth achieved.` : 'Scaling: dominant rankings, sustained traffic growth achieved.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-accent text-white font-bold rounded-full mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-primary mb-2">{item.title}</h4>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <div className="flex justify-center text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
              </div>
              <blockquote className="text-xl text-text-secondary mb-8 leading-relaxed">
                &quot;Web Wise completely transformed our online presence. The results speak for themselves -
                {client.results ? ` we've seen a ${client.results.trafficIncrease} increase in traffic and` : ''} our phone
                hasn&apos;t stopped ringing. Highly recommended!&quot;
              </blockquote>
              <div>
                <h4 className="font-semibold text-primary">Owner</h4>
                <p className="text-text-muted">{client.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Projects */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">More Work</span>
            <h2 className="text-3xl font-bold text-primary">Other Projects</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {otherClients.map((other) => (
              <Link key={other.slug} href={`/portfolio/${other.slug}`} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="h-40 bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center">
                  <span className="text-4xl font-bold text-accent/20">
                    {other.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs text-accent">{other.industry}</span>
                  <h3 className="font-bold text-primary mt-1 mb-2">{other.name}</h3>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-bold text-accent">{other.results!.trafficIncrease}</span>
                      <span className="text-text-muted ml-1">Traffic</span>
                    </div>
                    <div>
                      <span className="font-bold text-accent">{other.results!.leadsIncrease}</span>
                      <span className="text-text-muted ml-1">Leads</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 bg-bg-secondary text-primary font-medium rounded-lg hover:bg-bg-tertiary transition-colors">
              View All Projects <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Want Results Like {client.name}?</h2>
            <p className="text-white/80 mb-8">
              Let&apos;s discuss how we can help transform your business.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
              Start Your Project
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
