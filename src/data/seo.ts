// Centralized SEO Data - Unique metadata per page to eliminate keyword cannibalization

export interface PageSEO {
  title: string
  description: string
  keywords: string[]
}

export const pageSEO: Record<string, PageSEO> = {
  // ============================================
  // HOMEPAGE
  // ============================================
  home: {
    title: 'Web Development & SEO Services for Small Business',
    description: 'Custom websites, local SEO, and digital marketing for small businesses in the UK & USA. Next.js & Django development. 340% avg traffic increase. Free consultation.',
    keywords: ['web development services', 'SEO services', 'digital marketing agency', 'custom web applications', 'local SEO services', 'small business website'],
  },

  // ============================================
  // MAIN SERVICE PAGES
  // ============================================
  'seo-services': {
    title: 'SEO Services for Small Business - Packages from $480/mo',
    description: 'Data-driven SEO for small businesses. Keyword research, on-page optimization, link building, monthly reporting. Packages from $480/month. Free audit.',
    keywords: ['seo services for small business', 'affordable seo services', 'small business seo services', 'professional seo services'],
  },

  'development': {
    title: 'Web Development for Small Business - Next.js & Django',
    description: 'Custom websites and web applications built on Next.js and Django. 98+ PageSpeed scores. Starting at $1,500. UK & USA businesses.',
    keywords: ['contractor website design', 'small business website design', 'custom website development', 'nextjs website development'],
  },

  'digital-marketing': {
    title: 'Digital Marketing for Small Business - PPC, Content & Social',
    description: 'PPC advertising, content marketing, social media, and analytics for small businesses. Data-driven campaigns that generate leads. Free strategy call.',
    keywords: ['small business digital marketing', 'online marketing services', 'digital marketing agency', 'internet marketing services'],
  },

  // ============================================
  // SEO SUB-SERVICES
  // ============================================
  'local-seo': {
    title: 'Local SEO Services - Google Maps & 3-Pack Rankings',
    description: 'Local SEO that gets contractors into the Google 3-pack. GBP optimization, local citations, review strategy. 380% avg traffic increase. Free audit.',
    keywords: ['local seo services near me', 'local seo packages', 'best local seo services', 'local seo services for small business'],
  },

  'technical-seo': {
    title: 'Technical SEO Audit Services - Site Speed & Indexing Fixes',
    description: 'We find and fix the technical issues killing your rankings. Crawlability, Core Web Vitals, indexing errors. Audits start at $480. Free initial check.',
    keywords: ['technical seo audit services', 'technical seo services', 'seo site audit', 'website technical optimization'],
  },

  'ecommerce-seo': {
    title: 'E-commerce SEO Services - Product & Category Optimization',
    description: 'SEO for online stores that drives sales, not just traffic. Product page optimization, category structure, schema markup. Free store audit.',
    keywords: ['ecommerce seo services', 'online store seo', 'product page seo', 'ecommerce optimization'],
  },

  'international-seo': {
    title: 'International SEO Services - Multi-Language & Multi-Country',
    description: 'Reach customers in any country and language. Hreflang implementation, localized keyword research, multilingual content strategy. Free market analysis.',
    keywords: ['international seo services', 'multilingual seo services', 'global seo strategy', 'multi-country seo'],
  },

  // ============================================
  // WEB DEVELOPMENT SUB-SERVICES
  // ============================================
  'development/website-design': {
    title: 'Website Design for Small Business - Custom & Responsive',
    description: 'Custom, mobile-first website design that converts visitors into customers. 94% of first impressions are design-related. Starting at $1,500.',
    keywords: ['professional website design', 'custom website development', 'responsive web design', 'business website design'],
  },

  'development/applications': {
    title: 'Web Application Development - Django & React Apps',
    description: 'Custom web applications built with Django, Python, React, and Vue.js. Business automation, CRM, booking systems. Scalable and secure.',
    keywords: ['web application development', 'django web applications', 'custom web app development', 'react application development'],
  },

  'development/ecommerce': {
    title: 'E-commerce Website Development - Custom Online Stores',
    description: 'Custom e-commerce websites with seamless checkout, inventory management, and payment processing. Starting at $3,500. Free consultation.',
    keywords: ['custom ecommerce development', 'online store design', 'ecommerce website', 'custom online store'],
  },

  // ============================================
  // DIGITAL MARKETING SUB-SERVICES
  // ============================================
  'digital-marketing/content': {
    title: 'SEO Content Writing Services - Blog Posts & Service Pages',
    description: 'SEO-optimized blog posts, service pages, and landing pages that rank and convert. Content marketing generates 3x more leads at 62% less cost.',
    keywords: ['seo content writing services', 'content marketing services', 'blog writing services', 'seo copywriting'],
  },

  'digital-marketing/ppc': {
    title: 'PPC Advertising Services - Google Ads Management',
    description: 'Google Ads and paid search management for small businesses. ROI-focused campaigns, conversion tracking, transparent reporting. Free ad account audit.',
    keywords: ['ppc advertising services', 'google ads management', 'pay per click advertising', 'ppc management services'],
  },

  'digital-marketing/social-management': {
    title: 'Social Media Marketing Services - Facebook, Instagram & LinkedIn',
    description: 'Strategic social media management for small businesses. Content creation, community management, paid social advertising. Build your brand online.',
    keywords: ['social media marketing services', 'social media advertising', 'facebook marketing', 'instagram marketing'],
  },

  'digital-marketing/analytics': {
    title: 'Website Analytics & SEO Reporting - Google Analytics Setup',
    description: 'Google Analytics setup, conversion tracking, call tracking, and custom dashboards. Know exactly what is working and what is not. Free analytics audit.',
    keywords: ['website analytics services', 'seo reporting services', 'google analytics setup', 'marketing analytics'],
  },

  // ============================================
  // BLOG
  // ============================================
  blog: {
    title: 'SEO & Web Development Blog - Tips for Local Business',
    description: 'Actionable SEO tips, web development guides, and digital marketing strategies for local service businesses. Plumbers, roofers, HVAC, electricians, and more.',
    keywords: ['local seo blog', 'seo tips for small business', 'contractor marketing tips', 'local business marketing blog'],
  },

  // ============================================
  // BLOG POSTS - Unique keywords per post
  // ============================================
  'blog/seo-pricing': {
    title: 'How Much Does SEO Cost for a Small Business in 2026?',
    description: 'SEO pricing breakdown for local service businesses. Packages from $480-$1,100/month. What affects cost, what to expect, and how to budget.',
    keywords: ['seo pricing', 'seo cost small business', 'how much does seo cost', 'seo pricing packages'],
  },

  'blog/gbp-optimization': {
    title: 'Google Business Profile Optimization - Complete 2026 Guide',
    description: 'Step-by-step GBP optimization guide for local businesses. Categories, posts, photos, reviews, Q&A. Rank higher in Google Maps.',
    keywords: ['google business profile optimization', 'gbp optimization', 'google my business seo', 'google maps ranking'],
  },

  'blog/seo-timeline': {
    title: 'How Long Does SEO Take to Work? Realistic Timelines by Industry',
    description: 'Realistic SEO timelines for local businesses. Initial results in 30-60 days, significant growth by month 3-6. What affects your timeline.',
    keywords: ['how long does seo take', 'seo timeline', 'seo results time', 'when does seo work'],
  },

  'blog/local-seo-uk-vs-usa': {
    title: 'Local SEO in the UK vs USA - Key Differences You Need to Know',
    description: 'Citation sources, review platforms, spelling conventions, and search behavior differences between UK and USA local SEO. Optimize for your market.',
    keywords: ['uk seo vs usa', 'local seo uk', 'international local seo', 'uk local seo strategy'],
  },

  'blog/google-maps-ranking-factors': {
    title: 'Google Maps Ranking Factors - The 12 That Actually Matter in 2026',
    description: 'The 12 Google Maps ranking factors that determine Map Pack visibility. GBP signals, reviews, citations, on-page SEO. Data-backed guide.',
    keywords: ['google maps ranking factors', 'local map pack', 'google maps seo', 'local search ranking'],
  },

  'blog/google-reviews-guide': {
    title: 'How to Get More Google Reviews for Your Business in 2026',
    description: 'Proven strategies to generate authentic Google reviews. Automated request systems, direct links, response templates. Build a 4.8+ star average.',
    keywords: ['google reviews guide', 'get more google reviews', 'review generation', 'online reviews strategy'],
  },

  'blog/seo-vs-ppc': {
    title: 'SEO vs PPC - Which Should Your Business Invest In?',
    description: 'SEO vs PPC comparison for local businesses. Cost per lead, timeline, ROI, and when to use each. Data-driven analysis to guide your budget.',
    keywords: ['seo vs ppc', 'seo or ppc', 'organic vs paid search', 'search marketing strategy'],
  },

  // ============================================
  // STATIC PAGES
  // ============================================
  pricing: {
    title: 'SEO & Web Development Pricing - Packages from $480/mo',
    description: 'SEO packages from $480/month. Web development from $1,500. No contracts, no hidden fees. See exactly what you get at each tier.',
    keywords: ['seo pricing', 'website design cost', 'seo packages pricing', 'web development pricing'],
  },

  about: {
    title: 'About Web Wise - SEO & Web Development Agency',
    description: 'SEO and web development agency serving small businesses in the UK & USA. 50+ businesses helped. 340% average traffic increase. Meet the team.',
    keywords: ['web design agency', 'seo agency', 'local seo agency', 'about Web Wise'],
  },

  contact: {
    title: 'Contact Web Wise - Free SEO Consultation & Website Quote',
    description: 'Get a free SEO audit and website quote. Tell us about your project and we will show you how to grow your local business online.',
    keywords: ['free seo consultation', 'website quote', 'contact seo agency', 'get seo quote'],
  },

  'case-studies': {
    title: 'SEO Case Studies & Web Design Portfolio',
    description: 'Real results for real businesses. See how we helped contractors and service businesses increase traffic by 290%+. View our full portfolio.',
    keywords: ['seo case studies', 'web design portfolio', 'seo portfolio', 'website design examples'],
  },
}

// Helper function to get SEO data for a page path
export function getPageSEO(path: string): PageSEO | undefined {
  // Remove leading slash if present
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  // Handle empty path as home
  if (normalizedPath === '' || normalizedPath === '/') {
    return pageSEO.home
  }
  return pageSEO[normalizedPath]
}

// Helper function to get blog post SEO data
export function getBlogPostSEO(slug: string): PageSEO | undefined {
  return pageSEO[`blog/${slug}`]
}
