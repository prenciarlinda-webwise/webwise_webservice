import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart } from 'lucide-react'
import { services, siteConfig } from '@/data/site'
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schemas'
import { seoFaqs, webDevFaqs, digitalMarketingFaqs } from '@/data/faqs'
import FAQSection from '@/components/sections/FAQSection'

// Map service slugs to their FAQ data
const faqMap: { [key: string]: { question: string; answer: string }[] } = {
  'seo': seoFaqs,
  'web-development': webDevFaqs,
  'digital-marketing': digitalMarketingFaqs,
}

const iconMap: { [key: string]: React.ElementType } = {
  Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart
}

function getIcon(iconName: string, size = 20) {
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent size={size} /> : null
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services[slug as keyof typeof services]
  if (!service) return { title: 'Service Not Found' }
  return {
    title: service.title,
    description: service.description,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services[slug as keyof typeof services]

  if (!service) {
    notFound()
  }

  const serviceUrl = `${siteConfig.url}/services/${slug}`
  const serviceFaqs = faqMap[slug] || []
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.description,
    url: serviceUrl,
  })
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
    { name: service.title, url: serviceUrl },
  ])
  const faqSchema = serviceFaqs.length > 0 ? generateFAQSchema(serviceFaqs) : null

  return (
    <>
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

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
          <div className="max-w-3xl">
            <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl text-white mb-6">
              {getIcon(service.icon, 32)}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">{service.title}</h1>
            <p className="text-lg text-white/80">{service.description}</p>
          </div>
        </div>
      </section>

      {/* Subservices */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">What We Offer</span>
            <h2 className="text-3xl font-bold text-primary">Our {service.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(service.subservices).map(([subKey, sub]) => (
              <Link
                key={subKey}
                href={`/services/${slug}/${subKey}`}
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

      {/* Why Choose Us */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Why Choose Us</span>
              <h2 className="text-3xl font-bold text-primary mb-6">Why Our {service.title} Stand Out</h2>
              <div className="space-y-4">
                {[
                  'Data-driven strategies tailored to your business',
                  'Transparent reporting and communication',
                  'Proven track record of success',
                  'Dedicated team of experts',
                  'Continuous optimization and improvement',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 flex items-center justify-center bg-accent rounded-full text-white flex-shrink-0 mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-6">Get Started Today</h3>
              <p className="text-text-secondary mb-6">
                Ready to take your {service.title.toLowerCase()} to the next level? Contact us for a free consultation.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 w-full justify-center px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
                Get Your Free Quote
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {serviceFaqs.length > 0 && (
        <FAQSection
          faqs={serviceFaqs}
          title={`${service.title} FAQ`}
          subtitle={`Common questions about our ${service.title.toLowerCase()}.`}
        />
      )}
    </>
  )
}
