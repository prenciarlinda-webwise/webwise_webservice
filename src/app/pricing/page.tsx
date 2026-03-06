import Script from 'next/script'
import { ArrowRight, Check, Zap, Rocket, Crown, Monitor, TrendingUp, Shield, Clock, DollarSign, Star, Gift, Palette, Globe, Users, Briefcase, MapPin, BarChart2 } from 'lucide-react'
import { generateFAQSchema, generateWebPageSchema } from '@/lib/schemas'
import { siteConfig, getWhatsAppUrl } from '@/data/site'
import { pageSEO } from '@/data/seo'
import { pricingFaqs } from '@/data/faqs'
import { pricingContent } from '@/data/staticContent'
import FAQSection from '@/components/sections/FAQSection'

export const metadata = {
  title: pageSEO.pricing.title,
  description: pageSEO.pricing.description,
  keywords: pageSEO.pricing.keywords,
  openGraph: {
    title: pageSEO.pricing.title,
    description: pageSEO.pricing.description,
  },
}

const faqSchema = generateFAQSchema(pricingFaqs)
const pageSchema = generateWebPageSchema({
  name: pageSEO.pricing.title,
  description: pageSEO.pricing.description,
  url: `${siteConfig.url}/pricing`,
})

export default function PricingPage() {
  const content = pricingContent

  const seoPlans = [
    {
      name: 'Starter Local SEO',
      icon: Zap,
      originalPrice: '€580',
      price: '€480',
      savings: 'Save €100/month',
      period: '/month',
      description: 'Foundational Visibility',
      features: [
        { text: 'Full local SEO audit (20+ point checklist)', included: true },
        { text: 'Google Business Profile optimized (all 14 sections)', included: true },
        { text: 'NAP consistency check across 15 directories', included: true },
        { text: '10 target keywords tracked monthly', included: true },
        { text: '3 local citations built per month', included: true },
        { text: '10 GBP posts per month', included: true },
        { text: 'Monthly ranking + traffic report', included: true },
        { text: 'Review monitoring (alerts on new reviews)', included: true },
        { text: 'Blog content creation', included: false },
        { text: 'Competitor rank tracking', included: false },
      ],
      expectations: [
        { month: 1, title: 'Audit & Foundation', desc: 'Complete SEO audit, GBP fully optimized, NAP errors fixed across 15 directories' },
        { month: 2, title: 'Citations & Content', desc: 'Citation building underway, 10 GBP posts published, keyword positions recorded' },
        { month: 3, title: 'Visibility Growth', desc: 'Map Pack movement visible, increased calls & profile views' },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Medium Local SEO',
      icon: Rocket,
      originalPrice: '€980',
      price: '€780',
      savings: 'Save €200/month',
      period: '/month',
      description: 'Competitive Climbing',
      features: [
        { text: 'Everything in Starter', included: true },
        { text: '25 target keywords tracked weekly', included: true },
        { text: '5 local citations + 1 backlink per month', included: true },
        { text: '2 blog posts/month (800+ words, fully optimized)', included: true },
        { text: 'On-page SEO for all service & location pages', included: true },
        { text: 'Competitor rank tracking (3 competitors)', included: true },
        { text: '15 GBP posts per month', included: true },
        { text: 'Bi-weekly ranking & traffic reports', included: true },
        { text: 'Review response management', included: true },
        { text: 'Content gap analysis', included: true },
      ],
      expectations: [
        { month: 1, title: 'Audit & Analysis', desc: 'Deep audit, content gaps identified, competitor benchmarks set, first 2 blog posts live' },
        { month: 2, title: 'Optimization', desc: 'On-page improvements live, citation building active, 25 keywords tracking weekly movement' },
        { month: 3, title: 'Measurable Results', desc: 'Traffic increase visible in Search Console, improved Map Pack positions, leads rising' },
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Premium Local SEO',
      icon: Crown,
      originalPrice: '€1,500',
      price: '€1,100',
      savings: 'Save €400/month',
      period: '/month',
      description: 'Market Authority',
      features: [
        { text: 'Everything in Medium', included: true },
        { text: 'Unlimited keywords tracked weekly', included: true },
        { text: '10+ citations & backlinks per month', included: true },
        { text: '4 blog posts/month (1,000+ words, schema-optimized)', included: true },
        { text: 'Deep competitor analysis (5 competitors)', included: true },
        { text: '20 GBP posts per month', included: true },
        { text: 'Weekly reporting with call tracking metrics', included: true },
        { text: 'Proactive review generation system', included: true },
        { text: 'Aggressive backlink outreach campaign', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
      expectations: [
        { month: 1, title: 'Audit & Strategy', desc: 'Comprehensive audit, 5-competitor deep dive, backlink campaign launched, review system activated' },
        { month: 2, title: 'Full Execution', desc: 'All strategies running: content, links, citations, 20 GBP posts, competitor gap closures' },
        { month: 3, title: 'Authority & Leads', desc: 'Established Map Pack presence, organic traffic growing, qualified lead volume measurably higher' },
      ],
      cta: 'Get Started',
      popular: false,
    },
  ]

  const webPlan = {
    name: 'Website Development',
    icon: Monitor,
    originalPrice: '€2,000',
    price: '€1,500',
    period: 'one-time',
    description: 'The Conversion Engine',
    includes: ['Perfect SEO Setup', 'Google My Business Setup'],
    features: [
      'Modern, responsive design',
      'Next.js for blazing speed',
      'SEO-optimized structure',
      'Contact form integration',
      'Google Analytics setup (€100 value)',
      'Mobile-first approach',
      '30-day support included',
    ],
    expectations: [
      { month: 1, title: 'Launch', desc: 'Site live, Google indexed every page, GMB verified' },
      { month: 2, title: 'Performance', desc: 'Technical SEO pays off - faster loads, longer user sessions' },
      { month: 3, title: 'Insights', desc: 'Clear baseline data on visitor-to-lead conversion rate' },
    ],
  }

  const launchPackageCategories = [
    {
      icon: Palette,
      label: 'Brand Identity',
      items: ['Professional logo design', 'Brand colors & typography kit'],
    },
    {
      icon: Globe,
      label: 'Website',
      items: [
        'Fully SEO-optimized website',
        '2 location pages',
        '3 service pages',
        '3 blog posts',
        'Mobile-first, fast-loading design',
        'Contact form + click-to-call',
      ],
    },
    {
      icon: MapPin,
      label: 'Google Setup',
      items: [
        'Google Business Profile setup & full optimization',
        'Google Ads account setup & first campaign',
      ],
    },
    {
      icon: Users,
      label: 'Social Media',
      items: ['Instagram Business Profile setup', 'Facebook Business Page setup'],
    },
    {
      icon: Briefcase,
      label: 'Lead Platforms',
      items: ['Thumbtack business profile setup', 'Angi (formerly Angie\'s List) profile setup'],
    },
  ]

  return (
    <>
      {/* Page Schemas */}
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm mb-4">Pricing</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {content.hero.headline}
            </h1>
            <p className="text-xl text-white/90 mb-4">{content.hero.subheadline}</p>
            <p className="text-lg text-white/80">
              {content.hero.valueProposition}
            </p>
          </div>
        </div>
      </section>

      {/* NEW LOCAL BUSINESS LAUNCH PACKAGE */}
      <section className="py-24 bg-gradient-to-br from-[#fff4e8] via-[#fde8ce] to-[#fbd3a5] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="container px-6 relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-accent text-white font-semibold rounded-full text-sm mb-4 tracking-wide uppercase">
              New Local Business
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Complete Business Launch Package
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Everything a new local business needs to go from zero to fully visible online. Logo, website, Google, social media, and lead platforms, all done for you in <strong>2 weeks</strong>.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">

              {/* Top banner */}
              <div className="bg-gradient-to-r from-accent to-[#d96a10] px-8 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Star className="text-white" size={22} fill="white" />
                  <span className="text-white font-bold text-lg">Launch Special: Everything Included at One Fixed Price</span>
                </div>
                <span className="bg-white text-accent font-bold px-4 py-1 rounded-full text-sm">Limited Availability</span>
              </div>

              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-5 gap-10">

                  {/* Left: deliverables grid */}
                  <div className="lg:col-span-3 space-y-6">
                    <h3 className="text-xl font-bold text-primary mb-2">What&apos;s Included</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {launchPackageCategories.map((cat, i) => (
                        <div key={i} className="bg-bg-secondary rounded-2xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                              <cat.icon size={18} />
                            </div>
                            <span className="font-semibold text-primary text-sm">{cat.label}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {cat.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                                <Check size={14} className="text-accent flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: price + bonus */}
                  <div className="lg:col-span-2 flex flex-col justify-between gap-6">

                    {/* Price block */}
                    <div className="bg-gradient-to-br from-primary to-[#1a1c3a] rounded-2xl p-8 text-center text-white">
                      <p className="text-white/60 text-sm uppercase tracking-wider mb-1">One-Time Investment</p>
                      <div className="text-6xl font-bold text-white mb-1">€700</div>
                      <p className="text-white/60 text-sm mb-3">No monthly fees. No hidden costs.</p>
                      <div className="inline-flex items-center gap-1.5 bg-accent/20 border border-accent/40 rounded-full px-3 py-1 text-accent text-xs font-semibold mb-6">
                        <Clock size={12} />
                        Everything delivered within 2 weeks
                      </div>
                      <ul className="text-left space-y-2 mb-8">
                        {[
                          'Logo + Branding',
                          'SEO-Optimized Website',
                          'GMB Setup & Optimization',
                          'Google Ads Setup',
                          'Instagram + Facebook',
                          'Thumbtack + Angi Profiles',
                          '2 Locations + 3 Services + 3 Blogs',
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                            <Check size={14} className="text-accent flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={getWhatsAppUrl("Hi, I'm interested in the New Local Business Launch Package at €700.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-4 text-center font-bold rounded-xl bg-accent text-white hover:bg-[#d96a10] transition-colors text-lg"
                      >
                        Get Started Today
                      </a>
                    </div>

                    {/* 3-Month Offer */}
                    <div className="border-2 border-accent/40 rounded-2xl p-6 bg-accent/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Gift size={20} className="text-accent" />
                        <span className="font-bold text-primary">Exclusive 3-Month Offer</span>
                        <span className="bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5 rounded-full ml-auto border border-accent/30">Optional Add-On</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        You can choose to add our <strong>Premium SEO package at the Medium SEO price</strong>, full premium service for <strong>€780/month</strong> instead of €1,100.
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-text-muted line-through">Premium SEO: €1,100/mo</span>
                        <span className="text-accent font-bold">Available at: €780/mo</span>
                      </div>
                      <p className="text-xs text-text-muted mt-3 italic">Available exclusively to Launch Package clients after month 3.</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Much Does SEO Cost - 40-60 word answer for Featured Snippets */}
      <section className="py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-6">{content.definition.question}</h2>
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

      {/* SEO Pricing */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Monthly SEO Plans</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Local SEO Packages</h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-4">
              Each plan includes a comprehensive local SEO audit in the first month with a clear 3-month roadmap of measurable milestones.
            </p>
            <p className="text-sm text-text-muted max-w-3xl mx-auto italic">
              Note: Actual ranking results depend on market competition, current website status, domain authority, and Google algorithm updates. We focus on transparent, measurable, white-hat strategies that build long-term success.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {seoPlans.map((plan, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border-2 p-8 relative flex flex-col ${
                  plan.popular ? 'border-accent shadow-xl lg:scale-105' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-accent/10 rounded-xl text-accent">
                    <plan.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-1">{plan.name}</h3>
                  <p className="text-accent font-medium text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <div className="text-lg text-text-muted line-through">{plan.originalPrice}</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-accent">{plan.price}</span>
                    <span className="text-text-muted">{plan.period}</span>
                  </div>
                  <div className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    {plan.savings}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check size={16} className={`flex-shrink-0 mt-0.5 ${feature.included ? 'text-accent' : 'text-gray-300'}`} />
                      <span className={`text-sm ${feature.included ? 'text-text-secondary' : 'text-text-muted line-through'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* 3-Month Expectations */}
                <div className="bg-bg-secondary rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                    <BarChart2 size={14} className="text-accent" />
                    3-Month Measurable Roadmap
                  </h4>
                  <div className="space-y-3">
                    {plan.expectations.map((exp, j) => (
                      <div key={j} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {exp.month}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-primary">{exp.title}</div>
                          <div className="text-xs text-text-muted">{exp.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl(`Hi, I'm interested in your ${plan.name} plan.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 text-center font-semibold rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-[#25D366] text-white hover:bg-[#128C7E]'
                      : 'bg-bg-secondary text-primary hover:bg-bg-tertiary'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Much Does Website Cost - 40-60 word answer */}
      <section className="py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Web Development</span>
            <h2 className="text-3xl font-bold text-primary mb-6">How Much Does a Business Website Cost?</h2>
            {Array.isArray(content.sections[0].content) && content.sections[0].content.map((paragraph, i) => (
              <p key={i} className={`${i === 0 ? 'text-lg' : ''} text-text-secondary mb-6 leading-relaxed`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Website Development */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Web Development</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Website Package</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              A high-performance Next.js website built for speed and conversions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Left Side - Details */}
                <div className="p-8 border-b md:border-b-0 md:border-r border-border">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
                      <webPlan.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary">{webPlan.name}</h3>
                      <p className="text-accent font-medium text-sm">{webPlan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-lg text-text-muted line-through">{webPlan.originalPrice}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-accent">{webPlan.price}</span>
                      <span className="text-text-muted">{webPlan.period}</span>
                    </div>
                    <div className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Save €500
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {webPlan.includes.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        Includes {item}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-3">
                    {webPlan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <Check size={18} className="text-accent" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Side - 3-Month Expectations */}
                <div className="p-8 bg-bg-secondary/50">
                  <h4 className="font-semibold text-primary mb-6">3-Month Roadmap</h4>
                  <div className="space-y-6">
                    {webPlan.expectations.map((exp, j) => (
                      <div key={j} className="relative pl-8">
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center">
                          {exp.month}
                        </div>
                        {j < webPlan.expectations.length - 1 && (
                          <div className="absolute left-[11px] top-6 w-0.5 h-full bg-accent/20" />
                        )}
                        <div>
                          <div className="font-semibold text-primary">{exp.title}</div>
                          <div className="text-sm text-text-muted mt-1">{exp.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href={getWhatsAppUrl("Hi, I'm interested in getting a website for my business.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-8 py-3 text-center font-semibold rounded-lg bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                  >
                    Get Your Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Pricing Delivers Better ROI */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Value</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Why Our Pricing Delivers Better ROI</h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
              Many businesses waste money on cheap SEO that doesn&apos;t work or expensive agencies that over-promise. Our pricing hits the sweet spot.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {content.sections[1].items?.map((item, i) => {
              const icons = [Clock, DollarSign, Shield, TrendingUp]
              const IconComponent = icons[i % icons.length]
              return (
                <div key={i} className="bg-white border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                    <IconComponent size={24} />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">{item.title}</h4>
                  <p className="text-sm text-text-muted">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* When to Invest */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Timing</span>
            <h2 className="text-3xl font-bold text-primary mb-4">When Should You Invest in SEO vs. a New Website?</h2>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {content.sections[2].items?.map((item, i) => (
              <div key={i} className={`bg-white border-2 rounded-xl p-6 ${i === 2 ? 'border-accent' : 'border-border'}`}>
                {i === 2 && (
                  <div className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded mb-3">
                    Best Value
                  </div>
                )}
                <h4 className="font-semibold text-primary mb-3">{item.title}</h4>
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Affects Price */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Factors</span>
            <h2 className="text-3xl font-bold text-primary mb-4">What Affects SEO Pricing?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {content.sections[3].items?.map((item, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl p-6">
                <h4 className="font-semibold text-primary mb-2">{item.title}</h4>
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Guarantee */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Promise</span>
              <h2 className="text-3xl font-bold text-primary mb-4">What We Guarantee</h2>
            </div>
            <div className="bg-white rounded-2xl border border-border p-8">
              {Array.isArray(content.sections[4].content) && content.sections[4].content.map((paragraph, i) => (
                <p key={i} className="text-text-secondary leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-primary mb-4">We Guarantee:</h4>
                <ul className="grid md:grid-cols-2 gap-3">
                  {[
                    'Transparent reporting every month',
                    '100% Google-compliant practices',
                    '24-hour response time',
                    'Continuous data-driven optimization',
                    'No long-term contracts after 3 months',
                    'Full access to your accounts & data',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-secondary">
                      <Check size={16} className="text-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone Tracker Preview */}
      <section className="py-24">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Client Dashboard</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Track Your Progress</h2>
            <p className="text-text-secondary">
              Every client gets access to a milestone tracker. SEO isn&apos;t a black box - it&apos;s a project with a clear timeline.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-border p-8">
            <h4 className="font-semibold text-primary mb-6">Your 3-Month Journey</h4>
            <div className="space-y-6">
              {[
                { stage: 'Foundation', month: 'Month 1', progress: 100, status: 'Complete' },
                { stage: 'Ranking', month: 'Month 2', progress: 50, status: 'In Progress' },
                { stage: 'Conversion', month: 'Month 3', progress: 10, status: 'Upcoming' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium text-primary">{item.stage}</span>
                      <span className="text-sm text-text-muted ml-2">({item.month})</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      item.progress === 100 ? 'text-green-600' :
                      item.progress > 0 ? 'text-accent' : 'text-text-muted'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.progress === 100 ? 'bg-green-500' : 'bg-accent'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Solutions CTA */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{content.cta.headline}</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              {content.cta.description}
            </p>
            <a href={getWhatsAppUrl("Hi, I need help choosing the right package for my business.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors">
              {content.cta.buttonText}
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        faqs={pricingFaqs}
        title="Pricing Questions"
        subtitle="Common questions about our pricing and packages."
        background="white"
      />
    </>
  )
}