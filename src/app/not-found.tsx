import Link from 'next/link'
import { ArrowRight, Home, Search, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center py-24">
      <div className="container px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 flex items-center justify-center bg-accent/10 rounded-full text-accent mx-auto mb-8">
            <FileQuestion size={48} />
          </div>

          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">Page Not Found</h2>
          <p className="text-text-secondary mb-8">
            Sorry, the page you are looking for does not exist or has been moved.
            Let us help you find what you need.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
            >
              <Home size={18} />
              Go to Homepage
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-white transition-colors"
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="bg-bg-secondary rounded-2xl p-8">
            <h3 className="font-semibold text-primary mb-4">Looking for something specific?</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <Link href="/seo-services" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group">
                <Search size={20} className="text-accent" />
                <div>
                  <div className="font-medium text-primary group-hover:text-accent transition-colors">SEO Services</div>
                  <div className="text-sm text-text-muted">Boost your rankings</div>
                </div>
              </Link>
              <Link href="/development" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group">
                <Search size={20} className="text-accent" />
                <div>
                  <div className="font-medium text-primary group-hover:text-accent transition-colors">Web Development</div>
                  <div className="text-sm text-text-muted">Custom websites</div>
                </div>
              </Link>
              <Link href="/case-studies" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group">
                <Search size={20} className="text-accent" />
                <div>
                  <div className="font-medium text-primary group-hover:text-accent transition-colors">Our Work</div>
                  <div className="text-sm text-text-muted">View case studies</div>
                </div>
              </Link>
              <Link href="/blog" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group">
                <Search size={20} className="text-accent" />
                <div>
                  <div className="font-medium text-primary group-hover:text-accent transition-colors">Blog</div>
                  <div className="text-sm text-text-muted">Tips and guides</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}