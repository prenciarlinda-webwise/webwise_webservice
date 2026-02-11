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
    title: 'Web Development & SEO Services for Small Business | WebWise',
    description: 'Professional web development, SEO, and digital marketing services for businesses in UK & USA. Custom websites, web applications, and local SEO. 340% avg traffic increase.',
    keywords: ['web development services', 'SEO services', 'digital marketing agency', 'custom web applications', 'local SEO services', 'small business website'],
  },

  // ============================================
  // MAIN SERVICE PAGES
  // ============================================
  'seo-services': {
    title: 'SEO Services for Small Business - WebWise',
    description: 'Data-driven SEO strategies for small businesses. Affordable SEO packages starting at $480/month. Transparent pricing, measurable results.',
    keywords: ['seo services for small business', 'affordable seo services', 'small business seo services', 'professional seo services'],
  },

  'development': {
    title: 'Web Development Services - Websites & Applications | WebWise',
    description: 'Custom web development for businesses. Websites, web applications, and systems built with Next.js, Django, and modern technologies. From $1,500.',
    keywords: ['contractor website design', 'small business website design', 'custom website development', 'nextjs website development'],
  },

  'digital-marketing': {
    title: 'Digital Marketing for Small Business - WebWise',
    description: 'Comprehensive digital marketing services for small businesses. PPC, content marketing, social media, and analytics to grow your business.',
    keywords: ['small business digital marketing', 'online marketing services', 'digital marketing agency', 'internet marketing services'],
  },

  // ============================================
  // SEO SUB-SERVICES
  // ============================================
  'local-seo': {
    title: 'Local SEO Services Near Me - Rank #1 in Google Maps - WebWise',
    description: 'Local SEO services that get small businesses into the Google 3-pack. Serving USA & UK contractors, plumbers, roofers. 380% avg traffic increase. Free audit.',
    keywords: ['local seo services near me', 'local seo packages', 'best local seo services', 'local seo services for small business'],
  },

  'technical-seo': {
    title: 'Technical SEO Audit Services - WebWise',
    description: 'Technical SEO audit and optimization services. Site speed, crawlability, indexing, and Core Web Vitals improvements for better rankings.',
    keywords: ['technical seo audit services', 'technical seo services', 'seo site audit', 'website technical optimization'],
  },

  'ecommerce-seo': {
    title: 'E-commerce SEO Services - Online Store SEO - WebWise',
    description: 'E-commerce SEO services for online stores. Custom e-commerce platform optimization, product page SEO, and category structure optimization.',
    keywords: ['ecommerce seo services', 'online store seo', 'product page seo', 'ecommerce optimization'],
  },

  'international-seo': {
    title: 'International SEO Services - Multilingual SEO - WebWise',
    description: 'International SEO services for businesses targeting multiple countries and languages. Hreflang implementation, multilingual content strategy.',
    keywords: ['international seo services', 'multilingual seo services', 'global seo strategy', 'multi-country seo'],
  },

  // ============================================
  // WEB DEVELOPMENT SUB-SERVICES
  // ============================================
  'development/website-design': {
    title: 'Professional Website Design & Development - WebWise',
    description: 'Professional website design and development services. Custom, responsive websites that convert visitors into customers. Mobile-first approach.',
    keywords: ['professional website design', 'custom website development', 'responsive web design', 'business website design'],
  },

  'development/applications': {
    title: 'Web Application Development - Django & React Apps - WebWise',
    description: 'Custom web application development using Django, Python, React, and Vue.js. Scalable business applications and SaaS platforms.',
    keywords: ['web application development', 'django web applications', 'custom web app development', 'react application development'],
  },

  'development/ecommerce': {
    title: 'Custom E-commerce Website Development - Online Store Design - WebWise',
    description: 'Custom e-commerce website development for small businesses. Tailored online store solutions with seamless checkout, starting at $3,500.',
    keywords: ['custom ecommerce development', 'online store design', 'ecommerce website', 'custom online store'],
  },

  // ============================================
  // DIGITAL MARKETING SUB-SERVICES
  // ============================================
  'digital-marketing/content': {
    title: 'SEO Content Writing Services - Content Marketing - WebWise',
    description: 'SEO content writing services that rank. Blog posts, service pages, and landing pages optimized for search engines and conversions.',
    keywords: ['seo content writing services', 'content marketing services', 'blog writing services', 'seo copywriting'],
  },

  'digital-marketing/ppc': {
    title: 'PPC Advertising Services - Google Ads Management - WebWise',
    description: 'PPC advertising and Google Ads management for small businesses. ROI-focused campaigns that generate leads and sales.',
    keywords: ['ppc advertising services', 'google ads management', 'pay per click advertising', 'ppc management services'],
  },

  'digital-marketing/social-management': {
    title: 'Social Media Marketing Services - WebWise',
    description: 'Social media marketing services for small businesses. Facebook, Instagram, LinkedIn marketing and paid social advertising.',
    keywords: ['social media marketing services', 'social media advertising', 'facebook marketing', 'instagram marketing'],
  },

  'digital-marketing/analytics': {
    title: 'Website Analytics & SEO Reporting Services - WebWise',
    description: 'Website analytics setup and SEO reporting services. Google Analytics, Search Console, and custom dashboards to track your growth.',
    keywords: ['website analytics services', 'seo reporting services', 'google analytics setup', 'marketing analytics'],
  },

  // ============================================
  // BLOG
  // ============================================
  blog: {
    title: 'SEO & Web Design Blog for Local Businesses - WebWise',
    description: 'Expert SEO tips and strategies for plumbers, roofers, HVAC, electricians, and local service businesses. Learn how to rank higher on Google.',
    keywords: ['local seo blog', 'seo tips for small business', 'contractor marketing tips', 'local business marketing blog'],
  },

  // ============================================
  // BLOG POSTS - Unique keywords per post
  // ============================================
  'blog/seo-pricing': {
    title: 'How Much Does SEO Cost for a Small Business in 2026?',
    description: 'A comprehensive breakdown of SEO pricing for plumbers, roofers, detailers, and local service businesses. Learn what to expect and how to budget for SEO.',
    keywords: ['seo pricing', 'seo cost small business', 'how much does seo cost', 'seo pricing packages'],
  },

  'blog/gbp-optimization': {
    title: 'Google Business Profile Optimization: The Ultimate Guide',
    description: 'Master your Google Business Profile and dominate the local map pack. Step-by-step guide for local service businesses.',
    keywords: ['google business profile optimization', 'gbp optimization', 'google my business seo', 'google maps ranking'],
  },

  'blog/seo-timeline': {
    title: 'How Long Does SEO Take to Work? Realistic Timeline for Local Businesses',
    description: 'Set realistic expectations for your SEO investment. Learn the typical timeline for local businesses to see results.',
    keywords: ['how long does seo take', 'seo timeline', 'seo results time', 'when does seo work'],
  },

  'blog/local-seo-uk-vs-usa': {
    title: 'Local SEO in the UK vs USA: Key Differences You Need to Know',
    description: 'Understanding the differences between local SEO strategies in the UK and USA. Optimize for your specific market.',
    keywords: ['uk seo vs usa', 'local seo uk', 'international local seo', 'uk local seo strategy'],
  },

  'blog/google-maps-ranking-factors': {
    title: 'Google Maps Ranking Factors: Complete Guide for Local Businesses',
    description: 'Learn the key Google Maps ranking factors and how to optimize your local business for map pack visibility.',
    keywords: ['google maps ranking factors', 'local map pack', 'google maps seo', 'local search ranking'],
  },

  'blog/google-reviews-guide': {
    title: 'Google Reviews Guide: How to Get More Reviews for Your Business',
    description: 'Complete guide to getting more Google reviews. Learn proven strategies to generate authentic reviews that boost your local SEO.',
    keywords: ['google reviews guide', 'get more google reviews', 'review generation', 'online reviews strategy'],
  },

  'blog/seo-vs-ppc': {
    title: 'SEO vs PPC: Which Strategy Is Right for Your Business?',
    description: 'Compare SEO and PPC advertising to determine the best marketing strategy for your local business. Pros, cons, and when to use each.',
    keywords: ['seo vs ppc', 'seo or ppc', 'organic vs paid search', 'search marketing strategy'],
  },

  // ============================================
  // STATIC PAGES
  // ============================================
  pricing: {
    title: 'SEO & Web Design Pricing - Transparent Packages - WebWise',
    description: 'Clear, transparent pricing for SEO and web design services. SEO packages from $480/month. Website development from $1,500. No hidden fees.',
    keywords: ['seo pricing', 'website design cost', 'seo packages pricing', 'web development pricing'],
  },

  about: {
    title: 'About WebWise - Local SEO & Web Design Agency',
    description: 'WebWise is a web design and SEO agency specializing in local businesses. Based in UK, serving USA & UK contractors, plumbers, and service businesses.',
    keywords: ['web design agency', 'seo agency', 'local seo agency', 'about webwise'],
  },

  contact: {
    title: 'Contact WebWise - Free SEO Consultation',
    description: 'Get a free SEO consultation and website quote. Contact WebWise to discuss your project and start growing your local business online.',
    keywords: ['free seo consultation', 'website quote', 'contact seo agency', 'get seo quote'],
  },

  'case-studies': {
    title: 'SEO Case Studies & Web Design Portfolio - WebWise',
    description: 'View our portfolio of successful SEO campaigns and web design projects. Real results for contractors, plumbers, roofers, and service businesses.',
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
