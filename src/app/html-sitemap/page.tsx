import Link from 'next/link'
import { ArrowRight, Home, Briefcase, FolderOpen, DollarSign, Users, Mail, BookOpen, Search, Code, TrendingUp } from 'lucide-react'
import { services, clients, siteConfig } from '@/data/site'
import { blogPosts } from '@/data/blog'

export const metadata = {
  title: 'Sitemap',
  description: 'Browse all pages on WebWise - your complete guide to our website structure.',
}

// URL mappings for new flat URL structure
const serviceUrlMap: Record<string, string> = {
  'seo': '/seo-services',
  'web-development': '/development',
  'digital-marketing': '/digital-marketing',
}

const subserviceUrlMap: Record<string, Record<string, string>> = {
  'seo': {
    'local-seo': '/local-seo',
    'technical-seo': '/technical-seo',
    'ecommerce-seo': '/ecommerce-seo',
    'international-seo': '/international-seo',
  },
  'web-development': {
    'website-design': '/development',
    'web-applications': '/development/applications',
    'ecommerce-development': '/development/ecommerce',
  },
  'digital-marketing': {
    'content-marketing': '/digital-marketing/content',
    'ppc-advertising': '/digital-marketing/ppc',
    'social-media': '/digital-marketing/social-management',
    'analytics': '/digital-marketing/analytics',
  },
}

const caseStudyUrlMap: Record<string, string> = {
  'illyrian-group-plumbing-seo-web-development': '/case-studies/illyrian-group',
  'gimos-roofing-local-seo-website-design': '/case-studies/gimos-roofing',
  'albros-premium-detailing-seo-website-design': '/case-studies/albros-detailing',
  'northstar-home-improvement-seo-website-development': '/case-studies/northstar',
  '904-dumpster-rental-jacksonville-seo-website': '/case-studies/904-dumpster',
  'gjej-pro-marketplace-web-application-seo': '/case-studies/gjej-pro',
  'paint-techs-painting-contractor-seo-website-redesign': '/case-studies/paint-techs',
  'sunrise-auto-rent-car-rental-website-design': '/case-studies/sunrise-auto',
  'kn-flooring-contractor-website-design': '/case-studies/kn-flooring',
  'kryemadhi-car-rental-albania-website-design': '/case-studies/kryemadhi',
  'gnt-home-remodeling-contractor-website-design': '/case-studies/gnt-remodeling',
  'eli-taxi-durres-albania-website-design': '/case-studies/eli-taxi',
  'msc-certification-web-application-development': '/case-studies/msc-certification',
  'aaa-remodels-jacksonville-home-remodeling-seo-website': '/case-studies/aaa-remodels',
}

// Blog posts that became industry pages (link to new URLs)
const blogToIndustryMap: Record<string, string> = {
  'local-seo-for-plumbers-complete-guide': '/local-seo/plumbers',
  'hvac-seo-complete-guide': '/local-seo/hvac',
  'roofing-company-seo-strategy': '/local-seo/roofing',
  'electrician-seo-guide': '/local-seo/electricians',
  'auto-detailing-seo-get-more-customers': '/local-seo/auto-detailing',
  'dumpster-rental-seo-dominate-local-search': '/local-seo/dumpster-rental',
  'landscaping-seo-grow-your-business': '/local-seo/landscaping',
  'pest-control-seo-strategy': '/local-seo/pest-control',
  'cleaning-company-seo-guide': '/local-seo/cleaning',
  'moving-company-seo-guide': '/local-seo/moving',
  'construction-company-seo-strategy': '/local-seo/construction',
}

// Blog URL shortening
const blogUrlMap: Record<string, string> = {
  'how-much-does-seo-cost-for-small-business': '/blog/seo-pricing',
  'how-long-does-seo-take-to-work': '/blog/seo-timeline',
  'google-business-profile-optimization-guide': '/blog/gbp-optimization',
  'local-seo-uk-vs-usa-differences': '/blog/local-seo-uk-vs-usa',
}

export default function SitemapPage() {
  // Separate blog posts: industry pages vs regular blog
  const industryPosts = blogPosts.filter(post => blogToIndustryMap[post.slug])
  const regularBlogPosts = blogPosts.filter(post => !blogToIndustryMap[post.slug])

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
                  <Link href="/seo-services" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium">
                    <ArrowRight size={14} />
                    All Services
                  </Link>
                </li>
                {Object.entries(services).map(([slug, service]) => (
                  <li key={slug}>
                    <Link href={serviceUrlMap[slug] || `/services/${slug}`} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                      <ArrowRight size={14} />
                      {service.title}
                    </Link>
                    <ul className="ml-6 mt-2 space-y-2">
                      {Object.entries(service.subservices).map(([subslug, sub]) => (
                        <li key={subslug}>
                          <Link href={subserviceUrlMap[slug]?.[subslug] || `/services/${slug}/${subslug}`} className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors">
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

            {/* Industry Pages (Local SEO) */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-xl font-bold text-primary">Local SEO by Industry</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/local-seo" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium">
                    <ArrowRight size={14} />
                    Local SEO Services
                  </Link>
                </li>
                {industryPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={blogToIndustryMap[post.slug]} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                      <ArrowRight size={14} />
                      {post.title.replace(' Complete Guide', '').replace(' Strategy', '')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Case Studies */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent">
                  <FolderOpen size={20} />
                </div>
                <h2 className="text-xl font-bold text-primary">Case Studies</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/case-studies" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium">
                    <ArrowRight size={14} />
                    All Case Studies
                  </Link>
                </li>
                {Object.values(clients).map((client) => (
                  <li key={client.slug}>
                    <Link href={caseStudyUrlMap[client.slug] || `/case-studies/${client.slug}`} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
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
                {regularBlogPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={blogUrlMap[post.slug] || `/blog/${post.slug}`} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
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
