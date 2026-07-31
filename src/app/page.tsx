import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { ArrowRight, Star, Code, Search, TrendingUp, Droplet, Wind, Zap, Car, Truck, TreePine, Bug, Sparkles, Building, Home as HomeIcon, KeyRound, MapPin } from 'lucide-react'
import { siteConfig, techStack, clients } from '@/data/site'
import { pageSEO } from '@/data/seo'
import type { Metadata } from 'next'
import LeadForm from '@/components/forms/LeadForm'
import PricingCTA from '@/components/forms/PricingCTA'
import ScreenshotFrame from '@/components/ui/ScreenshotFrame'

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
    question: 'What services does Web Wise offer?',
    answer: 'Web Wise offers custom web development (websites, e-commerce, web applications), SEO services (local, technical, e-commerce, international), and digital marketing (PPC, content marketing, social media). We specialize in contractors and small businesses across the UK and USA.'
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
    question: 'What makes Web Wise different from other agencies?',
    answer: 'We specialize in contractors and small businesses, not everyone. We build custom solutions, not templates. We offer transparent pricing with no hidden fees. And we focus on results you can measure, traffic, leads, and revenue.'
  },
]

// Homepage schema
const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Web Wise",
      "url": siteConfig.url,
      "logo": `${siteConfig.url}${siteConfig.logo}`,
      "description": "Web development, SEO, and digital marketing agency for contractors and small businesses in the UK and USA.",
      "areaServed": ["United States", "United Kingdom"],
    },
    {
      "@type": "WebSite",
      "name": "Web Wise",
      "url": siteConfig.url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteConfig.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "ProfessionalService",
      "name": "Web Wise",
      "description": "Web development, SEO, and digital marketing services",
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
  { name: 'Locksmiths', slug: 'locksmiths', icon: KeyRound, description: 'Emergency lockout SEO' },
]

// Case studies (image pulled from the real client screenshot already generated in site.ts)
const caseStudies = [
  {
    name: 'MSC Certification',
    slug: 'msc-certification',
    type: 'Web Application',
    description: 'Custom certification management platform with admin dashboard, certificate builder, and QR code verification.',
    services: ['Web Application', 'Website', 'Dashboard'],
    results: { traffic: '250%', leads: '180%', keywords: '35+' },
    image: clients.msccertification.image,
  },
  {
    name: 'Illyrian Plumber',
    slug: 'illyrian-group',
    type: 'Local SEO + Website',
    description: 'Complete website rebuild and local SEO for East Brunswick, NJ plumber.',
    services: ['Website Development', 'Local SEO', 'Brand Strategy'],
    results: { traffic: '553%', leads: '245%', keywords: '911+', extra: 'Local Pack Top 5' },
    image: clients.illyrianplumber.image,
  },
  {
    name: "Gimo's Roofing",
    slug: 'gimos-roofing',
    type: 'Local SEO + Website + PPC',
    description: 'Full-service roofing website with local SEO and Google Ads management.',
    services: ['Website Development', 'Local SEO', 'Google Ads'],
    results: { traffic: '380%', leads: '295%', keywords: '52+' },
    image: clients.gimosroofing.image,
  },
  {
    name: '904 Dumpster',
    slug: '904-dumpster',
    type: 'Local SEO + Website',
    description: 'Dumpster rental website with pricing calculator and online booking.',
    services: ['Website Development', 'Local SEO'],
    results: { traffic: '445%', leads: '350%', keywords: '67+' },
    image: clients['904dumpster'].image,
  },
  {
    name: 'GjejPro',
    slug: 'gjej-pro',
    type: 'Web Application + SEO',
    description: 'Professional services marketplace with booking, reviews, and admin dashboard.',
    services: ['Web Application', 'SEO', 'Content Marketing'],
    results: { traffic: '580%', leads: '430%', keywords: '92+' },
    image: clients.gjejpro.image,
  },
]

