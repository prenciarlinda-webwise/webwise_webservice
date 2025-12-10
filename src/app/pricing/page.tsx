import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'

export const metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for web development, SEO, and digital marketing services.',
}

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$999',
      period: '/month',
      description: 'Perfect for small businesses just getting started',
      features: [
        { text: 'Basic SEO optimization', included: true },
        { text: 'Up to 10 keywords', included: true },
        { text: 'Monthly reporting', included: true },
        { text: 'Google Business Profile', included: true },
        { text: 'Technical SEO audit', included: false },
        { text: 'Content marketing', included: false },
        { text: 'Link building', included: false },
        { text: 'Dedicated manager', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Growth',
      price: '$2,499',
      period: '/month',
      description: 'Ideal for growing businesses ready to scale',
      features: [
        { text: 'Advanced SEO optimization', included: true },
        { text: 'Up to 30 keywords', included: true },
        { text: 'Bi-weekly reporting', included: true },
        { text: 'Google Business Profile', included: true },
        { text: 'Technical SEO audit', included: true },
        { text: 'Content marketing (4 posts)', included: true },
        { text: 'Link building', included: true },
        { text: 'Dedicated manager', included: false },
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$4,999',
      period: '/month',
      description: 'For businesses that demand the best results',
      features: [
        { text: 'Full-service SEO', included: true },
        { text: 'Unlimited keywords', included: true },
        { text: 'Weekly reporting', included: true },
        { text: 'Google Business Profile', included: true },
        { text: 'Technical SEO audit', included: true },
        { text: 'Content marketing (8 posts)', included: true },
        { text: 'Premium link building', included: true },
        { text: 'Dedicated manager', included: true },
      ],
      cta: 'Contact Us',
      popular: false,
    },
  ]

  const webPlans = [
    {
      name: 'Basic Website',
      price: '$2,500',
      period: 'one-time',
      description: '5-page professional website',
      features: ['Responsive design', 'SEO-optimized', 'Contact form', '2 revisions', '30-day support'],
    },
    {
      name: 'Business Website',
      price: '$5,000',
      period: 'one-time',
      description: '10-page feature-rich website',
      features: ['Custom design', 'CMS integration', 'Blog setup', 'Analytics setup', '90-day support'],
    },
    {
      name: 'E-commerce',
      price: '$8,000+',
      period: 'one-time',
      description: 'Full online store solution',
      features: ['Product catalog', 'Payment integration', 'Inventory management', 'Custom features', '6-month support'],
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm mb-4">Pricing</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-lg text-white/80">
              No hidden fees. Choose the plan that fits your business needs and budget.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Pricing */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">SEO Services</span>
            <h2 className="text-3xl font-bold text-primary">Monthly SEO Plans</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border-2 p-8 relative ${
                  plan.popular ? 'border-accent shadow-xl scale-105' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-primary mb-2">{plan.name}</h3>
                  <p className="text-text-muted text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-text-muted">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check size={18} className="text-accent" />
                      ) : (
                        <X size={18} className="text-text-muted" />
                      )}
                      <span className={feature.included ? 'text-text-secondary' : 'text-text-muted'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
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

      {/* Web Development Pricing */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Web Development</span>
            <h2 className="text-3xl font-bold text-primary">Website Packages</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {webPlans.map((plan, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-primary mb-2">{plan.name}</h3>
                  <p className="text-text-muted text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-text-muted">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check size={18} className="text-accent" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="block w-full py-3 text-center font-semibold rounded-lg bg-bg-secondary text-primary hover:bg-bg-tertiary transition-colors"
                >
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="py-24">
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
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">FAQ</span>
            <h2 className="text-3xl font-bold text-primary">Pricing Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Are there any setup fees?', a: 'No hidden fees! The prices shown include all setup and onboarding costs.' },
              { q: 'Can I cancel anytime?', a: 'Yes, our SEO services are month-to-month with no long-term contracts required.' },
              { q: 'Do you offer payment plans?', a: 'Yes, we offer flexible payment options for website projects. Contact us to discuss.' },
              { q: 'What&apos;s included in ongoing support?', a: 'Ongoing support includes bug fixes, security updates, content changes, and technical assistance.' },
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
