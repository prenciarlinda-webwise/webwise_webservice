import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Share2 } from 'lucide-react'
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/data/blog'
import { siteConfig } from '@/data/site'

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
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
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
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
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

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-white truncate max-w-[200px]">{post.title}</span>
          </nav>
          <div className="max-w-4xl">
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
        </div>
      </section>

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

                  if (trimmed.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold text-primary mt-10 mb-4">{trimmed.replace('## ', '')}</h2>
                  }
                  if (trimmed.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold text-primary mt-8 mb-3">{trimmed.replace('### ', '')}</h3>
                  }
                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return <p key={index} className="font-bold text-primary mt-6 mb-2">{trimmed.replace(/\*\*/g, '')}</p>
                  }
                  if (trimmed.startsWith('- ')) {
                    return <li key={index} className="text-text-secondary ml-6 mb-1">{trimmed.replace('- ', '')}</li>
                  }
                  if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ') || trimmed.startsWith('5. ')) {
                    return <li key={index} className="text-text-secondary ml-6 mb-1 list-decimal">{trimmed.replace(/^\d+\. /, '')}</li>
                  }
                  if (trimmed.startsWith('- [ ]')) {
                    return <li key={index} className="text-text-secondary ml-6 mb-1 flex items-center gap-2"><span className="w-4 h-4 border border-border rounded" />{trimmed.replace('- [ ] ', '')}</li>
                  }
                  return <p key={index} className="text-text-secondary mb-4 leading-relaxed">{trimmed}</p>
                })}
              </div>

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
                  <Link href="/contact" className="block w-full py-2 bg-accent text-white text-center font-medium rounded-lg hover:bg-accent-dark transition-colors">
                    Get Free Quote
                  </Link>
                </div>

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
                  <div className="h-40 bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent/20">{relatedPost.category}</span>
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
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
              Get Your Free SEO Audit
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
