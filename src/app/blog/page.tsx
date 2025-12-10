import Link from 'next/link'
import { ArrowRight, Calendar, User, Clock } from 'lucide-react'
import { blogPosts, getFeaturedPost, getOtherPosts } from '@/data/blog'

export const metadata = {
  title: 'Blog | Local SEO Tips for Plumbers, Roofers, Contractors & More',
  description: 'Expert SEO tips and strategies for local service businesses. Learn how plumbers, roofers, electricians, and contractors can rank higher on Google.',
}

export default function BlogPage() {
  const featuredPost = getFeaturedPost()
  const otherPosts = getOtherPosts()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm mb-4">Blog</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Insights & <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-lg text-white/80">
              Expert tips, strategies, and insights to help your business succeed online.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container px-6">
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="h-64 lg:h-auto bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center">
                <span className="text-6xl font-bold text-accent/20">FEATURED</span>
              </div>
              <div className="p-8 lg:p-12">
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">{featuredPost.title}</h2>
                <p className="text-text-secondary mb-6">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6">
                  <span className="flex items-center gap-1"><User size={14} /> {featuredPost.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {featuredPost.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {featuredPost.readTime}</span>
                </div>
                <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-bg-secondary">
        <div className="container px-6">
          <h2 className="text-2xl font-bold text-primary mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-48 bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center">
                  <span className="text-3xl font-bold text-accent/20">{post.category}</span>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">{post.title}</h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
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
