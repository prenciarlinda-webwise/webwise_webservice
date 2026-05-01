// Site Configuration
export const siteConfig = {
  name: 'Web Wise',
  tagline: 'Professional Web Design & Local SEO Services',
  email: 'info@websiteandseoagency.com',
  phone: '+355685121313',
  whatsapp: '355685121313', // Without + for wa.me URL
  url: 'https://www.websiteandseoagency.com',
  logo: '/portfolio/web-wise-logo.png',
  description: 'We help local businesses in the UK and USA grow with professional web design and SEO services. Plumbers, roofers, contractors, and more trust us for results.',
}

// WhatsApp URL helper
export const getWhatsAppUrl = (message?: string) => {
  const baseUrl = `https://wa.me/${siteConfig.whatsapp}`
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`
  }
  return baseUrl
}

// Default WhatsApp message for CTAs
export const defaultWhatsAppMessage = "Hi, I'm interested in your SEO and web design services. I'd like to get a free consultation."

// Services Data
export const services = {
  seo: {
    title: 'SEO Services',
    slug: 'seo',
    icon: 'Search',
    description: 'Dominate search results with data-driven SEO strategies that deliver measurable growth.',
    subservices: {
      'local-seo': {
        title: 'Local SEO',
        slug: 'local-seo',
        icon: 'MapPin',
        description: 'Dominate your local market and attract nearby customers actively searching for your services.',
      },
      'international-seo': {
        title: 'International SEO',
        slug: 'international-seo',
        icon: 'Globe',
        description: 'Expand your reach globally with multi-language and multi-regional SEO strategies.',
      },
      'technical-seo': {
        title: 'Technical SEO',
        slug: 'technical-seo',
        icon: 'Code',
        description: 'Optimize your site architecture, speed, and crawlability for maximum search visibility.',
      },
      'ecommerce-seo': {
        title: 'E-commerce SEO',
        slug: 'ecommerce-seo',
        icon: 'ShoppingCart',
        description: 'Drive qualified traffic and boost sales with specialized e-commerce optimization.',
      },
    },
  },
  'web-development': {
    title: 'Web Development',
    slug: 'web-development',
    icon: 'Code',
    description: 'Custom websites and web applications built with cutting-edge technologies.',
    subservices: {
      'website-design': {
        title: 'Website Design & Development',
        slug: 'website-design',
        icon: 'PenTool',
        description: 'Beautiful, responsive websites that convert visitors into customers.',
      },
      'web-applications': {
        title: 'Web Applications',
        slug: 'web-applications',
        icon: 'Layers',
        description: 'Powerful web applications built with Django, Python, Vue.js, and React.',
      },
      'ecommerce-development': {
        title: 'E-commerce Development',
        slug: 'ecommerce-development',
        icon: 'ShoppingCart',
        description: 'Scalable online stores with seamless checkout experiences.',
      },
    },
  },
  'digital-marketing': {
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    icon: 'TrendingUp',
    description: 'Comprehensive digital marketing strategies that drive growth and ROI.',
    subservices: {
      'content-marketing': {
        title: 'Content Marketing',
        slug: 'content-marketing',
        icon: 'FileText',
        description: 'Strategic content that attracts, engages, and converts your target audience.',
      },
      'ppc-advertising': {
        title: 'PPC Advertising',
        slug: 'ppc-advertising',
        icon: 'Target',
        description: 'Maximize ROI with targeted pay-per-click campaigns on Google and social platforms.',
      },
      'social-media': {
        title: 'Social Media Marketing',
        slug: 'social-media',
        icon: 'Share2',
        description: 'Build brand awareness and engagement across all major social platforms.',
      },
      analytics: {
        title: 'Analytics & Reporting',
        slug: 'analytics',
        icon: 'BarChart',
        description: 'Data-driven insights and comprehensive reporting to measure success.',
      },
    },
  },
}

// Helper function to generate screenshot URL
// Using WordPress mshots for free website screenshots
const getScreenshot = (url: string) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=600`

// Client type definition
export interface KeywordRanking {
  keyword: string
  serp?: number
  localPack?: number
  mapsPack?: number
  aiOverview?: 'cited' | 'suggestion' | string
  note?: string
}

export interface RankingScreenshot {
  src: string
  alt: string
  caption?: string
}

export interface CaseStudyTimelineStep {
  step: string
  title: string
  desc: string
}

export interface CaseStudyTestimonial {
  quote: string
  author: string
  role?: string
}

export interface Client {
  name: string
  slug: string
  url: string
  image: string
  industry: string
  services: string[]
  description: string
  results?: {
    trafficIncrease: string
    leadsIncrease: string
    rankingKeywords: string
  }
  keywordRankings?: KeywordRanking[]
  rankingScreenshots?: RankingScreenshot[]
  challenge?: string
  solution?: string
  timelineSteps?: CaseStudyTimelineStep[]
  testimonial?: CaseStudyTestimonial
  nofollow?: boolean
}

// Clients/Portfolio Data
export const clients: Record<string, Client> = {
  msccertification: {
    name: 'MSC Certification',
    slug: 'msc-certification-web-application-development',
    url: 'https://www.msc-cert.com',
    image: getScreenshot('https://www.msc-cert.com'),
    industry: 'Certification & Training',
    services: ['Web Application', 'Website Design', 'Dashboard Development'],
    description: 'Custom-built certification management platform featuring a professional public website, secure admin dashboard for managing clients and certificates, dynamic certificate template builder, and automated QR code generation for instant verification.',
    results: {
      trafficIncrease: '250%',
      leadsIncrease: '180%',
      rankingKeywords: '35+',
    },
  },
  illyriangroupcorp: {
    name: 'Illyrian Group Corp',
    slug: 'illyrian-group-plumbing-seo-web-development',
    url: 'https://www.illyrianplumber.com',
    image: getScreenshot('https://www.illyrianplumber.com'),
    industry: 'Plumbing',
    services: ['Local SEO', 'Website Design', 'Brand Strategy'],
    description: 'Local SEO and a brand-new high-performance website for this East Brunswick, NJ plumbing company. Today, Illyrian Plumber ranks #1 organic on Google for "PEX repiping NJ", "whole house repiping NJ", and "gas appliance hookup NJ" - five-figure jobs that competitors used to win. The site is cited directly inside Google AI Overviews, ChatGPT, and Perplexity, and Search Console shows a +553% jump in impressions over the last 90 days. From a near-zero starting point to dominating the highest-value plumbing searches in Middlesex County, all without paying per-lead platforms.',
    results: {
      trafficIncrease: '+553%',
      leadsIncrease: '245%',
      rankingKeywords: '20+',
    },
    keywordRankings: [
      {
        keyword: 'PEX repiping NJ',
        serp: 1,
        localPack: 2,
        mapsPack: 2,
        aiOverview: 'suggestion',
        note: 'Suggested in Google AI Overview alongside national chains',
      },
      {
        keyword: 'whole house repiping NJ',
        serp: 1,
        mapsPack: 1,
        aiOverview: 'cited',
        note: 'Cited as Central/Northern NJ specialist in AI Overview',
      },
      {
        keyword: 'gas appliance hookup NJ',
        serp: 1,
        aiOverview: 'cited',
        note: 'Cited as a key NJ provider in AI Overview',
      },
      {
        keyword: 'boiler repair East Brunswick NJ',
        serp: 2,
        note: 'Search Console shows +553% impressions in 90 days for this query cluster',
      },
      {
        keyword: 'gas line repair East Brunswick NJ',
        serp: 2,
      },
      {
        keyword: 'bathroom remodeling plumber East Brunswick',
        serp: 2,
      },
      {
        keyword: '24 hour plumber East Brunswick NJ',
        serp: 3,
      },
      {
        keyword: 'water heater repair East Brunswick NJ',
        serp: 3,
      },
      {
        keyword: 'emergency plumber cost East Brunswick',
        serp: 8,
        mapsPack: 13,
        aiOverview: 'suggestion',
        note: 'Suggested in AI Overview emergency plumber list',
      },
      {
        keyword: 'plumber East Brunswick NJ',
        serp: 14,
      },
      {
        keyword: 'gas leak repair NJ',
        serp: 23,
      },
    ],
    challenge: `Illyrian came to us as a newer plumbing business in one of the most saturated local markets in the country. Middlesex County, NJ is dominated by long-established competitors with thousands of reviews (NJ Pipe Doctor, Roto-Rooter, RA Nichols), national chains buying every paid slot, and Yelp/HomeAdvisor directories occupying the rest of page one.

The existing online presence was effectively invisible: no consistent rankings, no Google Business Profile authority, almost no Search Console impressions, and a website that wasn't built to convert the high-value repiping and gas-line work the business actually wants. Every emergency call that should have been theirs was being intercepted by competitors with bigger ad budgets and older domains.`,
    solution: `We rebuilt the foundation, then attacked the most profitable searches first.

Phase 1 - Technical foundation: A new Next.js website built for speed and intent, hitting 98/100 PageSpeed on mobile and desktop. Schema, internal linking, and dedicated service pages for each money keyword (repiping, gas line, water heater, boiler, emergency plumbing).

Phase 2 - Local authority: Full Google Business Profile rebuild, NAP consistency across 20+ directories, weekly GBP posts, structured review generation. Anchored in East Brunswick and surrounding municipalities (Old Bridge, South River, North Brunswick).

Phase 3 - Money-keyword focus: Instead of chasing every plumbing term, we targeted the searches with the highest job value first - PEX repiping, whole house repiping, gas appliance hookup. These are five-figure projects, and most competitors weren't optimizing for them.

Phase 4 - AI-first content: Long-form, structured service pages designed to be cited by Google AI Overviews, ChatGPT, and Perplexity. Today, Illyrian is named directly inside the AI Overview for multiple high-value NJ searches - a moat most plumbing competitors haven't even started building.`,
    timelineSteps: [
      { step: '1', title: 'Month 1', desc: 'New website launched at 98/100 PageSpeed. GBP rebuilt. Schema, internal linking, and dedicated service pages live.' },
      { step: '2', title: 'Month 2', desc: 'First Map Pack appearances for emergency plumber terms across East Brunswick, Old Bridge, South River, North Brunswick.' },
      { step: '3', title: 'Months 3-4', desc: 'Money-keyword wins: #1 organic for "whole house repiping NJ", #1 organic and #2 local pack for "PEX repiping NJ".' },
      { step: '4', title: 'Now', desc: 'Cited inside Google AI Overviews + ChatGPT + Perplexity for multiple NJ plumbing searches. Search Console shows +553% impressions in 90 days.' },
    ],
    testimonial: {
      quote: "Web Wise rebuilt our website and our SEO from the ground up. We're now ranking #1 on Google for the jobs that actually pay - whole house repiping, PEX, gas line work. Our phone rings with the right kind of calls now, and we're the only plumber in our area being recommended by Google's AI directly. Worth every dollar.",
      author: 'Illyrian Plumber',
      role: 'Owner',
    },
    rankingScreenshots: [
      {
        src: '/case-studies/illyrian-plumber/pex-repiping-nj-serp.png',
        alt: 'Illyrian Plumber ranking #1 organic on Google for PEX repiping NJ',
        caption: '"PEX repiping NJ" — Illyrian Plumber owns the #1 organic result on Google.',
      },
      {
        src: '/case-studies/illyrian-plumber/pex-repiping-nj-local-pack.png',
        alt: 'Illyrian Plumber ranking #2 in the local pack for PEX repiping NJ',
        caption: '"PEX repiping NJ" — #2 in the local 3-pack, beating most established NJ plumbers.',
      },
      {
        src: '/case-studies/illyrian-plumber/pex-repiping-nj-maps.png',
        alt: 'Illyrian Plumber ranking in the top 4 of Google Maps for PEX repiping NJ',
        caption: '"PEX repiping NJ" — top-of-list visibility in Google Maps.',
      },
      {
        src: '/case-studies/illyrian-plumber/pex-repiping-nj-ai-overview.png',
        alt: 'Illyrian Plumber cited in Google AI Overview for PEX repiping NJ',
        caption: '"PEX repiping NJ" — Illyrian is one of the few NJ providers Google AI Overview recommends.',
      },
      {
        src: '/case-studies/illyrian-plumber/whole-house-repiping-nj-serp.png',
        alt: 'Illyrian Plumber ranking #1 organic for whole house repiping NJ',
        caption: '"Whole house repiping NJ" — #1 organic result, right under the AI Overview.',
      },
      {
        src: '/case-studies/illyrian-plumber/whole-house-repiping-nj-ai-overview.png',
        alt: 'Illyrian Plumber cited as a NJ specialist in Google AI Overview for whole house repiping',
        caption: '"Whole house repiping NJ" — Illyrian named in Google AI Overview as a Central/Northern NJ specialist.',
      },
      {
        src: '/case-studies/illyrian-plumber/whole-house-repiping-nj-maps.png',
        alt: 'Illyrian Plumber visible in Google Maps for whole house repiping NJ',
        caption: '"Whole house repiping NJ" — top-of-list visibility in Google Maps.',
      },
      {
        src: '/case-studies/illyrian-plumber/gas-appliance-hookup-nj-ai-overview.png',
        alt: 'Illyrian Plumber cited in Google AI Overview for gas appliance hookup NJ',
        caption: '"Gas appliance hookup NJ" — Illyrian named as a key NJ provider in the AI Overview.',
      },
      {
        src: '/case-studies/illyrian-plumber/24-hour-plumber-east-brunswick-nj-serp.png',
        alt: 'Illyrian Plumber ranking on page 1 for 24 hour plumber East Brunswick NJ',
        caption: '"24 hour plumber East Brunswick NJ" — page-1 visibility for high-intent emergency searches.',
      },
      {
        src: '/case-studies/illyrian-plumber/boiler-repair-east-brunswick-nj-serp.png',
        alt: 'Illyrian Plumber ranking #2 for boiler repair East Brunswick NJ',
        caption: '"Boiler repair East Brunswick NJ" — Illyrian sits #2 organic, with Search Console showing +553% impressions in 90 days.',
      },
      {
        src: '/case-studies/illyrian-plumber/gas-line-repair-east-brunswick-nj-serp.png',
        alt: 'Illyrian Plumber ranking #2 for gas line repair East Brunswick NJ',
        caption: '"Gas line repair East Brunswick NJ" — #2 organic, beating directories and HVAC competitors.',
      },
      {
        src: '/case-studies/illyrian-plumber/water-heater-repair-east-brunswick-nj-serp.png',
        alt: 'Illyrian Plumber ranking #3 for water heater repair East Brunswick NJ',
        caption: '"Water heater repair East Brunswick NJ" — Illyrian on page 1 alongside Yelp directories.',
      },
    ],
  },
  gimosroofing: {
    name: "Gimo's Roofing",
    slug: 'gimos-roofing-local-seo-website-design',
    url: 'https://www.gimosroofing.com',
    image: getScreenshot('https://www.gimosroofing.com'),
    industry: 'Roofing',
    services: ['Local SEO', 'Website Design', 'Google Ads'],
    description: 'Full-service roofing company specializing in residential and commercial roof installation, repair, and maintenance. Built a lead-generating website with service area pages, project galleries, and integrated quote request system to capture local customers.',
    results: {
      trafficIncrease: '380%',
      leadsIncrease: '295%',
      rankingKeywords: '52+',
    },
  },
  albrosdetailing: {
    name: 'Albros Premium Detailing',
    slug: 'albros-premium-detailing-seo-website-design',
    url: 'https://www.albrosdetailing.com',
    image: getScreenshot('https://www.albrosdetailing.com'),
    industry: 'Auto Detailing',
    services: ['Local SEO', 'Website Design'],
    description: 'Premium mobile auto detailing service offering interior and exterior car care, ceramic coating, and paint protection. Designed a sleek, modern website with online booking integration, service packages showcase, and before/after gallery to drive conversions.',
    results: {
      trafficIncrease: '315%',
      leadsIncrease: '260%',
      rankingKeywords: '41+',
    },
  },
  northstarhome: {
    name: 'Northstar Home Improvement',
    slug: 'northstar-home-improvement-seo-website-development',
    url: 'https://www.northstarhome.pro',
    image: getScreenshot('https://www.northstarhome.pro'),
    industry: 'Home Services',
    services: ['Local SEO', 'Website Design', 'PPC'],
    description: 'Comprehensive home improvement and renovation company offering kitchen remodeling, bathroom upgrades, flooring, and general contracting. Built an authority website with project portfolios, financing options integration, and multi-step quote request forms.',
    results: {
      trafficIncrease: '365%',
      leadsIncrease: '285%',
      rankingKeywords: '49+',
    },
  },
  '904dumpster': {
    name: '904 Dumpster',
    slug: '904-dumpster-rental-jacksonville-seo-website',
    url: 'https://www.904dumpster.com',
    image: getScreenshot('https://www.904dumpster.com'),
    industry: 'Waste Management',
    services: ['Local SEO', 'Website Design'],
    description: 'Jacksonville-based dumpster rental company serving residential and commercial customers for construction debris, home cleanouts, and renovation projects. Developed a user-friendly website with instant pricing calculator, online booking system, and service area maps.',
    results: {
      trafficIncrease: '445%',
      leadsIncrease: '350%',
      rankingKeywords: '67+',
    },
  },
  gjejpro: {
    name: 'Gjej Pro',
    slug: 'gjej-pro-marketplace-web-application-seo',
    url: 'https://www.gjejpro.com',
    image: getScreenshot('https://www.gjejpro.com'),
    industry: 'Marketplace Platform',
    services: ['Web Application', 'Marketplace Architecture', 'SEO', 'Content Marketing'],
    description: 'A two-sided marketplace platform connecting Albanian homeowners and businesses with verified local professionals — electricians, plumbers, painters, cleaners, tutors, and 17 more service categories — with a path to UK expansion. Tagline: "Profesionistë për ju" (Professionals for you). We built the full product end-to-end: Django 6 + DRF + PostGIS backend, Next.js 16 (App Router, server components) + Tailwind v4 frontend, JWT auth with rotating refresh tokens, role-guarded dashboards for Admin / Profesionist / Klient, real-time messaging, an end-to-end job-and-quote flow with atomic accept logic, and a fully server-rendered SEO-shaped public site with 100+ indexable URLs across categories, cities, and pros. The platform makes finding the right professional feel as easy as ordering food: transparent prices, real reviews, no hidden commissions.',
    results: {
      trafficIncrease: '580%',
      leadsIncrease: '430%',
      rankingKeywords: '92+',
    },
    challenge: `Gjej Pro needed an entire two-sided marketplace built from zero — not a template skin, an actual production system that could handle the messy reality of local services in Albania.

The job: connect Klients (people who need a leak fixed, a wall painted, an emergency electrician, a tutor for their kid) with Profesionistë (verified tradespeople competing on quotes and reputation), without taking commission, without intermediating payment, and without making either side feel like they were dealing with software.

Specific constraints we had to design around: Albanian-language UX as the primary market with a UK-expansion-ready architecture, 22 distinct service categories with their own taxonomy and routes, 18 cities with per-city SEO landing pages, role-aware navigation for three user types, real-time-feeling messaging without a websocket budget, server-rendered pages so Google could actually index real content (not empty React shells), and a platform that ranks before it has critical mass. None of this exists out of the box.`,
    solution: `We built the entire product end-to-end across backend, frontend, infrastructure, and SEO.

**Backend (Django 6 + DRF + PostgreSQL + PostGIS):** Three-role auth (Admin / Profesionist / Klient) with JWT, rotating refresh tokens, Argon2 password hashing, and email verification. 22-category service catalog with reserved-slug guards. Per-freelancer service CRUD, service areas auto-geocoded to PostGIS center_points, and the core job-and-quote loop with atomic accept logic that rejects all other quotes in a single transaction. 1:1 messaging with idempotent conversation creation. Reviews with server-side avg recompute. A 7-trigger notification system (in-app + email) with per-kind opt-out toggles.

**Frontend (Next.js 16 + React 19 + Tailwind v4):** Server-component-first public site, client-component dashboards. Role-guarded routing, mobile drawer nav, unread badges polling every 30s. Avatar uploads with deterministic-color fallbacks. Per-role profile editors. Public freelancer browse with "Pranë meje" geolocation filtering.

**SEO-shaped public site:** 100+ server-rendered URLs that Google can actually crawl — 22 category landings (/elektricist, /hidraulik, …) flattened from /kategorite/[slug] for shorter URLs, 18 city landings, public freelancer profiles, a Django-backed blog at /blog, auto-generated sitemap.xml, and Albanian-language og: tags + canonical URLs on every page. Indexable real content, not empty React shells.

**Brand & UX:** Black + forest green (#1F4D3A) + warm gold (#C9A961) for verified/featured. Inter + Fraunces. Layered card hero, category scroll-rail, featured pros, stats band, testimonials. Designed to feel as easy as ordering food.`,
    timelineSteps: [
      { step: '1', title: 'Discovery & Architecture', desc: 'Mapped the full marketplace flow — auth, catalog, jobs, quotes, messaging, reviews, notifications. Chose Django + DRF + PostGIS for the backend, Next.js 16 App Router for the frontend.' },
      { step: '2', title: 'Core Loop Built', desc: 'Three-role auth, 22-category catalog with reserved-slug guard, services CRUD, geocoded service areas, end-to-end job-and-quote flow with atomic accept logic.' },
      { step: '3', title: 'Engagement Layer', desc: '1:1 messaging, 5-star reviews with server-side avg recompute, 7-trigger notification system (in-app + email) with per-user opt-out toggles.' },
      { step: '4', title: 'SEO-Shaped Public Site', desc: '100+ server-rendered URLs across categories, cities, and pros. Auto-generated sitemap, Albanian metadata, Django-backed blog, full schema. Indexable content from day one.' },
    ],
  },
  painttechs: {
    name: 'Paint-Techs LLC',
    slug: 'paint-techs-painting-contractor-seo-website-redesign',
    url: 'https://www.paint-techs.com',
    image: getScreenshot('https://www.paint-techs.com'),
    industry: 'Painting Services',
    services: ['SEO', 'Website Redesign'],
    description: 'Professional painting contractor offering residential and commercial painting services. Redesigned their website with a modern look and optimized for search engines to increase visibility and generate more leads.',
    results: {
      trafficIncrease: '320%',
      leadsIncrease: '275%',
      rankingKeywords: '45+',
    },
  },
  sunriseautorent: {
    name: 'Sunrise Auto Rent',
    slug: 'sunrise-auto-rent-car-rental-website-design',
    url: 'https://www.sunriseautorent.com',
    image: getScreenshot('https://www.sunriseautorent.com'),
    industry: 'Car Rental',
    services: ['Website Design'],
    description: 'Car rental service offering a wide range of vehicles for tourists and locals. Built a user-friendly website with vehicle catalog, online booking system, and pricing calculator.',
    nofollow: true,
  },
  knflooring: {
    name: 'KN Flooring LLC',
    slug: 'kn-flooring-contractor-website-design',
    url: 'https://www.knflooringllc.com',
    image: getScreenshot('https://www.knflooringllc.com'),
    industry: 'Flooring',
    services: ['Website Design'],
    description: 'Professional flooring company specializing in hardwood, laminate, tile, and vinyl flooring installation. Developed a showcase website with project gallery and service area information.',
    nofollow: true,
  },
  kryemadhicarrental: {
    name: 'Kryemadhi Car Rental',
    slug: 'kryemadhi-car-rental-albania-website-design',
    url: 'https://www.kryemadhicarrental.com',
    image: getScreenshot('https://www.kryemadhicarrental.com'),
    industry: 'Car Rental',
    services: ['Website Design'],
    description: 'Car rental service providing quality vehicles for travelers. Created a modern website with fleet showcase, reservation system, and contact integration.',
    nofollow: true,
  },
  gnthomeremodeling: {
    name: 'GNT Home Remodeling',
    slug: 'gnt-home-remodeling-contractor-website-design',
    url: 'https://www.gnthomeremodeling.com',
    image: getScreenshot('https://www.gnthomeremodeling.com'),
    industry: 'Home Remodeling',
    services: ['Website Design'],
    description: 'Full-service home remodeling company offering kitchen, bathroom, and whole-home renovations. Built a professional website with project portfolio and quote request functionality.',
    nofollow: true,
  },
  aaaremodels: {
    name: 'AAA Remodels LLC',
    slug: 'aaa-remodels-jacksonville-home-remodeling-seo-website',
    url: 'https://www.aaaremodelsllc.com',
    image: getScreenshot('https://www.aaaremodelsllc.com'),
    industry: 'Home Remodeling',
    services: ['Local SEO', 'Website Design'],
    description: 'Jacksonville-based home remodeling company specializing in kitchen and bathroom renovations, whole-home remodels, and interior/exterior painting. Built a professional website with service showcases, project galleries, and integrated quote request system to capture local customers.',
    results: {
      trafficIncrease: '340%',
      leadsIncrease: '275%',
      rankingKeywords: '48+',
    },
  },
  torragips: {
    name: 'Torra Gips',
    slug: 'torra-gips-construction-company-website-design',
    url: 'https://www.torragips.com/sq/',
    image: getScreenshot('https://www.torragips.com/sq/'),
    industry: 'Construction',
    services: ['Website Design'],
    description: 'Albanian construction and gypsum services company specializing in interior finishing, drywall installation, and decorative plasterwork. Built a bilingual website showcasing their project portfolio, service offerings, and contact system to reach residential and commercial clients across Albania.',
  },
}

// Industries we serve (for case studies and local-seo pages)
export interface Industry {
  name: string
  slug: string
  localSeoUrl: string
}

export const industries: Industry[] = [
  { name: 'Plumbing', slug: 'plumbing', localSeoUrl: '/local-seo/plumbers' },
  { name: 'Roofing', slug: 'roofing', localSeoUrl: '/local-seo/roofing' },
  { name: 'Auto Detailing', slug: 'auto-detailing', localSeoUrl: '/local-seo/auto-detailing' },
  { name: 'HVAC', slug: 'hvac', localSeoUrl: '/local-seo/hvac' },
  { name: 'Electricians', slug: 'electricians', localSeoUrl: '/local-seo/electricians' },
  { name: 'Construction', slug: 'construction', localSeoUrl: '/local-seo/construction' },
  { name: 'Home Remodeling', slug: 'home-remodeling', localSeoUrl: '/local-seo/construction' },
  { name: 'Home Services', slug: 'home-services', localSeoUrl: '/local-seo/construction' },
  { name: 'Waste Management', slug: 'waste-management', localSeoUrl: '/local-seo/dumpster-rental' },
  { name: 'Landscaping', slug: 'landscaping', localSeoUrl: '/local-seo/landscaping' },
  { name: 'Pest Control', slug: 'pest-control', localSeoUrl: '/local-seo/pest-control' },
  { name: 'Cleaning', slug: 'cleaning', localSeoUrl: '/local-seo/cleaning' },
  { name: 'Moving', slug: 'moving', localSeoUrl: '/local-seo/moving' },
  { name: 'Locksmiths', slug: 'locksmiths', localSeoUrl: '/local-seo/locksmiths' },
]

// Get industry by name (for matching client industries)
export const getIndustryByName = (name: string): Industry | undefined => {
  return industries.find(i => i.name.toLowerCase() === name.toLowerCase())
}

// Get clients by industry
export const getClientsByIndustry = (industryName: string): Client[] => {
  return Object.values(clients).filter(c => c.industry.toLowerCase() === industryName.toLowerCase())
}

// Get unique industries from clients (for case studies page)
export const getUniqueClientIndustries = (): string[] => {
  const industrySet = new Set(Object.values(clients).map(c => c.industry))
  return Array.from(industrySet)
}

// Industries that have dedicated local-seo pages (for nav menu)
export const getIndustriesWithPages = (): Industry[] => {
  const pagesExist = [
    'plumbing', 'roofing', 'auto-detailing', 'hvac', 'electricians',
    'construction', 'waste-management', 'landscaping', 'pest-control',
    'cleaning', 'moving', 'locksmiths'
  ]
  return industries.filter(i => pagesExist.includes(i.slug))
}

// Case study short slug mapping (for nav dropdown)
const caseStudyShortSlugs: Record<string, string> = {
  'illyrian-group-plumbing-seo-web-development': 'illyrian-group',
  'gimos-roofing-local-seo-website-design': 'gimos-roofing',
  'albros-premium-detailing-seo-website-design': 'albros-detailing',
  'northstar-home-improvement-seo-website-development': 'northstar',
  '904-dumpster-rental-jacksonville-seo-website': '904-dumpster',
  'gjej-pro-marketplace-web-application-seo': 'gjej-pro',
  'paint-techs-painting-contractor-seo-website-redesign': 'paint-techs',
  'msc-certification-web-application-development': 'msc-certification',
  'aaa-remodels-jacksonville-home-remodeling-seo-website': 'aaa-remodels',
}

// Get featured case studies for nav dropdown (clients with results/SEO work)
export const getFeaturedCaseStudies = () => {
  return Object.values(clients)
    .filter(c => c.results && caseStudyShortSlugs[c.slug])
    .map(c => ({
      name: c.name,
      industry: c.industry,
      url: `/case-studies/${caseStudyShortSlugs[c.slug]}`,
      trafficIncrease: c.results!.trafficIncrease,
    }))
}

// Navigation
export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/seo-services', hasDropdown: true },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
]

// Tech Stack
export const techStack = {
  backend: ['Python', 'Django', 'PHP', 'Laravel', 'Node.js'],
  frontend: ['Vue.js', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  infrastructure: ['Docker', 'AWS', 'PostgreSQL', 'Redis', 'Git'],
}
