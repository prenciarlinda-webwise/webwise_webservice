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
    title: 'SEO Services for Small Business in 2026 | From $480/mo',
    description: 'Results-driven SEO services for small businesses and contractors. Packages from $480/month. Free audit, transparent reporting, 3-month measurable roadmap.',
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
    title: 'How Much Does SEO Cost Per Month? 2026 Pricing for Small Business',
    description: 'SEO costs $480-$1,100 per month for small businesses in 2026. Full pricing breakdown, what affects cost, what to expect, and how to budget for real ROI.',
    keywords: ['how much does seo cost per month', 'seo pricing', 'seo cost small business', 'how much does seo cost', 'seo pricing packages'],
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

  // Industry SEO guides
  'blog/local-seo-for-plumbers-complete-guide': {
    title: 'SEO for Plumbers: Get More Emergency Calls From Google',
    description: 'Plumber SEO strategies that deliver 290%+ traffic increases. Dominate Google Maps, rank for emergency keywords, and fill your schedule with high-value calls.',
    keywords: ['seo for plumbers', 'plumber seo', 'plumbing seo', 'local seo for plumbers'],
  },

  'blog/roofing-company-seo-strategy': {
    title: 'Roofing SEO: Generate More Leads for Your Roofing Company',
    description: 'SEO for roofers that generates roof replacement inquiries and emergency repair calls. Proven strategies for Google Maps and organic rankings.',
    keywords: ['roofing seo', 'seo for roofers', 'roofing marketing agency', 'roofing contractor seo'],
  },

  'blog/hvac-seo-complete-guide': {
    title: 'HVAC SEO: Year-Round Lead Generation for HVAC Companies',
    description: 'HVAC SEO strategies that keep your schedule full through summer cooling rushes and winter heating emergencies. Seasonal keyword targeting and Map Pack domination.',
    keywords: ['hvac seo', 'seo for hvac companies', 'hvac marketing', 'ac repair seo'],
  },

  'blog/electrician-seo-guide': {
    title: 'Electrician SEO: Get More Service Calls From Google',
    description: 'SEO for electricians that generates consistent leads. From emergency calls to EV charger installations, rank higher and book more jobs.',
    keywords: ['electrician seo', 'seo for electricians', 'electrical contractor marketing', 'electrician leads'],
  },

  'blog/construction-company-seo-strategy': {
    title: 'Construction SEO: Win More Bids With Better Google Rankings',
    description: 'SEO for construction companies and general contractors. Generate high-value project inquiries for residential, commercial, and specialty work.',
    keywords: ['construction seo', 'general contractor seo', 'contractor marketing', 'construction leads'],
  },

  'blog/landscaping-seo-grow-your-business': {
    title: 'Landscaping SEO: 80+ Keywords & Complete Ranking Guide for 2026',
    description: 'The complete landscaping SEO guide with 80+ keywords by season, service-specific page strategies, and a month-by-month process to dominate local search.',
    keywords: ['landscaping seo', 'landscaper seo', 'lawn care seo', 'seo for landscaping company'],
  },

  'blog/pest-control-seo-strategy': {
    title: 'Pest Control SEO: Get More Calls From Google',
    description: 'SEO for pest control companies that captures emergency treatments and recurring prevention customers. Dominate local search in your service area.',
    keywords: ['pest control seo', 'exterminator marketing', 'pest control marketing', 'pest control leads'],
  },

  'blog/cleaning-company-seo-guide': {
    title: 'Cleaning Service SEO: Get More Clients From Google in 2026',
    description: 'SEO for cleaning companies covering residential, commercial, and carpet cleaning. Proven strategies to generate consistent leads from Google.',
    keywords: ['cleaning service seo', 'cleaning company seo', 'carpet cleaning seo', 'seo for cleaning company'],
  },

  'blog/moving-company-seo-guide': {
    title: 'Moving Company SEO: Get More Quote Requests From Google',
    description: 'SEO for moving companies that brings in local, long-distance, and specialty moving clients. Rank higher and book more moves.',
    keywords: ['moving company seo', 'movers marketing', 'moving company marketing', 'moving leads'],
  },

  'blog/auto-detailing-seo-get-more-customers': {
    title: 'Auto Detailing SEO: Book More Appointments From Google',
    description: 'SEO for auto detailing businesses. Rank for ceramic coating, mobile detailing, and interior cleaning keywords to fill your booking calendar.',
    keywords: ['auto detailing seo', 'car detailing marketing', 'mobile detailing seo', 'ceramic coating seo'],
  },

  'blog/dumpster-rental-seo-dominate-local-search': {
    title: 'Dumpster Rental SEO: Dominate Local Search & Get More Rentals',
    description: 'SEO for dumpster rental companies. Capture contractor, homeowner, and commercial rental inquiries with proven local search strategies.',
    keywords: ['dumpster rental seo', 'roll off dumpster marketing', 'waste management seo', 'dumpster company marketing'],
  },

  'blog/locksmith-seo-guide': {
    title: 'Locksmith SEO: Get More Emergency Calls From Google',
    description: 'SEO for locksmiths that delivers 24/7 visibility for emergency lockout calls. Dominate Google Maps and stop paying per-lead fees.',
    keywords: ['locksmith seo', 'seo for locksmiths', 'locksmith marketing', 'emergency locksmith seo'],
  },

  // Keyword research guides
  'blog/plumber-keywords-for-seo': {
    title: 'Plumber Keywords for SEO: 100+ High-Intent Keywords for 2026',
    description: '100+ plumber keywords organized by service type, search intent, and conversion potential. Emergency, residential, commercial, and seasonal plumbing keywords.',
    keywords: ['plumber keywords', 'plumbing keywords for seo', 'plumbing seo keywords', 'plumber search terms'],
  },

  'blog/locksmith-keywords-for-seo': {
    title: 'Locksmith SEO: 100+ Keywords That Drive Calls in 2026',
    description: '100+ locksmith keywords organized by service category and conversion potential. Emergency, residential, commercial, and automotive locksmith terms with volumes.',
    keywords: ['locksmith seo', 'locksmith keywords', 'locksmith keywords for seo', 'locksmith seo keywords', 'locksmith search terms'],
  },

  'blog/electrician-keywords-for-seo': {
    title: 'Electrician Keywords for SEO: 100+ High-Intent Keywords for 2026',
    description: '100+ electrician keywords organized by service type and search intent. Residential, commercial, emergency, and specialty electrical keywords with volumes.',
    keywords: ['electrician keywords', 'electrician keywords for seo', 'electrician seo keywords', 'electrician search terms'],
  },

  'blog/roofing-keywords-for-seo': {
    title: 'Roofing Keywords for SEO: 100+ Keywords for Year-Round Leads',
    description: '100+ roofing keywords organized by service type, material, and season. Storm damage, roof replacement, repair, and commercial roofing search terms.',
    keywords: ['roofing keywords', 'roofing keywords for seo', 'roofing seo keywords', 'roofer search terms'],
  },

  'blog/hvac-keywords-for-seo': {
    title: 'HVAC Keywords for SEO: 100+ Keywords for Year-Round Leads',
    description: '100+ HVAC keywords organized by service type, season, and conversion potential. AC repair, furnace, heating, cooling, and commercial HVAC search terms.',
    keywords: ['hvac keywords', 'hvac keywords for seo', 'hvac seo keywords', 'heating cooling keywords'],
  },

  // Marketing and advertising guides
  'blog/plumber-marketing-ideas': {
    title: '15 Plumber Marketing Ideas That Actually Generate Calls in 2026',
    description: 'Proven plumber advertising and marketing ideas for any budget. From GBP optimization to digital marketing for plumbers, these strategies bring in emergency calls.',
    keywords: ['plumber marketing ideas', 'marketing for plumbers', 'plumber advertising ideas', 'digital marketing for plumbers'],
  },

  'blog/roofing-leads': {
    title: 'How to Get Roofing Leads: 12 Proven Strategies for 2026',
    description: '12 proven strategies to generate roofing leads consistently. SEO, Google Ads, referrals, storm chasing, and more. Average roofing project: $8-$20K.',
    keywords: ['how to get roofing leads', 'roofing lead generation', 'roofing leads', 'roofing marketing'],
  },

  'blog/hvac-marketing-ideas': {
    title: '15 HVAC Marketing & Advertising Ideas That Work in 2026',
    description: '15 proven HVAC marketing and advertising ideas for 2026. Seasonal strategies that deliver cooling-season and heating-season leads. Any budget, any company size.',
    keywords: ['hvac marketing ideas', 'hvac advertising', 'hvac advertising ideas', 'marketing for hvac companies', 'hvac business marketing'],
  },

  // SEO strategy and education guides
  'blog/local-citations-guide': {
    title: 'Local Citations: Complete Guide to Building & Managing Citations',
    description: 'Everything about local citations: what they are, why they matter, top citation sources, and how to audit and fix NAP consistency issues.',
    keywords: ['local citations', 'citation building', 'NAP consistency', 'local seo citations'],
  },

  'blog/local-seo-checklist': {
    title: 'Local SEO Checklist: 47 Steps to Higher Rankings in 2026',
    description: 'Step-by-step local SEO checklist covering GBP, on-page SEO, citations, reviews, and link building. 47 actionable steps for better local rankings.',
    keywords: ['local seo checklist', 'local seo audit checklist', 'local seo steps', 'local search optimization'],
  },

  'blog/local-link-building': {
    title: 'Local Link Building: 15 Strategies for Better Local Rankings',
    description: '15 proven local link building strategies with outreach templates. Earn backlinks from local sources that boost your local SEO rankings.',
    keywords: ['local link building', 'local backlinks', 'local seo link building', 'local link building strategies'],
  },

  'blog/best-free-ahrefs-alternatives': {
    title: '7 Free Ahrefs Alternatives That Actually Work in 2026',
    description: 'Powerful SEO tools without the Ahrefs price tag. Free keyword research, backlink analysis, and rank tracking tools for small businesses.',
    keywords: ['ahrefs alternative free', 'free seo tools', 'affordable seo tools', 'free keyword research tool'],
  },

  'blog/how-to-use-keywords-for-seo': {
    title: 'How to Use Keywords for SEO: Placement, Density & Best Practices',
    description: 'Where to place keywords on your pages, how many to target per page, and how to avoid keyword stuffing. Practical keyword usage guide for 2026.',
    keywords: ['how to use keywords for seo', 'keyword placement', 'how many keywords per page', 'keyword optimization'],
  },

  'blog/on-page-vs-off-page-seo': {
    title: 'On-Page vs Off-Page SEO: What Actually Matters in 2026',
    description: 'The difference between on-page and off-page SEO, which matters more, and how to build a strategy that covers both. Includes actionable checklists.',
    keywords: ['on page vs off page seo', 'on page seo', 'off page seo', 'seo ranking factors'],
  },

  'blog/best-cms-for-seo': {
    title: 'Best CMS for SEO in 2026: WordPress vs Next.js vs Shopify & More',
    description: 'WordPress, Next.js, Shopify, Wix, Squarespace, and Webflow compared for SEO. Find the best CMS for your business to rank on Google.',
    keywords: ['best cms for seo', 'wordpress seo', 'nextjs seo', 'best seo cms platform'],
  },

  'blog/best-ecommerce-platform-for-seo': {
    title: 'Best Ecommerce Platform for SEO in 2026: Shopify vs WooCommerce',
    description: 'Shopify, WooCommerce, BigCommerce, and Magento compared for SEO. Which platform helps online stores rank higher and convert organic traffic.',
    keywords: ['best ecommerce platform for seo', 'shopify seo vs woocommerce', 'ecommerce seo platform', 'search engine friendly ecommerce'],
  },

  'blog/seo-reputation-management-guide': {
    title: 'SEO Reputation Management: Control What Google Shows About You',
    description: 'How to push down negative search results and build a positive brand presence on Google. Practical reputation management strategies for businesses.',
    keywords: ['seo reputation management', 'online reputation management', 'negative search results', 'brand reputation seo'],
  },

  'blog/local-seo-audit-guide': {
    title: 'Local SEO Audit: Find & Fix What Hurts Your Rankings',
    description: 'Step-by-step local SEO audit guide. Find broken citations, GBP issues, on-page problems, and link gaps costing you rankings and leads.',
    keywords: ['local seo audit', 'local seo audit checklist', 'local search audit', 'how to audit local seo'],
  },

  'blog/skyscraper-technique-link-building': {
    title: 'Skyscraper Technique: Does It Still Work for Link Building?',
    description: 'Is the skyscraper technique still effective in the age of AI content? What works, what changed, and modern alternatives that deliver better results.',
    keywords: ['skyscraper technique', 'skyscraper link building', 'content marketing link building', 'seo skyscraper technique'],
  },

  'blog/buyer-intent-keywords-guide': {
    title: 'Buyer Intent Keywords: How to Find Keywords That Convert',
    description: 'How to identify keywords that signal purchase readiness. Difference between informational and transactional intent, plus a strategy that drives revenue.',
    keywords: ['buyer intent keywords', 'transactional keywords', 'commercial intent keywords', 'purchase keywords'],
  },

  'blog/keyword-clustering-guide': {
    title: 'Keyword Clustering: Group Keywords for Maximum SEO Impact',
    description: 'What keyword clustering is, why it prevents cannibalization, and how to group keywords into topic clusters. Free and paid tool recommendations included.',
    keywords: ['keyword clustering', 'topic clusters seo', 'keyword grouping', 'keyword cannibalization'],
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
