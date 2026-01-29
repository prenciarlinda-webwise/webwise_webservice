import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart, AlertCircle, CheckCircle, User, Award, Clock } from 'lucide-react'
import { services, siteConfig, getWhatsAppUrl } from '@/data/site'
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema, generateHowToSchema } from '@/lib/schemas'
import FAQSection from '@/components/sections/FAQSection'
import { pageSEO } from '@/data/seo'
import { getServiceContent } from '@/data/serviceContent'

const iconMap: { [key: string]: React.ElementType } = {
  Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart
}

function getIcon(iconName: string, size = 20) {
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent size={size} /> : null
}

// URL mappings for new flat URL structure
const serviceUrlMap: Record<string, string> = {
  'seo': '/seo-services',
  'web-development': '/development',
  'digital-marketing': '/digital-marketing',
}

const subserviceUrlMap: Record<string, Record<string, string>> = {
  'seo': {
    'local-seo': '/local-seo',
    'technical-seo': '/technical-seo',
    'ecommerce-seo': '/ecommerce-seo',
    'international-seo': '/international-seo',
  },
  'web-development': {
    'website-design': '/development',
    'web-applications': '/development/applications',
    'ecommerce-development': '/development/ecommerce',
  },
  'digital-marketing': {
    'content-marketing': '/digital-marketing/content',
    'ppc-advertising': '/digital-marketing/ppc',
    'social-media': '/digital-marketing/social-management',
    'analytics': '/digital-marketing/analytics',
  },
}

function getCanonicalUrl(slug: string): string {
  const newPath = serviceUrlMap[slug]
  return newPath ? `${siteConfig.url}${newPath}` : `${siteConfig.url}/services/${slug}`
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services[slug as keyof typeof services]
  if (!service) return { title: 'Service Not Found' }

  const seoData = pageSEO[`services/${slug}`]
  const canonicalUrl = getCanonicalUrl(slug)

  return {
    title: seoData?.title || service.title,
    description: seoData?.description || service.description,
    keywords: seoData?.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoData?.title || service.title,
      description: seoData?.description || service.description,
      url: canonicalUrl,
    },
  }
}

