import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { siteConfig, clients } from '@/data/site'
import { getIndustryRelatedPosts } from '@/data/blog'
import { generateFAQSchema } from '@/lib/schemas'
import PricingCTA from '@/components/forms/PricingCTA'
import {
  DoodleUnderline,
  DoodleArrow,
  DoodlePipe,
  DoodlePaintStroke,
  DoodleRoofline,
  DoodleKeyCut,
} from '@/components/ui/Doodle'
import type { IndustryPageContent } from '@/data/industryPages'

const heroDoodles: Record<string, typeof DoodlePipe> = {
  plumbers: DoodlePipe,
  painters: DoodlePaintStroke,
  roofing: DoodleRoofline,
  locksmiths: DoodleKeyCut,
}

export default function IndustryPage({ content }: { content: IndustryPageContent }) {
  const pageUrl = `${siteConfig.url}/local-seo/${content.slug}`
  const caseStudy = content.caseStudy
  const caseStudyClient = caseStudy ? clients[caseStudy.clientKey] : undefined
  const HeroDoodle = heroDoodles[content.slug] ?? DoodlePipe
  const relatedPosts = getIndustryRelatedPosts(content.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${pageUrl}#service`,
        name: `Web Wise Local SEO for ${content.tradeName}`,
        description: content.metaDescription,
        url: pageUrl,
        areaServed: ['United States', 'United Kingdom'],
        priceRange: '$$',
        provider: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url, logo: `${siteConfig.url}${siteConfig.logo}` },
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        // Real per-plan pricing from the tiers already rendered on this page, not a generic placeholder.
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${content.tradeName} SEO Plans`,
          itemListElement: content.pricingTiers.map((tier) => ({
            '@type': 'Offer',
            name: `${tier.name} Plan`,
            description: tier.description,
            price: tier.price.replace(/[^0-9.]/g, ''),
            priceCurrency: 'USD',
            priceSpecification: { '@type': 'UnitPriceSpecification', price: tier.price.replace(/[^0-9.]/g, ''), priceCurrency: 'USD', billingIncrement: 1, unitText: 'MONTH' },
          })),
        },
      },
      generateFAQSchema(content.faqs, `/local-seo/${content.slug}`),
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'Local SEO', item: `${siteConfig.url}/local-seo` },
          { '@type': 'ListItem', position: 3, name: content.tradeName, item: pageUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: content.metaTitle,
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.aeo-answer', '.hero-answer'] },
        about: { '@id': `${pageUrl}#service` },
      },
    ],
  }

  return (
    <>
      <Script
        id={`${content.slug}-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero, light, centered, ambient light wash */}
      <section className="relative bg-white ambient-light overflow-hidden py-24 lg:py-28">
        <HeroDoodle className="hidden md:block absolute -top-4 -right-14 w-80 h-48 text-accent/15 pointer-events-none" />
        <HeroDoodle className="hidden md:block absolute -bottom-14 -left-20 w-72 h-44 text-primary/10 pointer-events-none rotate-180" />
        <div className="container px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary leading-[1.05] mb-4">
              {content.h1.split(content.underlineWord)[0]}
              <span className="relative inline-block">
                {content.underlineWord}
                <DoodleUnderline className="absolute left-0 -bottom-1 w-full h-3 text-accent" />
              </span>
              {content.h1.split(content.underlineWord)[1]}
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              {content.heroSubhead}
            </p>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-accent mb-4">
              {content.heroH2}
            </h2>
            <p className="hero-answer text-base md:text-lg text-text-primary max-w-2xl mx-auto mb-10 leading-relaxed">
              {content.heroH2Answer}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <PricingCTA
                source={`${content.tradeName} local SEO page hero`}
                ctaLabel={`Get My Free ${content.tradeName} SEO Audit`}
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
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              {content.aeoQuestion}
            </h2>
            <p className="aeo-answer text-lg text-text-primary leading-relaxed mb-6">
              {content.aeoAnswer}
            </p>
            <p className="text-text-secondary leading-relaxed mb-10">
              {content.aeoIntro}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-8 border-t border-border">
              {content.stats.map(({ stat, label }) => (
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
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              What Our {content.tradeName} SEO Service Includes
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Every ranking signal that matters for Google Maps and local organic search, handled end-to-end
              by our team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.map((service) => (
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
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Our {content.tradeName} SEO Process
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              A clear, four-phase roadmap so you always know what we&apos;re working on and when to expect results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.process.map((step) => (
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
              {content.tradeName} SEO Pricing
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              No contracts. No hidden fees. Month-to-month plans that scale with your growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {content.pricingTiers.map((tier, i) => (
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
                <h3 className={`font-display font-bold text-xl mb-1 ${tier.popular ? 'text-white' : 'text-primary'}`}>
                  {tier.name}
                </h3>
                <div className={`text-4xl font-display font-bold mb-1 ${tier.popular ? 'text-accent' : 'text-primary'}`}>
                  {tier.price}
                  <span className={`text-base font-normal ${tier.popular ? 'text-white/60' : 'text-text-muted'}`}>/mo</span>
                </div>
                <p className={`text-sm mb-6 ${tier.popular ? 'text-white/70' : 'text-text-muted'}`}>{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                      <span className={`text-sm ${tier.popular ? 'text-white/80' : 'text-text-primary'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <PricingCTA
                  source={`${content.tradeName} local SEO page, ${tier.name} plan`}
                  ctaLabel="Get Started"
                  popular={i === 1}
                  planName={tier.name}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan and Timeline Comparison, real <table> markup so pricing and ranking-speed
          data can be extracted directly by AI Overviews and other LLM answer engines. */}
      <section className="py-16 bg-white">
        <div className="container px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="text-left font-display font-bold text-lg text-primary mb-4">
                  {content.tradeName} SEO Plan Comparison
                </caption>
                <thead>
                  <tr className="border-b-2 border-border">
                    <th scope="col" className="text-left py-3 pr-4 font-semibold text-primary">Plan</th>
                    <th scope="col" className="text-left py-3 pr-4 font-semibold text-primary">Monthly Price</th>
                    <th scope="col" className="text-left py-3 font-semibold text-primary">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {content.pricingTiers.map((tier) => (
                    <tr key={tier.name} className="border-b border-border">
                      <th scope="row" className="text-left py-3 pr-4 font-medium text-text-primary">{tier.name}</th>
                      <td className="py-3 pr-4 text-text-primary">{tier.price}/mo</td>
                      <td className="py-3 text-text-muted">{tier.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {content.rankingTimeline && content.rankingTimeline.length > 0 && (
              <div className="lg:col-span-2 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <caption className="text-left font-display font-bold text-lg text-primary mb-4">
                    Expected Ranking Timeline
                  </caption>
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th scope="col" className="text-left py-3 pr-4 font-semibold text-primary">Milestone</th>
                      <th scope="col" className="text-left py-3 font-semibold text-primary">Timeframe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.rankingTimeline.map((row) => (
                      <tr key={row.milestone} className="border-b border-border">
                        <th scope="row" className="text-left py-3 pr-4 font-medium text-text-primary">{row.milestone}</th>
                        <td className="py-3 text-text-muted">{row.timeframe}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Case Study, real screenshot */}
      {caseStudy && caseStudyClient && (
        <section className="py-16">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border shadow-sm overflow-hidden grid md:grid-cols-2">
              <div className="relative bg-bg-secondary min-h-[220px] md:min-h-full">
                <Image
                  src={caseStudyClient.image}
                  alt={`Screenshot of the ${caseStudyClient.name} website`}
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
                <h3 className="text-primary font-display font-bold text-xl mt-1 mb-4">{caseStudyClient.name}</h3>
                <p className="text-text-muted mb-8">{caseStudy.summary}</p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {caseStudy.metrics.map(({ metric, label }) => (
                    <div key={label}>
                      <div className="text-2xl font-display font-bold text-accent">{metric}</div>
                      <div className="text-sm text-text-muted mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/case-studies/${caseStudy.caseStudySlug}`}
                  className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:gap-3 transition-all"
                >
                  Read the full case study →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
              {content.tradeName} SEO FAQs
            </h2>
            <p className="text-text-muted text-center mb-12">
              Answers to the questions we hear most from {content.tradePlural}.
            </p>
            <div className="space-y-6">
              {content.faqs.map((faq) => (
                <div key={faq.question} className="bg-white rounded-xl p-6 border border-border">
                  <h3 className="font-display font-bold text-primary mb-3">{faq.question}</h3>
                  <p className="text-text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-24">
          <div className="container px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                {content.tradeName} SEO Resources
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Free guides and keyword research for {content.tradePlural}, straight from the team running
                these campaigns.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-48 bg-white flex items-center justify-center overflow-hidden p-3">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-accent/20">{post.category}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                    <p className="text-xs text-text-muted">{post.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related industries + hub link */}
      <section className="py-12">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-text-muted leading-relaxed">
              See our full{' '}
              <Link href="/pricing" className="text-accent hover:underline font-medium">
                {content.tradeName.toLowerCase()} SEO pricing and package details
              </Link>
              , browse{' '}
              <Link href="/local-seo" className="text-accent hover:underline font-medium">
                local SEO for every trade we serve
              </Link>
              , or see how we run a similar playbook for{' '}
              {content.relatedIndustries.map((rel, i) => (
                <span key={rel.slug}>
                  <Link href={`/local-seo/${rel.slug}`} className="text-accent hover:underline font-medium">
                    {rel.name}
                  </Link>
                  {i < content.relatedIndustries.length - 1 ? ', ' : ''}
                </span>
              ))}
              .
            </p>
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
            Stop watching competitors take your calls. Get a free SEO audit and find out exactly what&apos;s
            holding your Map Pack rankings back, with no commitment and no sales pressure.
          </p>
          <p className="font-caveat text-2xl text-accent mb-8 flex items-center justify-center gap-2">
            <DoodleArrow className="w-8 h-8 rotate-[100deg] text-accent" />
            no contracts, ever
          </p>
          <PricingCTA
            source={`${content.tradeName} local SEO page, bottom CTA`}
            ctaLabel={`Get Your Free ${content.tradeName} SEO Audit`}
            buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
          />
        </div>
      </section>
    </>
  )
}
