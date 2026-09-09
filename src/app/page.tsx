import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { siteConfig, techStack, clients } from '@/data/site'
import { pageSEO } from '@/data/seo'
import type { Metadata } from 'next'
import PricingCTA from '@/components/forms/PricingCTA'
import Globe from '@/components/ui/Globe'
import Reveal from '@/components/ui/Reveal'
import TiltCard from '@/components/ui/TiltCard'
import FaqAccordion from '@/components/ui/FaqAccordion'
import ClientOrbit from '@/components/ui/ClientOrbit'

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
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#webpage`,
      "url": siteConfig.url,
      "name": "Web Wise, Web Development and SEO Services",
      "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".aeo-answer"] },
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

// Industries data, no icon field, the grid leans on typography and hover glow instead
const industries = [
  { name: 'Plumbers', slug: 'plumbers', description: 'Emergency plumber SEO, website development' },
  { name: 'Roofers', slug: 'roofing', description: 'Storm damage keywords, lead generation' },
  { name: 'HVAC Companies', slug: 'hvac', description: 'Seasonal SEO strategies' },
  { name: 'Electricians', slug: 'electricians', description: 'Emergency + EV charger keywords' },
  { name: 'Auto Detailing', slug: 'auto-detailing', description: 'Mobile detailing, booking sites' },
  { name: 'Dumpster Rental', slug: 'dumpster-rental', description: 'Size-specific landing pages' },
  { name: 'Landscaping', slug: 'landscaping', description: 'Seasonal marketing' },
  { name: 'Pest Control', slug: 'pest-control', description: 'Emergency pest searches' },
  { name: 'Cleaning Services', slug: 'cleaning', description: 'Residential + commercial' },
  { name: 'Moving Companies', slug: 'moving', description: 'Local mover keywords' },
  { name: 'Construction', slug: 'construction', description: 'Contractor SEO' },
  { name: 'Locksmiths', slug: 'locksmiths', description: 'Emergency lockout SEO' },
]

// Case studies (image pulled from the real client screenshot already generated in site.ts)
const caseStudies = [
  {
    name: 'Illyrian Plumber',
    slug: 'illyrian-group',
    type: 'Local SEO + Website',
    description: 'Complete website rebuild and local SEO for East Brunswick, NJ plumber.',
    results: { traffic: '553%', leads: '245%', keywords: '911+' },
    image: clients.illyrianplumber.image,
  },
  {
    name: "Gimo's Roofing",
    slug: 'gimos-roofing',
    type: 'Local SEO + Website + PPC',
    description: 'Full-service roofing website with local SEO and Google Ads management.',
    results: { traffic: '380%', leads: '295%', keywords: '52+' },
    image: clients.gimosroofing.image,
  },
  {
    name: '904 Dumpster',
    slug: '904-dumpster',
    type: 'Local SEO + Website',
    description: 'Dumpster rental website with pricing calculator and online booking.',
    results: { traffic: '445%', leads: '350%', keywords: '67+' },
    image: clients['904dumpster'].image,
  },
]

