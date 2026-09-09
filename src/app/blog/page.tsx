import Link from 'next/link'
import Script from 'next/script'
import { blogPosts, getFeaturedPost, getOtherPosts, getBlogPostUrl } from '@/data/blog'
import { siteConfig } from '@/data/site'
import { generateCollectionPageSchema } from '@/lib/schemas'
import { pageSEO } from '@/data/seo'
import HeroBackground from '@/components/ui/HeroBackground'

export const metadata = {
  title: pageSEO.blog.title,
  description: pageSEO.blog.description,
  keywords: pageSEO.blog.keywords,
  openGraph: {
    title: pageSEO.blog.title,
    description: pageSEO.blog.description,
  },
}

const pageSchema = generateCollectionPageSchema({
  name: pageSEO.blog.title,
  description: pageSEO.blog.description,
  url: `${siteConfig.url}/blog`,
})

export default function BlogPage() {
  const featuredPost = getFeaturedPost()
  const otherPosts = getOtherPosts()

  return (
    <>
      <Script
        id="blog-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <HeroBackground />
        <div className="container px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              SEO &amp; Web Development Blog
            </h1>
            <p className="text-lg text-white/80">
              Actionable SEO tips, web development guides, and digital marketing strategies for local service businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container px-6">
          <Link href={getBlogPostUrl(featuredPost.slug)} className="wise-card group block p-8 lg:p-12">
            <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full mb-4">
              Featured
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">{featuredPost.title}</h2>
            <p className="text-text-secondary mb-6 max-w-2xl">{featuredPost.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-text-muted mb-6">
              <span className="text-accent font-medium">{featuredPost.category}</span>
              <span>·</span>
              <span>{featuredPost.author}</span>
              <span>·</span>
              <span>{featuredPost.date}</span>
              <span>·</span>
              <span>{featuredPost.readTime}</span>
            </div>
            <span className="inline-flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
              Read Article →
            </span>
          </Link>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-bg-secondary">
        <div className="container px-6">
          <h2 className="text-2xl font-bold text-primary mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link key={post.slug} href={getBlogPostUrl(post.slug)} className="wise-card group block p-6">
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">{post.title}</h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Get the latest SEO tips, web development insights, and marketing strategies delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
