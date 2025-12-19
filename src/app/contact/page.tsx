'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { siteConfig } from '@/data/site'
import { trackContactFormSubmit } from '@/lib/analytics'

export default function ContactPage() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      service: formData.get('service') as string,
      website: formData.get('website') as string,
      message: formData.get('message') as string,
      recaptchaToken: '',
    }

    // Get reCAPTCHA token if available
    if (executeRecaptcha) {
      try {
        data.recaptchaToken = await executeRecaptcha('contact_form')
      } catch {
        console.error('reCAPTCHA error')
      }
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        trackContactFormSubmit(data.service)
        ;(e.target as HTMLFormElement).reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
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
                <h2 className="text-2xl font-bold text-primary mb-6">Get A Free Quote</h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Message sent successfully!</p>
                      <p className="text-sm text-green-700">We&apos;ll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Failed to send message</p>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
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
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-text-primary mb-2">Service Interested In</label>
                      <select
                        id="service"
                        name="service"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors bg-white"
                      >
                        <option value="">Select a service</option>
                        <option value="local-seo">Local SEO</option>
                        <option value="website-design">Website Design</option>
                        <option value="web-development">Web Development</option>
                        <option value="ppc">PPC Advertising</option>
                        <option value="seo-website">SEO + Website Package</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-text-primary mb-2">Website URL (optional)</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
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
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                      placeholder="Tell us about your project and goals..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Get My Free Quote'
                    )}
                  </button>
                  <p className="text-xs text-text-muted text-center">
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a> and{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a> apply.
                  </p>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-bg-secondary rounded-2xl p-8">
                <h3 className="text-lg font-bold text-primary mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-4 text-text-secondary hover:text-accent transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg text-accent flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-text-muted mb-1">Email</div>
                      <div className="font-medium">{siteConfig.email}</div>
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

              <div className="bg-primary rounded-2xl p-8 text-white">
                <h3 className="text-lg font-bold mb-4">Free Consultation</h3>
                <p className="text-white/80 mb-6">
                  Not sure what you need? Schedule a free 30-minute consultation call with our team.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Website audit</li>
                  <li>• SEO analysis</li>
                  <li>• Strategy recommendations</li>
                  <li>• Custom quote</li>
                </ul>
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
            <h2 className="text-3xl font-bold text-primary">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'How long does it take to see SEO results?', a: 'Most clients see significant improvements within 3-6 months. SEO is a long-term investment that continues to compound over time.' },
              { q: 'How much does a website cost?', a: 'Website costs vary based on complexity and features. We offer solutions starting from $2,500 for basic sites to $15,000+ for complex web applications.' },
              { q: 'Do you offer ongoing support?', a: 'Yes! We offer monthly maintenance and support packages to keep your website and SEO performing at their best.' },
              { q: 'What industries do you work with?', a: 'We work with businesses across all industries, with special expertise in home services, professional services, e-commerce, and local businesses.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-primary mb-2">{item.q}</h3>
                <p className="text-text-secondary">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
