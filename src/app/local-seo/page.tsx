import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Check, ArrowRight, MapPin, Star, Phone, TrendingUp, Users, Award } from 'lucide-react'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import LeadForm from '@/components/forms/LeadForm'
import PricingCTA from '@/components/forms/PricingCTA'

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
      telephone: siteConfig.phone,
      email: siteConfig.email,
      url: `${siteConfig.url}/local-seo`,
      areaServed: ['United States', 'United Kingdom'],
      priceRange: '$$',
      knowsAbout: [
        'Local SEO',
        'Google Business Profile Optimization',
        'Google Maps Ranking',
        'Local Citation Building',
        'NAP Consistency',
        'Review Generation',
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
        cssSelector: ['#what-is-local-seo'],
      },
    },
  ],
}

const services = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Google Business Profile Optimization',
    description:
      'Complete GBP setup and optimization covering categories, attributes, photos, posts, Q&A, and service descriptions, to maximize your Map Pack visibility.',
  },
  {
    icon: <Check className="w-6 h-6" />,
    title: 'Local Citation Building & Cleanup',
    description:
      'Build and audit citations across Yelp, Apple Maps, Bing Places, and 50+ industry directories. Fix inconsistent NAP data that suppresses your rankings.',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Review Generation Strategy',
    description:
      'Systematic review request workflows via SMS and email that build your star rating and review count, two of the strongest Map Pack ranking signals.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Local Keyword Research',
    description:
      'Uncover every service + city keyword combination your customers use. We map intent to pages so each query drives traffic to the right landing page.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'On-Page Local SEO',
    description:
      'Service area pages, localized title tags, LocalBusiness schema markup, and internal linking architecture that strengthens your organic local rankings.',
  },
  {
    icon: <Award className="w-6 h-6" />,
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
      'NAP consistency audit & fixes',
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
      'Competitor tracking & analysis',
      'Review generation campaigns',
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
      'Priority support & strategy calls',
    ],
  },
]

const industries = [
  { name: 'Plumbers', slug: 'plumbers', icon: '🔧' },
  { name: 'Roofers', slug: 'roofing', icon: '🏠' },
  { name: 'HVAC', slug: 'hvac', icon: '❄️' },
  { name: 'Electricians', slug: 'electricians', icon: '⚡' },
  { name: 'Landscapers', slug: 'landscaping', icon: '🌿' },
  { name: 'Cleaning Services', slug: 'cleaning', icon: '✨' },
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
    timeframe: 'Weeks 2–4',
    description:
      'Optimize your GBP from top to bottom, fix NAP inconsistencies across directories, build your first batch of core citations, and implement LocalBusiness schema on your site.',
  },
  {
    number: '03',
    title: 'Content & Authority',
    timeframe: 'Months 2–3',
    description:
      'Build localized service area landing pages, create supporting blog content targeting local queries, and launch review generation campaigns. Begin local link building outreach.',
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
]

