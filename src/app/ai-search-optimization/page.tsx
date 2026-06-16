import { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { Zap, MessageSquare, Check, ArrowRight, Mic, Globe } from 'lucide-react'
import { siteConfig } from '@/data/site'
import { pageSEO } from '@/data/seo'
import LeadForm from '@/components/forms/LeadForm'
import PricingCTA from '@/components/forms/PricingCTA'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = pageSEO['ai-search-optimization']
  return {
    title: seoData?.title || 'AI Search Optimization Services - GEO & AEO for 2026',
    description:
      seoData?.description ||
      'AI Search Optimization (GEO & AEO) services that get your business found in ChatGPT, Perplexity, and Google AI Overviews. Optimize for AI search in 2026.',
    keywords: seoData?.keywords,
    alternates: { canonical: `${siteConfig.url}/ai-search-optimization` },
    openGraph: {
      title: seoData?.title || 'AI Search Optimization Services - GEO & AEO for 2026',
      description:
        seoData?.description ||
        'Optimize for ChatGPT, Perplexity, Google AI Overviews and every AI-powered answer engine. GEO & AEO strategies for 2026.',
      url: `${siteConfig.url}/ai-search-optimization`,
    },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${siteConfig.url}/ai-search-optimization#service`,
      name: 'AI Search Optimization (GEO & AEO)',
      description:
        'Generative Engine Optimization and Answer Engine Optimization services that get small businesses found in ChatGPT, Perplexity, Google AI Overviews, and voice assistants.',
      url: `${siteConfig.url}/ai-search-optimization`,
      provider: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
      },
      areaServed: ['United States', 'United Kingdom'],
      serviceType: 'AI Search Optimization',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${siteConfig.url}/ai-search-optimization#breadcrumb`,
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
          name: 'AI Search Optimization',
          item: `${siteConfig.url}/ai-search-optimization`,
        },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/ai-search-optimization#webpage`,
      url: `${siteConfig.url}/ai-search-optimization`,
      name: 'AI Search Optimization Services - GEO & AEO for 2026',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#what-is'],
      },
      breadcrumb: { '@id': `${siteConfig.url}/ai-search-optimization#breadcrumb` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteConfig.url}/ai-search-optimization#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is AI search optimization?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AI search optimization (also called GEO or AEO) is the practice of structuring your content, authority signals, and entity data so that AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews cite or recommend your business when users ask relevant questions.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is GEO different from SEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Traditional SEO targets ranked blue links; GEO (Generative Engine Optimization) targets the AI-synthesized answers that appear above those links or replace them entirely. GEO focuses on entity authority, structured data, citation-worthy content, and topical depth rather than keyword density alone.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you appear in ChatGPT results?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. ChatGPT and Perplexity draw on indexed web content, Bing search data, and trusted third-party sources. By building strong entity authority, earning citations on high-trust sites, and publishing structured Q&A content, businesses can increase their likelihood of being cited in AI-generated answers.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does AI search optimization take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Initial improvements — such as appearing in Google AI Overviews for branded queries — typically take 6 to 12 weeks. Appearing consistently in ChatGPT or Perplexity for competitive queries usually requires 3 to 6 months of sustained entity-building and content authority work.',
          },
        },
      ],
    },
  ],
}

const tldrPoints = [
  'AI now answers up to 60% of searches directly — without a click to your website.',
  'GEO (Generative Engine Optimization) is the discipline of getting cited inside AI-generated answers.',
  'AEO (Answer Engine Optimization) focuses on structured, question-answering content that AI models can extract and quote.',
  'Businesses that build entity authority and topical depth now will dominate AI search for years.',
]

