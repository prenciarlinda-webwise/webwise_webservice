import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart } from 'lucide-react'
import { services, siteConfig } from '@/data/site'
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/schemas'

const iconMap: { [key: string]: React.ElementType } = {
  Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart
}

function getIcon(iconName: string, size = 20) {
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent size={size} /> : null
}

export async function generateStaticParams() {
  const params: { slug: string; subslug: string }[] = []
  Object.entries(services).forEach(([slug, service]) => {
    Object.keys(service.subservices).forEach((subslug) => {
      params.push({ slug, subslug })
    })
  })
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; subslug: string }> }) {
  const { slug, subslug } = await params
  const service = services[slug as keyof typeof services]
  if (!service) return { title: 'Service Not Found' }
  const subservices = service.subservices as Record<string, { title: string; slug: string; icon: string; description: string }>
  const subservice = subservices[subslug]
  if (!subservice) return { title: 'Service Not Found' }
  return {
    title: `${subservice.title} - ${service.title}`,
    description: subservice.description,
  }
}

type Subservice = { title: string; slug: string; icon: string; description: string }

export default async function SubservicePage({ params }: { params: Promise<{ slug: string; subslug: string }> }) {
  const { slug, subslug } = await params
  const service = services[slug as keyof typeof services]

  if (!service) {
    notFound()
  }

  const subservices = service.subservices as Record<string, Subservice>
  const subservice = subservices[subslug]

  if (!subservice) {
    notFound()
  }

  const pageUrl = `${siteConfig.url}/services/${slug}/${subslug}`
  const serviceSchema = generateServiceSchema({
    name: `${subservice.title} - ${service.title}`,
    description: subservice.description,
    url: pageUrl,
  })
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Services', url: `${siteConfig.url}/services` },
    { name: service.title, url: `${siteConfig.url}/services/${slug}` },
    { name: subservice.title, url: pageUrl },
  ])

  return (
    <>
      <Script
        id="subservice-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="container px-6">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white">Services</Link>
            <span>/</span>
            <Link href={`/services/${slug}`} className="hover:text-white">{service.title}</Link>
            <span>/</span>
            <span className="text-white">{subservice.title}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl text-white mb-6">
              {getIcon(subservice.icon, 32)}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">{subservice.title}</h1>
            <p className="text-lg text-white/80">{subservice.description}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-primary mb-6">What We Deliver</h2>
              <p className="text-text-secondary mb-8">
                Our {subservice.title.toLowerCase()} service is designed to help your business achieve measurable results.
                We combine industry expertise with data-driven strategies to deliver outcomes that matter.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {[
                  { title: 'Strategy Development', desc: 'Custom strategies tailored to your goals' },
                  { title: 'Implementation', desc: 'Expert execution of all initiatives' },
                  { title: 'Monitoring', desc: 'Continuous tracking and optimization' },
                  { title: 'Reporting', desc: 'Transparent, detailed performance reports' },
                ].map((item, i) => (
                  <div key={i} className="bg-bg-secondary rounded-xl p-6">
                    <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent mb-4">
                      <Check size={20} />
                    </div>
                    <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-primary mb-6">Our Process</h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Discovery', desc: 'We analyze your current situation and understand your goals.' },
                  { step: '02', title: 'Strategy', desc: 'We develop a customized plan tailored to your needs.' },
                  { step: '03', title: 'Execution', desc: 'Our team implements the strategy with precision.' },
                  { step: '04', title: 'Optimization', desc: 'We continuously improve based on performance data.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary text-white font-bold rounded-xl flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                      <p className="text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-border rounded-2xl p-8 sticky top-28">
                <h3 className="text-xl font-bold text-primary mb-6">Get Started</h3>
                <p className="text-text-secondary mb-6">
                  Ready to improve your {subservice.title.toLowerCase()}? Contact us for a free consultation.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 w-full justify-center px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors mb-4">
                  Get Free Quote
                  <ArrowRight size={18} />
                </Link>
                <p className="text-sm text-text-muted text-center">No commitment required</p>

                <hr className="my-8 border-border" />

                <h4 className="font-semibold text-primary mb-4">Other Services</h4>
                <div className="space-y-3">
                  {Object.entries(subservices)
                    .filter(([key]) => key !== subslug)
                    .slice(0, 3)
                    .map(([key, sub]) => (
                      <Link
                        key={key}
                        href={`/services/${slug}/${key}`}
                        className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
                      >
                        {getIcon(sub.icon, 16)}
                        <span className="text-sm">{sub.title}</span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">Ready to Get Started?</h2>
            <p className="text-text-secondary mb-8">
              Let&apos;s discuss how our {subservice.title.toLowerCase()} services can help grow your business.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
              Schedule a Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
