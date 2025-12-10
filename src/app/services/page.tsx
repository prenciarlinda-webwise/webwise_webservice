import Link from 'next/link'
import { ArrowRight, Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart } from 'lucide-react'
import { services } from '@/data/site'

const iconMap: { [key: string]: React.ElementType } = {
  Search, Code, TrendingUp, MapPin, Globe, ShoppingCart, PenTool, Layers, FileText, Target, Share2, BarChart
}

function getIcon(iconName: string, size = 20) {
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent size={size} /> : null
}

export const metadata = {
  title: 'Our Services',
  description: 'Comprehensive digital services including SEO, web development, and digital marketing.',
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm mb-4">Our Services</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Comprehensive Digital <span className="text-gradient">Solutions</span>
            </h1>
            <p className="text-lg text-white/80">
              From stunning websites to dominating search results, we provide end-to-end digital services tailored to your business objectives.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container px-6">
          <div className="space-y-24">
            {Object.entries(services).map(([key, service], i) => (
              <div key={key} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="text-6xl font-bold text-bg-tertiary mb-4">0{i + 1}</div>
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light rounded-2xl text-white mb-6">
                    {getIcon(service.icon, 32)}
                  </div>
                  <h2 className="text-3xl font-bold text-primary mb-4">{service.title}</h2>
                  <p className="text-text-secondary mb-6">{service.description}</p>
                  <Link href={`/services/${key}`} className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
                    Explore {service.title}
                    <ArrowRight size={18} />
                  </Link>
                </div>
                <div className={`grid grid-cols-2 gap-4 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {Object.entries(service.subservices).map(([subKey, sub]) => (
                    <Link
                      key={subKey}
                      href={`/services/${key}/${subKey}`}
                      className="bg-white border border-border rounded-xl p-6 hover:shadow-lg hover:border-accent/30 transition-all group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-bg-secondary rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors mb-4">
                        {getIcon(sub.icon, 20)}
                      </div>
                      <h3 className="font-semibold text-primary mb-2">{sub.title}</h3>
                      <p className="text-sm text-text-muted line-clamp-2">{sub.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">Ready to Get Started?</h2>
            <p className="text-text-secondary mb-8">
              Let&apos;s discuss how our services can help grow your business.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
              Get Your Free Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
