import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { siteConfig, clients } from '@/data/site'
import { pageSEO } from '@/data/seo'
import PricingCTA from '@/components/forms/PricingCTA'
import { DoodleUnderline, DoodleArrow } from '@/components/ui/Doodle'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Local SEO Services for Small Business - From $750/mo',
    description:
      'Local SEO agency for contractors and small businesses. Get into the Google 3-Pack, rank on Maps, and generate leads. Services from $750/mo. Free local SEO audit.',
    keywords: [
      'local seo agency',
      'local seo services for small business',
      'local seo services near me',
      'local seo packages',
      'best local seo services',
      'local seo company',
      'local seo marketing',
      'local seo optimization',
      'local seo consultant',
      'google maps seo service',
      'google business profile optimization',
      'local search optimization',
      'small business local seo',
      'affordable local seo services',
      'local seo agency jacksonville',
    ],
    alternates: {
      canonical: `${siteConfig.url}/local-seo`,
    },
    openGraph: {
      title: 'Local SEO Services for Small Business - From $750/mo',
      description:
        'Local SEO agency for contractors and small businesses. Get into the Google 3-Pack, rank on Maps, and generate leads. Services from $750/mo. Free local SEO audit.',
      url: `${siteConfig.url}/local-seo`,
    },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      name: 'Web Wise Local SEO',
      description:
        'Local SEO agency helping contractors and small businesses rank in the Google Map Pack, generate more calls, and grow without ad spend.',
      url: `${siteConfig.url}/local-seo`,
      areaServed: ['United States', 'United Kingdom'],
      priceRange: '$$',
      knowsAbout: [
        'Local SEO',
        'Google Business Profile Optimization',
        'Google Maps Ranking',
        'Local Citation Building',
        'NAP Consistency',
        'Review Request Coaching',
        'Local Link Building',
        'Google 3-Pack Optimization',
        'Proximity Signals',
        'Local Schema Markup',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How long does local SEO take to work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Local SEO typically shows initial results within 60 to 90 days, with significant Map Pack improvements by month 4 to 6. Timeline depends on competition level, your current GBP standing, and how many citations you have. Emergency keyword ranking is often faster than competitive head terms.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does local SEO cost per month?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Local SEO services for small businesses cost between $750 and $1,800 per month depending on competition, location, and scope. Our packages start at $750 per month and include Google Business Profile optimization, citation building, and monthly reporting. We offer no-contract, month-to-month plans.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Google 3-Pack and how do I get in it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Google 3-Pack is the block of three local business listings that appears at the top of Google search results for local queries. To rank in the 3-Pack, you need an optimized Google Business Profile, consistent NAP citations, positive reviews, and local on-page SEO signals on your website.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can local SEO work for businesses without a storefront?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Service-area businesses (plumbers, roofers, landscapers, and other contractors who travel to customers) can absolutely rank in the Google Map Pack. You set a service area in your Google Business Profile, and local SEO signals help you rank for searches across that entire area, not just one city.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteConfig.url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Local SEO',
          item: `${siteConfig.url}/local-seo`,
        },
      ],
    },
    {
      '@type': 'WebPage',
      url: `${siteConfig.url}/local-seo`,
      name: 'Local SEO Services for Small Business - From $750/mo',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.aeo-answer'],
      },
    },
  ],
}