// General spread of markers across the US and UK, shown as green dots on
// the globe to back up the "30+ clients" claim and the site's UK + USA
// positioning. Deliberately not paired with named city labels in the UI,
// this is an approximate footprint, not a per-client verified address list.
const clientLocations: { location: [number, number]; size: number }[] = [
  { location: [40.7128, -74.0060], size: 0.07 }, // New York, NY
  { location: [40.7357, -74.1724], size: 0.08 }, // Newark, NJ
  { location: [39.9526, -75.1652], size: 0.06 }, // Philadelphia, PA
  { location: [42.3601, -71.0589], size: 0.06 }, // Boston, MA
  { location: [30.3322, -81.6557], size: 0.08 }, // Jacksonville, FL
  { location: [25.7617, -80.1918], size: 0.06 }, // Miami, FL
  { location: [33.7490, -84.3880], size: 0.07 }, // Atlanta, GA
  { location: [35.2271, -80.8431], size: 0.06 }, // Charlotte, NC
  { location: [35.7796, -78.6382], size: 0.06 }, // Raleigh, NC
  { location: [36.1627, -86.7816], size: 0.06 }, // Nashville, TN
  { location: [41.8781, -87.6298], size: 0.08 }, // Chicago, IL
  { location: [39.9612, -82.9988], size: 0.06 }, // Columbus, OH
  { location: [42.3314, -83.0458], size: 0.06 }, // Detroit, MI
  { location: [39.7684, -86.1581], size: 0.06 }, // Indianapolis, IN
  { location: [44.9778, -93.2650], size: 0.06 }, // Minneapolis, MN
  { location: [38.6270, -90.1994], size: 0.06 }, // St. Louis, MO
  { location: [29.7604, -95.3698], size: 0.07 }, // Houston, TX
  { location: [32.7767, -96.7970], size: 0.07 }, // Dallas, TX
  { location: [30.2672, -97.7431], size: 0.06 }, // Austin, TX
  { location: [29.4241, -98.4936], size: 0.06 }, // San Antonio, TX
  { location: [29.9511, -90.0715], size: 0.06 }, // New Orleans, LA
  { location: [39.7392, -104.9903], size: 0.06 }, // Denver, CO
  { location: [33.4484, -112.0740], size: 0.07 }, // Phoenix, AZ
  { location: [36.1699, -115.1398], size: 0.06 }, // Las Vegas, NV
  { location: [40.7608, -111.8910], size: 0.06 }, // Salt Lake City, UT
  { location: [34.0522, -118.2437], size: 0.08 }, // Los Angeles, CA
  { location: [32.7157, -117.1611], size: 0.06 }, // San Diego, CA
  { location: [37.7749, -122.4194], size: 0.06 }, // San Francisco, CA
  { location: [47.6062, -122.3321], size: 0.06 }, // Seattle, WA
  { location: [45.5152, -122.6784], size: 0.06 }, // Portland, OR
  // UK
  { location: [51.5074, -0.1278], size: 0.08 }, // London
  { location: [53.4808, -2.2426], size: 0.07 }, // Manchester
  { location: [52.4862, -1.8904], size: 0.06 }, // Birmingham
  { location: [53.8008, -1.5491], size: 0.06 }, // Leeds
  { location: [55.8642, -4.2518], size: 0.06 }, // Glasgow
  { location: [51.4545, -2.5879], size: 0.06 }, // Bristol
]

// Testimonials
const testimonials = [
  {
    quote: "Our local SEO results have been phenomenal. We went from invisible to dominating the map pack in just 3 months.",
    company: "Gimo's Roofing"
  },
  {
    quote: "Web Wise rebuilt our website and our SEO from the ground up. We're now ranking #1 on Google for the jobs that actually pay, whole house repiping, PEX, gas line work. Our phone rings with the right kind of calls now, and we're the only plumber in our area being recommended by Google's AI directly. Worth every dollar.",
    company: "Illyrian Plumber"
  },
]

