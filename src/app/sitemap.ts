import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { siteConfig, clients } from '@/data/site'
import { getBlogPosts, getBlogPostUrl } from '@/data/blog'

const baseUrl = siteConfig.url

// Case study slug mapping (old long slugs → new short slugs)
const caseStudySlugMap: Record<string, string> = {
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

// Old paths that only exist as redirect stubs — never include in sitemap
const REDIRECT_PATHS = ['/services', '/portfolio']

/**
 * Auto-discovers all page.tsx files under src/app/ and converts them to URL paths.
 * Skips route groups (admin, auth, dashboard), dynamic [slug] routes, and old redirect stubs.
 * Any new page.tsx added to the app directory is automatically included.
 */
function discoverPages(): string[] {
  const appDir = path.join(process.cwd(), 'src', 'app')
  const pages: string[] = []

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith('(') || entry.name.startsWith('[')) continue
        scan(path.join(dir, entry.name))
      } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
        const relative = path.relative(appDir, dir)
        const urlPath = relative === '' ? '/' : `/${relative.replace(/\\/g, '/')}`
        if (REDIRECT_PATHS.some(rp => urlPath === rp || urlPath.startsWith(`${rp}/`))) continue
        pages.push(urlPath)
      }
    }
  }

  scan(appDir)
  return pages
}

function getPriority(urlPath: string): number {
  if (urlPath === '/' || urlPath === '/local-seo') return 1.0
  if (['/seo-services', '/development', '/digital-marketing', '/blog'].includes(urlPath)) return 0.9
  if (['/case-studies', '/about'].includes(urlPath)) return 0.7
  if (urlPath.startsWith('/case-studies/')) return 0.6
  if (['/privacy-policy', '/terms-and-agreements', '/html-sitemap'].includes(urlPath)) return 0.5
  if (
    urlPath.startsWith('/local-seo/') ||
    urlPath.startsWith('/blog/') ||
    urlPath.startsWith('/development/') ||
    urlPath.startsWith('/digital-marketing/') ||
    ['/pricing', '/contact', '/technical-seo', '/ecommerce-seo', '/international-seo'].includes(urlPath)
  ) return 0.8
  return 0.7
}

function getChangeFrequency(urlPath: string): MetadataRoute.Sitemap[number]['changeFrequency'] {
  if (urlPath === '/' || urlPath.startsWith('/blog')) return 'weekly'
  if (['/privacy-policy', '/terms-and-agreements'].includes(urlPath)) return 'yearly'
  return 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Auto-discover all static pages from filesystem (no lastModified)
  const staticPages: MetadataRoute.Sitemap = discoverPages().map(urlPath => ({
    url: `${baseUrl}${urlPath}`,
    changeFrequency: getChangeFrequency(urlPath),
    priority: getPriority(urlPath),
  }))

  // 2. Blog posts with real publish dates
  const blogPosts = getBlogPosts()
  const blogDateMap = new Map(blogPosts.map(post => [getBlogPostUrl(post.slug), post.date]))
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => {
    const urlPath = getBlogPostUrl(post.slug)
    return {
      url: `${baseUrl}${urlPath}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })

  // 3. Case studies (no date available, omit lastModified)
  const caseStudyPages: MetadataRoute.Sitemap = Object.values(clients).map(client => {
    const urlPath = `/case-studies/${caseStudySlugMap[client.slug] || client.slug}`
    return {
      url: `${baseUrl}${urlPath}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  })

  // 4. Combine and deduplicate (blog/case study entries override static ones)
  const seen = new Set<string>()
  const result: MetadataRoute.Sitemap = []

  // Add blog and case study entries first (they have better metadata)
  for (const entry of [...blogPages, ...caseStudyPages]) {
    if (!seen.has(entry.url)) {
      seen.add(entry.url)
      result.push(entry)
    }
  }

  // Add static pages that aren't already covered
  for (const entry of staticPages) {
    if (!seen.has(entry.url)) {
      seen.add(entry.url)
      result.push(entry)
    }
  }

  return result
}
