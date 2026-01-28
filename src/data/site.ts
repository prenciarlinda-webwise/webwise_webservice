// Site Configuration
export const siteConfig = {
  name: 'WebWise',
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
    industry: 'Construction & Plumbing',
    services: ['SEO', 'Web Development', 'Brand Strategy'],
    description: 'Multi-service business group offering professional construction and plumbing services. We developed their main corporate website showcasing their full range of services, along with dedicated websites for their construction division and Illyrian Plumber subsidiary.',
    results: {
      trafficIncrease: '290%',
      leadsIncrease: '245%',
      rankingKeywords: '38+',
    },
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
    industry: 'Professional Services',
    services: ['Web Application', 'SEO', 'Content Marketing'],
    description: 'Professional service marketplace connecting customers with verified local service providers. Built a full-featured web application with provider profiles, booking system, review management, and admin dashboard for platform management.',
    results: {
      trafficIncrease: '580%',
      leadsIncrease: '430%',
      rankingKeywords: '92+',
    },
  },
  painttechs: {
    name: 'Paint-Techs LLC',
    slug: 'paint-techs-painting-contractor-seo-website-redesign',
    url: 'https://www.paint-techs.us',
    image: getScreenshot('https://www.paint-techs.us'),
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
  elitaxidurres: {
    name: 'Eli Taxi Durres',
    slug: 'eli-taxi-durres-albania-website-design',
    url: 'https://www.eli-taxidurres.com',
    image: getScreenshot('https://www.eli-taxidurres.com'),
    industry: 'Transportation',
    services: ['Website Design'],
    description: 'Taxi and transfer service operating in Durres, Albania. Developed a clean website with service information, pricing, and easy booking options for tourists and locals.',
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
}

// Navigation
export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services', hasDropdown: true },
  { name: 'Portfolio', href: '/portfolio' },
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
