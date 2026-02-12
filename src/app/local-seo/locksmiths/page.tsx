import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Check, AlertCircle, CheckCircle, KeyRound, Phone, MapPin, Star, Clock, Shield, Search } from 'lucide-react'
import { siteConfig, getWhatsAppUrl } from '@/data/site'
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schemas'
import FAQSection from '@/components/sections/FAQSection'

const pageUrl = `${siteConfig.url}/local-seo/locksmiths`

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Locksmiths - Locksmith SEO Services',
    description: 'We get locksmith businesses to the top of Google when customers are locked out. Emergency lockout calls, 24/7 visibility. Free audit.',
    keywords: [
      'locksmith seo', 'seo for locksmiths', 'locksmith marketing',
      'locksmith google ranking', 'emergency locksmith seo',
      'locksmith local seo', 'locksmith lead generation',
      'locksmith website optimization', 'locksmith google maps',
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title: 'SEO for Locksmiths - Locksmith SEO Services',
      description: 'We get locksmith businesses to the top of Google when customers are locked out. Emergency lockout calls, 24/7 visibility.',
      url: pageUrl,
    },
  }
}

const faqs = [
  {
    question: 'How long does locksmith SEO take to show results?',
    answer: 'Most locksmith businesses see measurable improvements in Google Maps rankings within 60–90 days. Organic search rankings for competitive keywords like "emergency locksmith near me" typically improve within 3–6 months. Quick wins like Google Business Profile optimization can generate new calls within the first month.',
  },
  {
    question: 'How much does SEO cost for a locksmith business?',
    answer: 'Locksmith SEO typically ranges from $750 to $2,500 per month depending on your market size and competition. A single-location locksmith in a mid-sized city may invest less, while a multi-van operation covering a large metro area may require a higher budget. We provide custom quotes based on your specific market and goals.',
  },
  {
    question: 'Can SEO help me compete with locksmith lead generation sites?',
    answer: 'Absolutely. Lead generation sites like Angi and HomeAdvisor charge $30–75 per lead and share those leads with multiple locksmiths. With SEO, your own website ranks directly in Google, so customers call you first,no middleman, no shared leads, and no per-lead fees. Over time, your cost per lead drops significantly compared to paid platforms.',
  },
  {
    question: 'What keywords should a locksmith target for SEO?',
    answer: 'The highest-converting keywords for locksmiths include emergency-intent terms like "locksmith near me," "locked out of house," "car lockout service," and "24 hour locksmith [city]." We also target service-specific keywords like "lock rekey," "commercial lock installation," and "smart lock installation" to capture customers across all service categories.',
  },
  {
    question: 'Do I need a website to do locksmith SEO?',
    answer: 'While a Google Business Profile alone can generate some calls, a professional website dramatically improves your rankings and conversion rate. Your website serves as the hub for all SEO efforts,service pages, city pages, customer reviews, and trust signals that convince customers to call you instead of a competitor.',
  },
  {
    question: 'How important are Google reviews for locksmith SEO?',
    answer: 'Reviews are one of the top 3 ranking factors for Google Maps. Locksmiths with 50+ reviews and a 4.7+ star rating consistently outrank competitors in the local pack. We help you implement automated review request systems that generate a steady flow of 5-star reviews from satisfied customers.',
  },
]

