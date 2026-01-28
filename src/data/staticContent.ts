// Rich content for static pages (About, Pricing)
// Follows content rules: 40-60 word answers, question-based H2s, E-E-A-T signals

export interface StaticPageContent {
  hero: {
    headline: string
    subheadline: string
    valueProposition: string
  }
  definition: {
    question: string
    answer: string // 40-60 words for featured snippets
    expansion: string
  }
  sections: ContentSection[]
  cta: {
    headline: string
    description: string
    buttonText: string
  }
}

export interface ContentSection {
  id: string
  badge?: string
  title: string
  subtitle?: string
  content?: string | string[]
  items?: SectionItem[]
  layout?: 'grid' | 'list' | 'cards' | 'two-column'
}

export interface SectionItem {
  title: string
  description: string
  icon?: string
  highlight?: boolean
}

// ============================================
// ABOUT PAGE CONTENT
// ============================================

export const aboutContent: StaticPageContent = {
  hero: {
    headline: "We're WebWise",
    subheadline: "Your Partner in Digital Growth",
    valueProposition: "A team of passionate digital experts dedicated to helping local service businesses thrive online through high-performance websites and data-driven SEO strategies that deliver measurable results.",
  },

  definition: {
    question: "Who Is WebWise?",
    // 40-60 word direct answer optimized for featured snippets
    answer: "WebWise is a digital marketing agency specializing in SEO and web development for local service businesses in the USA and UK. We help plumbers, roofers, HVAC contractors, and electricians dominate local search results with custom websites, Google Business Profile optimization, and proven SEO strategies that generate real leads.",
    expansion: "Founded by experienced digital marketers and web developers, WebWise combines technical expertise with a deep understanding of how local customers search for services online. We've helped over 50 businesses achieve an average 340% increase in organic traffic through our systematic approach to local SEO and conversion-focused web design.",
  },

  sections: [
    {
      id: 'mission',
      badge: 'Our Mission',
      title: 'Empowering Local Businesses Through Digital Excellence',
      content: [
        "At WebWise, we believe every local service business deserves a powerful online presence that generates consistent leads without the confusion and wasted money that often comes with digital marketing.",
        "Our mission is to deliver transparent, results-driven digital solutions tailored to the unique needs of contractors, tradespeople, and local service providers. We cut through the noise and focus on what actually works: getting your business found by customers ready to hire.",
        "Unlike large agencies that treat small businesses as an afterthought, we specialize exclusively in local service businesses. This focus allows us to develop deep expertise in the specific challenges you face-from seasonal fluctuations to managing reviews to competing against larger companies with bigger budgets.",
      ],
    },
    {
      id: 'values',
      badge: 'Our Values',
      title: 'What We Stand For',
      layout: 'grid',
      items: [
        {
          title: 'Transparency First',
          description: "No black-box tactics or confusing reports. You'll always know exactly what we're doing, why we're doing it, and how it's working. Our client dashboard shows real-time progress on every deliverable.",
          icon: 'Target',
        },
        {
          title: 'Results Over Promises',
          description: "We don't sell dreams-we deliver data. Every strategy is measured against clear KPIs: traffic growth, lead generation, and ROI. If something isn't working, we pivot fast.",
          icon: 'TrendingUp',
        },
        {
          title: 'Long-Term Partnerships',
          description: "We're not interested in quick wins that fade. Our clients stay with us for years because we continuously improve their results. Your success is our success.",
          icon: 'Users',
        },
        {
          title: 'Honest Communication',
          description: "If we think something won't work for your business, we'll tell you-even if it means losing a sale. We'd rather earn your trust than take your money for services you don't need.",
          icon: 'Shield',
        },
      ],
    },
    {
      id: 'expertise',
      badge: 'Our Expertise',
      title: 'What Makes Us Different',
      subtitle: "Years of specialized experience in local service business marketing",
      layout: 'two-column',
      content: [
        "Most agencies are generalists-they work with anyone who will pay. We're specialists. Our entire business is built around helping local service businesses succeed online. This laser focus means we understand your industry, your customers, and your competition better than any generalist agency ever could.",
        "Our team includes certified Google Ads specialists, technical SEO experts who've worked on enterprise-level migrations, and web developers who build sites that load in under 2 seconds. We combine this technical firepower with genuine business strategy-understanding that rankings mean nothing if they don't translate to phone calls and booked jobs.",
      ],
      items: [
        {
          title: 'Local SEO Specialists',
          description: "We've optimized hundreds of Google Business Profiles and know exactly what it takes to rank in the local 3-pack for competitive service keywords.",
        },
        {
          title: 'Conversion-Focused Design',
          description: "Every website we build is designed with one goal: turning visitors into leads. We test headlines, CTAs, and layouts to maximize your conversion rate.",
        },
        {
          title: 'Technical Excellence',
          description: "Our sites score 90+ on Core Web Vitals because we build with Next.js and modern performance practices. Speed matters for both SEO and user experience.",
        },
        {
          title: 'Industry Knowledge',
          description: "We understand the seasonal patterns of roofing, the emergency nature of plumbing, and the competitive landscape of HVAC. This context informs every strategy.",
        },
      ],
    },
    {
      id: 'process',
      badge: 'Our Process',
      title: 'How We Work With Clients',
      subtitle: "A proven methodology refined over 50+ successful projects",
      layout: 'list',
      items: [
        {
          title: 'Discovery & Audit',
          description: "We start by understanding your business, market, and goals. We audit your current online presence, analyze competitors, and identify the biggest opportunities for growth. You'll receive a detailed report with specific recommendations.",
        },
        {
          title: 'Strategy Development',
          description: "Based on the audit, we create a customized strategy with clear milestones. This isn't a generic template-it's a roadmap designed specifically for your business, your budget, and your timeline.",
        },
        {
          title: 'Implementation',
          description: "We execute the strategy systematically, prioritizing high-impact tasks first. You'll have visibility into everything through your client dashboard, with regular check-ins to ensure alignment.",
        },
        {
          title: 'Measurement & Optimization',
          description: "We track every metric that matters and report on them monthly. More importantly, we use this data to continuously improve. SEO and marketing are never 'done'-they're constantly refined.",
        },
      ],
    },
    {
      id: 'results',
      badge: 'Our Track Record',
      title: 'Results That Speak For Themselves',
      layout: 'grid',
      items: [
        {
          title: '340%',
          description: 'Average organic traffic increase across all SEO clients within 6 months',
          highlight: true,
        },
        {
          title: '50+',
          description: 'Successful projects completed for local service businesses',
          highlight: true,
        },
        {
          title: '92%',
          description: 'Client retention rate-most clients stay for 2+ years',
          highlight: true,
        },
        {
          title: '<2s',
          description: 'Average page load time for websites we build',
          highlight: true,
        },
      ],
    },
    {
      id: 'team',
      badge: 'Our Team',
      title: 'The People Behind WebWise',
      content: [
        "We're a small, senior team by design. You won't be passed off to junior account managers or outsourced overseas. When you work with WebWise, you work directly with experienced professionals who take ownership of your results.",
        "Our team includes strategists who've managed six-figure ad budgets, developers who've built platforms serving millions of users, and SEO specialists who've recovered sites from Google penalties. We bring enterprise-level expertise to small business budgets.",
      ],
    },
  ],

  cta: {
    headline: "Ready to Grow Your Business?",
    description: "Let's discuss how we can help your local service business dominate search results and generate more leads. Free consultation, no obligation.",
    buttonText: "Get Your Free Consultation",
  },
}