const whatWeOptimizeFor = [
  {
    Icon: Globe,
    title: 'Google AI Overviews',
    description:
      'Google SGE/AI Overviews appear at the top of SERPs for millions of queries. We optimise your content structure, entity signals, and E-E-A-T indicators so Google pulls your answers into the overview box rather than a competitor\'s.',
  },
  {
    Icon: MessageSquare,
    title: 'ChatGPT & Perplexity',
    description:
      'ChatGPT Browse, GPT-4o, and Perplexity all pull from indexed web content and third-party citations. We build the authority signals and structured content that make these models reference your business when users ask industry questions.',
  },
  {
    Icon: Mic,
    title: 'Voice & Answer Engines',
    description:
      'Siri, Alexa, and Google Assistant read Featured Snippet and schema-structured content. We craft concise, spoken-English answers and FAQ schema so your business becomes the default answer for local and industry voice queries.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'AI Search Audit',
    description:
      'We audit how your brand currently appears (or doesn\'t) across ChatGPT, Perplexity, Google AI Overviews, and voice search. We benchmark entity recognition, citation gaps, and structured data coverage.',
  },
  {
    step: '02',
    title: 'Entity & Authority Building',
    description:
      'We build your Knowledge Graph entity, earn citations on high-authority directories and publications, and ensure your brand data is consistent across every source AI models trust.',
  },
  {
    step: '03',
    title: 'AEO Content Optimisation',
    description:
      'We rewrite or create content using direct-answer formats: concise definition paragraphs, FAQ schema, How-To schema, and speakable markup — exactly what AI models extract when generating answers.',
  },
  {
    step: '04',
    title: 'Monitoring & Iteration',
    description:
      'We track your AI search presence monthly, testing prompts across platforms to measure citation frequency. We iterate on content and schema as AI algorithms evolve to maintain and grow your visibility.',
  },
]

const faqs = [
  {
    question: 'What is AI search optimization?',
    answer:
      'AI search optimization (also called GEO or AEO) is the practice of structuring your content, authority signals, and entity data so that AI-powered engines like ChatGPT, Perplexity, and Google AI Overviews cite or recommend your business when users ask relevant questions.',
  },
  {
    question: 'How is GEO different from SEO?',
    answer:
      'Traditional SEO targets ranked blue links; GEO targets the AI-synthesized answers that appear above or replace those links. GEO focuses on entity authority, structured data, citation-worthy content, and topical depth rather than keyword density alone.',
  },
  {
    question: 'Can you appear in ChatGPT results?',
    answer:
      'Yes. ChatGPT and Perplexity draw on indexed web content, Bing search data, and trusted third-party sources. Strong entity authority, citations on high-trust sites, and structured Q&A content all increase the likelihood of being cited in AI-generated answers.',
  },
  {
    question: 'How long does AI search optimization take?',
    answer:
      'Initial improvements — such as appearing in Google AI Overviews for branded queries — typically take 6 to 12 weeks. Consistent appearance in ChatGPT or Perplexity for competitive queries usually requires 3 to 6 months of sustained entity-building and content authority work.',
  },
]

const comparisonRows = [
  { label: 'Primary goal', traditional: 'Rank on page one', ai: 'Get cited in AI answers' },
  { label: 'Key metric', traditional: 'Keyword rankings', ai: 'Citation frequency & AI impressions' },
  { label: 'Content format', traditional: 'Long-form keyword-rich pages', ai: 'Direct-answer, structured Q&A' },
  { label: 'Authority signals', traditional: 'Backlink count & domain authority', ai: 'Entity recognition & citation quality' },
  { label: 'Click-through', traditional: 'Users click blue links', ai: 'Answer delivered without click' },
  { label: 'Schema markup', traditional: 'Nice to have', ai: 'Essential for extraction' },
]

