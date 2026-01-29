import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Star, Phone, Mail, MessageCircle, Code, Search, TrendingUp, Droplet, Wind, Zap, Car, Truck, TreePine, Bug, Sparkles, Building, Home as HomeIcon } from 'lucide-react'
import { siteConfig, getWhatsAppUrl, techStack } from '@/data/site'
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
  {
    question: 'What services does WebWise offer?',
    answer: 'WebWise offers custom web development (websites, e-commerce, web applications), SEO services (local, technical, e-commerce, international), and digital marketing (PPC, content marketing, social media). We specialize in contractors and small businesses across the UK and USA.'
  },
  {
    question: 'How long does it take to build a website?',
    answer: 'A typical website takes 2-4 weeks from start to launch. This includes discovery, design, development, and testing. More complex projects like web applications or e-commerce stores may take 6-8 weeks. We provide a detailed timeline upfront.'
  },
  {
    question: 'How much does a website cost?',
    answer: 'Website packages start at $1,500 (one-time), which includes SEO setup and Google Business Profile optimization. E-commerce and web application projects are quoted based on scope. View our pricing page for full details.'
  },
  {
    question: 'How long does SEO take to show results?',
    answer: 'Most clients see initial improvements within 1-2 months, with significant results by month 3-6. Local SEO typically shows faster results than national campaigns. We provide monthly reports so you can track progress.'
  },
  {
    question: 'Do you work with businesses outside the UK and USA?',
    answer: 'Yes! While we specialize in UK and USA markets, we work with businesses worldwide. We have experience with international SEO and can accommodate different time zones.'
  },
  {
    question: 'What makes WebWise different from other agencies?',
    answer: 'We specialize in contractors and small businesses,  not everyone. We build custom solutions, not templates. We offer transparent pricing with no hidden fees. And we focus on results you can measure: traffic, leads, and revenue.'
  },
]

// Homepage schema
const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "WebWise",
      "url": siteConfig.url,
      "logo": `${siteConfig.url}${siteConfig.logo}`,
      "description": "Web development, SEO, and digital marketing agency for contractors and small businesses in the UK and USA.",
      "telephone": siteConfig.phone,
      "email": siteConfig.email,
      "areaServed": ["United States", "United Kingdom"],
    },
    {
      "@type": "WebSite",
      "name": "WebWise",
      "url": siteConfig.url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteConfig.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "ProfessionalService",
      "name": "WebWise",
      "description": "Web development, SEO, and digital marketing services",
      "telephone": siteConfig.phone,
      "email": siteConfig.email,
      "areaServed": ["United States", "United Kingdom"],
      "priceRange": "$$",
      "serviceType": ["Web Development", "Web Applications", "SEO", "Digital Marketing"]
    },
    {
      "@type": "FAQPage",
      "mainEntity": homepageFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ]
}

// Industries data
const industries = [
  { name: 'Plumbers', slug: 'plumbers', icon: Droplet, description: 'Emergency plumber SEO, website development' },
  { name: 'Roofers', slug: 'roofing', icon: HomeIcon, description: 'Storm damage keywords, lead generation' },
  { name: 'HVAC Companies', slug: 'hvac', icon: Wind, description: 'Seasonal SEO strategies' },
  { name: 'Electricians', slug: 'electricians', icon: Zap, description: 'Emergency + EV charger keywords' },
  { name: 'Auto Detailing', slug: 'auto-detailing', icon: Car, description: 'Mobile detailing, booking sites' },
  { name: 'Dumpster Rental', slug: 'dumpster-rental', icon: Truck, description: 'Size-specific landing pages' },
  { name: 'Landscaping', slug: 'landscaping', icon: TreePine, description: 'Seasonal marketing' },
  { name: 'Pest Control', slug: 'pest-control', icon: Bug, description: 'Emergency pest searches' },
  { name: 'Cleaning Services', slug: 'cleaning', icon: Sparkles, description: 'Residential + commercial' },
  { name: 'Moving Companies', slug: 'moving', icon: Truck, description: 'Local mover keywords' },
  { name: 'Construction', slug: 'construction', icon: Building, description: 'Contractor SEO' },
]

// Case studies
const caseStudies = [
  {
    name: 'MSC Certification',
    slug: 'msc-certification',
    type: 'Web Application',
    description: 'Custom certification management platform with admin dashboard, certificate builder, and QR code verification.',
    services: ['Web Application', 'Website', 'Dashboard'],
    results: { traffic: '250%', leads: '180%', keywords: '35+' }
  },
  {
    name: 'Illyrian Plumber',
    slug: 'illyrian-group',
    type: 'Local SEO + Website',
    description: 'Complete website rebuild and local SEO for East Brunswick, NJ plumber.',
    services: ['Website Development', 'Local SEO', 'Brand Strategy'],
    results: { traffic: '290%', leads: '245%', keywords: '20+', extra: 'Local Pack Top 5' }
  },
  {
    name: "Gimo's Roofing",
    slug: 'gimos-roofing',
    type: 'Local SEO + Website + PPC',
    description: 'Full-service roofing website with local SEO and Google Ads management.',
    services: ['Website Development', 'Local SEO', 'Google Ads'],
    results: { traffic: '380%', leads: '295%', keywords: '52+' }
  },
  {
    name: '904 Dumpster',
    slug: '904-dumpster',
    type: 'Local SEO + Website',
    description: 'Dumpster rental website with pricing calculator and online booking.',
    services: ['Website Development', 'Local SEO'],
    results: { traffic: '445%', leads: '350%', keywords: '67+' }
  },
  {
    name: 'GjejPro',
    slug: 'gjej-pro',
    type: 'Web Application + SEO',
    description: 'Professional services marketplace with booking, reviews, and admin dashboard.',
    services: ['Web Application', 'SEO', 'Content Marketing'],
    results: { traffic: '580%', leads: '430%', keywords: '92+' }
  },
]