const services = [
  {
    title: 'Google Business Profile Optimization',
    description:
      'Complete GBP setup and optimization covering categories, attributes, photos, posts, Q&A, and service descriptions, to maximize your Map Pack visibility.',
    featured: true,
  },
  {
    title: 'Local Citation Building & Cleanup',
    description:
      'Build and audit citations across Yelp, Apple Maps, Bing Places, and 50+ industry directories. Fix inconsistent NAP data that suppresses your rankings.',
  },
  {
    title: 'Review Request Coaching',
    description:
      'We give you the exact scripts, timing, and templates to ask happy customers for a review yourself, the habit that builds your star rating and review count, two of the strongest Map Pack ranking signals.',
  },
  {
    title: 'Local Keyword Research',
    description:
      'Uncover every service and city keyword combination your customers use. We map intent to pages so each query drives traffic to the right landing page.',
  },
  {
    title: 'On-Page Local SEO',
    description:
      'Service area pages, localized title tags, LocalBusiness schema markup, and internal linking architecture that strengthens your organic local rankings.',
  },
  {
    title: 'Local Link Building',
    description:
      'Earn backlinks from local news, chambers of commerce, sponsorships, and industry directories. Local authority links are the fastest path to sustained Map Pack presence.',
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    price: '$750',
    description: 'For businesses just starting local SEO or in lower-competition markets.',
    features: [
      'Google Business Profile optimization',
      '20 local citation submissions',
      'NAP consistency audit and fixes',
      'Review monitoring dashboard',
      'Monthly ranking report',
      'Keyword position tracking (10 terms)',
    ],
  },
  {
    name: 'Growth',
    price: '$1,100',
    description: 'For businesses ready to compete seriously for Map Pack rankings.',
    popular: true,
    features: [
      'Everything in Starter',
      'Local landing pages (up to 3)',
      'Competitor tracking and analysis',
      'Review request coaching and templates',
      '40+ citation submissions',
      'Keyword tracking (25 terms)',
      'Bi-weekly check-in calls',
    ],
  },
  {
    name: 'Authority',
    price: '$1,800',
    description: 'For competitive markets where you need to dominate, not just appear.',
    features: [
      'Everything in Growth',
      'Local link building (5 links/mo)',
      'Content marketing (2 posts/mo)',
      'Service area page expansion',
      'Weekly ranking reports',
      'Keyword tracking (50 terms)',
      'Priority support and strategy calls',
    ],
  },
]

const industries = [
  { name: 'Plumbers', slug: 'plumbers' },
  { name: 'Roofers', slug: 'roofing' },
  { name: 'HVAC', slug: 'hvac' },
  { name: 'Electricians', slug: 'electricians' },
  { name: 'Painters', slug: 'painters' },
  { name: 'Landscapers', slug: 'landscaping' },
  { name: 'Cleaning Services', slug: 'cleaning' },
]

const processSteps = [
  {
    number: '01',
    title: 'Local SEO Audit',
    timeframe: 'Week 1',
    description:
      'We audit your Google Business Profile, existing citations, review standing, competitor Map Pack positions, and website on-page signals. You receive a full findings report.',
  },
  {
    number: '02',
    title: 'Foundation Fixes',
    timeframe: 'Weeks 2 to 4',
    description:
      'Optimize your GBP from top to bottom, fix NAP inconsistencies across directories, build your first batch of core citations, and implement LocalBusiness schema on your site.',
  },
  {
    number: '03',
    title: 'Content & Authority',
    timeframe: 'Months 2 to 3',
    description:
      'Build localized service area landing pages, create supporting blog content targeting local queries, and roll out review request coaching. Begin local link building outreach.',
  },
  {
    number: '04',
    title: 'Rank & Report',
    timeframe: 'Ongoing',
    description:
      'Track Map Pack positions weekly, report on ranking movements and leads generated, identify new keyword opportunities, and continuously optimize based on Google algorithm updates.',
  },
]

const faqs = [
  {
    question: 'How long does local SEO take to work?',
    answer:
      'Local SEO typically shows initial results within 60 to 90 days, with significant Map Pack improvements by month 4 to 6. Timeline depends on competition level, your current GBP standing, and how many citations you have. Emergency keyword ranking is often faster than competitive head terms.',
  },
  {
    question: 'How much does local SEO cost per month?',
    answer:
      'Local SEO services for small businesses cost between $750 and $1,800 per month depending on competition, location, and scope. Our packages start at $750 per month and include Google Business Profile optimization, citation building, and monthly reporting. We offer no-contract, month-to-month plans.',
  },
  {
    question: 'What is the Google 3-Pack and how do I get in it?',
    answer:
      'The Google 3-Pack is the block of three local business listings that appears at the top of Google search results for local queries. To rank in the 3-Pack, you need an optimized Google Business Profile, consistent NAP citations, positive reviews, and local on-page SEO signals on your website.',
  },
  {
    question: 'Can local SEO work for businesses without a storefront?',
    answer:
      'Yes. Service-area businesses (plumbers, roofers, landscapers, and other contractors who travel to customers) can absolutely rank in the Google Map Pack. You set a service area in your Google Business Profile, and local SEO signals help you rank for searches across that entire area, not just one city.',
  },
  {
    question: 'How do I compare local SEO agencies?',
    answer:
      'Compare agencies on industry-specific case studies (not generic testimonials), transparent monthly reporting tied to leads and Map Pack position, no-contract terms, and whether they offer a free audit before you commit. Be wary of agencies that guarantee specific rankings, since no agency controls Google\'s algorithm directly.',
  },
  {
    question: 'What is included in a local SEO package?',
    answer:
      'A complete local SEO package typically includes a Google Business Profile optimization, local citation building, on-page SEO for your website, review request coaching, and monthly ranking and traffic reports. Higher-tier packages add content creation, competitor tracking, and backlink outreach. See our full pricing breakdown by plan.',
  },
]

