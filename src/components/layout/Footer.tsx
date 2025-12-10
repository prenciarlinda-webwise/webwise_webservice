import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, ArrowRight, Gift, DollarSign } from 'lucide-react'
import { services, siteConfig, clients } from '@/data/site'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      {/* Referral Program Banner */}
      <div className="bg-gradient-to-r from-accent to-accent-dark">
        <div className="container px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full">
                <Gift size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Earn Cash Referring Clients!</h3>
                <p className="text-white/90">Know a business that needs a website or SEO? Get paid for every successful referral.</p>
              </div>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-accent font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg whitespace-nowrap">
              <DollarSign size={18} />
              Learn More & Refer
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={150}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/70 mb-6">
              {siteConfig.tagline}. We build stunning websites and deliver powerful SEO strategies that drive real results.
            </p>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Mail size={18} />
                {siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Phone size={18} />
                {siteConfig.phone}
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {Object.entries(services).map(([key, service]) => (
                <li key={key}>
                  <Link href={`/services/${key}`} className="text-white/70 hover:text-white transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portfolio */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Portfolio</h4>
            <ul className="space-y-3">
              {Object.entries(clients).filter(([, c]) => c.results).slice(0, 5).map(([key, client]) => (
                <li key={key}>
                  <a href={client.url} target="_blank" rel={client.nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'} className="text-white/70 hover:text-white transition-colors">
                    {client.name}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/portfolio" className="text-accent hover:text-accent-light transition-colors flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-white/70 hover:text-white transition-colors">Case Studies</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              &copy; {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