// ============================================
// PRICING PAGE CONTENT
// ============================================

export const pricingContent: StaticPageContent = {
  hero: {
    headline: "Transparent Pricing",
    subheadline: "No Hidden Fees. Clear Expectations. Real Results.",
    valueProposition: "Know exactly what you're paying for and what you'll get. Our pricing is designed for local service businesses with clear 3-month roadmaps so you can track progress and ROI.",
  },

  definition: {
    question: "How Much Does SEO Cost for Small Business?",
    // 40-60 word direct answer optimized for featured snippets
    answer: "Professional SEO services for small businesses typically cost $480-$1,100 per month depending on competition and goals. At WebWise, our SEO packages include a comprehensive audit in month one, Google Business Profile optimization, keyword targeting, content creation, and monthly reporting. Most local service businesses see positive ROI within 3-4 months of consistent SEO work.",
    expansion: "SEO pricing varies based on your market's competitiveness, the number of service areas you target, and how aggressive you want to be. A plumber in a small town needs less investment than an HVAC company competing in a major metro. During your free consultation, we'll analyze your specific situation and recommend the right package.",
  },

  sections: [
    {
      id: 'website-cost',
      badge: 'Web Development',
      title: 'How Much Does a Business Website Cost?',
      subtitle: "A 40-60 word answer for featured snippets",
      content: [
        "A professional small business website costs $1,500-$5,000 depending on complexity and features. Our standard package at $1,500 includes responsive design, SEO optimization, contact forms, and Google Analytics setup. Custom e-commerce stores start at $3,500. All our websites are built for speed and conversions.",
        "Unlike template-based services that charge monthly fees, we build custom websites you own outright. There's no monthly 'website fee' to WebWise-just hosting costs of $10-50/month depending on your provider. This means better ROI over time compared to $200+/month website rental services.",
      ],
    },
    {
      id: 'value-comparison',
      badge: 'Value',
      title: 'Why Our Pricing Delivers Better ROI',
      layout: 'two-column',
      content: [
        "Many businesses waste money on cheap SEO that doesn't work or expensive agencies that over-promise. Our pricing is designed to hit the sweet spot: professional-grade services at prices that make sense for local businesses.",
      ],
      items: [
        {
          title: 'No Long-Term Contracts',
          description: "After the initial 3-month period, you're month-to-month. We earn your business every month through results, not contracts.",
        },
        {
          title: 'Everything Included',
          description: "Our prices include all setup, tools, and reporting. No surprise 'platform fees' or 'reporting add-ons' that some agencies use to inflate costs.",
        },
        {
          title: 'Dedicated Attention',
          description: "We limit our client roster so every account gets genuine attention. You're not just another name on a spreadsheet.",
        },
        {
          title: 'Proven ROI',
          description: "Our average client generates $5+ in revenue for every $1 spent on SEO within 6 months. We track this obsessively.",
        },
      ],
    },
    {
      id: 'when-to-invest',
      badge: 'Timing',
      title: 'When Should You Invest in SEO vs. a New Website?',
      layout: 'list',
      items: [
        {
          title: 'Start with a Website If...',
          description: "You don't have a website, your current site is more than 5 years old, your site isn't mobile-friendly, or your site loads slowly (3+ seconds). A poor website will undermine any SEO investment.",
        },
        {
          title: 'Start with SEO If...',
          description: "You have a decent website but no traffic, competitors outrank you in search results, your Google Business Profile is unoptimized, or you're relying entirely on referrals and want to diversify lead sources.",
        },
        {
          title: 'Bundle Both If...',
          description: "You need a new website AND want to grow traffic. Our bundle discount (15% off) makes this the most cost-effective approach. We'll build your site with SEO baked in from day one.",
        },
      ],
    },
    {
      id: 'what-affects-price',
      badge: 'Factors',
      title: 'What Affects SEO Pricing?',
      layout: 'grid',
      items: [
        {
          title: 'Market Competition',
          description: "A roofer in NYC faces more competition than one in a small town. More competitive markets require more aggressive (and expensive) strategies.",
        },
        {
          title: 'Service Areas',
          description: "Targeting one city is simpler than targeting 10. Multi-location or wide service area campaigns require more content and optimization work.",
        },
        {
          title: 'Starting Point',
          description: "A brand new website needs more foundational work than an established site. We'll assess where you are and what's needed.",
        },
        {
          title: 'Goals & Timeline',
          description: "Want aggressive growth fast? That requires more investment. Comfortable with steady, sustainable growth? A lower tier works well.",
        },
      ],
    },
    {
      id: 'guarantee',
      badge: 'Our Promise',
      title: 'What We Guarantee',
      content: [
        "We can't guarantee specific rankings (no ethical SEO company can-Google controls the algorithm). But we do guarantee: transparent reporting so you always know what's happening, adherence to Google's guidelines so you're never at risk of penalties, responsive communication within 24 hours, and continuous optimization based on data.",
        "If after 3 months you haven't seen measurable improvement in your online visibility, we'll work with you to diagnose why and adjust the strategy at no additional cost. Our reputation depends on your results.",
      ],
    },
  ],

  cta: {
    headline: "Not Sure Which Package Is Right?",
    description: "Every business is different. Let's discuss your specific situation, goals, and budget to find the perfect fit. No pressure, no obligation.",
    buttonText: "Get Your Free Consultation",
  },
}

// Helper function to get content by page
export function getStaticContent(page: 'about' | 'pricing'): StaticPageContent {
  const contentMap = {
    about: aboutContent,
    pricing: pricingContent,
  }
  return contentMap[page]
}
