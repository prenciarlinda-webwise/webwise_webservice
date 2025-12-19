import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Check, Zap, Rocket, Crown, Monitor } from 'lucide-react'
import { generateFAQSchema, generateWebPageSchema } from '@/lib/schemas'
import { siteConfig } from '@/data/site'

export const metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for web development, SEO, and digital marketing services.',
}

const faqs = [
  { question: 'Why should I commit to 3 months?', answer: 'SEO is a long-term strategy. The 3-month timeline allows us to properly build your foundation, achieve rankings, and optimize for conversions. Most clients see meaningful results by month 2-3.' },
  { question: 'Are there any setup fees?', answer: 'No hidden fees! The prices shown include all setup and onboarding costs.' },
  { question: 'Can I cancel anytime?', answer: 'Yes, our SEO services are month-to-month after the initial 3-month period. We recommend staying for at least 3 months to see real results.' },
  { question: 'Do you offer payment plans?', answer: 'Yes, we offer flexible payment options for website projects. Contact us to discuss.' },
  { question: 'What if I need both a website and SEO?', answer: 'We offer bundle discounts! Get a website + 3 months of any SEO plan and save 15%. Contact us for details.' },
]

const faqSchema = generateFAQSchema(faqs)
const pageSchema = generateWebPageSchema({
  name: 'Pricing - WebWise',
  description: 'Transparent pricing for web development, SEO, and digital marketing services.',
  url: `${siteConfig.url}/pricing`,
})

