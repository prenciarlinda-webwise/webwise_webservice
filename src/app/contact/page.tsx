import { Phone, MapPin, Clock } from 'lucide-react'
import { siteConfig } from '@/data/site'
import { contactFaqs } from '@/data/faqs'
import LeadForm from '@/components/forms/LeadForm'

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Contact Web Wise</h1>
            <p className="text-lg text-white/80">
              Get a free SEO audit and website quote. Tell us about your project and we will show you how to grow.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24">
        <div className="container px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-border rounded-2xl p-8">
                <LeadForm
                  source="Contact page"
                  heading="Get A Free Quote"
                  subheading="Fill out the form and we'll reply within 24 hours. Pick a service to see the questions that help us prep a useful first call."
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-bg-secondary rounded-2xl p-8">
                <h3 className="text-lg font-bold text-primary mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="flex items-start gap-4 text-text-secondary hover:text-accent transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-text-muted mb-1">Phone</div>
                      <div className="font-medium">{siteConfig.phone}</div>
                    </div>
                  </a>
                  <div className="flex items-start gap-4 text-text-secondary">
                    <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-text-muted mb-1">Location</div>
                      <div className="font-medium">Remote / Worldwide</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-text-secondary">
                    <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-text-muted mb-1">Response Time</div>
                      <div className="font-medium">Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="block text-xs font-bold text-accent uppercase tracking-widest mb-4">FAQ</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Common questions about contacting us and what to expect.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {contactFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-primary mb-2">{faq.question}</h3>
                <p className="text-text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