export default function AISearchOptimizationPage() {
  return (
    <>
      <Script
        id="ai-search-optimization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="bg-primary text-white py-24">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-white/60 mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white/80">AI Search Optimization</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="block text-xs font-bold text-accent uppercase tracking-widest mb-6">GEO and AEO for 2026</p>
              <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
                Get Found in ChatGPT, Perplexity and Google AI
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Traditional SEO gets you ranked. AI Search Optimization — Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) — gets you <strong className="text-white">cited inside the answer</strong>. We help small businesses become the source AI models quote when customers ask questions in your industry.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Appear in Google AI Overviews & SGE',
                  'Get cited by ChatGPT, Perplexity & Copilot',
                  'Optimise for voice & answer engines',
                  'Build entity authority AI models trust',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-white/90">
                    <Check size={16} className="text-accent flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Get My Free GEO Audit
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="#what-is"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div id="contact" className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-primary text-xl font-display font-bold mb-2">
                Free AI Search Audit
              </h2>
              <p className="text-text-secondary text-sm mb-6">
                Find out how your business currently appears across ChatGPT, Perplexity, and Google AI — and what it will take to get cited.
              </p>
              <LeadForm
                source="AI Search Optimization hero"
                defaultService="ai-search-optimization"
                ctaLabel="Get My GEO Audit"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TL;DR Takeaways ─────────────────────────────────────── */}
      <section className="py-12 bg-bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto border-l-4 border-accent bg-white rounded-r-xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-4">
              Key Takeaways
            </p>
            <ul className="space-y-3">
              {tldrPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-text-secondary">
                  <Zap size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── What Is AI Search Optimization ──────────────────────── */}
      <section id="what-is" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-6">
              What Is AI Search Optimization?
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              <strong className="text-primary">AI search optimization</strong> is the process of structuring your website content, brand authority signals, and entity data so that AI-powered search engines — including Google AI Overviews, ChatGPT, and Perplexity — cite your business when users ask questions in your industry.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6">
              It encompasses two complementary disciplines: <strong className="text-primary">GEO (Generative Engine Optimization)</strong>, which focuses on getting AI language models to reference your brand in their generated responses, and <strong className="text-primary">AEO (Answer Engine Optimization)</strong>, which structures your content so it can be cleanly extracted and surfaced as a direct answer — in AI Overviews, featured snippets, voice responses, and chatbot replies.
            </p>
            <p className="text-text-secondary leading-relaxed">
              As search behaviour shifts from clicking links to receiving synthesised answers, businesses that invest in GEO and AEO now will hold a compounding advantage: their brand becomes the trusted source AI models learn to cite, creating a self-reinforcing cycle of visibility and authority.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Traditional SEO Is No Longer Enough ─────────────── */}
      <section className="py-24 bg-bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
                Why Traditional SEO Is No Longer Enough
              </h2>
              <p className="text-text-secondary text-lg">
                The search landscape has shifted. AI answers are replacing blue links for an ever-growing share of queries — and your current SEO strategy was not built for this.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                { stat: '60%', label: 'of Google searches now trigger an AI Overview in the US' },
                { stat: '100M+', label: 'monthly active ChatGPT users conducting research and purchasing decisions' },
                { stat: '40%', label: 'drop in organic click-through for queries answered by AI' },
              ].map(({ stat, label }) => (
                <div key={stat} className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <p className="text-4xl font-display font-bold text-accent mb-2">{stat}</p>
                  <p className="text-text-secondary text-sm">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 bg-primary text-white text-sm font-semibold">
                <div className="p-4">Signal</div>
                <div className="p-4 border-l border-white/20">Traditional SEO</div>
                <div className="p-4 border-l border-white/20 text-accent">AI Search (GEO/AEO)</div>
              </div>
              {comparisonRows.map(({ label, traditional, ai }, i) => (
                <div
                  key={label}
                  className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-bg-secondary'}`}
                >
                  <div className="p-4 font-medium text-primary">{label}</div>
                  <div className="p-4 border-l border-border text-text-secondary">{traditional}</div>
                  <div className="p-4 border-l border-border text-primary font-medium">{ai}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Optimise For ────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
              What We Optimise For
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              AI search is not one platform. We build your presence across every major AI-powered surface where your future customers are asking questions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whatWeOptimizeFor.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="border border-border rounded-xl p-8 hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary mb-3">{title}</h3>
                <p className="text-text-secondary leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Process ─────────────────────────────────────────── */}
      <section className="py-24 bg-bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
              Our AI Search Optimization Process
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              A systematic, four-step approach to building the authority and content signals that get your business cited across every major AI platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {processSteps.map(({ step, title, description }) => (
              <div key={step} className="bg-white rounded-xl p-6 shadow-sm relative">
                <div className="text-5xl font-display font-bold text-primary/10 mb-4 leading-none">
                  {step}
                </div>
                <h3 className="text-lg font-display font-bold text-primary mb-3">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-3 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-text-secondary text-center mb-12">
              Straight answers to the questions we hear most about GEO, AEO, and AI search.
            </p>

            <div className="space-y-6">
              {faqs.map(({ question, answer }) => (
                <div key={question} className="border border-border rounded-xl p-6">
                  <h3 className="text-lg font-display font-semibold text-primary mb-3">
                    {question}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <p className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-6">Free GEO Audit</p>
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            Ready to Get Found in AI Search?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            We will audit your current AI search visibility across ChatGPT, Perplexity, and Google AI Overviews — free of charge. You will receive a clear picture of where you stand and exactly what it will take to get cited.
          </p>
          <PricingCTA
            source="AI Search Optimization — CTA"
            ctaLabel="Get Your Free GEO Audit"
            defaultService="ai-search-optimization"
            buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          />
        </div>
      </section>
    </>
  )
}
