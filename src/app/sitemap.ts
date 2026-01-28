import { MetadataRoute } from 'next'
import { siteConfig } from '@/data/site'
import { services, clients } from '@/data/site'
import { blogPosts } from '@/data/blog'

/**
 * Sitemap Priority Tier System:
 * Tier 1 (1.0): Homepage, Main SEO page (highest commercial value)
 * Tier 2 (0.9): Main service pages, Blog listing
 * Tier 3 (0.8): Sub-services, Blog posts, Pricing, Contact
 * Tier 4 (0.7): Portfolio listing, Case studies, About
 * Tier 5 (0.6): Privacy, Terms (legal pages)
 */

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
  ]

  // Tier 2: Main service pages and blog listing
  const tier2Pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/seo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/web-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/digital-marketing`,
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

  // Tier 3: Sub-services, blog posts, pricing, contact
  const subServicePages: MetadataRoute.Sitemap = Object.entries(services).flatMap(([slug, service]) => {
    return Object.keys(service.subservices).map((subslug) => ({
      url: `${baseUrl}/services/${slug}/${subslug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  })

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
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

  // Tier 4: Portfolio and case studies, About page
  const tier4StaticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/portfolio`,
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

  const portfolioPages: MetadataRoute.Sitemap = Object.values(clients).map((client) => ({
    url: `${baseUrl}/portfolio/${client.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Tier 5: Legal pages
  const tier5Pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  return [
    ...tier1Pages,
    ...tier2Pages,
    ...subServicePages,
    ...blogPages,
    ...tier3StaticPages,
    ...tier4StaticPages,
    ...portfolioPages,
    ...tier5Pages,
  ]
}