export default function LocalSEOPage() {
  return (
    <>
      <Script
        id="local-seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="text-white">
              <p className="block text-xs font-bold text-accent uppercase tracking-widest mb-6">Local SEO Agency</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
                Local SEO Services That Get You Into the Google Map Pack
              </h1>
              <p className="text-xl text-white/80 mb-6 leading-relaxed">
                Rank higher on Google Maps. Generate more calls. Grow your local business.
              </p>
              <p className="text-white/70 mb-8 leading-relaxed">
                Contractors and small businesses across the UK and USA use our local SEO services to dominate
                Google Maps, appear in the 3-Pack, and generate a consistent stream of inbound leads,
                without paying per click. We handle everything: GBP optimization, citation building, review
                generation, and local content that turns searches into calls.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-white/80 text-sm">Rated 5.0 · 50+ local businesses helped</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <LeadForm
                source="Local SEO page hero"
                defaultService="local-seo"
                ctaLabel="Get My Free Local SEO Audit"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TL;DR */}
      <section className="py-12 bg-bg-secondary">
        <div className="container px-6">
          <div className="border-l-4 border-accent bg-white rounded-r-xl p-6 lg:p-8 shadow-sm">
            <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-4">Key Takeaways</p>
            <ul className="space-y-3">
              {[
                'Local SEO puts your business in front of customers searching nearby. 76% of local searches result in a call or visit within 24 hours',
                'Google Map Pack (top 3 local results) gets 44% of all local search clicks',
                'We optimize your Google Business Profile, build local citations, and earn reviews, the three core Map Pack signals',
                'Most clients see initial Map Pack movement within 60–90 days; significant results by month 4–6',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-text-primary">
                  <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Definition */}
      <section id="what-is-local-seo" className="py-24">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              What Is Local SEO?
            </h2>
            <p className="text-lg text-text-primary leading-relaxed mb-6 p-5 bg-bg-secondary rounded-xl border border-border">
              Local SEO is the process of optimizing a business's online presence to rank higher in
              location-based Google searches and the Google Map Pack. It covers Google Business Profile
              optimization, local citations, review management, and on-page SEO, all aimed at driving
              nearby customers to call or visit.
            </p>
            <p className="text-text-primary leading-relaxed mb-4">
              Unlike national SEO (which targets broad keywords like "best running shoes"), local SEO
              targets searches with geographic intent: "plumber near me," "HVAC repair [city]," or "roofing
              contractor [zip code]." These searches happen when someone has an immediate need and is ready
              to act.
            </p>
            <p className="text-text-primary leading-relaxed">
              For contractors and service businesses, local SEO is often the single highest-ROI marketing
              channel available. A plumber in the Google 3-Pack for "emergency plumber London" receives
              phone calls 24 hours a day without paying per click. That's the power of owning local
              search, and it's exactly what we build for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                stat: '46%',
                label: 'of all Google searches have local intent',
                icon: <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />,
              },
              {
                stat: '76%',
                label: 'of local searchers visit a business within 24 hours',
                icon: <Phone className="w-8 h-8 text-accent mx-auto mb-3" />,
              },
              {
                stat: '28%',
                label: 'of local searches result in a purchase',
                icon: <Award className="w-8 h-8 text-accent mx-auto mb-3" />,
              },
            ].map(({ stat, label, icon }) => (
              <div key={stat} className="text-white">
                {icon}
                <div className="text-5xl font-display font-bold text-accent mb-2">{stat}</div>
                <p className="text-white/70 text-sm max-w-[200px] mx-auto">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points + Benefits */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Where Local Businesses Are Losing and Winning
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Most local businesses rank poorly on Google Maps not because their service is bad, but because
              their online presence hasn't been built to rank.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <h3 className="font-display font-bold text-lg text-red-800 mb-6">Without Local SEO</h3>
              <ul className="space-y-4">
                {[
                  'Invisible on Google Maps while competitors take your calls',
                  'Losing leads to competitors who invested in local search',
                  'Paying for ads when organic traffic should be free',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-red-700">
                    <span className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5 text-red-600 font-bold text-xs">
                      ✕
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <h3 className="font-display font-bold text-lg text-green-800 mb-6">With Local SEO</h3>
              <ul className="space-y-4">
                {[
                  'Get into the Google 3-Pack and receive calls around the clock',
                  'Appear for every local search variation customers use',
                  'Generate leads without ad spend for sustainable, compounding growth',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-green-700">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-bg-secondary">
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
                className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4">
                  {service.icon}
                </div>
                <h3 className="font-display font-bold text-primary mb-2">{service.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Our Local SEO Process
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              A clear, four-phase roadmap so you always know what we're working on and when to expect results.
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
      <section className="py-24 bg-bg-secondary">
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
                className={`rounded-2xl p-8 border ${
                  tier.popular
                    ? 'bg-primary border-primary shadow-xl scale-105'
                    : 'bg-white border-border shadow-sm'
                }`}
              >
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
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          tier.popular ? 'text-accent' : 'text-accent'
                        }`}
                      />
                      <span
                        className={`text-sm ${tier.popular ? 'text-white/80' : 'text-text-primary'}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <PricingCTA
                  source={`Local SEO page — ${tier.name} plan`}
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
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Industries We Specialize In
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              We've built local SEO systems for contractors and service businesses across the UK and USA.
              Select your industry for a tailored overview.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/local-seo/${industry.slug}`}
                className="group flex flex-col items-center gap-3 p-5 bg-bg-secondary rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all text-center"
              >
                <span className="text-3xl">{industry.icon}</span>
                <span className="font-semibold text-primary group-hover:text-accent transition-colors text-sm">
                  {industry.name}
                </span>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-16 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary px-8 py-5">
              <p className="text-accent text-sm font-semibold uppercase tracking-wide">Case Study</p>
              <h3 className="text-white font-display font-bold text-xl mt-1">Illyrian Plumber</h3>
            </div>
            <div className="p-8">
              <p className="text-text-muted mb-8">
                A residential plumbing business that was invisible on Google Maps when we started. After a
                complete local SEO campaign covering GBP overhaul, citation building, service area pages, and review
                generation. The results were significant.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { metric: '+290%', label: 'Organic Traffic' },
                  { metric: '+245%', label: 'Monthly Leads' },
                  { metric: '20+', label: 'Keywords Ranked' },
                  { metric: 'Top 5', label: 'Local Pack Result' },
                ].map(({ metric, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-3xl font-display font-bold text-accent">{metric}</div>
                    <div className="text-sm text-text-muted mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
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
                  className="bg-bg-secondary rounded-xl p-6 border border-border"
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
      <section className="py-24 bg-gradient-to-br from-primary to-primary-dark">
        <div className="container px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Dominate Local Search?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10 text-lg">
            Stop watching competitors take your calls. Get a free local SEO audit and find out exactly what's
            holding your Map Pack rankings back, with no commitment and no sales pressure.
          </p>
          <PricingCTA
            source="Local SEO page — bottom CTA"
            ctaLabel="Get Your Free Local SEO Audit"
            buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
          />
        </div>
      </section>
    </>
  )
}
