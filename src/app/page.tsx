import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Star, ExternalLink, Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart, ChevronDown } from 'lucide-react'
import { services, clients, techStack, siteConfig, getWhatsAppUrl } from '@/data/site'
import { generateFAQSchema } from '@/lib/schemas'
import WebsiteRoast from '@/components/sections/WebsiteRoast'
import { pageSEO } from '@/data/seo'
import type { Metadata } from 'next'

// Homepage-specific metadata
export const metadata: Metadata = {
  title: pageSEO.home.title,
  description: pageSEO.home.description,
  keywords: pageSEO.home.keywords,
  openGraph: {
    title: pageSEO.home.title,
    description: pageSEO.home.description,
    type: 'website',
  },
}

// Homepage FAQs
const homepageFaqs = [
  { question: 'What services does WebWise offer?', answer: 'We offer comprehensive digital services including custom web design and development, SEO (Local, Technical, E-commerce), and digital marketing (Content Marketing, PPC, Social Media). We specialize in helping local service businesses like plumbers, roofers, and contractors dominate their local markets.' },
  { question: 'How long does it take to build a website?', answer: 'A typical website project takes 2-4 weeks from start to launch. This includes discovery, design, development, and testing phases. More complex projects like web applications may take 6-8 weeks. We provide a detailed timeline during our initial consultation.' },
  { question: 'How much do your services cost?', answer: 'Our website packages start at $1,500 (one-time), which includes SEO setup and Google Business Profile optimization. Monthly SEO services range from $480 to $1,100 depending on your needs. We offer transparent pricing with no hidden fees.' },
  { question: 'How long does SEO take to show results?', answer: 'SEO is a long-term strategy. Most clients start seeing initial improvements within 1-2 months, with significant results by month 3-6. We provide monthly reports so you can track progress. Local SEO typically shows faster results than national campaigns.' },
  { question: 'Do you work with businesses outside the UK and USA?', answer: 'Yes! While we specialize in UK and USA markets, we work with businesses worldwide. Our team operates remotely and can accommodate different time zones. We have experience with international SEO for businesses targeting multiple countries.' },
  { question: 'What makes WebWise different from other agencies?', answer: 'We combine technical expertise with a results-focused approach. Unlike agencies that use generic templates, we build custom solutions tailored to your business. We specialize in local service businesses and understand their unique challenges. Plus, we offer transparent pricing and clear 3-month roadmaps so you know exactly what to expect.' },
]

const homepageFaqSchema = generateFAQSchema(homepageFaqs)