export default function PricingPage() {
  const seoPlans = [
    {
      name: 'Starter SEO',
      icon: Zap,
      price: '$450',
      pricePound: '£380',
      period: '/month',
      description: 'Foundational Visibility',
      features: [
        { text: 'Google Business Profile optimization', included: true },
        { text: 'NAP consistency audit & fixes', included: true },
        { text: 'Up to 10 target keywords', included: true },
        { text: 'Monthly performance reporting', included: true },
        { text: 'Local citation building', included: true },
        { text: 'Blog content creation', included: false },
        { text: 'Competitor analysis', included: false },
        { text: 'Backlink strategy', included: false },
      ],
      expectations: [
        { month: 1, title: 'Foundation', desc: 'GBP fully optimized, all NAP errors fixed across the web' },
        { month: 2, title: 'Visibility', desc: 'Appearing in Map Pack for long-tail keywords' },
        { month: 3, title: 'Growth', desc: '20-50% more Discovery views, increased calls & clicks' },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Medium SEO',
      icon: Rocket,
      price: '$800',
      pricePound: '£680',
      period: '/month',
      description: 'Competitive Climbing',
      features: [
        { text: 'Everything in Starter', included: true },
        { text: 'Up to 25 target keywords', included: true },
        { text: 'Bi-weekly reporting', included: true },
        { text: 'Content gap analysis', included: true },
        { text: '2 blog posts per month', included: true },
        { text: 'On-page SEO optimization', included: true },
        { text: 'Competitor tracking', included: true },
        { text: 'Premium backlinks', included: false },
      ],
      expectations: [
        { month: 1, title: 'Analysis', desc: 'Content gaps identified, first 2 industry-leading blog posts published' },
        { month: 2, title: 'Ranking', desc: 'Page 1 or Top of Page 2 for "Service + City" keywords' },
        { month: 3, title: 'Traffic', desc: 'Measurable MoM organic traffic increase, outranking local competitors' },
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Premium SEO',
      icon: Crown,
      price: '$1,200',
      pricePound: '£1,000',
      period: '/month',
      description: 'Market Authority',
      features: [
        { text: 'Everything in Medium', included: true },
        { text: 'Unlimited target keywords', included: true },
        { text: 'Weekly reporting', included: true },
        { text: 'Deep competitor analysis', included: true },
        { text: '4 blog posts per month', included: true },
        { text: 'Aggressive backlink strategy', included: true },
        { text: 'Conversion rate optimization', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
      expectations: [
        { month: 1, title: 'Strategy', desc: 'Deep competitor analysis, aggressive backlink campaign begins' },
        { month: 2, title: 'Dominance', desc: 'Top 3 rankings (Golden Triangle) for high-volume keywords' },
        { month: 3, title: 'Authority', desc: 'Lead Generation Machine with established local brand authority' },
      ],
      cta: 'Get Started',
      popular: false,
    },
  ]

  const webPlan = {
    name: 'Website Development',
    icon: Monitor,
    price: '$1,500',
    pricePound: '£1,200',
    period: 'one-time',
    description: 'The Conversion Engine',
    includes: ['Perfect SEO Setup', 'Google My Business Setup'],
    features: [
      'Modern, responsive design',
      'Next.js for blazing speed',
      'SEO-optimized structure',
      'Contact form integration',
      'Google Analytics setup',
      'Mobile-first approach',
      '30-day support included',
    ],
    expectations: [
      { month: 1, title: 'Launch', desc: 'Site live, Google indexed every page, GMB verified' },
      { month: 2, title: 'Performance', desc: 'Technical SEO pays off - faster loads, longer user sessions' },
      { month: 3, title: 'Insights', desc: 'Clear baseline data on visitor-to-lead conversion rate' },
    ],
  }

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
              Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-lg text-white/80">
              No hidden fees. Clear 3-month expectations. Real results you can track.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Pricing */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">SEO Services</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Monthly SEO Plans</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Each plan comes with a clear 3-month roadmap so you know exactly what to expect.
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
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-text-muted">{plan.period}</span>
                  </div>
                  <div className="text-sm text-text-muted mt-1">{plan.pricePound}/month</div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check size={18} className={feature.included ? 'text-accent' : 'text-gray-300'} />
                      <span className={feature.included ? 'text-text-secondary' : 'text-text-muted line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* 3-Month Expectations */}
                <div className="bg-bg-secondary rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-semibold text-primary mb-3">3-Month Roadmap</h4>
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

                <Link
                  href="/contact"
                  className={`block w-full py-3 text-center font-semibold rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-accent text-white hover:bg-accent-dark'
                      : 'bg-bg-secondary text-primary hover:bg-bg-tertiary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
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
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">{webPlan.price}</span>
                      <span className="text-text-muted">{webPlan.period}</span>
                    </div>
                    <div className="text-sm text-text-muted">{webPlan.pricePound} one-time</div>
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

                  <Link
                    href="/contact"
                    className="block w-full mt-8 py-3 text-center font-semibold rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Get Your Website
                  </Link>
                </div>
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
              Every client gets access to a milestone tracker. SEO isn&apos;t a black box — it&apos;s a project with a clear timeline.
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

      {/* Custom Solutions */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Every business is unique. Let&apos;s discuss your specific needs and create a tailored package that fits your goals and budget.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
              Get Custom Quote
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">FAQ</span>
            <h2 className="text-3xl font-bold text-primary">Pricing Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Why should I commit to 3 months?', a: 'SEO is a long-term strategy. The 3-month timeline allows us to properly build your foundation, achieve rankings, and optimize for conversions. Most clients see meaningful results by month 2-3.' },
              { q: 'Are there any setup fees?', a: 'No hidden fees! The prices shown include all setup and onboarding costs.' },
              { q: 'Can I cancel anytime?', a: 'Yes, our SEO services are month-to-month after the initial 3-month period. We recommend staying for at least 3 months to see real results.' },
              { q: 'Do you offer payment plans?', a: 'Yes, we offer flexible payment options for website projects. Contact us to discuss.' },
              { q: 'What if I need both a website and SEO?', a: 'We offer bundle discounts! Get a website + 3 months of any SEO plan and save 15%. Contact us for details.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-primary mb-2">{item.q}</h3>
                <p className="text-text-secondary">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}