// Ambient hero proof strip, visual only, names/domains intentionally omitted
// so this decorative use never becomes a shortcut straight to a client's live site
const proofScreenshots = [
  { image: clients.gimosroofing.image, alt: 'Screenshot of a roofing company website we designed', rotate: -4 },
  { image: clients.illyrianplumber.image, alt: 'Screenshot of a plumbing company website we designed', rotate: 3 },
  { image: clients['904dumpster'].image, alt: 'Screenshot of a dumpster rental website we designed', rotate: -2 },
  { image: clients.aaaremodels.image, alt: 'Screenshot of a home remodeling website we designed', rotate: 4 },
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
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="container px-6 relative py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-[1.05] tracking-tight">
                Websites and SEO
                <span className="text-gradient"> built to get you found</span>
              </h1>
              <p className="text-xl text-white/90 font-medium mb-4">
                Websites that convert, SEO that ranks, marketing that grows.
              </p>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                We help contractors and small businesses dominate online, with lightning fast
                websites (98+ PageSpeed), local SEO that puts you in the Google Map Pack, and
                digital marketing that generates real leads.
              </p>

              {/* Proof strip, real screenshots, no domains named on purpose */}
              <div className="flex items-end gap-3 mb-4">
                {proofScreenshots.map((shot, i) => (
                  <ScreenshotFrame
                    key={i}
                    image={shot.image}
                    alt={shot.alt}
                    rotate={shot.rotate}
                    className={`w-16 sm:w-20 shrink-0 ${i >= 2 ? 'hidden sm:block' : ''} ${i === 3 ? 'hidden lg:block' : ''}`}
                  />
                ))}
                <p className="text-sm text-white/70 pb-1">Real sites we&apos;ve designed and ranked</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-sm text-white/70">Rated 5.0, 50+ businesses helped</span>
              </div>
            </div>

            {/* Lead Capture Form */}
            <div className="relative">
              <div className="absolute -top-4 -right-3 sm:-right-6 z-10 bg-accent text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full shadow-lg rotate-3">
                +553% traffic for one client
              </div>
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-primary mb-2">Get a Free Audit</h2>
                <p className="text-sm text-text-secondary mb-6">
                  Tell us about your project. We&apos;ll reply within 24 hours with concrete next steps.
                </p>
                <LeadForm source="Homepage hero" ctaLabel="Get My Free Audit" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section - AEO Optimized */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">What We Do</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">What Does Web Wise Do?</h2>
            <p className="text-lg text-text-secondary mb-6">
              Web Wise is a web development and digital marketing agency that helps contractors
              and small businesses grow online. We build custom, high-performance websites that
              load fast and convert visitors into customers. We implement local SEO strategies
              that put you at the top of Google Maps. And we run digital marketing campaigns,
              PPC, content, and social, that generate measurable leads. We specialize in{' '}
              <Link href="/local-seo/plumbers" className="text-accent hover:underline">plumbers</Link>,{' '}
              <Link href="/local-seo/roofing" className="text-accent hover:underline">roofers</Link>,{' '}
              <Link href="/local-seo/hvac" className="text-accent hover:underline">HVAC companies</Link>,{' '}
              <Link href="/local-seo/landscaping" className="text-accent hover:underline">landscapers</Link>,{' '}
              <Link href="/local-seo/locksmiths" className="text-accent hover:underline">locksmiths</Link>,{' '}
              <Link href="/local-seo/cleaning" className="text-accent hover:underline">cleaning services</Link>,
              and other service businesses across the UK and USA.
            </p>
            <p className="text-text-secondary font-medium">
              <strong className="text-primary">We&apos;re not a generalist agency.</strong> We only work with small businesses and
              contractors. That focus means we understand your customers, your competition,
              and what actually works in your industry.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section - Bento layout, Local SEO featured since it's our core focus */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">Our Services</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Comprehensive Digital Solutions</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From custom websites to dominating search results, we provide end-to-end
              digital services tailored to your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* SEO Services - featured bento tile */}
            <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-accent/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 flex items-center justify-center bg-accent rounded-xl text-white shrink-0">
                    <Search size={32} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-widest">Our core focus</span>
                    <h3 className="text-2xl font-bold text-white">SEO Services</h3>
                  </div>
                </div>
                <p className="text-white/80 mb-6 max-w-lg">
                  Data-driven SEO strategies that get you found on Google, in Maps, and in AI search results.
                  This is what most of our clients hire us for first.
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-display font-bold text-accent">340%</span>
                  <span className="text-white/70">average traffic increase across our clients</span>
                </div>
                <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                  <li className="text-sm text-white/90">
                    <Link href="/local-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                      <MapPin size={14} className="text-accent shrink-0" />
                      Local SEO, Google Maps, GBP, citations
                    </Link>
                  </li>
                  <li className="text-sm text-white/90">
                    <Link href="/technical-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      Technical SEO, audits, speed, crawlability
                    </Link>
                  </li>
                  <li className="text-sm text-white/90">
                    <Link href="/ecommerce-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      E-commerce SEO, product optimization
                    </Link>
                  </li>
                  <li className="text-sm text-white/90">
                    <Link href="/international-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      International SEO, multi-region targeting
                    </Link>
                  </li>
                </ul>
                <Link href="/local-seo" className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
                  Explore SEO services <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Web Development */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light rounded-xl text-white mb-4">
                <Code size={22} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Web Development</h3>
              <p className="text-sm text-text-secondary mb-4">
                Custom websites and web applications built for speed and conversions.
              </p>
              <ul className="space-y-1.5 mb-4">
                <li className="text-sm text-text-muted">
                  <Link href="/custom-web-development" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Custom websites
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/ecommerce-website-development" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    E-commerce stores
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/web-application-development" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Web applications
                  </Link>
                </li>
              </ul>
              <p className="text-xs text-accent font-medium mb-4">98+ average PageSpeed score</p>
              <Link href="/custom-web-development" className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:gap-3 transition-all">
                Learn more <ArrowRight size={14} />
              </Link>
            </div>

            {/* Digital Marketing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light rounded-xl text-white mb-4">
                <TrendingUp size={22} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Digital Marketing</h3>
              <p className="text-sm text-text-secondary mb-4">
                Marketing strategies that drive traffic, leads, and revenue.
              </p>
              <ul className="space-y-1.5 mb-4">
                <li className="text-sm text-text-muted">
                  <Link href="/digital-marketing/ppc" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    PPC advertising
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
              <p className="text-sm text-accent font-medium mb-4">We focus on ROI, not vanity metrics</p>
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
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">Industries</span>
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
            <PricingCTA
              source="Homepage — Industry-not-listed inquiry"
              ctaLabel="Don't see your industry? We probably still work with you"
              buttonClassName="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
            />
          </div>

          {/* Popular industry guides - internal linking for SEO */}
          <div className="max-w-5xl mx-auto mt-16 pt-10 border-t border-border">
            <p className="text-center text-sm font-semibold text-primary uppercase tracking-wider mb-5">
              Free Industry SEO Guides
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/blog/plumber-keywords-for-seo" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                Plumbing SEO keywords
              </Link>
              <Link href="/local-seo/plumbers" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                Plumber SEO agency
              </Link>
              <Link href="/local-seo/plumbers" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                Local SEO for plumbers
              </Link>
              <Link href="/blog/locksmith-keywords-for-seo" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                Locksmith SEO guide
              </Link>
              <Link href="/blog/hvac-marketing-ideas" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                HVAC marketing ideas
              </Link>
              <Link href="/blog/plumber-marketing-ideas" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                Marketing for plumbers
              </Link>
              <Link href="/blog/roofing-leads" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                How to get roofing leads
              </Link>
              <Link href="/local-seo/landscaping" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                SEO for landscapers
              </Link>
              <Link href="/local-seo/cleaning" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                Cleaning service SEO
              </Link>
              <Link href="/blog/seo-pricing" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                How much does SEO cost per month
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section - horizontal wall of real screenshots */}
      <section className="py-24 overflow-hidden">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">Results</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Results for Businesses Like Yours</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Real projects, real results. Here is what we have built and achieved.
            </p>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 pb-4">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group shrink-0 w-[300px] sm:w-[360px] snap-start bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Screenshot with overlaid result badge */}
              <div className="relative aspect-[4/3] bg-bg-secondary">
                <Image src={study.image} alt={`Screenshot of the ${study.name} website`} fill unoptimized className="object-cover object-top" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                </div>
                <div className="absolute bottom-3 right-3 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                  +{study.results.traffic} traffic
                </div>
              </div>

              <div className="p-6">
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">{study.type}</span>
                <h3 className="text-lg font-bold text-primary mt-3 mb-2 group-hover:text-accent transition-colors">
                  {study.name}
                </h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{study.description}</p>
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-border">
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
                <span className="inline-flex items-center gap-2 text-sm text-accent font-medium group-hover:gap-3 transition-all">
                  View Case Study <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}

          {/* Trailing card pointing to the full list */}
          <Link
            href="/case-studies"
            className="group shrink-0 w-[300px] sm:w-[360px] snap-start bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex flex-col items-center justify-center text-center p-8 hover:shadow-xl transition-shadow"
          >
            <span className="text-white font-bold text-lg mb-2">View All Case Studies</span>
            <span className="text-white/70 text-sm mb-4">See every project, industry, and result</span>
            <span className="inline-flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-all">
              Browse all <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">Our Process</span>
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
                  description: 'We discuss your business, goals, and challenges. You\'ll get honest advice, even if that means we\'re not the right fit.'
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
              <PricingCTA
                source="Homepage — Free Consultation CTA"
                ctaLabel="Start With a Free Consultation"
                buttonClassName="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">Technology</span>
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
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">Testimonials</span>
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
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">FAQ</span>
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
                <PricingCTA
                  source="Homepage — Bottom CTA Free Consultation"
                  ctaLabel="Get Your Free Consultation"
                  buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg"
                />
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