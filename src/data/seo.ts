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
    title: 'Local SEO & Web Design for Contractors - WebWise',
    description: 'WebWise delivers local SEO services for plumbers, roofers, HVAC & contractors in USA & UK. 300%+ traffic increases. Get a free SEO audit today.',
    keywords: ['local SEO services', 'contractor SEO', 'contractor website design', 'small business SEO'],
  },

  // ============================================
  // MAIN SERVICE PAGES
  // ============================================
  'services/seo': {
    title: 'SEO Services for Small Business - WebWise',
    description: 'Data-driven SEO strategies for small businesses. Affordable SEO packages starting at $480/month. Transparent pricing, measurable results.',
    keywords: ['seo services for small business', 'affordable seo services', 'small business seo services', 'professional seo services'],
  },

  'services/web-development': {
    title: 'Contractor Website Design & Development - WebWise',
    description: 'Custom website design for contractors and small businesses. Next.js websites built for speed and conversions. From $1,500.',
    keywords: ['contractor website design', 'small business website design', 'custom website development', 'nextjs website development'],
  },

  'services/digital-marketing': {
    title: 'Digital Marketing for Small Business - WebWise',
    description: 'Comprehensive digital marketing services for small businesses. PPC, content marketing, social media, and analytics to grow your business.',
    keywords: ['small business digital marketing', 'online marketing services', 'digital marketing agency', 'internet marketing services'],
  },

  // ============================================
  // SEO SUB-SERVICES
  // ============================================
  'services/seo/local-seo': {
    title: 'Local SEO Services Near Me - Rank #1 in Google Maps - WebWise',
    description: 'Local SEO services that get small businesses into the Google 3-pack. Serving USA & UK contractors, plumbers, roofers. 380% avg traffic increase. Free audit.',
    keywords: ['local seo services near me', 'local seo packages', 'best local seo services', 'local seo services for small business'],
  },

  'services/seo/technical-seo': {
    title: 'Technical SEO Audit Services - WebWise',
    description: 'Technical SEO audit and optimization services. Site speed, crawlability, indexing, and Core Web Vitals improvements for better rankings.',
    keywords: ['technical seo audit services', 'technical seo services', 'seo site audit', 'website technical optimization'],
  },

  'services/seo/ecommerce-seo': {
    title: 'E-commerce SEO Services - Online Store SEO - WebWise',
    description: 'E-commerce SEO services for online stores. Custom e-commerce platform optimization, product page SEO, and category structure optimization.',
    keywords: ['ecommerce seo services', 'online store seo', 'product page seo', 'ecommerce optimization'],
  },

  'services/seo/international-seo': {
    title: 'International SEO Services - Multilingual SEO - WebWise',
    description: 'International SEO services for businesses targeting multiple countries and languages. Hreflang implementation, multilingual content strategy.',
    keywords: ['international seo services', 'multilingual seo services', 'global seo strategy', 'multi-country seo'],
  },

  // ============================================
  // WEB DEVELOPMENT SUB-SERVICES
  // ============================================
  'services/web-development/website-design': {
    title: 'Professional Website Design & Development - WebWise',
    description: 'Professional website design and development services. Custom, responsive websites that convert visitors into customers. Mobile-first approach.',
    keywords: ['professional website design', 'custom website development', 'responsive web design', 'business website design'],
  },

  'services/web-development/web-applications': {
    title: 'Web Application Development - Django & React Apps - WebWise',
    description: 'Custom web application development using Django, Python, React, and Vue.js. Scalable business applications and SaaS platforms.',
    keywords: ['web application development', 'django web applications', 'custom web app development', 'react application development'],
  },

  'services/web-development/ecommerce-development': {
    title: 'Custom E-commerce Website Development - Online Store Design - WebWise',
    description: 'Custom e-commerce website development for small businesses. Tailored online store solutions with seamless checkout, starting at $3,500.',
    keywords: ['custom ecommerce development', 'online store design', 'ecommerce website', 'custom online store'],
  },

  // ============================================
  // DIGITAL MARKETING SUB-SERVICES
  // ============================================
  'services/digital-marketing/content-marketing': {
    title: 'SEO Content Writing Services - Content Marketing - WebWise',
    description: 'SEO content writing services that rank. Blog posts, service pages, and landing pages optimized for search engines and conversions.',
    keywords: ['seo content writing services', 'content marketing services', 'blog writing services', 'seo copywriting'],
  },

  'services/digital-marketing/ppc-advertising': {
    title: 'PPC Advertising Services - Google Ads Management - WebWise',
    description: 'PPC advertising and Google Ads management for small businesses. ROI-focused campaigns that generate leads and sales.',
    keywords: ['ppc advertising services', 'google ads management', 'pay per click advertising', 'ppc management services'],
  },

  'services/digital-marketing/social-management-media': {
    title: 'Social Media Marketing Services - WebWise',
    description: 'Social media marketing services for small businesses. Facebook, Instagram, LinkedIn marketing and paid social advertising.',
    keywords: ['social media marketing services', 'social media advertising', 'facebook marketing', 'instagram marketing'],
  },

  'services/digital-marketing/analytics': {
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
  'blog/how-much-does-seo-cost-for-small-business': {
    title: 'How Much Does SEO Cost for a Small Business in 2026?',
    description: 'A comprehensive breakdown of SEO pricing for plumbers, roofers, detailers, and local service businesses. Learn what to expect and how to budget for SEO.',
    keywords: ['seo pricing', 'seo cost small business', 'how much does seo cost', 'seo pricing packages'],
  },

  'blog/local-seo-for-plumbers-complete-guide': {
    title: 'Local SEO for Plumbers: The Complete 2026 Guide',
    description: 'Everything plumbers need to know about ranking #1 on Google Maps and local search. Step-by-step strategies that actually work.',
    keywords: ['local seo for plumbers', 'plumber seo', 'plumbing marketing', 'plumber google ranking'],
  },

  'blog/roofing-company-seo-strategy': {
    title: 'Roofing Company SEO: Complete Strategy for 2026',
    description: 'How roofing contractors can generate more leads through SEO. Proven strategies for ranking in competitive local markets.',
    keywords: ['roofing seo', 'roofing company seo', 'roofer marketing', 'roofing contractor seo'],
  },

  'blog/hvac-seo-complete-guide': {
    title: 'HVAC SEO: Complete Guide to Ranking Your Heating & Cooling Business',
    description: 'Dominate local search for HVAC services. Learn how to outrank competitors and generate more leads year-round.',
    keywords: ['hvac seo', 'hvac marketing', 'heating cooling seo', 'hvac company marketing'],
  },

  'blog/construction-company-seo-strategy': {
    title: 'Construction Company SEO: Build Your Online Presence',
    description: 'SEO strategies for general contractors and construction companies. Rank for high-value commercial and residential projects.',
    keywords: ['construction company seo', 'contractor seo', 'general contractor marketing', 'construction marketing'],
  },

  'blog/electrician-seo-guide': {
    title: 'Electrician SEO: Power Up Your Local Rankings',
    description: 'Complete SEO guide for electrical contractors. Learn how to generate more leads and outrank local competitors.',
    keywords: ['electrician seo', 'electrical contractor marketing', 'electrician marketing', 'local seo for electricians'],
  },

  'blog/google-business-profile-optimization-guide': {
    title: 'Google Business Profile Optimization: The Ultimate Guide',
    description: 'Master your Google Business Profile and dominate the local map pack. Step-by-step guide for local service businesses.',
    keywords: ['google business profile optimization', 'gbp optimization', 'google my business seo', 'google maps ranking'],
  },

  'blog/auto-detailing-seo-get-more-customers': {
    title: 'SEO for Auto Detailing: How to Get More Customers Online',
    description: 'Learn how mobile and shop-based auto detailers can dominate local search and book more appointments through SEO.',
    keywords: ['auto detailing seo', 'car detailing marketing', 'mobile detailing seo', 'detailing business marketing'],
  },

  'blog/dumpster-rental-seo-dominate-local-search': {
    title: 'Dumpster Rental SEO: How to Dominate Local Search Results',
    description: 'Complete SEO strategy for dumpster rental companies. Learn how to rank for high-value keywords and get more rental inquiries.',
    keywords: ['dumpster rental seo', 'waste management seo', 'roll off dumpster marketing', 'dumpster company marketing'],
  },

  'blog/how-long-does-seo-take-to-work': {
    title: 'How Long Does SEO Take to Work? Realistic Timeline for Local Businesses',
    description: 'Set realistic expectations for your SEO investment. Learn the typical timeline for local businesses to see results.',
    keywords: ['how long does seo take', 'seo timeline', 'seo results time', 'when does seo work'],
  },

  'blog/local-seo-uk-vs-usa-differences': {
    title: 'Local SEO in the UK vs USA: Key Differences You Need to Know',
    description: 'Understanding the differences between local SEO strategies in the UK and USA. Optimize for your specific market.',
    keywords: ['uk seo vs usa', 'local seo uk', 'international local seo', 'uk local seo strategy'],
  },

  'blog/landscaping-seo-grow-your-business': {
    title: 'Landscaping SEO: Grow Your Business with Local Search',
    description: 'SEO strategies for landscapers and lawn care businesses. Attract more residential and commercial clients.',
    keywords: ['landscaping seo', 'lawn care marketing', 'landscaper marketing', 'lawn service seo'],
  },

  'blog/pest-control-seo-strategy': {
    title: 'Pest Control SEO: Exterminate Your Competition',
    description: 'Complete SEO guide for pest control companies. Rank for emergency and preventive pest control services.',
    keywords: ['pest control seo', 'exterminator marketing', 'pest control marketing', 'pest management seo'],
  },

  'blog/cleaning-company-seo-guide': {
    title: 'Cleaning Company SEO: Clean Up in Local Search',
    description: 'SEO strategies for residential and commercial cleaning businesses. Stand out in a crowded market.',
    keywords: ['cleaning company seo', 'maid service marketing', 'janitorial seo', 'cleaning business marketing'],
  },

  'blog/moving-company-seo-guide': {
    title: 'Moving Company SEO: Pack in More Leads',
    description: 'Complete SEO strategy for local and long-distance moving companies. Rank when people are ready to move.',
    keywords: ['moving company seo', 'movers marketing', 'moving company marketing', 'local movers seo'],
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

  portfolio: {
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