// Testimonials
const testimonials = [
  {
    quote: "Our local SEO results have been phenomenal. We went from invisible to dominating the map pack in just 3 months.",
    company: "Gimo's Roofing"
  },
  {
    quote: "The certification management system they built has streamlined our entire operation. The admin dashboard and QR code verification feature have saved us countless hours.",
    company: "MSC Certification"
  },
  {
    quote: "The web application they built for us is incredible. Fast, reliable, and exactly what we needed. Their Django expertise is unmatched.",
    company: "GjejPro"
  },
]

export default function Home() {
  return (
    <>
      {/* Homepage Schema */}
      <Script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
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
                Trusted by 50+ businesses in UK & USA
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Web Development, SEO & Digital Marketing
                <span className="text-gradient"> for Small Business</span>
              </h1>
              <p className="text-xl text-white/90 font-medium mb-4">
                Websites That Convert. SEO That Ranks. Marketing That Grows.
              </p>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                We help contractors and small businesses dominate online,  with lightning-fast
                websites (98+ PageSpeed), local SEO that puts you in the Google Map Pack, and
                digital marketing that generates real leads.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <a href={getWhatsAppUrl("Hi, I'd like a free audit for my business!")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors shadow-lg">
                  Get Your Free Audit
                  <ArrowRight size={18} />
                </a>
                <Link href="/case-studies" className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                  View Case Studies
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['JD', 'MK', 'SR', 'PL'].map((initials, i) => (
                    <div key={i} className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-sm font-bold border-2 border-primary">
                      {initials}
                    </div>
                  ))}
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold border-2 border-primary">
                    +46
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
                  { value: '340%', label: 'Average Traffic Increase', width: '85%' },
                  { value: '50+', label: 'Projects Delivered', width: '92%' },
                  { value: '500+', label: 'Keywords Ranked', width: '78%' },
                  { value: '98+', label: 'PageSpeed Scores', width: '98%' },
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

      {/* Key Stats Bar */}
      <section className="bg-white py-8 border-b border-border">
        <div className="container px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">340%</div>
              <div className="text-sm text-text-muted">Average Traffic Increase</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">50+</div>
              <div className="text-sm text-text-muted">Projects Delivered</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-text-muted">Keywords Ranked</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">98+</div>
              <div className="text-sm text-text-muted">PageSpeed Scores</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section - AEO Optimized */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">What We Do</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">What Does WebWise Do?</h2>
            <p className="text-lg text-text-secondary mb-6">
              WebWise is a web development and digital marketing agency that helps contractors
              and small businesses grow online. We build custom, high-performance websites that
              load fast and convert visitors into customers. We implement local SEO strategies
              that put you at the top of Google Maps. And we run digital marketing campaigns, 
              PPC, content, and social,  that generate measurable leads. We specialize in
              plumbers, roofers, HVAC companies, and service businesses across the UK and USA.
            </p>
            <p className="text-text-secondary font-medium">
              <strong className="text-primary">We&apos;re not a generalist agency.</strong> We only work with small businesses and
              contractors. That focus means we understand your customers, your competition,
              and what actually works in your industry.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section - All Three Equal Weight */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Services</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Comprehensive Digital Solutions</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From custom websites to dominating search results, we provide end-to-end
              digital services tailored to your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Web Development */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-border">
              <div className="text-5xl font-bold text-bg-tertiary mb-4">01</div>
              <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light rounded-xl text-white mb-4">
                <Code size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Web Development</h3>
              <p className="text-text-secondary mb-4">
                Custom websites and web applications built for speed, conversions, and growth.
              </p>
              <p className="text-sm font-medium text-primary mb-4">What we build:</p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-text-muted">
                  <Link href="/development" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Custom Websites -  Fast, mobile-first sites
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/development/ecommerce" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    E-commerce Stores - Shopify, WooCommerce, custom
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/development/applications" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Web Applications - Dashboards, portals, tools
                  </Link>
                </li>
              </ul>
              <p className="text-sm text-accent font-medium mb-4">Our websites average 98+ PageSpeed scores</p>
              <Link href="/development" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                Learn more <ArrowRight size={16} />
              </Link>
            </div>

            {/* SEO Services */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-border">
              <div className="text-5xl font-bold text-bg-tertiary mb-4">02</div>
              <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light rounded-xl text-white mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">SEO Services</h3>
              <p className="text-text-secondary mb-4">
                Data-driven SEO strategies that get you found on Google,  Maps and organic.
              </p>
              <p className="text-sm font-medium text-primary mb-4">What we offer:</p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-text-muted">
                  <Link href="/local-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Local SEO - Google Maps, GBP, citations
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/technical-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Technical SEO - Audits, speed, crawlability
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/ecommerce-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    E-commerce SEO - Product optimization
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/international-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    International SEO - Multi-region targeting
                  </Link>
                </li>
              </ul>
              <p className="text-sm text-accent font-medium mb-4">Our clients average 340% traffic increases</p>
              <Link href="/local-seo" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                Learn more <ArrowRight size={16} />
              </Link>
            </div>

            {/* Digital Marketing */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-border">
              <div className="text-5xl font-bold text-bg-tertiary mb-4">03</div>
              <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light rounded-xl text-white mb-4">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Digital Marketing</h3>
              <p className="text-text-secondary mb-4">
                Complete marketing strategies that drive traffic, leads, and revenue.
              </p>
              <p className="text-sm font-medium text-primary mb-4">What we offer:</p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-text-muted">
                  <Link href="/digital-marketing/ppc" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    PPC Advertising - Google Ads, Facebook Ads
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/digital-marketing/content" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Content Marketing - Blogs, guides, SEO content
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/digital-marketing/social-management" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Social Media - Strategy, management, ads
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/digital-marketing/analytics" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Analytics - Tracking, reporting, insights
                  </Link>
                </li>
              </ul>
              <p className="text-sm text-accent font-medium mb-4">We focus on ROI,  not vanity metrics</p>
              <Link href="/digital-marketing" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                Learn more <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Industries</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Who We Work With</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We specialize in contractors and local service businesses. If you serve
              customers in a specific area, we can help you dominate that market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {industries.map((industry) => {
              const IconComponent = industry.icon
              return (
                <Link
                  key={industry.slug}
                  href={`/local-seo/${industry.slug}`}
                  className="bg-white rounded-xl p-6 border border-border hover:shadow-lg hover:border-accent/30 transition-all group"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="font-bold text-primary mb-2 group-hover:text-accent transition-colors">{industry.name}</h3>
                  <p className="text-sm text-text-muted">{industry.description}</p>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
              Don&apos;t see your industry? We probably still work with you <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Results</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Results for Businesses Like Yours</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Real projects. Real results. Here&apos;s what we&apos;ve built and achieved:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <div key={study.slug} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">{study.type}</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  <Link href={`/case-studies/${study.slug}`} className="hover:text-accent transition-colors">
                    {study.name}
                  </Link>
                </h3>
                <p className="text-sm text-text-secondary mb-4">{study.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.services.map((service, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-bg-secondary rounded-full text-text-muted">
                      {service}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-border mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{study.results.traffic}</div>
                    <div className="text-xs text-text-muted">Traffic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{study.results.leads}</div>
                    <div className="text-xs text-text-muted">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{study.results.keywords}</div>
                    <div className="text-xs text-text-muted">Keywords</div>
                  </div>
                </div>
                {study.results.extra && (
                  <p className="text-xs text-accent font-medium mb-4">{study.results.extra}</p>
                )}
                <Link href={`/case-studies/${study.slug}`} className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:gap-3 transition-all">
                  View Case Study <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/case-studies" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
              View All Case Studies <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Process</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">How We Work</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Simple process. Clear timeline. No surprises.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  step: 1,
                  title: 'Free Consultation',
                  description: 'We discuss your business, goals, and challenges. You\'ll get honest advice,  even if that means we\'re not the right fit.'
                },
                {
                  step: 2,
                  title: 'Proposal & Roadmap',
                  description: 'You receive a clear proposal with scope, timeline, and pricing. No hidden fees. No vague deliverables.'
                },
                {
                  step: 3,
                  title: 'Build & Launch',
                  description: 'For websites: 2-4 weeks to launch. For SEO: Month 1 is foundation, months 2-6 are growth. For marketing: Campaigns live within 1-2 weeks.'
                },
                {
                  step: 4,
                  title: 'Measure & Optimize',
                  description: 'Monthly reports showing traffic, leads, and ROI. We optimize based on data, not guesses.'
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">{item.title}</h3>
                    <p className="text-text-secondary">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
                Start With a Free Consultation <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Technology</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Built With Modern Technology</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We use cutting-edge tools to deliver fast, scalable, secure solutions.
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
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-border">
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
                    <span className="font-semibold text-primary">
                      {testimonial.company}
                    </span>
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

      {/* Final CTA Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Grow Your Business Online?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Let&apos;s discuss how we can help with a tailored website, SEO strategy,
                or marketing campaign.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a href={getWhatsAppUrl("Hi, I'd like to get a free consultation for my business.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                  Get Your Free Consultation
                  <ArrowRight size={18} />
                </a>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                  View Pricing
                </Link>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                  <Phone size={16} />
                  {siteConfig.phone}
                </a>
                <a href={getWhatsAppUrl("Hi!")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                  <Mail size={16} />
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}