// Homepage-specific schemas
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logo}`,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteConfig.url}/#business`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logo}`,
  image: `${siteConfig.url}${siteConfig.logo}`,
  description: siteConfig.description,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  priceRange: "$$",
  currenciesAccepted: "USD, GBP, EUR",
  paymentAccepted: "Credit Card, Bank Transfer, PayPal",
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressRegion: "England",
    addressCountry: "UK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "51.5074",
    longitude: "-0.1278",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    }
  ],
  areaServed: [
    {
      "@type": "Country",
      name: "United Kingdom",
      "@id": "https://www.wikidata.org/wiki/Q145"
    },
    {
      "@type": "Country",
      name: "United States",
      "@id": "https://www.wikidata.org/wiki/Q30"
    },
    {
      "@type": "City",
      name: "London",
      "@id": "https://www.wikidata.org/wiki/Q84"
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "50",
    bestRating: "5",
    worstRating: "1",
  },
  review: [
    {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: {
        "@type": "Organization",
        name: "Gimo's Roofing",
      },
      reviewBody: "Our local SEO results have been phenomenal. We went from invisible to dominating the map pack in just 3 months.",
    },
    {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: {
        "@type": "Organization",
        name: "MSC Certification",
      },
      reviewBody: "The certification management system they built has streamlined our entire operation.",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Website Development",
        description: "Custom website design and development using Next.js",
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        price: "1500",
        priceCurrency: "USD",
        unitText: "one-time",
      }
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "SEO Services",
        description: "Search engine optimization for local businesses",
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        price: "450",
        priceCurrency: "USD",
        unitText: "monthly",
      }
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Local SEO",
        description: "Google Business Profile optimization and local rankings",
      }
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Digital Marketing",
        description: "PPC advertising, content marketing, and social media",
      }
    },
  ],
}

const iconMap: { [key: string]: React.ElementType } = {
  Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart
}

// URL mappings for new flat URL structure
const serviceUrlMap: Record<string, string> = {
  'seo': '/seo-services',
  'web-development': '/development',
  'digital-marketing': '/digital-marketing',
}

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

function getIcon(iconName: string, size = 20) {
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent size={size} /> : null
}

export default function Home() {
  return (
    <>
      {/* Homepage Schemas */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="homepage-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
        </div>
        <div className="container px-6 relative py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Trusted by 50+ Businesses
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Digital Excellence<br />
                <span className="text-gradient">Delivered.</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                We craft high-performance websites and implement data-driven SEO strategies that transform your digital presence into a powerful growth engine.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <a href={getWhatsAppUrl("Hi, I'd like to start a project with WebWise!")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors shadow-lg">
                  Start Your Project
                  <ArrowRight size={18} />
                </a>
                <Link href="/case-studies" className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                  View Case Studies
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['JD', 'MK', 'SR'].map((initials, i) => (
                    <div key={i} className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-sm font-bold border-2 border-primary">
                      {initials}
                    </div>
                  ))}
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold border-2 border-primary">
                    +7
                  </div>
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-sm text-white/70">Rated 5.0 by our clients</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-text-secondary">Performance Dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '340%', label: 'Traffic Increase', width: '85%' },
                  { value: '50+', label: 'Projects Delivered', width: '92%' },
                  { value: '500+', label: 'Keywords Ranked', width: '78%' },
                  { value: '98%', label: 'Client Satisfaction', width: '98%' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-text-muted mb-2">{stat.label}</div>
                    <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full" style={{ width: stat.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Roast Section */}
      <WebsiteRoast />

      {/* Services Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">What We Do</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Comprehensive Digital Solutions</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From stunning websites to dominating search results, we provide end-to-end digital services tailored to your business objectives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(services).map(([key, service], i) => (
              <div key={key} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-border">
                <div className="text-5xl font-bold text-bg-tertiary mb-4">0{i + 1}</div>
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light rounded-xl text-white mb-4">
                  {getIcon(service.icon, 28)}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-text-secondary mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {Object.values(service.subservices).slice(0, 4).map((sub, j) => (
                    <li key={j} className="text-sm text-text-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {sub.title}
                    </li>
                  ))}
                </ul>
                <Link href={serviceUrlMap[key] || `/services/${key}`} className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                  Learn more <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Portfolio</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Case Studies & Client Work</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Real results for real businesses. Explore our complete portfolio of successful projects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(clients).filter(([, c]) => c.results).map(([key, client]) => (
              <div key={key} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow group">
                {/* Website Screenshot */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-bg-tertiary to-bg-secondary">
                  <img
                    src={client.image}
                    alt={`${client.name} website screenshot`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {client.industry}
                  </span>
                  <h3 className="text-lg font-bold text-primary mt-3 mb-2">
                    <a href={client.url} target="_blank" className="hover:text-accent transition-colors">
                      {client.name}
                    </a>
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">{client.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {client.services.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-bg-secondary rounded-full text-text-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{client.results!.trafficIncrease}</div>
                      <div className="text-xs text-text-muted">Traffic</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{client.results!.leadsIncrease}</div>
                      <div className="text-xs text-text-muted">Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{client.results!.rankingKeywords}</div>
                      <div className="text-xs text-text-muted">Keywords</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <a href={client.url} target="_blank" className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors">
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

      {/* Results Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Impact</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Results That Speak for Themselves</h2>
              <p className="text-text-secondary mb-8">
                We measure success by the growth we deliver. Our data-driven approach consistently produces exceptional outcomes for our clients.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '340%', label: 'Average Traffic Increase' },
                  { value: '50+', label: 'Successful Projects' },
                  { value: '500+', label: 'Keywords Ranked' },
                  { value: '10+', label: 'Happy Clients' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                    <div className="text-sm text-text-secondary">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-text-secondary">Traffic Growth</span>
                <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">+340%</span>
              </div>
              <div className="flex items-end gap-3 h-48">
                {[25, 35, 45, 55, 70, 85, 100].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-t-md transition-all ${i === 6 ? 'bg-accent' : 'bg-bg-tertiary hover:bg-accent/30'}`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-text-muted">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Technology</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Built With Modern Tech</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We leverage cutting-edge technologies to deliver fast, scalable, and secure solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(techStack).map(([category, techs]) => (
              <div key={category} className="text-center">
                <h4 className="font-semibold text-primary mb-4 capitalize">{category}</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {techs.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-bg-secondary text-text-secondary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-default">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">What Our Clients Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The certification management system they built has streamlined our entire operation. The admin dashboard and QR code verification feature have saved us countless hours.",
                company: "MSC Certification",
                url: "https://msc-cert.com"
              },
              {
                quote: "The web application they built for us is incredible. Fast, reliable, and exactly what we needed. Their Django expertise is unmatched.",
                company: "GjejPro",
                url: "https://www.gjejpro.com"
              },
              {
                quote: "Our local SEO results have been phenomenal. We went from invisible to dominating the map pack in just 3 months.",
                company: "Gimo's Roofing",
                url: "https://www.gimosroofing.com"
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <blockquote className="text-text-secondary mb-6">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.company.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <a href={testimonial.url} target="_blank" className="font-semibold text-primary hover:text-accent transition-colors">
                      {testimonial.company}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">FAQ</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Get answers to common questions about our services, pricing, and process.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {homepageFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-primary mb-2">{faq.question}</h3>
                <p className="text-text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Transform Your Digital Presence?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Let&apos;s discuss how we can help your business grow with a tailored digital strategy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href={getWhatsAppUrl("Hi, I'd like to get a free consultation for my business.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                  Get Your Free Consultation
                  <ArrowRight size={18} />
                </a>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
