'use client'

import { useState } from 'react'
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { siteConfig, getWhatsAppUrl } from '@/data/site'
import { contactFaqs } from '@/data/faqs'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    website: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Build WhatsApp message from form data
    const messageParts = [
      `Hi, I'm ${formData.name}.`,
      formData.service && `I'm interested in: ${formData.service}`,
      formData.website && `My website: ${formData.website}`,
      formData.email && `Email: ${formData.email}`,
      formData.phone && `Phone: ${formData.phone}`,
      formData.message && `\nMessage: ${formData.message}`,
    ].filter(Boolean)

    const whatsappMessage = messageParts.join('\n')
    const whatsappUrl = getWhatsAppUrl(whatsappMessage)

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-24 lg:py-32">
        <div className="container px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm mb-4">Contact Us</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Let&apos;s Start a <span className="text-gradient">Conversation</span>
            </h1>
            <p className="text-lg text-white/80">
              Ready to transform your digital presence? Get in touch with our team for a free consultation.
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
                <h2 className="text-2xl font-bold text-primary mb-2">Get A Free Quote</h2>
                <p className="text-text-secondary mb-6">Fill out the form and we&apos;ll continue the conversation on WhatsApp.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-text-primary mb-2">Service Interested In</label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors bg-white"
                      >
                        <option value="">Select a service</option>
                        <option value="Local SEO">Local SEO</option>
                        <option value="Website Design">Website Design</option>
                        <option value="Web Development">Web Development</option>
                        <option value="PPC Advertising">PPC Advertising</option>
                        <option value="SEO + Website Package">SEO + Website Package</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-text-primary mb-2">Website URL (optional)</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                      placeholder="Tell us about your project and goals..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Continue on WhatsApp
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-bg-secondary rounded-2xl p-8">
                <h3 className="text-lg font-bold text-primary mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <a
                    href={getWhatsAppUrl("Hi, I'd like to learn more about your services.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 text-text-secondary hover:text-[#25D366] transition-colors"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-[#25D366]/10 rounded-lg text-[#25D366] flex-shrink-0">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-text-muted mb-1">WhatsApp</div>
                      <div className="font-medium">Chat with us</div>
                    </div>
                  </a>
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

              <div className="bg-[#25D366] rounded-2xl p-8 text-white">
                <h3 className="text-lg font-bold mb-4">Quick Chat</h3>
                <p className="text-white/90 mb-6">
                  Prefer to chat directly? Message us on WhatsApp for a quick response.
                </p>
                <a
                  href={getWhatsAppUrl("Hi, I'd like to get a free consultation for my business.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-white text-[#25D366] text-center font-semibold rounded-lg hover:bg-white/90 transition-colors"
                >
                  Start WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-bg-secondary">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">FAQ</span>
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
