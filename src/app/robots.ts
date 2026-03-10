import { MetadataRoute } from 'next'
import { siteConfig } from '@/data/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rules for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // API routes
          '/api/',

          // Old WordPress patterns - block crawling
          '/feed/',
          '/feed',
          '/*?attachment_id=*',
          '/category/',
          '/author/',
          '/tag/',

          // Old WordPress date archives
          '/2024/',
          '/2023/',
          '/2022/',
          '/2021/',
          '/2020/',

          // Old WordPress pages/images that no longer exist
          '/home/',
          '/woocommerce-placeholder/',
          '/wp-content/',
          '/wp-includes/',
          '/wp-admin/',

          // Old WordPress attachment page patterns (not actual image files)
          '/*-svg/',
          '/*-png/',
          '/*-jpg/',
          '/*-jpeg/',

          // Old WordPress page patterns (specific paths only — avoid blocking live pages)
          '/elementor-*',
          '/pricing-plans/',
          '/seo-agency-3',
          '/website-and-seo/',
          '/website-client/',
          '/website-building*',

          // Search and internal pages
          '/search/',
          '/?s=*',
          '/?p=*',
          '/?page_id=*',
        ],
      },
      // AI Crawler Rules - Explicitly allow for AEO/GEO optimization
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Anthropic-AI', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
