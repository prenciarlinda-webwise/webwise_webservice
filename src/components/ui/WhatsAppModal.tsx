'use client'

import { useState } from 'react'
import { X, MessageCircle, Send, Loader2 } from 'lucide-react'
import { siteConfig, getWhatsAppUrl } from '@/data/site'

interface WhatsAppModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMessage?: string
}

export default function WhatsAppModal({ isOpen, onClose, defaultMessage = '' }: WhatsAppModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: defaultMessage,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Format the message with form data
    const fullMessage = `Hi, I'm ${formData.name}.

Email: ${formData.email}
Phone: ${formData.phone}

${formData.message}`

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    // Open WhatsApp with the formatted message
    window.open(getWhatsAppUrl(fullMessage), '_blank')

    setIsSubmitting(false)
    onClose()

    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#25D366] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-white" size={24} />
            <div>
              <h3 className="text-white font-semibold">Chat with Us</h3>
              <p className="text-white/80 text-sm">We typically reply within minutes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-text-secondary text-sm mb-4">
            Please fill in your details so we can better assist you.
          </p>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all ${
                errors.name ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all ${
                errors.email ? 'border-red-500' : 'border-border'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all ${
                errors.phone ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Your phone number"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-all resize-none ${
                errors.message ? 'border-red-500' : 'border-border'
              }`}
              placeholder="How can we help you?"
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Opening WhatsApp...
              </>
            ) : (
              <>
                <Send size={20} />
                Start Chat on WhatsApp
              </>
            )}
          </button>

          <p className="text-xs text-text-muted text-center">
            By submitting, you agree to our{' '}
            <a href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  )
}
