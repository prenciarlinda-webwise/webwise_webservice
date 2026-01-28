import { siteConfig } from '@/data/site'

// Base provider info for all schemas
const provider = {
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
}

// Service Schema - for service pages
export function generateServiceSchema(service: {
  name: string
  description: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${service.url}/#service`,
    name: service.name,
    description: service.description,
    url: service.url,
    provider,
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
    ],
  }
}

// FAQ Schema - for pages with FAQs
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// BreadcrumbList Schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// WebPage Schema - generic page schema
export function generateWebPageSchema(page: {
  name: string
  description: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${page.url}/#webpage`,
    name: page.name,
    description: page.description,
    url: page.url,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
    },
  }
}

// ContactPage Schema
export function generateContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteConfig.url}/contact/#contactpage`,
    name: "Contact Us",
    description: "Get in touch with WebWise for web design, SEO, and digital marketing services.",
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      telephone: siteConfig.phone,
      email: siteConfig.email,
    },
  }
}

// AboutPage Schema
export function generateAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteConfig.url}/about/#aboutpage`,
    name: "About WebWise",
    description: "Learn about WebWise - our mission, team, and commitment to delivering exceptional web design and SEO services.",
    url: `${siteConfig.url}/about`,
  }
}

// CollectionPage Schema - for portfolio/blog listing
export function generateCollectionPageSchema(page: {
  name: string
  description: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${page.url}/#collectionpage`,
    name: page.name,
    description: page.description,
    url: page.url,
  }
}

// HowTo Schema - for process/step-by-step content
export function generateHowToSchema(howTo: {
  name: string
  description: string
  steps: { name: string; text: string }[]
  totalTime?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    ...(howTo.totalTime && { totalTime: howTo.totalTime }),
    step: howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}