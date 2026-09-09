import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { clients, siteConfig, type KeywordRanking } from '@/data/site'
import { generateBreadcrumbSchema } from '@/lib/schemas'
import WebsitePreview from '@/components/ui/WebsitePreview'
import PricingCTA from '@/components/forms/PricingCTA'
import { DoodleUnderline } from '@/components/ui/Doodle'

// URL mappings for case studies (old slug -> new short URL)
const caseStudyUrlMap: Record<string, string> = {
  'illyrian-group-plumbing-seo-web-development': '/case-studies/illyrian-group',
  'gimos-roofing-local-seo-website-design': '/case-studies/gimos-roofing',
  'albros-premium-detailing-seo-website-design': '/case-studies/albros-detailing',
  'northstar-home-improvement-seo-website-development': '/case-studies/northstar',
  '904-dumpster-rental-jacksonville-seo-website': '/case-studies/904-dumpster',
  'paint-techs-painting-contractor-seo-website-redesign': '/case-studies/paint-techs',
  'kn-flooring-contractor-website-design': '/case-studies/kn-flooring',
  'gnt-home-remodeling-contractor-website-design': '/case-studies/gnt-remodeling',
  'aaa-remodels-jacksonville-home-remodeling-seo-website': '/case-studies/aaa-remodels',
}

function getCanonicalUrl(slug: string): string {
  return caseStudyUrlMap[slug] ? `${siteConfig.url}${caseStudyUrlMap[slug]}` : `${siteConfig.url}/case-studies/${slug}`
}

function firstSentence(text: string): string {
  const idx = text.indexOf('. ')
  return idx > 0 ? text.slice(0, idx + 1) : text
}

type Section = { title?: string; body: string }

function parseSections(text: string): Section[] {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return blocks.map((block) => {
    let m = block.match(/^\*\*(.+?):\*\*\s+([\s\S]+)$/)
    if (m) return { title: m[1].trim(), body: m[2].trim() }
    m = block.match(/^(Phase\s+\d+\s*[-–—]\s*[^:]+):\s*([\s\S]+)$/)
    if (m) return { title: m[1].trim(), body: m[2].trim() }
    return { body: block }
  })
}

function SectionList({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-5">
      {sections.map((s, i) =>
        s.title ? (
          <div key={i}>
            <h4 className="font-semibold text-primary mb-1.5">{s.title}</h4>
            <p className="text-text-secondary leading-relaxed">{s.body}</p>
          </div>
        ) : (
          <p key={i} className="text-text-secondary leading-relaxed">
            {s.body}
          </p>
        ),
      )}
    </div>
  )
}

// The strongest position a keyword holds across organic, local pack, and maps
function bestPosition(rank: KeywordRanking): number {
  const p = Math.min(
    ...[rank.serp, rank.localPack, rank.mapsPack].filter((v): v is number => v !== undefined),
  )
  return Number.isFinite(p) ? p : Infinity
}

