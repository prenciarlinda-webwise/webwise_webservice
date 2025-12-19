// GA4 Event Tracking Utilities
// See: https://developers.google.com/analytics/devguides/collection/ga4/events

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

// Track contact form submission (configure as conversion in GA4)
export const trackContactFormSubmit = (service?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_form_submit', {
      event_category: 'Lead Generation',
      event_label: service || 'general',
      value: 1,
    })
  }
}

// Track quote request button clicks
export const trackQuoteRequestClick = (location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quote_request_click', {
      event_category: 'Engagement',
      event_label: location,
    })
  }
}

// Track pricing page views (interest signal)
export const trackPricingPageView = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'pricing_page_view', {
      event_category: 'Interest',
      event_label: 'pricing',
    })
  }
}

// Track portfolio/case study views
export const trackCaseStudyView = (clientName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'case_study_view', {
      event_category: 'Engagement',
      event_label: clientName,
    })
  }
}

// Track blog post reads (scroll depth)
export const trackBlogPostRead = (postSlug: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'blog_post_read', {
      event_category: 'Content',
      event_label: postSlug,
    })
  }
}

// Track external link clicks (portfolio sites)
export const trackExternalLinkClick = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'external_link_click', {
      event_category: 'Outbound',
      event_label: url,
    })
  }
}