export default function LocalSEOPage() {
  return (
    <>
      <Script
        id="local-seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero, light, centered, ambient light wash */}
      <section className="relative bg-white ambient-light overflow-hidden py-24 lg:py-28">
        <div className="container px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary leading-[1.05] mb-6">
              Local SEO Services That Get You Found on{' '}
              <span className="relative inline-block">
                Google Maps
                <DoodleUnderline className="absolute left-0 -bottom-1 w-full h-3 text-accent" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Rank in the Google 3-Pack, generate calls without paying per click, and grow your local
              business with SEO built specifically for contractors and service businesses.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <PricingCTA
                source="Local SEO page hero"
                ctaLabel="Get My Free Local SEO Audit"
                defaultService="local-seo"
                buttonClassName="inline-flex items-center gap-2 px-7 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20"
              />
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-7 py-4 border-2 border-border text-primary font-semibold rounded-lg hover:border-accent hover:text-accent transition-colors"
              >
                View pricing
              </Link>
            </div>

            {/* Rating strip, verified claims only, no icons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-full border border-border text-sm">
                <span className="font-semibold text-primary">Google</span>
                <span className="text-text-muted">5.0 rating</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-full border border-border text-sm text-text-secondary">
                50+ local businesses helped
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-full border border-border text-sm text-text-secondary">
                US &amp; UK
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* At a glance, AEO answer card + stat row of 5 */}
      <section className="relative bg-white ambient-light py-20">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <h2 id="what-is-local-seo" className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              What is local SEO, and why does it matter?
            </h2>
            <p className="aeo-answer text-lg text-text-primary leading-relaxed mb-6">
              Local SEO is the process of optimizing a business&apos;s online presence, its Google Business
              Profile, citations, reviews, and website, to rank higher in location-based Google searches
              and the Google Map Pack. Unlike national SEO, it targets searches with geographic intent
              like &quot;plumber near me&quot; or &quot;roofing contractor [zip code]&quot;, the moments
              when someone has an immediate need and is ready to act.
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              For contractors and service businesses, local SEO is often the single highest-ROI marketing
              channel available. A plumber in the Google 3-Pack for &quot;emergency plumber East
              Brunswick&quot; receives phone calls around the clock without paying per click. That is the
              power of owning local search, and it is exactly what we build for our clients.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-8 border-t border-border">
              {[
                { stat: '46%', label: 'of Google searches have local intent' },
                { stat: '44%', label: 'of local clicks go to the Map Pack' },
                { stat: '76%', label: 'of local searchers visit within 24 hours' },
                { stat: '28%', label: 'of local searches end in a purchase' },
                { stat: '60 to 90', label: 'days to first Map Pack movement' },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <div className="text-3xl font-display font-bold text-accent mb-1">{stat}</div>
                  <p className="text-xs text-text-muted leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              What Our Local SEO Service Includes
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Every ranking signal that matters for Google Maps and local organic search, handled end-to-end
              by our team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className={`relative bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow ${
                  service.featured ? 'border-accent/40' : 'border-border'
                }`}
              >
                {service.featured && (
                  <span className="absolute -top-3 -right-2 font-caveat text-lg text-accent rotate-[-6deg] pointer-events-none">
                    start here!
                  </span>
                )}
                <div className="w-10 h-1 bg-accent rounded-full mb-4" />
                <h3 className="font-display font-bold text-primary mb-2">{service.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Our Local SEO Process
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              A clear, four-phase roadmap so you always know what we&apos;re working on and when to expect results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shrink-0">
                    {step.number}
                  </div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                    {step.timeframe}
                  </span>
                </div>
                <h3 className="font-display font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Local SEO Pricing
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              No contracts. No hidden fees. Month-to-month plans that scale with your growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 border ${
                  tier.popular
                    ? 'bg-primary border-primary shadow-xl scale-105'
                    : 'bg-white border-border shadow-sm'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-4 right-6 font-caveat text-xl text-accent rotate-3 pointer-events-none">
                    clients&apos; favorite
                  </span>
                )}
                {tier.popular && (
                  <div className="inline-block bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </div>
                )}
                <h3
                  className={`font-display font-bold text-xl mb-1 ${
                    tier.popular ? 'text-white' : 'text-primary'
                  }`}
                >
                  {tier.name}
                </h3>
                <div
                  className={`text-4xl font-display font-bold mb-1 ${
                    tier.popular ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {tier.price}
                  <span
                    className={`text-base font-normal ${
                      tier.popular ? 'text-white/60' : 'text-text-muted'
                    }`}
                  >
                    /mo
                  </span>
                </div>
                <p
                  className={`text-sm mb-6 ${tier.popular ? 'text-white/70' : 'text-text-muted'}`}
                >
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                      <span
                        className={`text-sm ${tier.popular ? 'text-white/80' : 'text-text-primary'}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <PricingCTA
                  source={`Local SEO page, ${tier.name} plan`}
                  ctaLabel="Get Started"
                  popular={i === 1}
                  planName={tier.name}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Industries We Specialize In
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              We&apos;ve built local SEO systems for contractors and service businesses across the UK and USA.
              Select your industry for a tailored overview.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/local-seo/${industry.slug}`}
                className="group flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all text-center"
              >
                <span className="font-semibold text-primary group-hover:text-accent transition-colors text-sm">
                  {industry.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-12">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-text-muted leading-relaxed">
              See our full{' '}
              <Link href="/pricing" className="text-accent hover:underline font-medium">local SEO pricing and package details</Link>
              {' '}to compare plans, or explore our{' '}
              <Link href="/ai-search-optimization" className="text-accent hover:underline font-medium">AI Search Optimization (AEO/GEO) services</Link>
              {' '}to get your business cited in Google AI Overviews, ChatGPT, and Perplexity too.
            </p>
          </div>
        </div>
      </section>

      {/* Case Study, real screenshot, proof-forward like the homepage */}
      <section className="py-16">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border shadow-sm overflow-hidden grid md:grid-cols-2">
            <div className="relative bg-bg-secondary min-h-[220px] md:min-h-full">
              <Image
                src={clients.illyrianplumber.image}
                alt="Screenshot of the Illyrian Plumber website"
                fill
                unoptimized
                className="object-cover object-top"
              />
              <div className="absolute top-4 left-4 flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
            </div>
            <div className="p-8">
              <p className="text-accent text-sm font-semibold uppercase tracking-wide">Case Study</p>
              <h3 className="text-primary font-display font-bold text-xl mt-1 mb-4">Illyrian Plumber</h3>
              <p className="text-text-muted mb-8">
                A residential plumbing business that was invisible on Google Maps when we started. After a
                complete local SEO campaign covering GBP overhaul, citation building, service area pages, and
                review request coaching, the results were significant.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {[
                  { metric: '+290%', label: 'Organic Traffic' },
                  { metric: '+245%', label: 'Monthly Leads' },
                  { metric: '20+', label: 'Keywords Ranked' },
                  { metric: 'Top 5', label: 'Local Pack Result' },
                ].map(({ metric, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-display font-bold text-accent">{metric}</div>
                    <div className="text-sm text-text-muted mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <Link href="/case-studies/illyrian-group" className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:gap-3 transition-all">
                Read the full case study →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
              Local SEO FAQs
            </h2>
            <p className="text-text-muted text-center mb-12">
              Answers to the questions we hear most from contractors and small business owners.
            </p>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-white rounded-xl p-6 border border-border"
                >
                  <h3 className="font-display font-bold text-primary mb-3">{faq.question}</h3>
                  <p className="text-text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="container px-6 text-center relative">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Dominate Local Search?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-4 text-lg">
            Stop watching competitors take your calls. Get a free local SEO audit and find out exactly what&apos;s
            holding your Map Pack rankings back, with no commitment and no sales pressure.
          </p>
          <p className="font-caveat text-2xl text-accent mb-8 flex items-center justify-center gap-2">
            <DoodleArrow className="w-8 h-8 rotate-[100deg] text-accent" />
            no contracts, ever
          </p>
          <PricingCTA
            source="Local SEO page, bottom CTA"
            ctaLabel="Get Your Free Local SEO Audit"
            buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
          />
        </div>
      </section>
    </>
  )
}
