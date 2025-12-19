import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Users, Target, Award, Zap } from 'lucide-react'
import { siteConfig, techStack } from '@/data/site'
import { generateAboutPageSchema } from '@/lib/schemas'

export const metadata = {
  title: 'About Us',
  description: 'Learn about Web Wise - our mission, values, and the team behind your digital success.',
}

const aboutSchema = generateAboutPageSchema()

export default function AboutPage() {
  return (
    <>
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm mb-4">About Us</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              We&apos;re <span className="text-gradient">{siteConfig.name}</span>
            </h1>
            <p className="text-lg text-white/80">
              A team of passionate digital experts dedicated to helping businesses thrive online through innovative websites and data-driven SEO strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24">
        <div className="container px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Mission</span>
              <h2 className="text-3xl font-bold text-primary mb-6">Empowering Businesses Through Digital Excellence</h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                At {siteConfig.name}, we believe every business deserves a powerful online presence. Our mission is to deliver exceptional digital solutions that drive real, measurable results for our clients.
              </p>
              <p className="text-text-secondary leading-relaxed">
                We combine cutting-edge technology with proven strategies to help businesses of all sizes compete and win in the digital landscape. From local service providers to growing enterprises, we&apos;re committed to your success.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, title: 'Client-Focused', desc: 'Your success is our priority' },
                { icon: Target, title: 'Results-Driven', desc: 'Data-backed strategies that work' },
                { icon: Award, title: 'Excellence', desc: 'Quality in everything we do' },
                { icon: Zap, title: 'Innovation', desc: 'Always ahead of the curve' },
              ].map((item, i) => (
                <div key={i} className="bg-bg-secondary rounded-xl p-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg text-accent mb-4">
                    <item.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50+', label: 'Projects Completed' },
              { value: '10+', label: 'Happy Clients' },
              { value: '340%', label: 'Avg. Traffic Growth' },
              { value: '5+', label: 'Years Experience' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Expertise</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Technologies We Master</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We stay at the forefront of technology to deliver the best solutions for our clients.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(techStack).map(([category, techs]) => (
              <div key={category} className="text-center">
                <h4 className="font-semibold text-primary mb-4 capitalize">{category}</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {techs.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-bg-secondary text-text-secondary rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Why Us</span>
            <h2 className="text-3xl font-bold text-primary">Why Choose {siteConfig.name}?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Proven Track Record',
                desc: 'We\'ve helped dozens of businesses achieve significant growth in traffic, leads, and revenue.',
              },
              {
                title: 'Transparent Communication',
                desc: 'Regular updates, detailed reports, and always available to answer your questions.',
              },
              {
                title: 'Custom Solutions',
                desc: 'No cookie-cutter approaches. Every strategy is tailored to your unique business needs.',
              },
              {
                title: 'Full-Service Agency',
                desc: 'From web design to SEO to digital marketing - we handle everything under one roof.',
              },
              {
                title: 'Long-Term Partnership',
                desc: 'We\'re invested in your success. Most clients stay with us for years.',
              },
              {
                title: 'Competitive Pricing',
                desc: 'Enterprise-quality services at prices that work for growing businesses.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-border">
                <h3 className="text-lg font-semibold text-primary mb-3">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Let&apos;s discuss how we can help your business grow.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors">
              Get in Touch
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