// Process steps, big gradient numerals replace icons as the repeated visual motif
const processSteps = [
  {
    step: '01',
    title: 'Free Consultation',
    description: "We discuss your business, goals, and challenges. You'll get honest advice, even if that means we're not the right fit.",
  },
  {
    step: '02',
    title: 'Proposal & Roadmap',
    description: 'You receive a clear proposal with scope, timeline, and pricing. No hidden fees. No vague deliverables.',
  },
  {
    step: '03',
    title: 'Build & Launch',
    description: 'Websites launch in 2-4 weeks. SEO builds its foundation in month one, then grows steadily through month six. Marketing campaigns go live within 1-2 weeks.',
  },
  {
    step: '04',
    title: 'Measure & Optimize',
    description: 'Monthly reports showing traffic, leads, and ROI. We optimize based on data, not guesses.',
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

      {/* ============ HERO — dark aurora anchor, sets the brand tone the rest of the page echoes ============ */}
      <section className="relative bg-primary overflow-hidden py-28 lg:py-36">
        {/* Ambient gradient mesh, one continuous field rather than a flat navy fill */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary-dark" />
        <div aria-hidden="true" className="glow-orb aurora-drift -top-24 -left-24 w-[28rem] h-[28rem] bg-accent/25" />
        <div aria-hidden="true" className="glow-orb aurora-drift -bottom-32 -right-16 w-[32rem] h-[32rem] bg-primary-light/50" style={{ animationDelay: '-7s' }} />
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
            WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 0%, transparent 65%)',
            maskImage: 'radial-gradient(circle at 50% 40%, black 0%, transparent 65%)',
          }}
        />

        {/* Low-opacity glass-coin ring drifting behind the headline, ambient
            texture rather than a feature, standing in for the literal website
            screenshots this replaced. */}
        <ClientOrbit className="hidden lg:flex opacity-[0.14]" count={9} radius={340} />

        <div className="container px-6 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.05] mb-6 text-white">
              Web Development, SEO, and Marketing{' '}
              <span className="text-gradient">That Get You Found</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
              We help contractors and small businesses dominate online. Starting at $950, you get
              an SEO optimized website with full branding included. Then Local SEO starts at $480
              a month to keep you ranking in the Google Map Pack.
            </p>

            <div className="mb-3">
              <PricingCTA
                source="Homepage hero"
                ctaLabel="Get My Free Audit"
                buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-dark transition-colors shadow-lg shadow-accent/30"
              />
            </div>
            <Link href="/pricing" className="inline-block text-sm text-white/50 hover:text-accent transition-colors mb-10">
              or view pricing
            </Link>

            {/* Rating strip, verified claims only, no icons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 text-sm">
                <span className="font-semibold text-white">Google</span>
                <span className="text-white/60">5.0 rating</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 text-sm text-white/70">
                50+ businesses helped
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 text-sm text-white/70">
                +553% traffic for one client
              </span>
            </div>

            <p className="text-sm text-white/40">Clear scope, clear pricing, no hidden fees.</p>
          </div>
        </div>
      </section>

      {/* ============ WHAT WE DO — AEO answer panel, reuses the shared trust/proof texture ============ */}
      <section className="relative ambient-light diagonal-wash py-24 overflow-hidden">
        {/* Bleeds up into the dark hero above so the seam between them isn't a flat color cut. */}
        <div aria-hidden="true" className="glow-orb -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-64 bg-accent/10" />
        <div className="container px-6 relative">
          <Reveal className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">What Does Web Wise Do?</h2>
            <p className="aeo-answer text-left text-lg text-text-secondary mb-6">
              Web Wise is a web development and digital marketing agency for contractors and small
              businesses. We build fast, custom websites, run local SEO campaigns that win the
              Google Map Pack, and manage marketing campaigns that generate measurable leads.
            </p>
            <p className="text-text-secondary mb-4">
              We specialize in{' '}
              <Link href="/local-seo/plumbers" className="text-accent hover:underline">plumbers</Link>,{' '}
              <Link href="/local-seo/roofing" className="text-accent hover:underline">roofers</Link>,{' '}
              <Link href="/local-seo/hvac" className="text-accent hover:underline">HVAC companies</Link>,{' '}
              <Link href="/local-seo/landscaping" className="text-accent hover:underline">landscapers</Link>,{' '}
              <Link href="/local-seo/locksmiths" className="text-accent hover:underline">locksmiths</Link>, and{' '}
              <Link href="/local-seo/cleaning" className="text-accent hover:underline">cleaning services</Link>{' '}
              across the UK and USA.
            </p>
            <p className="text-text-secondary font-medium">
              <strong className="text-primary">We&apos;re not a generalist agency.</strong> That focus means
              we understand your customers, your competition, and what actually works in your industry.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES — bento, gradient numerals stand in for icons ============ */}
      <section className="py-24 bg-bg-primary">
        <div className="container px-6">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Comprehensive Digital Solutions</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From custom websites to dominating search results, we provide end-to-end
              digital services tailored to your business.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {/* SEO Services, featured bento tile, part of the recurring dark-gradient-plus-glow family */}
            <Reveal className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
              <div aria-hidden="true" className="glow-orb -bottom-10 -right-10 w-56 h-56 bg-accent/25" />
              <div className="relative">
                <span className="wise-numeral text-5xl block mb-3">01</span>
                <h3 className="text-2xl font-bold text-white mb-4">SEO Services</h3>
                <p className="text-white/80 mb-4 max-w-lg">
                  Data-driven SEO strategies that get you found on Google, in Maps, and in AI search results.
                  This is what most of our clients hire us for first.
                </p>
                <p className="text-white/70 border-l-2 border-accent bg-white/5 pl-4 py-3 rounded-r-md mb-8 max-w-lg">
                  In plain terms, we optimize your Google Business Profile, build the citations Google checks,
                  and write content that answers what buyers are actually searching. That is what gets you into
                  the Map Pack and named in AI answers, instead of buried on page one.
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                  <li className="text-sm text-white/90">
                    <Link href="/local-seo" className="hover:text-accent transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
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
                  Explore SEO Services →
                </Link>
              </div>
            </Reveal>

            {/* Web Development */}
            <Reveal delay={100} className="wise-card p-6">
              <span className="wise-numeral text-3xl block mb-3">02</span>
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
              <p className="text-sm text-text-secondary border-l-2 border-accent/40 bg-bg-secondary/60 pl-3 py-2 rounded-r-md mb-4">
                A slow, cluttered site loses customers before they ever call. We build fast, mobile-friendly
                sites with clear calls to action, so visitors become leads instead of bouncing to a competitor.
              </p>
              <Link href="/custom-web-development" className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:gap-3 transition-all">
                Learn more →
              </Link>
            </Reveal>

            {/* Digital Marketing */}
            <Reveal delay={200} className="wise-card p-6">
              <span className="wise-numeral text-3xl block mb-3">03</span>
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
                    Content marketing, blogs, guides, SEO content
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/digital-marketing/social-management" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Social media, strategy, management, ads
                  </Link>
                </li>
                <li className="text-sm text-text-muted">
                  <Link href="/digital-marketing/analytics" className="hover:text-accent transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Analytics, tracking, reporting, insights
                  </Link>
                </li>
              </ul>
              <p className="text-sm text-text-secondary border-l-2 border-accent/40 bg-bg-secondary/60 pl-3 py-2 rounded-r-md mb-4">
                Marketing without a plan wastes your budget on clicks that never turn into customers. We run
                the ads and content built for people already ready to hire you, so every dollar has a job to do.
              </p>
              <Link href="/digital-marketing" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                Learn more →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ INDUSTRIES — typography-led grid, no icon boxes ============ */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Who We Work With</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We specialize in contractors and local service businesses. If you serve
              customers in a specific area, we can help you dominate that market.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {industries.map((industry, i) => (
              <Reveal key={industry.slug} delay={(i % 4) * 80}>
                <Link
                  href={`/local-seo/${industry.slug}`}
                  className="wise-card group block p-6 h-full"
                >
                  <h3 className="font-bold text-primary mb-2 group-hover:text-accent transition-colors">{industry.name}</h3>
                  <p className="text-sm text-text-muted">{industry.description}</p>
                  <span className="block mt-4 h-0.5 w-8 bg-accent/40 group-hover:w-12 group-hover:bg-accent transition-all" />
                </Link>
              </Reveal>
            ))}
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
              <Link href="/blog/plumbing-industry-statistics" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                Plumbing industry statistics
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
              <Link href="/blog/roofing-industry-statistics" className="px-4 py-2 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors">
                Roofing industry statistics
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

      {/* ============ CASE STUDIES — the one flagship "glass tilt" moving moment ============ */}
      <section className="relative py-24 overflow-hidden bg-bg-primary">
        <div aria-hidden="true" className="glow-orb top-0 left-1/2 -translate-x-1/2 w-[40rem] h-40 bg-accent/8" />
        <div className="container px-6 relative">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Results for Businesses Like Yours</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Real projects, real results. Here is what we have built and achieved.
            </p>
          </Reveal>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 pb-4" style={{ perspective: '1200px' }}>
          {caseStudies.map((study) => (
            <TiltCard key={study.slug} className="group shrink-0 w-[300px] sm:w-[360px] snap-start">
              <Link
                href={`/case-studies/${study.slug}`}
                className="wise-card block overflow-hidden"
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
                    View Case Study →
                  </span>
                </div>
              </Link>
            </TiltCard>
          ))}

          {/* Trailing card pointing to the full list, part of the recurring dark-gradient family */}
          <Link
            href="/case-studies"
            className="group shrink-0 w-[300px] sm:w-[360px] snap-start bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex flex-col items-center justify-center text-center p-8 hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            <div aria-hidden="true" className="glow-orb -top-8 -right-8 w-40 h-40 bg-accent/25" />
            <span className="relative text-white font-bold text-lg mb-2">View All Case Studies</span>
            <span className="relative text-white/70 text-sm mb-4">See every project, industry, and result</span>
            <span className="relative inline-flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-all">
              Browse all →
            </span>
          </Link>
        </div>
      </section>

      {/* ============ WHERE WE WORK — client locations globe, second dark anchor ============ */}
      <section className="relative py-24 bg-orbit-dark overflow-hidden">
        <div aria-hidden="true" className="glow-orb -top-20 left-10 w-72 h-72 bg-accent/10" />
        <div className="container px-6 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                Clients Across the US and UK
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed">
                We are not a one-metro shop. Drag the globe, each green marker represents one
                of the businesses whose website and rankings we manage today on both sides
                of the Atlantic.
              </p>
              <div className="flex items-baseline gap-3">
                <span className="wise-numeral text-5xl">30+</span>
                <span className="text-white/60 text-sm uppercase tracking-widest">Clients in the US and UK</span>
              </div>
            </Reveal>

            <Reveal delay={150} className="flex justify-center">
              <Globe
                className="max-w-sm"
                markers={clientLocations}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS — same gradient numerals as Services, ties the two together ============ */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">How We Work</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Simple process. Clear timeline. No surprises.
            </p>
          </Reveal>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {processSteps.map((item, i) => (
                <Reveal key={item.step} delay={(i % 2) * 100} className="wise-card flex gap-5 items-start p-6">
                  <span className="wise-numeral text-4xl shrink-0 leading-none">{item.step}</span>
                  <div>
                    <h3 className="font-bold text-primary text-lg mb-2">{item.title}</h3>
                    <p className="text-text-secondary">{item.description}</p>
                  </div>
                </Reveal>
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

      {/* ============ TECHNOLOGY ============ */}
      <section className="py-24 bg-bg-primary">
        <div className="container px-6">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Built With Modern Technology</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We use cutting-edge tools to deliver fast, scalable, secure solutions.
            </p>
          </Reveal>

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

      {/* ============ TESTIMONIALS — oversized gradient quote mark instead of star icons ============ */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">What Our Clients Say</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Reveal key={i} delay={i * 120} className="wise-card p-8 h-full">
                <span className="wise-numeral text-6xl leading-none block mb-2" aria-hidden="true">&ldquo;</span>
                <blockquote className="text-text-secondary mb-6 -mt-4">
                  {testimonial.quote}
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {testimonial.company.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-primary">{testimonial.company}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ — accordion ============ */}
      <section className="py-24 bg-bg-primary">
        <div className="container px-6">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
          </Reveal>
          <FaqAccordion faqs={homepageFaqs} />
        </div>
      </section>

      {/* ============ FINAL CTA — bookends the hero, same dark-gradient-plus-glow family ============ */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <Reveal className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div aria-hidden="true" className="glow-orb aurora-drift top-0 right-0 w-64 h-64 bg-accent/25" />
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
          </Reveal>
        </div>
      </section>
    </>
  )
}
