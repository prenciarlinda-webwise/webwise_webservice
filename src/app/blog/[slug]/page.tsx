import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Share2, HelpCircle, Award } from 'lucide-react'
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/data/blog'
import { siteConfig, getWhatsAppUrl } from '@/data/site'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords || [post.category, 'SEO', 'local business', 'web design'],
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      section: post.category,
      images: post.image ? [{ url: post.image, alt: post.imageAlt || post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug, 3)

  // Article Schema
  const articleSchema = {
    "@type": "Article",
    "@id": `${siteConfig.url}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.image || undefined,
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.keywords?.join(", ") || post.category,
  }

  // Service Schema for industry-specific SEO posts
  const getServiceType = (keywords: string[] = []) => {
    const keywordStr = keywords.join(' ').toLowerCase()
    if (keywordStr.includes('plumber') || keywordStr.includes('plumbing')) return 'Plumber SEO Services'
    if (keywordStr.includes('hvac') || keywordStr.includes('heating') || keywordStr.includes('cooling')) return 'HVAC SEO Services'
    if (keywordStr.includes('roofing') || keywordStr.includes('roofer')) return 'Roofing SEO Services'
    if (keywordStr.includes('electrician') || keywordStr.includes('electrical')) return 'Electrician SEO Services'
    if (keywordStr.includes('construction') || keywordStr.includes('contractor')) return 'Construction SEO Services'
    if (keywordStr.includes('landscaping') || keywordStr.includes('lawn')) return 'Landscaping SEO Services'
    if (keywordStr.includes('pest control') || keywordStr.includes('exterminator')) return 'Pest Control SEO Services'
    if (keywordStr.includes('cleaning') || keywordStr.includes('maid') || keywordStr.includes('janitorial')) return 'Cleaning Company SEO Services'
    if (keywordStr.includes('moving') || keywordStr.includes('movers')) return 'Moving Company SEO Services'
    if (keywordStr.includes('auto detailing') || keywordStr.includes('car detailing')) return 'Auto Detailing SEO Services'
    if (keywordStr.includes('dumpster') || keywordStr.includes('waste')) return 'Dumpster Rental SEO Services'
    return null
  }

  const serviceType = getServiceType(post.keywords)

  // Service Schema - only for industry-specific SEO posts
  const serviceSchema = serviceType ? {
    "@type": "Service",
    "@id": `${siteConfig.url}/blog/${post.slug}#service`,
    serviceType: serviceType,
    name: serviceType,
    description: post.excerpt,
    provider: {
      "@type": "ProfessionalService",
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.phone,
      email: siteConfig.email,
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Local SEO Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: serviceType,
          },
        },
      ],
    },
  } : null

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${siteConfig.url}/blog/${post.slug}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteConfig.url}/blog/${post.slug}`,
      },
    ],
  }

  // FAQ Schema - only when post has FAQs
  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/blog/${post.slug}#faq`,
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null

  // Combined Schema Graph
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      articleSchema,
      breadcrumbSchema,
      ...(serviceSchema ? [serviceSchema] : []),
      ...(faqSchema ? [faqSchema] : []),
    ],
  }

  return (
    <>
      <Script
        id="schema-graph"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16 lg:py-24">
        <div className="container px-6">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-white truncate max-w-[200px]">{post.title}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent-light rounded-full text-sm font-medium mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-white/80 mb-8">{post.excerpt}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                <span className="flex items-center gap-2"><User size={16} /> {post.author}</span>
                <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock size={16} /> {post.readTime}</span>
              </div>
            </div>
            {post.image && (
              <div className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="w-full h-[350px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Featured Image */}
      {post.image && (
        <div className="lg:hidden -mt-8 px-6 pb-8">
          <div className="container">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={post.image}
                alt={post.imageAlt || post.title}
                className="w-full h-[200px] object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Key Takeaways Box - Immediately after hero for AI extraction */}
      {post.tldr && post.tldr.length > 0 && (
        <section className="py-8 bg-accent/5 border-b border-accent/20">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-accent/30 p-6 lg:p-8 shadow-sm">
                <ul className="space-y-3">
                  {post.tldr.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-text-secondary leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3">
              <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-p:text-text-secondary prose-li:text-text-secondary prose-strong:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
                {post.content.split('\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim()
                  if (!trimmed) return null

                  // Parse inline markdown (bold and links)
                  const parseInlineMarkdown = (text: string) => {
                    const parts: (string | React.ReactElement)[] = []
                    let remaining = text
                    let keyCounter = 0

                    while (remaining) {
                      // Check for markdown link [text](url)
                      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
                      // Check for bold **text**
                      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)

                      if (linkMatch && (!boldMatch || remaining.indexOf(linkMatch[0]) < remaining.indexOf(boldMatch[0]))) {
                        const beforeLink = remaining.substring(0, remaining.indexOf(linkMatch[0]))
                        if (beforeLink) parts.push(beforeLink)
                        parts.push(
                          <a key={`link-${keyCounter++}`} href={linkMatch[2]} className="text-accent hover:underline">
                            {linkMatch[1]}
                          </a>
                        )
                        remaining = remaining.substring(remaining.indexOf(linkMatch[0]) + linkMatch[0].length)
                      } else if (boldMatch) {
                        const beforeBold = remaining.substring(0, remaining.indexOf(boldMatch[0]))
                        if (beforeBold) parts.push(beforeBold)
                        parts.push(<strong key={`bold-${keyCounter++}`} className="font-semibold text-primary">{boldMatch[1]}</strong>)
                        remaining = remaining.substring(remaining.indexOf(boldMatch[0]) + boldMatch[0].length)
                      } else {
                        parts.push(remaining)
                        break
                      }
                    }
                    return parts.length > 0 ? parts : text
                  }

                  if (trimmed.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold text-primary mt-10 mb-4">{parseInlineMarkdown(trimmed.replace('## ', ''))}</h2>
                  }
                  if (trimmed.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold text-primary mt-8 mb-3">{parseInlineMarkdown(trimmed.replace('### ', ''))}</h3>
                  }
                  if (trimmed.startsWith('- ')) {
                    return <li key={index} className="text-text-secondary ml-6 mb-1">{parseInlineMarkdown(trimmed.replace('- ', ''))}</li>
                  }
                  if (/^\d+\.\s/.test(trimmed)) {
                    return <li key={index} className="text-text-secondary ml-6 mb-1 list-decimal">{parseInlineMarkdown(trimmed.replace(/^\d+\.\s/, ''))}</li>
                  }
                  return <p key={index} className="text-text-secondary mb-4 leading-relaxed">{parseInlineMarkdown(trimmed)}</p>
                })}
              </div>

              {/* Related Service CTA - Internal link to parent service */}
              {post.relatedServiceUrl && post.relatedServiceName && (
                <div className="mt-12 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/20">
                  <h3 className="text-lg font-bold text-primary mb-2">Want Professional Help?</h3>
                  <p className="text-text-secondary mb-4">
                    Learn more about our {post.relatedServiceName} services and how we can help your business dominate local search results.
                  </p>
                  <Link
                    href={post.relatedServiceUrl}
                    className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
                  >
                    Explore {post.relatedServiceName} Services
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}

              {/* FAQ Section */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <HelpCircle className="text-primary" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Frequently Asked Questions</h2>
                  </div>
                  <div className="space-y-4">
                    {post.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group bg-bg-secondary rounded-xl border border-border overflow-hidden"
                      >
                        <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-primary hover:bg-bg-tertiary transition-colors">
                          <span>{faq.question}</span>
                          <span className="ml-4 flex-shrink-0 text-accent transition-transform group-open:rotate-180">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </summary>
                        <div className="px-5 pb-5 pt-2 text-text-secondary leading-relaxed">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio */}
              {post.authorBio && (
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex items-start gap-4 p-6 bg-bg-secondary rounded-2xl">
                    <div className="flex-shrink-0 p-3 bg-primary rounded-xl">
                      <Award className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-1">About the Author</h3>
                      <p className="text-lg font-semibold text-primary mb-2">{post.author}</p>
                      <p className="text-text-secondary leading-relaxed">{post.authorBio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted">Share this article:</span>
                    <button className="p-2 bg-bg-secondary rounded-lg hover:bg-accent hover:text-white transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                  <Link href="/blog" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                    <ArrowLeft size={16} /> Back to Blog
                  </Link>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* CTA */}
                <div className="bg-primary rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-2">Need Help With SEO?</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Get a free consultation and see how we can help your local business rank higher.
                  </p>
                  <a href={getWhatsAppUrl("Hi, I need help with SEO for my local business.")} target="_blank" rel="noopener noreferrer" className="block w-full py-2 bg-[#25D366] text-white text-center font-medium rounded-lg hover:bg-[#128C7E] transition-colors">
                    Get Free Quote
                  </a>
                </div>

                {/* Related Service Quick Link */}
                {post.relatedServiceUrl && post.relatedServiceName && (
                  <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
                    <h3 className="font-bold text-primary mb-2">Related Service</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Explore our professional {post.relatedServiceName} services.
                    </p>
                    <Link
                      href={post.relatedServiceUrl}
                      className="block w-full py-2 bg-accent text-white text-center font-medium rounded-lg hover:bg-accent-dark transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                )}

                {/* Categories */}
                <div className="bg-bg-secondary rounded-2xl p-6">
                  <h3 className="font-bold text-primary mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Local SEO', 'SEO', 'SEO Pricing'].map((cat) => (
                      <span key={cat} className="px-3 py-1 bg-white border border-border rounded-full text-sm text-text-secondary hover:border-accent hover:text-accent cursor-pointer transition-colors">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-bg-secondary">
          <div className="container px-6">
            <h2 className="text-2xl font-bold text-primary mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="h-40 bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center overflow-hidden">
                    {relatedPost.image ? (
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.imageAlt || relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-accent/20">{relatedPost.category}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-3">
                      {relatedPost.category}
                    </span>
                    <h3 className="font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">{relatedPost.title}</h3>
                    <p className="text-sm text-text-muted">{relatedPost.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Local Business?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Let our experts help you dominate local search and generate more leads.
            </p>
            <a href={getWhatsAppUrl("Hi, I'd like to get a free SEO audit for my local business.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors">
              Get Your Free SEO Audit
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