export async function generateStaticParams() {
  return Object.values(clients).map((client) => ({ slug: client.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const client = Object.values(clients).find((c) => c.slug === slug)
  if (!client) return { title: 'Case Study Not Found' }

  const title = `${client.name} Case Study`
  const description = client.results
    ? `See how we helped ${client.name} achieve ${client.results.trafficIncrease} traffic increase.`
    : `See how we helped ${client.name} with their ${client.services.join(', ').toLowerCase()}.`

  // Generate unique keywords based on client industry and services
  const keywords = [
    `${client.industry.toLowerCase()} seo case study`,
    `${client.industry.toLowerCase()} website design`,
    ...client.services.map(s => `${s.toLowerCase()} results`),
    'seo success story',
    'web design portfolio',
  ]

  const canonicalUrl = getCanonicalUrl(slug)

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const client = Object.values(clients).find((c) => c.slug === slug)

  if (!client) {
    notFound()
  }

  const otherClients = Object.values(clients).filter((c) => c.slug !== slug && c.results).slice(0, 3)
  // Only the genuine number 1 rankings, a weaker position like #36 doesn't belong on the highlight reel
  const topRankings = (client.keywordRankings ?? []).filter((r) => bestPosition(r) === 1)

  const pageUrl = getCanonicalUrl(slug)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Case Studies', url: `${siteConfig.url}/case-studies` },
    { name: client.name, url: pageUrl },
  ])
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}/#casestudy`,
    headline: `${client.name} Case Study`,
    description: client.results
      ? `See how we helped ${client.name} achieve ${client.results.trafficIncrease} traffic increase.`
      : `See how we helped ${client.name} with their ${client.services.join(', ').toLowerCase()}.`,
    url: pageUrl,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
  }

  return (
    <>
      <Script
        id="casestudy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero, light, centered, ambient light wash, matches the local-seo hero */}
      <section className="relative bg-white ambient-light overflow-hidden py-24 lg:py-28">
        <div className="container px-6 relative">
          <nav className="flex items-center justify-center gap-2 text-text-muted text-sm mb-8">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-accent">Case Studies</Link>
            <span>/</span>
            <span className="text-text-secondary">{client.name}</span>
          </nav>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary leading-[1.05] mb-6 text-balance">
              <span className="relative inline-block">
                {client.name}
                <DoodleUnderline className="absolute left-0 -bottom-1 w-full h-3 text-accent" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              {firstSentence(client.description)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a
                href={client.url}
                target="_blank"
                rel={client.nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'}
                className="inline-flex items-center gap-2 px-7 py-4 border-2 border-border text-primary font-semibold rounded-lg hover:border-accent hover:text-accent transition-colors"
              >
                Visit Website →
              </a>
              <PricingCTA
                source={`${client.name} case study hero`}
                ctaLabel="Get My Free Audit"
                buttonClassName="inline-flex items-center gap-2 px-7 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1.5 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary">
                {client.industry}
              </span>
              {client.services.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary">
                  {s}
                </span>
              ))}
              {client.results && (
                <span className="px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                  {client.results.trafficIncrease} traffic for this client
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Strip */}
      {client.results && (
        <section className="py-10 border-b border-border">
          <div className="container px-6">
            <div className="flex flex-wrap justify-center divide-x divide-border max-w-3xl mx-auto">
              <div className="px-6 sm:px-10 py-2 text-center">
                <div className="text-2xl font-bold text-primary">{client.results.trafficIncrease}</div>
                <div className="text-sm text-text-muted">Traffic Increase</div>
              </div>
              <div className="px-6 sm:px-10 py-2 text-center">
                <div className="text-2xl font-bold text-primary">{client.results.leadsIncrease}</div>
                <div className="text-sm text-text-muted">Lead Growth</div>
              </div>
              <div className="px-6 sm:px-10 py-2 text-center">
                <div className="text-2xl font-bold text-primary">{client.results.rankingKeywords}</div>
                <div className="text-sm text-text-muted">Keywords Ranked</div>
              </div>
              {client.results.aiVisibility && (
                <div className="px-6 sm:px-10 py-2 text-center">
                  <div className="text-2xl font-bold text-primary">{client.results.aiVisibility.headline}</div>
                  <div className="text-sm text-text-muted">{client.results.aiVisibility.label}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Challenge & Solution */}
      {client.challenge && client.solution && (
        <section className="py-24">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl font-bold text-primary">The Challenge</h2>
            </div>
            <div className="max-w-3xl mx-auto mb-20">
              <SectionList sections={parseSections(client.challenge)} />
            </div>

            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl font-bold text-primary">Our Solution</h2>
            </div>
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-x-10 gap-y-8">
              {parseSections(client.solution).map((s, i) => (
                <div key={i}>
                  {s.title && <h3 className="font-semibold text-primary mb-1.5">{s.title}</h3>}
                  <p className="text-text-secondary leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The Website */}
      {client.lighthouse && (
        <section className="py-24">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                {client.techStack ? `Built on ${client.techStack} and Tuned for Real Performance` : 'Built and Tuned for Real Performance'}
              </h2>
              <p className="text-text-secondary">
                We didn&apos;t just redesign {client.name}&apos;s website. We rebuilt it from the ground up
                {client.techStack ? ` on ${client.techStack}, one of the fastest frameworks in web development` : ''}, and
                the results hold up under Google&apos;s own testing tools, not just our word for it.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <p className="text-text-secondary leading-relaxed">
                  <span className="font-semibold text-primary">{client.lighthouse.performance} desktop performance score.</span>{' '}
                  Verified independently by Google PageSpeed Insights.
                </p>
              </div>
              <div>
                <p className="text-text-secondary leading-relaxed">
                  <span className="font-semibold text-primary">{client.lighthouse.seo} SEO score.</span>{' '}
                  A perfect score, with every technical SEO signal Google checks in place.
                </p>
              </div>
              <div>
                <p className="text-text-secondary leading-relaxed">
                  <span className="font-semibold text-primary">{client.lighthouse.bestPractices} best practices score.</span>{' '}
                  Also perfect, covering security, modern code standards, and browser compatibility.
                </p>
              </div>
              <div>
                <p className="text-text-secondary leading-relaxed">
                  <span className="font-semibold text-primary">{client.lighthouse.accessibility} accessibility score.</span>{' '}
                  Built to work well for every visitor, screen reader users included.
                </p>
              </div>
              {client.lighthouse.agenticBrowsing && (
                <div>
                  <p className="text-text-secondary leading-relaxed">
                    <span className="font-semibold text-primary">{client.lighthouse.agenticBrowsing} on Google&apos;s agentic browsing audit.</span>{' '}
                    A new, still-evolving Lighthouse category that measures how well AI agents like ChatGPT and Gemini can actually browse and use the site.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Full-Service Setup */}
      {client.deliverables && client.deliverables.length > 0 && (
        <section className="py-24 bg-bg-secondary">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">A Complete Local Presence, Not Just a Website</h2>
              <p className="text-text-secondary">
                Most agencies build a website and stop there. For {client.name}, we set up and manage the full stack
                that actually drives local visibility.
              </p>
            </div>
            <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {client.deliverables.map((item, i) => (
                <p key={i} className="text-text-secondary leading-relaxed">
                  <span className="font-semibold text-primary">{item.label}.</span> {item.description}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Rankings */}
      {topRankings.length > 0 && (
        <section className="py-24">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-4">Ranking Number 1 in Google</h2>
            </div>
            <ul className="max-w-2xl mx-auto space-y-4 text-center">
              {topRankings.map((rank, i) => {
                const position = bestPosition(rank)
                const positionLabel = rank.mapsPack !== undefined && rank.mapsPack === position
                  ? 'the number 1 spot in Google Maps'
                  : rank.localPack !== undefined && rank.localPack === position
                  ? 'the number 1 spot in the local map pack'
                  : 'the actual number 1 spot in Google'
                return (
                  <li key={i} className="text-text-secondary leading-relaxed">
                    <span className="font-semibold text-primary">&quot;{rank.keyword}&quot;</span> holds {positionLabel}
                    {rank.aiOverview ? ', and is cited directly in Google AI Overview' : ''}.
                    {rank.note && ` ${rank.note}`}
                  </li>
                )
              })}
            </ul>

            {/* Optional ranking screenshots */}
            {client.rankingScreenshots && client.rankingScreenshots.length > 0 && (
              <div id="ranking-screenshots" className="max-w-5xl mx-auto mt-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-primary text-center mb-8">Ranking Screenshots</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {client.rankingScreenshots.map((shot, i) => (
                    <figure key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
                      <div className="relative w-full aspect-[16/10] bg-bg-tertiary">
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          fill
                          className="object-contain"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      </div>
                      {shot.caption && (
                        <figcaption className="p-4 text-sm text-text-secondary border-t border-border">
                          {shot.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* AI Overview Coverage */}
      {client.aiOverviewCoverage && client.aiOverviewCoverage.length > 0 && (
        <section className="py-24 bg-bg-secondary">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-4">Cited Across Google&apos;s AI Overview</h2>
              <p className="text-text-secondary">
                That AI Overview presence reaches well beyond one keyword, the kind of citation that used to only
                go to national brands with decades of content behind them.
              </p>
            </div>
            <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {client.aiOverviewCoverage.map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-primary mb-1.5">{item.topic}</h3>
                  <p className="text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Website Preview */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">See the Website in Action</h2>
            <p className="text-text-secondary">
              {client.embeddable
                ? `This is the real ${client.name} website, loaded live below. Toggle between desktop and mobile to see how it adapts.`
                : `${client.name}'s website blocks being loaded inside a frame from other pages. Visit it directly to see it live.`}
            </p>
          </div>
          <WebsitePreview url={client.url} name={client.name} embeddable={client.embeddable} nofollow={client.nofollow} />
        </div>
      </section>

      {/* Timeline */}
      {client.timelineSteps && client.timelineSteps.length > 0 && (
        <section className="py-24">
          <div className="container px-6">
            <div className="text-center mb-16">
              <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">The Journey</span>
              <h2 className="text-3xl font-bold text-primary">Results Timeline</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {client.timelineSteps.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-accent text-white font-bold rounded-full mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-primary mb-2">{item.title}</h4>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {client.testimonial && (
        <section className="py-24 bg-bg-secondary">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white rounded-2xl p-12 shadow-lg">
                <span className="wise-numeral text-6xl leading-none block mb-2" aria-hidden="true">&ldquo;</span>
                <blockquote className="text-xl text-text-secondary mb-8 leading-relaxed">
                  &quot;{client.testimonial.quote}&quot;
                </blockquote>
                <div>
                  <h4 className="font-semibold text-primary">{client.testimonial.author}</h4>
                  <p className="text-text-muted">{client.testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Projects */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">More Work</span>
            <h2 className="text-3xl font-bold text-primary">Other Projects</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {otherClients.map((other) => (
              <Link key={other.slug} href={caseStudyUrlMap[other.slug] || `/case-studies/${other.slug}`} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="h-40 bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center">
                  <span className="text-4xl font-bold text-accent/20">
                    {other.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs text-accent">{other.industry}</span>
                  <h3 className="font-bold text-primary mt-1 mb-2">{other.name}</h3>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-bold text-accent">{other.results!.trafficIncrease}</span>
                      <span className="text-text-muted ml-1">Traffic</span>
                    </div>
                    <div>
                      <span className="font-bold text-accent">{other.results!.leadsIncrease}</span>
                      <span className="text-text-muted ml-1">Leads</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/case-studies" className="inline-flex items-center gap-2 px-6 py-3 bg-bg-secondary text-primary font-medium rounded-lg hover:bg-bg-tertiary transition-colors">
              View All Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Want Results Like {client.name}?</h2>
            <p className="text-white/80 mb-8">
              Let&apos;s discuss how we can help transform your business.
            </p>
            <PricingCTA
              source={`Portfolio ${slug} — Start your project CTA`}
              ctaLabel="Start Your Project"
              buttonClassName="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
            />
          </div>
        </div>
      </section>
    </>
  )
}
