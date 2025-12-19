'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ArrowRight, Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart } from 'lucide-react'
import { services, siteConfig, navigation } from '@/data/site'

const iconMap: { [key: string]: React.ElementType } = {
  Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeService, setActiveService] = useState<string | null>('seo')
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getIcon = (iconName: string, size = 20) => {
    const IconComponent = iconMap[iconName]
    return IconComponent ? <IconComponent size={size} /> : null
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="container px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={150}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-text-primary hover:text-accent transition-colors">
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <Link href="/services" className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text-primary hover:text-accent transition-colors">
                  Services
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </Link>

                {/* Mega Menu */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="w-[800px] bg-white border border-border rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex min-h-[400px]">
                      {/* Sidebar */}
                      <div className="w-60 bg-bg-secondary border-r border-border p-4 flex flex-col">
                        {Object.entries(services).map(([key, service]) => (
                          <div
                            key={key}
                            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                              activeService === key ? 'bg-white shadow-sm border-l-3 border-accent' : 'hover:bg-white'
                            }`}
                            onMouseEnter={() => setActiveService(key)}
                          >
                            <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light rounded-md text-white">
                              {getIcon(service.icon)}
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm font-semibold text-text-primary">{service.title}</span>
                              <ChevronDown size={14} className="-rotate-90 text-text-muted" />
                            </div>
                          </div>
                        ))}
                        <div className="mt-auto pt-4 border-t border-border">
                          <Link href="/services" className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors">
                            View All Services
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>

                      {/* Content Panels */}
                      <div className="flex-1 p-6">
                        {Object.entries(services).map(([key, service]) => (
                          <div key={key} className={activeService === key ? 'block' : 'hidden'}>
                            <div className="mb-5 pb-4 border-b border-border">
                              <div className="text-lg font-bold text-text-primary">{service.title}</div>
                              <p className="text-sm text-text-secondary mt-1">{service.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {Object.entries(service.subservices).map(([subKey, sub]) => (
                                <Link
                                  key={subKey}
                                  href={`/services/${key}/${subKey}`}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-secondary transition-colors group/item"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center bg-bg-tertiary rounded-md text-accent group-hover/item:bg-accent group-hover/item:text-white transition-colors">
                                    {getIcon(sub.icon, 16)}
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold text-text-primary block">{sub.title}</span>
                                    <span className="text-xs text-text-muted line-clamp-2">{sub.description}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <Link href={`/services/${key}`} className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-accent hover:gap-3 transition-all">
                              Explore {service.title}
                              <ArrowRight size={16} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/portfolio" className="px-4 py-2 text-sm font-medium text-text-primary hover:text-accent transition-colors">
                Portfolio
              </Link>
              <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-text-primary hover:text-accent transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="px-4 py-2 text-sm font-medium text-text-primary hover:text-accent transition-colors">
                About
              </Link>
              <Link href="/blog" className="px-4 py-2 text-sm font-medium text-text-primary hover:text-accent transition-colors">
                Blog
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link href="/contact" className="audit-btn inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors shadow-md hover:shadow-lg animate-pulse hover:animate-none">
                Free Website Audit
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-text-primary"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-xl transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={120}
                height={32}
                className="h-8 w-auto"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-text-primary hover:bg-bg-secondary rounded-lg"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <Link href="/" className="block py-4 text-lg font-medium text-text-primary border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>

              {Object.entries(services).map(([key, service]) => (
                <div key={key} className="border-b border-border">
                  <button
                    onClick={() => setOpenMobileSubmenu(openMobileSubmenu === key ? null : key)}
                    className="flex items-center justify-between w-full py-4 text-lg font-medium text-text-primary"
                  >
                    {service.title}
                    <ChevronDown size={20} className={`transition-transform ${openMobileSubmenu === key ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openMobileSubmenu === key ? 'max-h-96' : 'max-h-0'}`}>
                    <Link
                      href={`/services/${key}`}
                      className="flex items-center gap-3 py-3 px-4 text-accent font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {getIcon(service.icon, 18)}
                      All {service.title}
                    </Link>
                    {Object.entries(service.subservices).map(([subKey, sub]) => (
                      <Link
                        key={subKey}
                        href={`/services/${key}/${subKey}`}
                        className="flex items-center gap-3 py-3 px-4 text-text-secondary hover:text-text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {getIcon(sub.icon, 18)}
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <Link href="/portfolio" className="block py-4 text-lg font-medium text-text-primary border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                Portfolio
              </Link>
              <Link href="/pricing" className="block py-4 text-lg font-medium text-text-primary border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="/about" className="block py-4 text-lg font-medium text-text-primary border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/blog" className="block py-4 text-lg font-medium text-text-primary border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
                Blog
              </Link>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-border">
              <Link href="/contact" className="audit-btn block w-full py-4 text-center bg-accent text-white font-semibold rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                Free Website Audit
              </Link>
              <div className="flex flex-col gap-2 mt-4 text-center">
                <a href={`mailto:${siteConfig.email}`} className="text-sm text-text-secondary">{siteConfig.email}</a>
                <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-text-secondary">{siteConfig.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
