import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Users, Target, TrendingUp, Shield, Check } from 'lucide-react'
import { siteConfig, techStack, getWhatsAppUrl } from '@/data/site'
import { generateAboutPageSchema, generateFAQSchema } from '@/lib/schemas'
import { aboutFaqs } from '@/data/faqs'
import { aboutContent } from '@/data/staticContent'
import FAQSection from '@/components/sections/FAQSection'
import { pageSEO } from '@/data/seo'

export const metadata = {
  title: pageSEO.about.title,
  description: pageSEO.about.description,
  keywords: pageSEO.about.keywords,
  openGraph: {
    title: pageSEO.about.title,
    description: pageSEO.about.description,
  },
}

const aboutSchema = generateAboutPageSchema()
const faqSchema = generateFAQSchema(aboutFaqs)

const iconMap: { [key: string]: React.ElementType } = {
  Target, TrendingUp, Users, Shield
}

function getIcon(iconName: string, size = 24) {
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent size={size} /> : null
}

export default function AboutPage() {
  const content = aboutContent

  return (
    <>
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm mb-4">About Us</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {content.hero.headline}
            </h1>
            <p className="text-xl text-white/90 mb-4">{content.hero.subheadline}</p>
            <p className="text-lg text-white/80">
              {content.hero.valueProposition}
            </p>
          </div>
        </div>
      </section>

      {/* Who Is WebWise - 40-60 word answer for Featured Snippets */}
      <section className="py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-6">{content.definition.question}</h2>
            {/* Direct answer - optimized for featured snippets */}
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              {content.definition.answer}
            </p>
            {/* Expansion */}
            <p className="text-text-secondary leading-relaxed">
              {content.definition.expansion}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Mission</span>
            <h2 className="text-3xl font-bold text-primary mb-8">Empowering Local Businesses Through Digital Excellence</h2>
            <div className="space-y-6">
              {Array.isArray(content.sections[0].content) && content.sections[0].content.map((paragraph, i) => (
                <p key={i} className="text-text-secondary leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Values</span>
            <h2 className="text-3xl font-bold text-primary">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.sections[1].items?.map((item, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl p-6">
                <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg text-accent mb-4">
                  {item.icon && getIcon(item.icon)}
                </div>
                <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Track Record</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Results That Speak For Themselves</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {content.sections[4].items?.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{stat.title}</div>
                <div className="text-text-secondary text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Expertise</span>
            <h2 className="text-3xl font-bold text-primary mb-4">What Makes Us Different</h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
              Years of specialized experience in local service business marketing
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              {Array.isArray(content.sections[2].content) && content.sections[2].content.map((paragraph, i) => (
                <p key={i} className="text-text-secondary leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {content.sections[2].items?.map((item, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-6">
                  <h4 className="font-semibold text-primary mb-2">{item.title}</h4>
                  <p className="text-sm text-text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Process</span>
            <h2 className="text-3xl font-bold text-primary mb-4">How We Work With Clients</h2>
            <p className="text-text-secondary max-w-3xl mx-auto">
              A proven methodology refined over 50+ successful projects
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {content.sections[3].items?.map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-accent text-white font-bold rounded-lg flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">{step.title}</h3>
                    <p className="text-text-secondary text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Technology</span>
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

      {/* Our Team */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">Our Team</span>
            <h2 className="text-3xl font-bold text-primary mb-8">The People Behind WebWise</h2>
            <div className="space-y-6">
              {Array.isArray(content.sections[5].content) && content.sections[5].content.map((paragraph, i) => (
                <p key={i} className="text-text-secondary leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 p-6 bg-white rounded-xl border border-border">
              <h4 className="font-semibold text-primary mb-4">What You Get When You Work With Us:</h4>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  'Direct access to senior team members',
                  'No handoffs to junior staff',
                  'Strategy calls with decision-makers',
                  'Transparent communication always',
                  'Enterprise expertise at SMB prices',
                  'Long-term partnership focus',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-text-secondary">
                    <Check size={16} className="text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        faqs={aboutFaqs}
        title="About Us FAQ"
        subtitle="Common questions about WebWise and our team."
        background="white"
      />

      {/* CTA */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{content.cta.headline}</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              {content.cta.description}
            </p>
            <a href={getWhatsAppUrl("Hi, I'd like to get a free consultation for my business.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors">
              {content.cta.buttonText}
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
