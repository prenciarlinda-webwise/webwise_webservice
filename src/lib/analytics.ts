// GTM DataLayer Event Tracking Utilities
// Events are pushed to dataLayer for Google Tag Manager to handle.
// Configure corresponding triggers and tags in GTM.

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

function pushEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...data })
  }
}

// Track contact form submission (configure as conversion in GTM)
export const trackContactFormSubmit = (service?: string) => {
  pushEvent('contact_form_submit', {
    event_category: 'Lead Generation',
    event_label: service || 'general',
    value: 1,
  })
}

// Track quote request button clicks
export const trackQuoteRequestClick = (location: string) => {
  pushEvent('quote_request_click', {
    event_category: 'Engagement',
    event_label: location,
  })
}

// Track pricing page views (interest signal)
export const trackPricingPageView = () => {
  pushEvent('pricing_page_view', {
    event_category: 'Interest',
    event_label: 'pricing',
  })
}

// Track portfolio/case study views
export const trackCaseStudyView = (clientName: string) => {
  pushEvent('case_study_view', {
    event_category: 'Engagement',
    event_label: clientName,
  })
}

// Track blog post reads (scroll depth)
export const trackBlogPostRead = (postSlug: string) => {
  pushEvent('blog_post_read', {
    event_category: 'Content',
    event_label: postSlug,
  })
}

// Track external link clicks (portfolio sites)
export const trackExternalLinkClick = (url: string) => {
  pushEvent('external_link_click', {
    event_category: 'Outbound',
    event_label: url,
  })
}

// Track phone number clicks
export const trackPhoneClick = (location: string) => {
  pushEvent('phone_click', {
    event_category: 'Lead Generation',
    event_label: location,
  })
}

// Track WhatsApp button clicks
export const trackWhatsAppClick = (location: string) => {
  pushEvent('whatsapp_click', {
    event_category: 'Lead Generation',
    event_label: location,
  })
}

// Track email link clicks
export const trackEmailClick = (location: string) => {
  pushEvent('email_click', {
    event_category: 'Lead Generation',
    event_label: location,
  })
}