// Generate LocalBusiness schema
function generateLocalBusinessSchema() {
  return {
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: ["US", "GB"],
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
    ],
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services[slug as keyof typeof services]

  if (!service) {
    notFound()
  }

  // Get rich content for this service
  const content = getServiceContent(slug)

  const serviceUrl = getCanonicalUrl(slug)
  const serviceSchema = generateServiceSchema({
    name: content?.hero.headline || service.title,
    description: content?.definition.answer || service.description,
    url: serviceUrl,
  })
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
    { name: service.title, url: serviceUrl },
  ])

  // Generate FAQ schema from rich content
  const faqSchema = content?.faqs ? generateFAQSchema(content.faqs) : null

  // Generate HowTo schema from process steps
  const howToSchema = content?.process ? generateHowToSchema({
    name: content.process.question || `How ${service.title} Works`,
    description: content.process.intro,
    steps: content.process.steps.map(step => ({
      name: step.title,
      text: step.description,
    })),
  }) : null

  // Combined schema graph
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      serviceSchema,
      breadcrumbSchema,
      generateLocalBusinessSchema(),
      ...(faqSchema ? [faqSchema] : []),
      ...(howToSchema ? [howToSchema] : []),
    ],
  }

  return (
    <>
      <Script
        id="schema-graph"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="container px-6">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white">Services</Link>
            <span>/</span>
            <span className="text-white">{service.title}</span>
          </nav>
          <div className="max-w-4xl">
            <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl text-white mb-6">
              {getIcon(service.icon, 32)}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {content?.hero.headline || service.title}
            </h1>
            <p className="text-xl text-white/90 mb-4">
              {content?.hero.subheadline || ''}
            </p>
            <p className="text-lg text-white/80 mb-8">
              {content?.hero.valueProposition || service.description}
            </p>
            <a href={getWhatsAppUrl(`Hi, I'm interested in your ${service.title} services.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors audit-btn">
              Get Your Free Consultation
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Key Takeaways Box */}
      {content?.tldr && content.tldr.length > 0 && (
        <section className="py-12 bg-accent/5 border-b border-accent/10">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 border-l-4 border-accent shadow-sm">
                <ul className="space-y-2">
                  {content.tldr.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <Check size={18} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What Is Section - 40-60 word answer for AI/Featured Snippets */}
      {content?.definition && (
        <section className="py-24">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-primary mb-6">
                {content.definition.question || `What Are ${service.title}?`}
              </h2>
              {/* Direct answer - optimized for featured snippets */}
              <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                {content.definition.answer}
              </p>
              {/* Expansion */}
              <p className="text-text-secondary leading-relaxed">
                {content.definition.expansion}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Services</span>
            <h2 className="text-3xl font-bold text-primary">What {service.title} Do We Offer?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(service.subservices).map(([subKey, sub]) => (
              <Link
                key={subKey}
                href={subserviceUrlMap[slug]?.[subKey] || `/services/${slug}/${subKey}`}
                className="bg-white border border-border rounded-2xl p-8 hover:shadow-xl hover:border-accent/30 transition-all group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-bg-secondary rounded-xl text-accent group-hover:bg-accent group-hover:text-white transition-colors mb-6">
                  {getIcon(sub.icon, 28)}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{sub.title}</h3>
                <p className="text-text-secondary mb-4">{sub.description}</p>
                <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why You Need This Service */}
      {content?.whyYouNeed && (
        <section className="py-24">
          <div className="container px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Why It Matters</span>
              <h2 className="text-3xl font-bold text-primary mb-4">
                {content.whyYouNeed.question || `Why Does Your Business Need ${service.title}?`}
              </h2>
              <p className="text-text-secondary max-w-3xl mx-auto">{content.whyYouNeed.intro}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Pain Points */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={24} />
                  Common Challenges
                </h3>
                <div className="space-y-4">
                  {content.whyYouNeed.painPoints.map((pain, i) => (
                    <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-6">
                      <h4 className="font-semibold text-red-800 mb-2">{pain.title}</h4>
                      <p className="text-red-700 text-sm">{pain.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={24} />
                  How We Help
                </h3>
                <div className="space-y-4">
                  {content.whyYouNeed.benefits.map((benefit, i) => (
                    <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-6">
                      <h4 className="font-semibold text-green-800 mb-2">{benefit.title}</h4>
                      <p className="text-green-700 text-sm">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {content?.process && (
        <section className="py-24 bg-bg-secondary">
          <div className="container px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Process</span>
              <h2 className="text-3xl font-bold text-primary mb-4">
                {content.process.question || `How Do Our ${service.title} Work?`}
              </h2>
              <p className="text-text-secondary max-w-3xl mx-auto">{content.process.intro}</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {content.process.steps.map((step, i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 border border-border">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 flex items-center justify-center bg-accent text-white font-bold rounded-xl flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                          {step.duration && (
                            <span className="text-sm text-accent font-medium">{step.duration}</span>
                          )}
                        </div>
                        <p className="text-text-secondary mb-4">{step.description}</p>
                        <ul className="grid md:grid-cols-2 gap-2">
                          {step.details.map((detail, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-text-muted">
                              <Check size={14} className="text-accent flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-primary rounded-2xl p-8 text-white">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-2">Expected Timeline</h4>
                    <p className="text-white/80 text-sm">{content.process.timeline}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What You&apos;ll Receive</h4>
                    <ul className="space-y-1">
                      {content.process.deliverables.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                          <Check size={14} className="text-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Industries We Serve */}
      {content?.industries && (
        <section className="py-24">
          <div className="container px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Industries</span>
              <h2 className="text-3xl font-bold text-primary mb-4">
                {content.industries.question || `Which Industries Benefit From ${service.title}?`}
              </h2>
              <p className="text-text-secondary max-w-3xl mx-auto">{content.industries.intro}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {content.industries.list.map((industry, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-primary mb-2">{industry.name}</h4>
                  <p className="text-sm text-text-secondary mb-3">{industry.description}</p>
                  {industry.link && (
                    <Link href={industry.link} className="text-sm text-accent font-medium hover:underline">
                      Read our guide →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies Section */}
      {content?.caseStudies && content.caseStudies.studies.length > 0 && (
        <section className="py-24 bg-bg-secondary">
          <div className="container px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Results</span>
              <h2 className="text-3xl font-bold text-primary mb-4">
                What Results Have We Achieved with {service.title}?
              </h2>
              <p className="text-text-secondary max-w-3xl mx-auto">{content.caseStudies.intro}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {content.caseStudies.studies.map((study, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-sm text-accent font-medium">{study.industry}</span>
                      <h3 className="text-xl font-bold text-primary">{study.clientName}: {study.resultHeadline}</h3>
                    </div>
                    {study.link && (
                      <Link href={study.link} className="text-sm text-accent font-medium hover:underline">
                        Full case study →
                      </Link>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Challenge</h4>
                      <p className="text-sm text-text-secondary">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Solution</h4>
                      <p className="text-sm text-text-secondary">{study.solution}</p>
                    </div>
                  </div>

                  <div className="bg-bg-secondary rounded-xl p-4">
                    <h4 className="font-semibold text-primary mb-3">Results</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {study.results.map((result, j) => (
                        <div key={j} className="text-center">
                          <div className="text-2xl font-bold text-accent">{result.change}</div>
                          <div className="text-xs text-text-muted">{result.metric}</div>
                          <div className="text-xs text-text-muted">{result.before} → {result.after}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-text-muted mt-3 text-center">
                      Timeline: {study.timeline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {content?.faqs && content.faqs.length > 0 && (
        <FAQSection
          faqs={content.faqs}
          title={`${service.title} FAQ`}
          subtitle={`Common questions about our ${service.title.toLowerCase()}.`}
          background="gray"
        />
      )}

      {/* Author/Team Bio */}
      {content?.authorBio && (
        <section className="py-12 border-t border-border">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 p-6 bg-bg-secondary rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">About Our {service.title} Team</h3>
                  <p className="text-sm text-text-secondary mb-2">
                    Led by the {content.authorBio.teamName}, our specialists have {content.authorBio.experience}. {content.authorBio.approach}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {content.authorBio.credentials.map((credential, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full text-text-muted">
                        <Award size={12} className="text-accent" />
                        {credential}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {content?.cta.headline || `Ready to Get Started with ${service.title}?`}
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              {content?.cta.description || `Contact us for a free consultation and see how our ${service.title.toLowerCase()} can help your business grow.`}
            </p>
            <a href={getWhatsAppUrl(`Hi, I'm interested in your ${service.title} services and would like a free quote.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors audit-btn">
              {content?.cta.buttonText || 'Get Your Free Quote'}
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
