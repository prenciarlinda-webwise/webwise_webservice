import Link from 'next/link'
import { ArrowRight, Home, Briefcase, FolderOpen, DollarSign, Users, Mail, BookOpen, Search, Code, TrendingUp } from 'lucide-react'
import { services, clients, siteConfig } from '@/data/site'
import { blogPosts } from '@/data/blog'

export const metadata = {
  title: 'Sitemap',
  description: 'Browse all pages on WebWise - your complete guide to our website structure.',
}

export default function SitemapPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16">
        <div className="container px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Sitemap
            </h1>
            <p className="text-lg text-white/80">
              Find everything you need on our website. Browse all our pages below.
            </p>
          </div>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-16">
        <div className="container px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Main Pages */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <Home size={20} />
                </div>
                <h2 className="text-xl font-bold text-primary">Main Pages</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <ArrowRight size={14} />
                    Homepage
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <ArrowRight size={14} />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <ArrowRight size={14} />
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <ArrowRight size={14} />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-bold text-primary">Services</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/services" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium">
                    <ArrowRight size={14} />
                    All Services
                  </Link>
                </li>
                {Object.entries(services).map(([slug, service]) => (
                  <li key={slug}>
                    <Link href={`/services/${slug}`} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                      <ArrowRight size={14} />
                      {service.title}
                    </Link>
                    <ul className="ml-6 mt-2 space-y-2">
                      {Object.entries(service.subservices).map(([subslug, sub]) => (
                        <li key={subslug}>
                          <Link href={`/services/${slug}/${subslug}`} className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors">
                            <ArrowRight size={12} />
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portfolio */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <FolderOpen size={20} />
                </div>
                <h2 className="text-xl font-bold text-primary">Portfolio</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/portfolio" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium">
                    <ArrowRight size={14} />
                    All Case Studies
                  </Link>
                </li>
                {Object.values(clients).map((client) => (
                  <li key={client.slug}>
                    <Link href={`/portfolio/${client.slug}`} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                      <ArrowRight size={14} />
                      {client.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blog */}
            <div className="bg-white border border-border rounded-2xl p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-xl font-bold text-primary">Blog</h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3">
                <li>
                  <Link href="/blog" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium">
                    <ArrowRight size={14} />
                    All Articles
                  </Link>
                </li>
                {blogPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                      <ArrowRight size={14} />
                      <span className="truncate">{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <Search size={20} />
                </div>
                <h2 className="text-xl font-bold text-primary">Resources</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="/sitemap.xml" target="_blank" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <ArrowRight size={14} />
                    XML Sitemap
                  </a>
                </li>
                <li>
                  <a href="/robots.txt" target="_blank" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <ArrowRight size={14} />
                    Robots.txt
                  </a>
                </li>
                <li>
                  <Link href="/privacy-policy" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <ArrowRight size={14} />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-agreements" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                    <ArrowRight size={14} />
                    Terms & Agreements
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
            <p className="text-text-secondary mb-6">
              Get in touch with us and we&apos;ll help you find exactly what you need.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
              Contact Us
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}