export default function LocksmithSEOPage() {
  const serviceSchema = generateServiceSchema({
    name: 'Locksmith SEO Services',
    description: 'Professional SEO services for locksmith businesses. We help locksmiths rank #1 on Google Maps and organic search for emergency lockout, key cutting, lock installation, and 24-hour locksmith keywords in their service area.',
    url: pageUrl,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Local SEO', url: `${siteConfig.url}/local-seo` },
    { name: 'Locksmiths', url: pageUrl },
  ])

  const faqSchema = generateFAQSchema(faqs)

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [serviceSchema, breadcrumbSchema, faqSchema],
  }

  return (
    <>
      <Script
        id="schema-graph"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="container px-6">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/local-seo" className="hover:text-white">Local SEO</Link>
            <span>/</span>
            <span className="text-white">Locksmiths</span>
          </nav>
          <div className="max-w-4xl">
            <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl text-white mb-6">
              <KeyRound size={32} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              SEO Services for Locksmiths
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Rank #1 for &ldquo;locksmith near me&rdquo; and emergency lockout searches in your city.
            </p>
            <p className="text-lg text-white/80 mb-8">
              When someone is locked out at 2 AM, they grab their phone and call the first locksmith they find on Google. Our <Link href="/local-seo" className="text-accent-light underline hover:text-white">local SEO services</Link> make sure that locksmith is you,not a lead generation middleman taking a cut of every job.
            </p>
            <a
              href={getWhatsAppUrl("Hi, I'm a locksmith and I'd like to discuss SEO services for my business.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors"
            >
              Get Your Free Locksmith SEO Audit
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="py-12 bg-accent/5 border-b border-accent/10">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border-l-4 border-accent shadow-sm">
              <ul className="space-y-2">
                {[
                  '97% of people search online when they need a locksmith,if you\'re not ranking, you\'re invisible',
                  'Emergency locksmith keywords have the highest conversion rates in home services (40%+ call rate)',
                  'Google Maps rankings drive 70% of all locksmith calls,we optimize your profile to dominate the local pack',
                  'Our locksmith clients see an average 250% increase in organic leads within 6 months',
                  'Stop paying $40–75 per shared lead,own your rankings and get exclusive calls directly',
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-secondary">
                    <Check size={18} className="text-accent flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Is Locksmith SEO */}
      <section className="py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-6">
              What Is Locksmith SEO?
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              Locksmith SEO is the process of optimizing your locksmith business to appear at the top of Google search results when potential customers search for lock-related services in your area. It includes Google Business Profile optimization, website optimization for emergency and service-specific keywords, local citation building, and review management.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Unlike pay-per-click ads or lead generation platforms that charge for every call, SEO builds a long-term asset. Once your locksmith business ranks in the Google Maps pack and organic results for terms like &ldquo;emergency locksmith,&rdquo; &ldquo;lock rekey near me,&rdquo; and &ldquo;24 hour locksmith [your city],&rdquo; you receive a consistent stream of high-intent calls without paying per lead. Combined with a well-structured <Link href="/development" className="text-accent hover:underline">professional website</Link>, locksmith SEO delivers the lowest cost-per-acquisition of any marketing channel.
            </p>
          </div>
        </div>
      </section>

      {/* Why Locksmiths Need SEO */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Why It Matters</span>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Does Your Locksmith Business Need SEO?
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
              The locksmith industry is uniquely dependent on Google visibility. Most customers need help immediately and call the first business they find,here&apos;s why SEO is your most important investment.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Pain Points */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <AlertCircle className="text-red-500" size={24} />
                Common Challenges
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Lead generation sites take your profits',
                    description: 'Platforms like Angi, Thumbtack, and HomeAdvisor charge $30–75 per lead and send the same customer to 3–5 locksmiths. You compete on price instead of reputation.',
                  },
                  {
                    title: 'Scam locksmith companies outrank you',
                    description: 'Fake locksmith operations use SEO tactics to rank above legitimate businesses, quoting low prices then charging 3x on-site. Google rewards businesses that prove legitimacy.',
                  },
                  {
                    title: 'Emergency calls go to whoever ranks first',
                    description: 'Locked-out customers don\'t compare 10 options,they call the first result. If that\'s not you, you\'re losing your highest-value jobs to competitors.',
                  },
                  {
                    title: 'Your service area is too broad to rank everywhere',
                    description: 'You serve 15+ cities but your website has one generic page. Google doesn\'t know which areas you cover, so you rank in none of them.',
                  },
                ].map((pain, i) => (
                  <div key={i} className="bg-white border border-red-100 rounded-xl p-6">
                    <h4 className="font-semibold text-red-800 mb-2">{pain.title}</h4>
                    <p className="text-red-700 text-sm">{pain.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                How We Help
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Own your leads,zero middleman fees',
                    description: 'When your website ranks #1, customers call you directly. No per-lead charges, no shared leads, no bidding wars. Every call is exclusive to your business.',
                  },
                  {
                    title: 'Dominate Google Maps in your service area',
                    description: 'We optimize your Google Business Profile with the right categories, service descriptions, photos, and review strategy to land in the coveted 3-pack for locksmith searches.',
                  },
                  {
                    title: 'Rank for every service you offer',
                    description: 'Dedicated pages for emergency lockouts, residential rekeying, commercial lock installation, automotive key cutting, and smart lock services,each targeting high-intent keywords.',
                  },
                  {
                    title: 'Cover your entire service area',
                    description: 'We build optimized city and neighborhood pages so you rank in every area you serve, not just your headquarters city.',
                  },
                ].map((benefit, i) => (
                  <div key={i} className="bg-white border border-green-100 rounded-xl p-6">
                    <h4 className="font-semibold text-green-800 mb-2">{benefit.title}</h4>
                    <p className="text-green-700 text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keyword Categories */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Keyword Strategy</span>
            <h2 className="text-3xl font-bold text-primary mb-4">
              High-Converting Keywords We Target for Locksmiths
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
              We target keywords across all locksmith service categories, prioritizing emergency and high-intent searches that convert to immediate phone calls.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Phone,
                title: 'Emergency Lockout',
                keywords: ['emergency locksmith near me', 'locked out of house', 'car lockout service', '24 hour locksmith', 'locksmith open now'],
              },
              {
                icon: Shield,
                title: 'Residential Services',
                keywords: ['lock rekey service', 'home lock change', 'deadbolt installation', 'house lockout', 'residential locksmith'],
              },
              {
                icon: KeyRound,
                title: 'Automotive',
                keywords: ['car key replacement', 'transponder key programming', 'car key fob copy', 'ignition repair', 'auto locksmith near me'],
              },
              {
                icon: MapPin,
                title: 'Commercial',
                keywords: ['commercial locksmith', 'access control installation', 'master key system', 'office lockout', 'commercial lock change'],
              },
              {
                icon: Star,
                title: 'Specialty Services',
                keywords: ['smart lock installation', 'safe lockout', 'lock repair', 'security assessment', 'high security locks'],
              },
              {
                icon: Search,
                title: 'Local + City',
                keywords: ['locksmith [city name]', 'locksmith near [neighborhood]', 'best locksmith in [city]', 'cheap locksmith [area]', 'mobile locksmith [city]'],
              },
            ].map((category, i) => (
              <div key={i} className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent mb-4">
                  <category.icon size={22} />
                </div>
                <h3 className="font-semibold text-primary mb-3">{category.title}</h3>
                <ul className="space-y-1.5">
                  {category.keywords.map((kw, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check size={14} className="text-accent flex-shrink-0" />
                      {kw}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Process</span>
            <h2 className="text-3xl font-bold text-primary mb-4">
              How Our Locksmith SEO Service Works
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
              A proven 6-step process designed specifically for locksmith businesses that want to stop relying on lead generation sites and start owning their search rankings.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  title: 'Locksmith Market Audit',
                  duration: 'Week 1',
                  description: 'We analyze your current online presence, competitor rankings, and local search landscape to identify the fastest path to page-one rankings in your service area.',
                  details: [
                    'Competitor keyword gap analysis',
                    'Google Business Profile audit',
                    'Website technical health check',
                    'Local citation consistency review',
                    'Review profile assessment',
                    'Service area mapping',
                  ],
                },
                {
                  title: 'Google Business Profile Optimization',
                  duration: 'Week 2',
                  description: 'Your GBP is where 70% of locksmith calls originate. We optimize every element to maximize your visibility in the Google Maps 3-pack.',
                  details: [
                    'Category optimization (locksmith + subcategories)',
                    'Service descriptions with target keywords',
                    'Service area configuration',
                    'Photo optimization (van, work, team)',
                    'Q&A section with keyword-rich answers',
                    'Post schedule for engagement signals',
                  ],
                },
                {
                  title: 'Website Structure & Service Pages',
                  duration: 'Weeks 2–3',
                  description: 'We build or optimize dedicated pages for every service you offer, each targeting specific keywords that customers search when they need a locksmith.',
                  details: [
                    'Emergency lockout service page',
                    'Residential lock services page',
                    'Commercial locksmith services page',
                    'Automotive key services page',
                    'City/area landing pages',
                    'Conversion-optimized contact forms',
                  ],
                },
                {
                  title: 'Local Citation & Directory Building',
                  duration: 'Weeks 3–4',
                  description: 'Consistent business listings across the web are critical for local rankings. We ensure your NAP (name, address, phone) is accurate everywhere.',
                  details: [
                    'Top 50 directory submissions',
                    'Locksmith-specific directories (ALOA, etc.)',
                    'NAP consistency cleanup',
                    'Industry association listings',
                    'Local chamber of commerce',
                    'Better Business Bureau profile',
                  ],
                },
                {
                  title: 'Review Generation System',
                  duration: 'Ongoing',
                  description: 'We implement automated systems to request reviews from happy customers after every job, building the social proof that drives Google Maps rankings.',
                  details: [
                    'Post-service SMS review requests',
                    'Email follow-up sequences',
                    'Review response templates',
                    'Review monitoring dashboard',
                    'Negative review management',
                    'Multi-platform review strategy',
                  ],
                },
                {
                  title: 'Content & Link Building',
                  duration: 'Monthly',
                  description: 'Ongoing content creation and link building to maintain and improve your rankings, keeping you ahead of competitors who start investing in SEO.',
                  details: [
                    'Monthly blog content (security tips, guides)',
                    'Local link building campaigns',
                    'Seasonal content (holiday security, etc.)',
                    'Internal linking optimization',
                    'Performance reporting & adjustments',
                    'Keyword expansion into new services',
                  ],
                },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-accent text-white font-bold rounded-xl flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                        <span className="text-sm text-accent font-medium bg-accent/10 px-3 py-1 rounded-full">{step.duration}</span>
                      </div>
                      <p className="text-text-secondary mb-4">{step.description}</p>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {step.details.map((detail, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-text-muted">
                            <Check size={14} className="text-accent flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-primary rounded-2xl p-8 text-white">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-2">Expected Timeline</h4>
                  <p className="text-white/80 text-sm">Initial rankings improvements within 60–90 days. Significant organic call volume growth within 4–6 months. Full market dominance within 9–12 months.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What You&apos;ll Receive</h4>
                  <ul className="space-y-1">
                    {[
                      'Monthly performance reports',
                      'Call tracking with recordings',
                      'Keyword ranking dashboard',
                      'Review monitoring alerts',
                      'Competitor movement updates',
                      'Dedicated account manager',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <Check size={14} className="text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Results</span>
            <h2 className="text-3xl font-bold text-primary mb-4">
              What Locksmith SEO Delivers
            </h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
              Our clients consistently see significant improvements in call volume, revenue, and market position within the first 6 months. See what our <Link href="/seo-services" className="text-accent hover:underline">SEO services</Link> can do for your locksmith business.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { stat: '250%', label: 'Average increase in organic leads' },
              { stat: '40%+', label: 'Call conversion rate from search' },
              { stat: '70%', label: 'Of locksmith calls come from Maps' },
              { stat: '$0', label: 'Per-lead cost once you rank' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-bg-secondary rounded-2xl">
                <div className="text-4xl font-bold text-accent mb-2">{item.stat}</div>
                <p className="text-sm text-text-secondary">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Industries */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Related Services</span>
            <h2 className="text-3xl font-bold text-primary">SEO for Other Home Service Industries</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Plumbers', slug: 'plumbers', description: 'Emergency plumbing calls and water damage leads through local SEO.' },
              { name: 'Electricians', slug: 'electricians', description: 'Electrical service leads from Google Maps and organic search.' },
              { name: 'HVAC Companies', slug: 'hvac', description: 'Heating and cooling leads year-round with seasonal SEO strategies.' },
            ].map((industry) => (
              <Link
                key={industry.slug}
                href={`/local-seo/${industry.slug}`}
                className="bg-white rounded-xl p-6 border border-border hover:shadow-lg hover:border-accent/30 transition-all group"
              >
                <h3 className="font-semibold text-primary mb-2">{industry.name}</h3>
                <p className="text-sm text-text-secondary mb-3">{industry.description}</p>
                <span className="text-sm text-accent font-medium group-hover:underline">Learn more &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        faqs={faqs}
        title="Locksmith SEO FAQ"
        subtitle="Common questions about SEO for locksmith businesses."
      />

      {/* CTA */}
      <section className="py-24">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Stop Paying for Shared Leads?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Get a free locksmith SEO audit and discover exactly what it takes to rank #1 in your city. No contracts, no per-lead fees,just more calls from customers who find you directly on Google.
            </p>
            <a
              href={getWhatsAppUrl("Hi, I'm a locksmith and I'd like a free SEO audit for my business.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors"
            >
              Get Your Free Locksmith SEO Audit
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
