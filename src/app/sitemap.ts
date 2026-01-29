import { MetadataRoute } from 'next'
import { siteConfig } from '@/data/site'
import { clients } from '@/data/site'
import { blogPosts } from '@/data/blog'

/**
 * Sitemap Priority Tier System (Updated for 2026 URL Structure):
 * Tier 1 (1.0): Homepage, Main SEO page (highest commercial value)
 * Tier 2 (0.9): Main service pages, Blog listing
 * Tier 3 (0.8): Sub-services, Industry pages, Blog posts, Pricing, Contact
 * Tier 4 (0.7): Case studies listing, About
 * Tier 5 (0.6): Individual case studies, Legal pages
 */

// Industry pages that were blog posts, now under /local-seo/[industry]
// NOTE: locksmiths excluded until custom content is created (see TODO.md)
const industryPages = [
  'plumbers',
  'hvac',
  'roofing',
  'electricians',
  'auto-detailing',
  'dumpster-rental',
  'landscaping',
  'pest-control',
  'cleaning',
  'moving',
  'construction',
  // 'locksmiths', // TODO: Add back when content is created
]

// Blog posts that stay in /blog (with new short URLs)
const blogUrlMap: Record<string, string> = {
  'how-much-does-seo-cost-for-small-business': 'seo-pricing',
  'how-long-does-seo-take-to-work': 'seo-timeline',
  'google-business-profile-optimization-guide': 'gbp-optimization',
  'local-seo-uk-vs-usa-differences': 'local-seo-uk-vs-usa',
  'google-maps-ranking-factors': 'google-maps-ranking-factors',
  'google-reviews-guide': 'google-reviews-guide',
  'seo-vs-ppc': 'seo-vs-ppc',
}

// Blog posts that became industry pages (exclude from /blog sitemap)
const industryBlogSlugs = [
  'local-seo-for-plumbers-complete-guide',
  'hvac-seo-complete-guide',
  'roofing-company-seo-strategy',
  'electrician-seo-guide',
  'auto-detailing-seo-get-more-customers',
  'dumpster-rental-seo-dominate-local-search',
  'landscaping-seo-grow-your-business',
  'pest-control-seo-strategy',
  'cleaning-company-seo-guide',
  'moving-company-seo-guide',
  'construction-company-seo-strategy',
]

// Case study URL mapping (old portfolio slugs to new short slugs)
const caseStudyUrlMap: Record<string, string> = {
  'illyrian-group-plumbing-seo-web-development': 'illyrian-group',
  'gimos-roofing-local-seo-website-design': 'gimos-roofing',
  'albros-premium-detailing-seo-website-design': 'albros-detailing',
  'northstar-home-improvement-seo-website-development': 'northstar',
  '904-dumpster-rental-jacksonville-seo-website': '904-dumpster',
  'gjej-pro-marketplace-web-application-seo': 'gjej-pro',
  'paint-techs-painting-contractor-seo-website-redesign': 'paint-techs',
  'sunrise-auto-rent-car-rental-website-design': 'sunrise-auto',
  'kn-flooring-contractor-website-design': 'kn-flooring',
  'kryemadhi-car-rental-albania-website-design': 'kryemadhi',
  'gnt-home-remodeling-contractor-website-design': 'gnt-remodeling',
  'eli-taxi-durres-albania-website-design': 'eli-taxi',
  'msc-certification-web-application-development': 'msc-certification',
  'aaa-remodels-jacksonville-home-remodeling-seo-website': 'aaa-remodels',
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Tier 1: Homepage and primary commercial page
  const tier1Pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/local-seo`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // Tier 2: Main service pages and blog listing
  const tier2Pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/seo-services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/development`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/digital-marketing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Tier 3: Sub-services, industry pages, remaining blog posts
  const subServicePages: MetadataRoute.Sitemap = [
    // SEO sub-services
    { url: `${baseUrl}/technical-seo`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/ecommerce-seo`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/international-seo`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    // Web design sub-services
    { url: `${baseUrl}/development/applications`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/development/ecommerce`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    // Digital marketing sub-services
    { url: `${baseUrl}/digital-marketing/content`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/digital-marketing/ppc`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/digital-marketing/social-management`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/digital-marketing/analytics`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  // Industry pages under /local-seo/[industry]
  const industryPageEntries: MetadataRoute.Sitemap = industryPages.map((industry) => ({
    url: `${baseUrl}/local-seo/${industry}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Blog posts (excluding ones that became industry pages)
  const blogPages: MetadataRoute.Sitemap = blogPosts
    .filter((post) => !industryBlogSlugs.includes(post.slug))
    .map((post) => ({
      url: `${baseUrl}/blog/${blogUrlMap[post.slug] || post.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const tier3StaticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Tier 4: Case studies listing, About page
  const tier4StaticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Tier 5: Individual case studies
  const caseStudyPages: MetadataRoute.Sitemap = Object.values(clients).map((client) => ({
    url: `${baseUrl}/case-studies/${caseStudyUrlMap[client.slug] || client.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Tier 5: Legal pages
  const tier5Pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-agreements`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/html-sitemap`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [
    ...tier1Pages,
    ...tier2Pages,
    ...subServicePages,
    ...industryPageEntries,
    ...blogPages,
    ...tier3StaticPages,
    ...tier4StaticPages,
    ...caseStudyPages,
    ...tier5Pages,
  ]
}
