// Rich Content Data for Service Pages
// Following SEO best practices: 40-60 word answers, question-based H2s, detailed processes

export interface ProcessStep {
  title: string
  description: string
  details: string[]
  duration?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface CaseStudy {
  clientName: string
  industry: string
  resultHeadline: string
  challenge: string
  solution: string
  results: {
    metric: string
    before: string
    after: string
    change: string
  }[]
  timeline: string
  link?: string
}

export interface AuthorBio {
  teamName: string
  credentials: string[]
  experience: string
  approach: string
}

export interface ServiceContent {
  // Hero Section
  hero: {
    headline: string
    subheadline: string
    valueProposition: string
  }
  // TL;DR Box (Key Takeaways for AI Overviews)
  tldr?: string[]
  // What Is Section (40-60 word answer + expansion)
  definition: {
    question?: string // The H2 question format
    answer: string // 40-60 words - the snippet-optimized answer
    expansion: string // Additional context and details
  }
  // Why You Need This Section
  whyYouNeed: {
    question?: string // H2 in question format
    intro: string
    painPoints: {
      title: string
      description: string
    }[]
    benefits: {
      title: string
      description: string
    }[]
  }
  // Process Section (for HowTo Schema)
  process: {
    question?: string // H2 in question format
    intro: string
    steps: ProcessStep[]
    timeline: string
    deliverables: string[]
  }
  // Packages/Pricing Overview
  packages?: {
    question: string
    intro: string
    tiers: {
      name: string
      price: string
      description: string
      features: string[]
      bestFor: string
    }[]
    pricingLink?: string
  }
  // Industries/Use Cases
  industries: {
    question?: string // H2 in question format
    intro: string
    list: {
      name: string
      description: string
      link?: string
    }[]
  }
  // Case Studies Section
  caseStudies?: {
    intro: string
    studies: CaseStudy[]
  }
  // Expanded FAQs
  faqs: FAQ[]
  // Author/Team Bio
  authorBio?: AuthorBio
  // CTA Section
  cta: {
    headline: string
    description: string
    buttonText: string
  }
}

// =============================================================================
// MAIN SERVICE: SEO SERVICES
// =============================================================================

export const seoServiceContent: ServiceContent = {
  hero: {
    headline: 'SEO Services That Drive Real Business Growth',
    subheadline: 'Data-Driven Search Engine Optimization for Small Businesses',
    valueProposition: 'Stop losing customers to competitors who rank higher. Our SEO services help local businesses dominate search results, attract qualified leads, and grow revenue predictably. With transparent reporting and proven strategies, we turn your website into your best salesperson.',
  },
  definition: {
    answer: 'SEO services are professional strategies and tactics that improve your website\'s visibility in search engine results pages (SERPs). These services include keyword research, on-page optimization, technical improvements, content creation, and link building-all designed to help your business appear when potential customers search for your products or services online.',
    expansion: 'Unlike paid advertising that stops generating leads the moment you stop paying, SEO builds lasting organic visibility. When done correctly, SEO creates a compounding effect: the longer you invest, the stronger your rankings become, and the more difficult it is for competitors to displace you. For local service businesses like plumbers, roofers, and contractors, SEO is particularly powerful because it captures high-intent customers actively searching for services in their area.',
  },
  whyYouNeed: {
    intro: 'In today\'s digital-first world, 97% of consumers search online before making a purchase decision. If your business isn\'t visible in search results, you\'re invisible to potential customers.',
    painPoints: [
      {
        title: 'Competitors Outranking You',
        description: 'Every day you\'re not on page one, your competitors are capturing customers who should be calling you. These aren\'t just lost leads-they\'re customers actively looking for exactly what you offer.',
      },
      {
        title: 'Inconsistent Lead Flow',
        description: 'Relying on referrals and word-of-mouth creates feast-or-famine cycles. SEO provides predictable, scalable lead generation that grows month over month.',
      },
      {
        title: 'Wasted Marketing Budget',
        description: 'Without proper SEO, your website is like a billboard in the desert. You\'ve invested in a website, but it\'s not working hard enough to bring in new business.',
      },
      {
        title: 'Missing Local Customers',
        description: 'When someone searches "plumber near me" or "roofer in [your city]," are you showing up? If not, you\'re losing the most valuable leads-people ready to buy right now.',
      },
    ],
    benefits: [
      {
        title: '24/7 Lead Generation',
        description: 'Your optimized website works around the clock, capturing leads even while you sleep. Unlike paid ads, these leads don\'t cost extra per click.',
      },
      {
        title: 'Higher Quality Leads',
        description: 'SEO attracts people actively searching for your services. These warm leads convert at 8x the rate of outbound marketing.',
      },
      {
        title: 'Long-Term ROI',
        description: 'SEO compounds over time. While paid ads stop the moment you stop paying, SEO rankings continue delivering leads month after month.',
      },
      {
        title: 'Local Market Dominance',
        description: 'Appear in the Google Map Pack and local search results. For service businesses, this visibility directly translates to phone calls and jobs.',
      },
      {
        title: 'Brand Authority',
        description: 'Ranking on page one builds trust. Customers perceive top-ranking businesses as more credible and established than those buried on page two.',
      },
    ],
  },
  process: {
    intro: 'Our proven SEO process has helped over 50 local businesses achieve page-one rankings. Here\'s exactly how we\'ll improve your search visibility:',
    steps: [
      {
        title: 'Comprehensive SEO Audit',
        description: 'We analyze your current online presence, identify technical issues, evaluate your competition, and uncover quick-win opportunities.',
        details: [
          'Technical website audit (speed, mobile, crawlability)',
          'Keyword gap analysis vs. competitors',
          'Google Business Profile evaluation',
          'Backlink profile assessment',
          'Content audit and recommendations',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Strategy Development',
        description: 'Based on audit findings, we create a customized SEO roadmap prioritized by impact and aligned with your business goals.',
        details: [
          'Target keyword selection (commercial + informational)',
          'Content calendar creation',
          'Technical fix prioritization',
          'Link building strategy',
          'Local SEO action plan',
        ],
        duration: 'Week 2',
      },
      {
        title: 'On-Page Optimization',
        description: 'We optimize your website\'s structure, content, and technical elements to signal relevance to search engines.',
        details: [
          'Title tags and meta descriptions',
          'Header structure (H1, H2, H3)',
          'Internal linking optimization',
          'Schema markup implementation',
          'Image optimization and alt text',
        ],
        duration: 'Weeks 2-4',
      },
      {
        title: 'Content Creation & Optimization',
        description: 'We develop and optimize content that ranks for your target keywords while converting visitors into leads.',
        details: [
          'Service page optimization',
          'Location page creation',
          'Blog content for informational keywords',
          'FAQ sections for featured snippets',
          'Case studies and social proof',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Off-Page SEO & Link Building',
        description: 'We build your website\'s authority through strategic link acquisition and local citation building.',
        details: [
          'Local citation building (NAP consistency)',
          'Industry-relevant directory submissions',
          'Guest posting opportunities',
          'Digital PR and mentions',
          'Review generation strategy',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Monitoring & Optimization',
        description: 'We continuously track performance, identify new opportunities, and refine strategies based on data.',
        details: [
          'Weekly ranking tracking',
          'Monthly performance reports',
          'Quarterly strategy reviews',
          'Algorithm update responses',
          'Competitor monitoring',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'Most clients see initial improvements within 30-60 days, with significant results by month 3-6. SEO is a long-term investment that compounds over time.',
    deliverables: [
      'Comprehensive SEO audit report',
      'Custom strategy roadmap',
      'Monthly performance reports',
      'Keyword ranking dashboard access',
      'Regular strategy calls',
    ],
  },
  industries: {
    intro: 'We specialize in SEO for local service businesses. Our deep industry experience means faster results and strategies proven to work in your market.',
    list: [
      { name: 'Plumbers', description: 'Dominate "plumber near me" searches and emergency plumbing keywords in your service area.', link: '/local-seo/plumbers' },
      { name: 'Roofers', description: 'Rank for high-value roofing keywords and capture storm damage leads.', link: '/local-seo/roofing' },
      { name: 'HVAC Contractors', description: 'Seasonal SEO strategies that keep leads flowing year-round.', link: '/local-seo/hvac' },
      { name: 'Electricians', description: 'Target emergency electrical services and EV charger installation keywords.', link: '/local-seo/electricians' },
      { name: 'Construction Companies', description: 'Rank for commercial and residential construction keywords in competitive markets.', link: '/local-seo/construction' },
      { name: 'Auto Detailers', description: 'Local SEO for mobile and shop-based detailing businesses.', link: '/local-seo/auto-detailing' },
      { name: 'Dumpster Rental', description: 'Capture high-intent rental keywords and beat national competitors locally.', link: '/local-seo/dumpster-rental' },
    ],
  },
  faqs: [
    {
      question: 'How much do SEO services cost?',
      answer: 'Our SEO services range from $480 to $1,100 per month depending on your competition level, goals, and scope of work. Every plan includes a comprehensive SEO audit in the first month. We offer transparent pricing with no hidden fees-view our full pricing breakdown on our pricing page.',
    },
    {
      question: 'How long does SEO take to work?',
      answer: 'Most businesses see initial improvements within 30-60 days, with significant results by month 3-6. Local SEO typically shows faster results than national campaigns. SEO is a long-term investment-the longer you invest, the stronger and more sustainable your results become.',
    },
    {
      question: 'What\'s included in your SEO services?',
      answer: 'Our SEO services include technical audits, on-page optimization, content creation, local SEO (Google Business Profile optimization, citations), link building, and monthly reporting. We customize the mix based on your specific needs and competitive landscape.',
    },
    {
      question: 'Do you guarantee first page rankings?',
      answer: 'We don\'t guarantee specific rankings because no legitimate SEO company can-Google\'s algorithm considers hundreds of factors. What we do guarantee is proven strategies, transparent reporting, and a track record of success. Our average client sees 290%+ traffic increases.',
    },
    {
      question: 'What\'s the difference between SEO and PPC?',
      answer: 'SEO focuses on organic rankings that don\'t cost per click, while PPC (Pay-Per-Click) involves paying for each ad click. SEO takes longer but provides lasting results; PPC delivers immediate traffic but stops when you stop paying. Most businesses benefit from both working together.',
    },
    {
      question: 'Will I own my SEO work if I cancel?',
      answer: 'Yes, absolutely. All on-page optimizations, content we create, and technical improvements stay with your website. We don\'t hold your work hostage. The only thing that stops is ongoing optimization and new content creation.',
    },
    {
      question: 'How do you report on SEO progress?',
      answer: 'We provide monthly reports covering keyword rankings, organic traffic, lead generation, and completed work. You\'ll also have access to a live dashboard showing your rankings. We schedule regular calls to review progress and adjust strategy as needed.',
    },
    {
      question: 'Do I need a new website for SEO to work?',
      answer: 'Not necessarily. We can optimize most existing websites. However, if your site has significant technical issues, poor mobile experience, or is built on an outdated platform, a redesign might provide better ROI. We\'ll assess this during our initial audit.',
    },
    {
      question: 'What makes WebWise different from other SEO agencies?',
      answer: 'We specialize exclusively in local service businesses-plumbers, roofers, contractors. This focus means we understand your market, your customers, and what keywords actually drive revenue. We offer transparent pricing, clear 3-month roadmaps, and a track record of 300%+ traffic increases.',
    },
    {
      question: 'Can I do SEO myself?',
      answer: 'Basic SEO is possible to DIY, but it requires significant time and expertise. Most business owners find that the time spent learning and implementing SEO is better spent on their core business. Professional SEO also provides access to premium tools and strategies that aren\'t cost-effective for individual businesses.',
    },
  ],
  cta: {
    headline: 'Ready to Dominate Local Search?',
    description: 'Get a free SEO audit and see exactly how we can help your business rank higher, attract more customers, and grow predictably.',
    buttonText: 'Get Your Free SEO Audit',
  },
}

// =============================================================================
// SUB-SERVICE: LOCAL SEO
// =============================================================================

export const localSeoContent: ServiceContent = {
  hero: {
    headline: 'Local SEO Services That Put You on the Map',
    subheadline: 'Dominate Google Maps and "Near Me" Searches',
    valueProposition: 'When customers search for services in your area, your business should be the first thing they see. Our local SEO services optimize your Google Business Profile, build local citations, and implement strategies that put you in the coveted Map Pack-where 42% of local searchers click.',
  },
  definition: {
    answer: 'Local SEO services optimize your online presence to attract customers from location-based searches like "plumber near me" or "roofer in [city]." These services include Google Business Profile optimization, local citation building, review management, and location-specific keyword targeting to help your business appear in Google Maps and local search results.',
    expansion: 'Local SEO is particularly crucial for service-area businesses that serve specific geographic regions. Unlike traditional SEO that targets broad keywords, local SEO focuses on capturing customers who are ready to buy-people searching with local intent have a 28% conversion rate, compared to just 7% for non-local searches. The Google Map Pack (the 3 business listings that appear with a map) receives 44% of clicks on local search results pages, making it prime real estate for local businesses.',
  },
  whyYouNeed: {
    intro: '46% of all Google searches have local intent. If you\'re not optimized for local search, you\'re invisible to nearly half of your potential customers.',
    painPoints: [
      {
        title: 'Not Showing Up in the Map Pack',
        description: 'The Google Map Pack captures 44% of clicks on local searches. If you\'re not in those top 3 spots, competitors are getting calls that should be yours.',
      },
      {
        title: 'Inconsistent Business Information',
        description: 'Different addresses, phone numbers, or business names across the web confuse Google and hurt your rankings. This "NAP inconsistency" is a silent ranking killer.',
      },
      {
        title: 'Few or No Reviews',
        description: 'Businesses with 10+ reviews get 3x more clicks than those without. Lack of reviews signals to both Google and customers that you\'re not established.',
      },
      {
        title: 'Losing to National Competitors',
        description: 'Big national brands often dominate search results, but local SEO lets small businesses compete-and win-by signaling strong local relevance.',
      },
    ],
    benefits: [
      {
        title: 'Google Map Pack Visibility',
        description: 'Appear in the top 3 local results with a map, showing your reviews, hours, and direct call button.',
      },
      {
        title: 'High-Intent Traffic',
        description: 'Local searchers are ready to buy. 78% of local mobile searches result in an offline purchase within 24 hours.',
      },
      {
        title: 'Mobile Optimization',
        description: '"Near me" searches have grown 500% in recent years. Local SEO ensures you capture this mobile traffic.',
      },
      {
        title: 'Review Generation',
        description: 'We implement systems that consistently generate positive reviews, building social proof that converts browsers into customers.',
      },
      {
        title: 'Competitive Local Advantage',
        description: 'Most local competitors aren\'t doing SEO well. Proper local optimization lets you leapfrog established businesses.',
      },
    ],
  },
  process: {
    intro: 'Our local SEO process is specifically designed for service-area businesses. Here\'s how we get you into the Map Pack:',
    steps: [
      {
        title: 'Local SEO Audit',
        description: 'We analyze your current local presence, identify issues, and benchmark against local competitors.',
        details: [
          'Google Business Profile audit',
          'Citation audit (NAP consistency check)',
          'Local competitor analysis',
          'Review profile assessment',
          'Local keyword opportunity research',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Google Business Profile Optimization',
        description: 'We fully optimize your GBP-the single most important factor for Map Pack rankings.',
        details: [
          'Complete all profile fields',
          'Select optimal categories',
          'Add services with descriptions',
          'Upload geo-tagged photos',
          'Set up messaging and booking',
        ],
        duration: 'Week 1-2',
      },
      {
        title: 'Citation Building & Cleanup',
        description: 'We build new citations and fix inconsistent listings across the web.',
        details: [
          'Fix NAP inconsistencies',
          'Submit to top 50+ directories',
          'Industry-specific citations',
          'Data aggregator submissions',
          'Ongoing citation monitoring',
        ],
        duration: 'Weeks 2-6',
      },
      {
        title: 'On-Page Local Optimization',
        description: 'We optimize your website to signal local relevance to search engines.',
        details: [
          'Location pages for each service area',
          'Local schema markup',
          'NAP in footer/contact page',
          'Local content creation',
          'Internal linking to location pages',
        ],
        duration: 'Weeks 2-4',
      },
      {
        title: 'Review Generation Strategy',
        description: 'We implement systems to consistently generate authentic customer reviews.',
        details: [
          'Review generation workflow setup',
          'Email/SMS follow-up sequences',
          'Review response strategy',
          'Negative review management',
          'Review widget integration',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Local Link Building',
        description: 'We build locally-relevant backlinks that boost your geographic authority.',
        details: [
          'Local sponsorship opportunities',
          'Chamber of commerce links',
          'Local news and PR',
          'Community involvement links',
          'Local blogger outreach',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'Local SEO typically shows faster results than national SEO. Most clients see Map Pack movement within 2-3 months, with full results by month 4-6.',
    deliverables: [
      'Google Business Profile optimization',
      '50+ citation submissions',
      'Location page creation',
      'Review generation system',
      'Monthly ranking reports',
    ],
  },
  industries: {
    intro: 'Local SEO is essential for any business that serves a specific geographic area. We\'ve helped these industries dominate local search:',
    list: [
      { name: 'Plumbing Companies', description: 'Capture "emergency plumber near me" and service-specific searches.', link: '/local-seo/plumbers' },
      { name: 'Roofing Contractors', description: 'Rank for storm damage, roof repair, and installation keywords.', link: '/local-seo/roofing' },
      { name: 'HVAC Services', description: 'Seasonal optimization for heating and cooling searches.', link: '/local-seo/hvac' },
      { name: 'Electricians', description: 'Target emergency services and growing EV charger keywords.', link: '/local-seo/electricians' },
      { name: 'Landscaping', description: 'Capture lawn care and landscaping searches by season.', link: '/local-seo/landscaping' },
      { name: 'Cleaning Services', description: 'Rank for residential and commercial cleaning keywords.', link: '/local-seo/cleaning' },
    ],
  },
  faqs: [
    {
      question: 'What is local SEO and how is it different from regular SEO?',
      answer: 'Local SEO focuses specifically on ranking for location-based searches like "near me" queries and city-specific keywords. While regular SEO targets broader audiences, local SEO optimizes your Google Business Profile, builds local citations, and targets geographic keywords to attract nearby customers ready to buy.',
    },
    {
      question: 'How do I get my business in the Google Map Pack?',
      answer: 'Getting into the Map Pack requires optimizing your Google Business Profile, building consistent citations, generating reviews, and having a website with local relevance signals. Our local SEO services address all these factors systematically to improve your Map Pack rankings.',
    },
    {
      question: 'How long does local SEO take to show results?',
      answer: 'Local SEO typically shows results faster than traditional SEO. Most businesses see Map Pack improvements within 2-3 months, with significant results by month 4-6. Factors like competition level and your starting point affect the timeline.',
    },
    {
      question: 'What are local citations and why do they matter?',
      answer: 'Citations are online mentions of your business name, address, and phone number (NAP) on directories like Yelp, Yellow Pages, and industry-specific sites. Consistent citations signal to Google that your business is legitimate and established, directly impacting local rankings.',
    },
    {
      question: 'How important are reviews for local SEO?',
      answer: 'Reviews are critical for local SEO. They influence both rankings and click-through rates. Businesses with 10+ reviews appear more trustworthy and typically rank higher. We implement review generation systems that help you consistently earn positive reviews.',
    },
    {
      question: 'Do I need a physical address for local SEO?',
      answer: 'Service-area businesses without a storefront can still do local SEO. Google allows you to hide your address while specifying service areas. We optimize your Google Business Profile for maximum visibility regardless of your business model.',
    },
    {
      question: 'Can I target multiple cities with local SEO?',
      answer: 'Yes, multi-location local SEO is possible. We create location-specific pages, set up proper service areas in your Google Business Profile, and build citations that establish relevance in each target city. Additional cities typically require expanded service scope.',
    },
    {
      question: 'What\'s the difference between local SEO and Google Ads?',
      answer: 'Local SEO builds organic visibility that doesn\'t cost per click, while Google Ads requires payment for each click. Local SEO provides long-term results that compound over time, while ads provide immediate but temporary traffic. Most businesses benefit from both.',
    },
  ],
  cta: {
    headline: 'Ready to Dominate Your Local Market?',
    description: 'Get a free local SEO audit and see exactly how you can outrank competitors and capture more local customers.',
    buttonText: 'Get Your Free Local SEO Audit',
  },
}

// =============================================================================
// SUB-SERVICE: TECHNICAL SEO
// =============================================================================

export const technicalSeoContent: ServiceContent = {
  hero: {
    headline: 'Technical SEO That Builds a Foundation for Growth',
    subheadline: 'Fix What\'s Holding Your Rankings Back',
    valueProposition: 'The best content in the world won\'t rank if Google can\'t properly crawl and index your website. Our technical SEO services identify and fix the hidden issues that sabotage your rankings-from site speed to mobile usability to crawl errors.',
  },
  definition: {
    answer: 'Technical SEO services optimize your website\'s infrastructure so search engines can efficiently crawl, index, and rank your pages. This includes improving site speed, fixing crawl errors, implementing proper URL structures, ensuring mobile responsiveness, and adding structured data markup that helps Google understand and display your content.',
    expansion: 'Think of technical SEO as the foundation of a house. You can have beautiful furniture (content) and great curb appeal (design), but if the foundation is cracked, the house won\'t stand. Technical issues like slow loading times, broken links, duplicate content, and poor mobile experience directly hurt your rankings. Google\'s Core Web Vitals update made technical performance a direct ranking factor, making technical SEO more important than ever.',
  },
  whyYouNeed: {
    intro: 'Google\'s crawlers visit billions of pages. Technical issues signal that your site isn\'t worth their time, causing them to crawl less frequently and rank you lower.',
    painPoints: [
      {
        title: 'Slow Loading Speed',
        description: '53% of mobile users abandon sites that take longer than 3 seconds to load. Google also uses page speed as a ranking factor. A slow site hurts both rankings and conversions.',
      },
      {
        title: 'Crawl Errors and Broken Links',
        description: 'When Google encounters errors, it wastes crawl budget on broken pages instead of your valuable content. Too many errors signal a poorly maintained site.',
      },
      {
        title: 'Poor Mobile Experience',
        description: 'Google uses mobile-first indexing, meaning it primarily uses your mobile site for rankings. A site that\'s not mobile-friendly will struggle to rank.',
      },
      {
        title: 'Duplicate Content Issues',
        description: 'Duplicate content confuses search engines about which page to rank. This dilutes your ranking power across multiple pages instead of consolidating it.',
      },
    ],
    benefits: [
      {
        title: 'Faster Load Times',
        description: 'Improved site speed benefits both rankings and user experience. Every second of improvement increases conversions by 7%.',
      },
      {
        title: 'Better Crawl Efficiency',
        description: 'Clean technical structure helps Google discover and index all your important pages quickly.',
      },
      {
        title: 'Mobile-First Ready',
        description: 'Full mobile optimization ensures you perform well in Google\'s mobile-first index.',
      },
      {
        title: 'Rich Search Results',
        description: 'Schema markup enables rich snippets-stars, prices, FAQs-that increase click-through rates.',
      },
      {
        title: 'Future-Proof Foundation',
        description: 'Proper technical setup makes future SEO efforts more effective and prevents issues from compounding.',
      },
    ],
  },
  process: {
    intro: 'Our technical SEO process systematically identifies and fixes issues holding back your rankings:',
    steps: [
      {
        title: 'Technical SEO Audit',
        description: 'We crawl your site using professional tools to identify every technical issue affecting your rankings.',
        details: [
          'Full site crawl (Screaming Frog, Sitebulb)',
          'Core Web Vitals analysis',
          'Mobile usability testing',
          'Indexation analysis (Google Search Console)',
          'JavaScript rendering check',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Prioritization & Roadmap',
        description: 'We prioritize issues by impact and create a clear implementation roadmap.',
        details: [
          'Critical issues (blocking rankings)',
          'High-impact quick wins',
          'Medium-term improvements',
          'Long-term optimizations',
          'Developer-ready documentation',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Site Speed Optimization',
        description: 'We implement optimizations that dramatically improve loading times.',
        details: [
          'Image compression and lazy loading',
          'Code minification (CSS, JS, HTML)',
          'Browser caching configuration',
          'CDN implementation',
          'Core Web Vitals optimization',
        ],
        duration: 'Weeks 2-3',
      },
      {
        title: 'Crawlability Improvements',
        description: 'We ensure Google can efficiently discover and crawl all your important pages.',
        details: [
          'XML sitemap optimization',
          'Robots.txt configuration',
          'Fix broken links and redirects',
          'Resolve crawl errors',
          'Optimize crawl budget allocation',
        ],
        duration: 'Weeks 2-3',
      },
      {
        title: 'Indexation Optimization',
        description: 'We ensure your important pages are properly indexed while preventing duplicate content issues.',
        details: [
          'Canonical tag implementation',
          'Noindex/nofollow audit',
          'Duplicate content resolution',
          'Index coverage monitoring',
          'Pagination handling',
        ],
        duration: 'Weeks 3-4',
      },
      {
        title: 'Structured Data Implementation',
        description: 'We add schema markup that helps Google understand your content and enables rich snippets.',
        details: [
          'Organization/LocalBusiness schema',
          'Service/Product schema',
          'FAQ schema',
          'Review schema',
          'Breadcrumb schema',
        ],
        duration: 'Weeks 3-4',
      },
    ],
    timeline: 'Technical SEO improvements typically show results within 2-4 weeks as Google recrawls your site. Full impact is usually visible within 1-2 months.',
    deliverables: [
      'Comprehensive technical audit report',
      'Prioritized fix roadmap',
      'Developer implementation guide',
      'Schema markup code',
      'Post-implementation verification',
    ],
  },
  industries: {
    intro: 'Technical SEO is essential for any website, but particularly impactful for these situations:',
    list: [
      { name: 'E-commerce Sites', description: 'Large product catalogs require careful crawl budget management and duplicate content handling.' },
      { name: 'Service Businesses', description: 'Schema markup for services, reviews, and local business information.' },
      { name: 'Multi-Location Businesses', description: 'Proper URL structure and location page optimization.' },
      { name: 'Site Migrations', description: 'Preserve rankings during platform changes or redesigns.' },
      { name: 'Slow Websites', description: 'Core Web Vitals optimization for better rankings and conversions.' },
    ],
  },
  faqs: [
    {
      question: 'What is technical SEO?',
      answer: 'Technical SEO involves optimizing your website\'s infrastructure so search engines can efficiently crawl, index, and rank your pages. This includes site speed, mobile optimization, URL structure, schema markup, and fixing crawl errors. It\'s the foundation that makes other SEO efforts effective.',
    },
    {
      question: 'Why is site speed important for SEO?',
      answer: 'Site speed is a direct Google ranking factor through Core Web Vitals. Slow sites also have higher bounce rates-53% of mobile users leave if a page takes over 3 seconds to load. Speed improvements benefit both rankings and conversions.',
    },
    {
      question: 'What are Core Web Vitals?',
      answer: 'Core Web Vitals are Google\'s metrics for user experience: Largest Contentful Paint (loading), Interaction to Next Paint (interactivity), and Cumulative Layout Shift (visual stability). These are ranking factors, making them essential to optimize.',
    },
    {
      question: 'How do I know if my site has technical SEO issues?',
      answer: 'Common signs include: rankings dropping without content changes, pages not appearing in Google search results, slow loading times, mobile usability warnings in Search Console, and crawl errors. A technical SEO audit reveals all hidden issues.',
    },
    {
      question: 'What is schema markup and why does it matter?',
      answer: 'Schema markup is code that helps search engines understand your content. It enables rich snippets in search results-like star ratings, prices, and FAQs-which increase click-through rates by up to 30%. It\'s essential for modern SEO.',
    },
    {
      question: 'Can technical issues really tank my rankings?',
      answer: 'Yes, severe technical issues can devastate rankings. A noindex tag on important pages removes them from Google entirely. Slow speed increases bounce rates. Crawl errors waste Google\'s budget on broken pages. Technical SEO prevents these problems.',
    },
    {
      question: 'How often should technical SEO be reviewed?',
      answer: 'We recommend quarterly technical audits, plus immediate audits after any site changes, migrations, or redesigns. Technical issues can appear at any time through plugin updates, content changes, or hosting problems.',
    },
    {
      question: 'Do I need a developer to implement technical SEO fixes?',
      answer: 'Some technical fixes require developer expertise (server configuration, JavaScript issues), while others can be done through CMS settings or plugins. We provide developer-ready documentation and can work directly with your tech team.',
    },
  ],
  cta: {
    headline: 'Uncover What\'s Holding Your Site Back',
    description: 'Get a free technical SEO audit and discover the hidden issues sabotaging your rankings.',
    buttonText: 'Get Your Free Technical Audit',
  },
}

// =============================================================================
// SUB-SERVICE: E-COMMERCE SEO
// =============================================================================

export const ecommerceSeoContent: ServiceContent = {
  hero: {
    headline: 'E-commerce SEO That Drives Sales, Not Just Traffic',
    subheadline: 'Rank Your Products Where Buyers Are Searching',
    valueProposition: 'In e-commerce, visibility equals revenue. Our e-commerce SEO services optimize your product pages, category structure, and technical foundation to capture high-intent shoppers searching for exactly what you sell-without paying for every click.',
  },
  definition: {
    answer: 'E-commerce SEO services optimize online stores to rank higher in search results for product-related queries. This includes product page optimization, category structure improvements, technical SEO for large catalogs, schema markup for rich snippets, and content strategies that capture shoppers at every stage of the buying journey.',
    expansion: 'E-commerce SEO differs from standard SEO because of unique challenges: large numbers of similar product pages, frequent inventory changes, duplicate content from manufacturer descriptions, and complex site architecture. Effective e-commerce SEO addresses these challenges while optimizing for commercial keywords that indicate buying intent. With over 44% of online shoppers starting their search on Google (not Amazon), search engine visibility is critical for online stores.',
  },
  whyYouNeed: {
    intro: 'Online shoppers who find you through organic search have 14.6% conversion rate-8x higher than social media traffic. E-commerce SEO captures these high-value visitors.',
    painPoints: [
      {
        title: 'Competing with Amazon and Big Retailers',
        description: 'Major retailers dominate generic product searches, but niche and long-tail keywords offer opportunities where smaller stores can rank and convert.',
      },
      {
        title: 'Thin Product Descriptions',
        description: 'Using manufacturer descriptions creates duplicate content across thousands of stores. Your products become invisible among identical listings.',
      },
      {
        title: 'Poor Site Architecture',
        description: 'Messy category structures confuse both users and search engines, diluting ranking power and making products hard to find.',
      },
      {
        title: 'Relying Entirely on Paid Ads',
        description: 'PPC costs continue rising. Without organic visibility, you\'re paying for every visitor, eating into already thin e-commerce margins.',
      },
    ],
    benefits: [
      {
        title: 'Reduced Customer Acquisition Cost',
        description: 'Organic traffic doesn\'t cost per click. As SEO compounds, your customer acquisition cost drops significantly.',
      },
      {
        title: 'Higher-Intent Visitors',
        description: 'Searchers using product-specific keywords are closer to purchase than casual browsers.',
      },
      {
        title: 'Rich Product Snippets',
        description: 'Product schema enables prices, availability, and reviews in search results, increasing click-through rates.',
      },
      {
        title: 'Category Page Rankings',
        description: 'Optimized category pages can rank for broad commercial keywords, capturing top-of-funnel shoppers.',
      },
      {
        title: 'Long-Term Revenue Growth',
        description: 'SEO builds compounding organic traffic that continues generating sales month after month.',
      },
    ],
  },
  process: {
    intro: 'Our e-commerce SEO process addresses the unique challenges of online stores:',
    steps: [
      {
        title: 'E-commerce SEO Audit',
        description: 'We analyze your store\'s technical foundation, content quality, and competitive positioning.',
        details: [
          'Technical crawl of all product pages',
          'Category structure analysis',
          'Duplicate content identification',
          'Competitor keyword analysis',
          'Conversion path review',
        ],
        duration: 'Week 1-2',
      },
      {
        title: 'Keyword Strategy Development',
        description: 'We identify product and category keywords with commercial intent and ranking potential.',
        details: [
          'Product keyword mapping',
          'Category keyword targets',
          'Long-tail opportunity identification',
          'Competitor keyword gaps',
          'Search intent analysis',
        ],
        duration: 'Week 2',
      },
      {
        title: 'Site Architecture Optimization',
        description: 'We improve your category structure for both users and search engines.',
        details: [
          'Category hierarchy optimization',
          'Internal linking strategy',
          'URL structure improvements',
          'Breadcrumb implementation',
          'Faceted navigation handling',
        ],
        duration: 'Weeks 2-4',
      },
      {
        title: 'Product Page Optimization',
        description: 'We optimize individual product pages for relevant keywords and conversions.',
        details: [
          'Unique product descriptions',
          'Title tag and meta optimization',
          'Product schema implementation',
          'Image optimization and alt text',
          'Review integration',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Category Page Content',
        description: 'We add SEO-optimized content to category pages that ranks for broader keywords.',
        details: [
          'Category descriptions',
          'Buying guides',
          'FAQ sections',
          'Internal cross-links',
          'Featured products optimization',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Content Marketing',
        description: 'We create content that captures shoppers researching before they buy.',
        details: [
          'Product comparison guides',
          'How-to content',
          'Buying guides',
          'Product roundups',
          'User-generated content strategy',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'E-commerce SEO typically shows initial results in 3-4 months, with significant revenue impact by month 6. Large catalogs may require longer for full optimization.',
    deliverables: [
      'Full e-commerce SEO audit',
      'Keyword-mapped product/category strategy',
      'Technical recommendations',
      'Content calendar',
      'Monthly performance reports',
    ],
  },
  industries: {
    intro: 'We work with online stores across various niches:',
    list: [
      { name: 'Custom E-commerce', description: 'Tailored optimization strategies for custom-built online stores.' },
      { name: 'Product Pages', description: 'Optimized product listings that rank and convert.' },
      { name: 'Fashion & Apparel', description: 'Size, color, and style variations handled properly for SEO.' },
      { name: 'Home & Garden', description: 'Product and category optimization for home improvement searches.' },
      { name: 'Health & Beauty', description: 'Ingredient and benefit-focused keyword strategies.' },
      { name: 'B2B E-commerce', description: 'Technical product specifications and comparison content.' },
    ],
  },
  faqs: [
    {
      question: 'How is e-commerce SEO different from regular SEO?',
      answer: 'E-commerce SEO deals with unique challenges: large numbers of product pages, duplicate content from manufacturer descriptions, complex category structures, and frequent inventory changes. It requires specific strategies for product schema, faceted navigation, and commercial keyword targeting.',
    },
    {
      question: 'Can SEO compete with Amazon?',
      answer: 'Not for generic product searches, but absolutely for niche and long-tail keywords. Many shoppers search for specific product features, comparisons, or alternatives where smaller stores can outrank Amazon. The key is targeting keywords with commercial intent where you have expertise.',
    },
    {
      question: 'How long does e-commerce SEO take to show results?',
      answer: 'E-commerce SEO typically shows initial traffic improvements in 3-4 months, with significant revenue impact by month 6. Results depend on factors like catalog size, competition, and starting point. Technical fixes can show faster improvements.',
    },
    {
      question: 'Should I optimize every product page?',
      answer: 'Start with your highest-margin and best-selling products. We prioritize pages by revenue potential and keyword opportunity. Over time, optimization scales to your full catalog, but focusing initial efforts drives faster ROI.',
    },
    {
      question: 'What makes custom e-commerce SEO different?',
      answer: 'Custom e-commerce stores offer full control over technical SEO elements-URL structure, site speed, schema markup, and more. This flexibility allows us to implement advanced optimization strategies not possible on template platforms, resulting in better rankings and higher conversions.',
    },
    {
      question: 'How do you handle product variations (size, color)?',
      answer: 'We implement canonical tags to consolidate ranking signals, use proper variant schema markup, and ensure each variation is indexable only when it serves a unique search intent. This prevents duplicate content while maintaining visibility for relevant variations.',
    },
    {
      question: 'What\'s product schema and why does it matter?',
      answer: 'Product schema is structured data that tells Google about your products\' price, availability, reviews, and more. It enables rich snippets in search results showing this information, which significantly increases click-through rates and conversions.',
    },
    {
      question: 'Can you help with international e-commerce SEO?',
      answer: 'Yes, we handle multi-currency, multi-language stores with proper hreflang implementation, country-specific keyword targeting, and technical setup for international e-commerce. Contact us to discuss your specific international needs.',
    },
  ],
  cta: {
    headline: 'Ready to Grow Organic Revenue?',
    description: 'Get a free e-commerce SEO audit and discover untapped opportunities to drive more sales from search.',
    buttonText: 'Get Your Free E-commerce Audit',
  },
}

// =============================================================================
// SUB-SERVICE: INTERNATIONAL SEO
// =============================================================================

export const internationalSeoContent: ServiceContent = {
  hero: {
    headline: 'International SEO for Global Market Expansion',
    subheadline: 'Reach Customers in Any Country, Any Language',
    valueProposition: 'Expanding internationally? Your SEO strategy needs to evolve. Our international SEO services ensure your website reaches the right audience in each target market with proper hreflang implementation, localized content, and country-specific optimization.',
  },
  definition: {
    answer: 'International SEO services optimize your website to rank in multiple countries and languages. This includes hreflang implementation to signal geographic targeting, localized keyword research for each market, country-specific content strategies, and technical setup that ensures search engines serve the right version of your site to each audience.',
    expansion: 'International SEO is more complex than simply translating content. Each market has unique search behaviors, competitors, and cultural nuances. German searchers use different keywords than British searchers, even when both speak English. Proper international SEO requires market-specific keyword research, culturally adapted content, and technical implementation that tells Google exactly which pages to show in each country. Done wrong, you risk duplicate content penalties, confused rankings, and missed opportunities in target markets.',
  },
  whyYouNeed: {
    intro: 'Global markets represent massive opportunity, but only if search engines understand your targeting. Without proper international SEO, you\'re invisible in your target markets or showing the wrong content to the wrong audiences.',
    painPoints: [
      {
        title: 'Wrong Version Ranking in Wrong Country',
        description: 'Without proper hreflang, Google might show your UK site to US searchers (or vice versa), confusing users and losing conversions.',
      },
      {
        title: 'Direct Translation Doesn\'t Rank',
        description: 'Translated content misses local search behavior. Germans search differently than Americans-direct translation misses valuable keywords.',
      },
      {
        title: 'Duplicate Content Across Regions',
        description: 'Multiple country versions of similar content can trigger duplicate content issues, diluting ranking power across all markets.',
      },
      {
        title: 'Competitors Dominating Local Markets',
        description: 'Local competitors understand their market. Without localized SEO, you\'re trying to compete with a generic approach.',
      },
    ],
    benefits: [
      {
        title: 'Proper Geographic Targeting',
        description: 'Hreflang tells Google exactly which content to show in each country, ensuring the right audience sees the right version.',
      },
      {
        title: 'Localized Keyword Capture',
        description: 'Market-specific keyword research captures how locals actually search, not just translations of English keywords.',
      },
      {
        title: 'Consolidated Ranking Signals',
        description: 'Proper technical setup consolidates ranking power instead of splitting it across duplicate international pages.',
      },
      {
        title: 'Local Search Dominance',
        description: 'Appear as a local player in each market, competing effectively against established regional businesses.',
      },
      {
        title: 'Scalable Global Presence',
        description: 'A proper international SEO foundation makes adding new markets straightforward and efficient.',
      },
    ],
  },
  process: {
    intro: 'Our international SEO process establishes your presence in global markets:',
    steps: [
      {
        title: 'International Market Analysis',
        description: 'We research each target market\'s search landscape and competitive environment.',
        details: [
          'Market search volume assessment',
          'Local competitor analysis',
          'Cultural and language considerations',
          'Regulatory/compliance requirements',
          'Market prioritization recommendations',
        ],
        duration: 'Week 1-2',
      },
      {
        title: 'Technical Structure Planning',
        description: 'We design the optimal technical setup for your international presence.',
        details: [
          'ccTLD vs subdomain vs subfolder decision',
          'Hreflang strategy mapping',
          'Server location considerations',
          'International sitemap structure',
          'Canonical tag strategy',
        ],
        duration: 'Week 2',
      },
      {
        title: 'Hreflang Implementation',
        description: 'We implement hreflang tags correctly across all international pages.',
        details: [
          'Hreflang tag generation',
          'Bidirectional link verification',
          'Default/fallback version setup',
          'Sitemap hreflang inclusion',
          'Implementation testing',
        ],
        duration: 'Weeks 2-4',
      },
      {
        title: 'Localized Keyword Research',
        description: 'We research how people actually search in each target market.',
        details: [
          'Native speaker keyword research',
          'Local search intent analysis',
          'Competitor keyword gaps',
          'Cultural terminology differences',
          'Keyword mapping per market',
        ],
        duration: 'Weeks 2-4',
      },
      {
        title: 'Content Localization',
        description: 'We adapt content for each market beyond simple translation.',
        details: [
          'Culturally adapted messaging',
          'Local examples and references',
          'Market-specific value propositions',
          'Local currency and measurements',
          'Region-specific trust signals',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Local Link Building',
        description: 'We build authority in each target market through local links.',
        details: [
          'Country-specific directory submissions',
          'Local PR and media outreach',
          'Regional industry associations',
          'Local influencer partnerships',
          'Market-specific citation building',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'International SEO setup takes 2-4 weeks for technical implementation. Rankings in new markets typically develop over 3-6 months, depending on competition and content investment.',
    deliverables: [
      'International market analysis',
      'Technical implementation roadmap',
      'Hreflang implementation',
      'Localized keyword research per market',
      'Ongoing multi-market reporting',
    ],
  },
  industries: {
    intro: 'International SEO is essential for businesses expanding globally:',
    list: [
      { name: 'E-commerce Brands', description: 'Sell products in multiple countries with localized shopping experiences.' },
      { name: 'SaaS Companies', description: 'Reach global software buyers with market-specific messaging.' },
      { name: 'Service Providers', description: 'Expand service offerings to new geographic markets.' },
      { name: 'Travel & Hospitality', description: 'Target travelers in their native languages and markets.' },
      { name: 'B2B Enterprises', description: 'Generate international leads with localized content.' },
    ],
  },
  faqs: [
    {
      question: 'What is hreflang and why is it important?',
      answer: 'Hreflang is an HTML attribute that tells search engines which language and geographic version of a page to show users. It ensures Spanish speakers see your Spanish content and Germans see your German content. Without it, Google guesses-often incorrectly-which version to display.',
    },
    {
      question: 'Should I use subdomains, subfolders, or country domains (ccTLDs)?',
      answer: 'Each approach has trade-offs. ccTLDs (like .de, .co.uk) provide strongest geo-targeting but require separate domain authority. Subfolders (site.com/de/) consolidate authority but require proper hreflang. We recommend based on your resources, technical capabilities, and market strategy.',
    },
    {
      question: 'Is translation enough for international SEO?',
      answer: 'No, translation alone misses how locals actually search. Keyword research must be done natively in each market. For example, British "flat" vs American "apartment," or German search terms that don\'t directly translate. Localization requires cultural adaptation, not just language translation.',
    },
    {
      question: 'How do you handle similar English markets (US, UK, Australia)?',
      answer: 'Even English-speaking markets have different search behaviors, spellings, and terminology. We implement hreflang to serve the right version, research market-specific keywords, and adapt content for local preferences (currency, measurements, cultural references).',
    },
    {
      question: 'What about countries with multiple languages?',
      answer: 'Countries like Canada (English/French), Belgium (Dutch/French/German), or Switzerland require language-country combinations in hreflang. We set up proper targeting for each language within multi-lingual markets.',
    },
    {
      question: 'How long does international SEO take to show results?',
      answer: 'Technical setup takes 2-4 weeks. Rankings in new markets typically develop over 3-6 months as search engines recognize your geographic targeting and you build local authority. Established markets with existing content see faster results.',
    },
    {
      question: 'Do I need local hosting for each country?',
      answer: 'Local hosting can improve page speed for local users but isn\'t required for SEO. Google uses hreflang and other signals for geographic targeting, not server location. A good CDN can serve content quickly worldwide without multiple servers.',
    },
    {
      question: 'Can you help with international link building?',
      answer: 'Yes, we build locally-relevant backlinks in each target market through country-specific directories, local PR, regional industry associations, and market-specific outreach. Local links signal relevance to search engines in each country.',
    },
  ],
  cta: {
    headline: 'Ready to Go Global?',
    description: 'Get a free international SEO assessment and learn how to effectively reach customers in your target markets.',
    buttonText: 'Get Your Free International Assessment',
  },
}

// =============================================================================
// MAIN SERVICE: WEB DEVELOPMENT
// =============================================================================

export const webDevelopmentContent: ServiceContent = {
  hero: {
    headline: 'Websites That Convert Visitors Into Customers',
    subheadline: 'Custom Web Development Built for Performance and Growth',
    valueProposition: 'Your website should be your hardest-working employee-generating leads 24/7. We build fast, SEO-optimized websites using modern technology that loads in under 2 seconds, ranks well in search engines, and converts visitors into paying customers.',
  },
  definition: {
    answer: 'Web development services encompass the design, building, and maintenance of websites and web applications. Our services include custom website design, responsive development, content management system implementation, e-commerce functionality, and web application development-all built with performance, SEO, and user experience as core priorities.',
    expansion: 'Modern web development goes far beyond making something that "looks nice." Today\'s websites must load instantly (Google penalizes slow sites), work flawlessly on mobile devices (60%+ of traffic), be accessible to all users, and be structured for search engine visibility. We build with Next.js, React, and modern frameworks that deliver exceptional performance while maintaining the flexibility to grow with your business. Every website we create is a business asset designed to generate measurable returns.',
  },
  whyYouNeed: {
    intro: 'Your website is often the first interaction customers have with your business. In fact, 75% of users judge a company\'s credibility based on their website design.',
    painPoints: [
      {
        title: 'Slow, Outdated Website',
        description: 'A 1-second delay in page load time reduces conversions by 7%. Old websites built on outdated platforms are slow, insecure, and hurt your rankings.',
      },
      {
        title: 'Poor Mobile Experience',
        description: 'Over 60% of web traffic is mobile. If your site isn\'t mobile-optimized, you\'re frustrating the majority of your visitors.',
      },
      {
        title: 'Not Generating Leads',
        description: 'A beautiful website that doesn\'t convert is just an expensive digital brochure. Your site should actively generate inquiries and sales.',
      },
      {
        title: 'Difficult to Update',
        description: 'Needing a developer for every small change is expensive and slow. You should be able to easily update content yourself.',
      },
    ],
    benefits: [
      {
        title: 'Lightning-Fast Performance',
        description: 'Sites built with modern technology load in under 2 seconds, improving both user experience and search rankings.',
      },
      {
        title: 'SEO-Optimized Foundation',
        description: 'Every site is built with proper technical SEO from the start-fast load times, clean code, proper structure.',
      },
      {
        title: 'Conversion-Focused Design',
        description: 'Strategic layouts, clear calls-to-action, and user-friendly forms designed to turn visitors into leads.',
      },
      {
        title: 'Mobile-First Approach',
        description: 'Designed for mobile first, then enhanced for desktop-ensuring great experience on all devices.',
      },
      {
        title: 'Easy Content Management',
        description: 'Update your own content without technical knowledge. Change text, images, and pages whenever you need.',
      },
    ],
  },
  process: {
    intro: 'Our web development process ensures your site is strategic, beautiful, and built to perform:',
    steps: [
      {
        title: 'Discovery & Strategy',
        description: 'We learn about your business, goals, audience, and competition to inform every design decision.',
        details: [
          'Business goals and KPIs',
          'Target audience analysis',
          'Competitor website review',
          'Content and feature requirements',
          'SEO keyword integration planning',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Design & Wireframing',
        description: 'We create wireframes and visual designs that balance aesthetics with conversion optimization.',
        details: [
          'Site architecture and navigation',
          'Wireframes for key pages',
          'Visual design concepts',
          'Mobile layout designs',
          'Client feedback and revisions',
        ],
        duration: 'Weeks 1-2',
      },
      {
        title: 'Development',
        description: 'We build your site using modern technology for optimal performance and SEO.',
        details: [
          'Next.js/React development',
          'Responsive implementation',
          'CMS integration',
          'Form and functionality setup',
          'Performance optimization',
        ],
        duration: 'Weeks 2-3',
      },
      {
        title: 'Content Integration',
        description: 'We integrate your content with SEO optimization and proper formatting.',
        details: [
          'Content entry and formatting',
          'Image optimization',
          'Meta tags and schema',
          'Internal linking',
          'SEO review',
        ],
        duration: 'Week 3',
      },
      {
        title: 'Testing & QA',
        description: 'We thoroughly test everything before launch to ensure a flawless experience.',
        details: [
          'Cross-browser testing',
          'Mobile device testing',
          'Form functionality',
          'Speed optimization',
          'Accessibility check',
        ],
        duration: 'Week 3-4',
      },
      {
        title: 'Launch & Training',
        description: 'We launch your site and train you on managing your content.',
        details: [
          'DNS and hosting setup',
          'SSL certificate installation',
          'Google Analytics/Search Console setup',
          'CMS training session',
          '30-day post-launch support',
        ],
        duration: 'Week 4',
      },
    ],
    timeline: 'Most websites launch within 2-4 weeks. Complex projects with custom functionality may take 6-8 weeks.',
    deliverables: [
      'Custom designed website',
      'Mobile-responsive development',
      'CMS for easy updates',
      'SEO foundation setup',
      '30-day support included',
    ],
  },
  industries: {
    intro: 'We build websites for businesses across industries, with deep experience in:',
    list: [
      { name: 'Contractors & Trades', description: 'Lead-generating websites for plumbers, electricians, roofers, and home service pros.' },
      { name: 'Professional Services', description: 'Credibility-building sites for consultants, agencies, and B2B services.' },
      { name: 'E-commerce', description: 'Online stores that convert browsers into buyers.' },
      { name: 'Healthcare & Wellness', description: 'HIPAA-aware sites for medical practices and wellness businesses.' },
      { name: 'Real Estate', description: 'Property listing integration and lead capture for agents and brokerages.' },
    ],
  },
  faqs: [
    {
      question: 'How much does a website cost?',
      answer: 'Our website packages start at $1,500 for a professional site with SEO setup, Google Analytics setup ($100 value), and Google Business Profile optimization. Custom e-commerce stores start at $3,500. Web applications are quoted based on requirements. We offer transparent pricing with no hidden fees.',
    },
    {
      question: 'How long does it take to build a website?',
      answer: 'Most websites launch within 2-4 weeks from project start. This includes discovery, design, development, and testing. Complex projects with custom features or extensive content may take 6-8 weeks. We provide a detailed timeline at project kickoff.',
    },
    {
      question: 'What platform do you build websites on?',
      answer: 'We primarily build with Next.js and React for optimal performance and SEO. For clients needing easy content management, we integrate headless CMS solutions. We focus on custom solutions that give you full control and ownership of your website.',
    },
    {
      question: 'Will my website be mobile-friendly?',
      answer: 'Absolutely. Every website we build is mobile-first, meaning we design for mobile devices first and enhance for larger screens. With over 60% of web traffic coming from mobile, this approach ensures the best experience for the majority of your visitors.',
    },
    {
      question: 'Can I update the website myself?',
      answer: 'Yes. We set up user-friendly content management so you can easily update text, images, and basic content. We provide training on how to make updates, and we\'re available for more complex changes or additions.',
    },
    {
      question: 'Is SEO included with the website?',
      answer: 'Yes, every website includes technical SEO setup: proper site structure, fast loading speed, mobile optimization, meta tags, schema markup, and Google Search Console integration. This gives you a strong SEO foundation. Ongoing SEO services for rankings and traffic growth are available separately.',
    },
    {
      question: 'Do you provide hosting?',
      answer: 'We recommend and can set up hosting optimized for performance. For Next.js sites, we typically use Vercel for best-in-class speed and reliability. Hosting costs vary but typically range from $20-50/month for most business sites.',
    },
    {
      question: 'What if I need changes after launch?',
      answer: 'Your package includes 30 days of post-launch support for adjustments and fixes. After that, we offer maintenance packages or hourly support for ongoing changes. Many clients also choose to handle routine updates themselves using the CMS we provide.',
    },
  ],
  cta: {
    headline: 'Ready for a Website That Works as Hard as You Do?',
    description: 'Get a free consultation and see how a high-performance website can transform your online presence.',
    buttonText: 'Get Your Free Consultation',
  },
}

// =============================================================================
// SUB-SERVICE: WEBSITE DESIGN & DEVELOPMENT
// =============================================================================

export const websiteDesignContent: ServiceContent = {
  hero: {
    headline: 'Professional Website Design That Converts',
    subheadline: 'Custom Designs Built for Your Business Goals',
    valueProposition: 'First impressions matter. 94% of first impressions are design-related, and users form opinions in just 0.05 seconds. We design websites that not only look stunning but are strategically crafted to convert visitors into customers.',
  },
  definition: {
    answer: 'Website design and development services create custom, professional websites tailored to your brand and business objectives. This includes user experience (UX) design, visual design, responsive development, content management system setup, and conversion optimization-resulting in a website that looks great, works flawlessly, and generates results.',
    expansion: 'Modern website design goes beyond aesthetics. It encompasses user psychology, conversion optimization, accessibility, performance, and SEO. Our design process considers how visitors navigate your site, what actions you want them to take, and how to remove friction from the conversion path. We combine creative design with data-driven decisions to build websites that serve as powerful business tools.',
  },
  whyYouNeed: {
    intro: 'Your website is your digital storefront, often the first touchpoint potential customers have with your business. A professional design builds trust and credibility instantly.',
    painPoints: [
      {
        title: 'Outdated Design Hurting Credibility',
        description: '75% of users judge a company\'s credibility based on their website design. An outdated site signals an outdated business.',
      },
      {
        title: 'High Bounce Rates',
        description: 'Visitors leave confusing or unappealing sites within seconds. You\'re paying for traffic that never converts.',
      },
      {
        title: 'Not Reflecting Your Brand',
        description: 'A generic template doesn\'t communicate what makes your business unique. You blend in instead of standing out.',
      },
      {
        title: 'Poor User Experience',
        description: 'Visitors can\'t find what they need, forms are complicated, and navigation is confusing. Frustrated users don\'t become customers.',
      },
    ],
    benefits: [
      {
        title: 'Professional Credibility',
        description: 'A polished design instantly builds trust and positions you as an established, professional business.',
      },
      {
        title: 'Conversion-Focused Layout',
        description: 'Strategic placement of calls-to-action, testimonials, and contact forms guides visitors toward becoming leads.',
      },
      {
        title: 'Brand Differentiation',
        description: 'Custom design communicates your unique value proposition and helps you stand out from competitors.',
      },
      {
        title: 'Intuitive Navigation',
        description: 'Clear information architecture helps visitors find what they need quickly, improving engagement and conversions.',
      },
      {
        title: 'Responsive Across Devices',
        description: 'Flawless experience on desktop, tablet, and mobile ensures you never lose a visitor due to poor mobile design.',
      },
    ],
  },
  process: {
    intro: 'Our design process combines creativity with strategy to deliver websites that look great and perform even better:',
    steps: [
      {
        title: 'Discovery & Research',
        description: 'We learn about your business, audience, and goals to inform every design decision.',
        details: [
          'Brand and style preferences',
          'Target audience research',
          'Competitor analysis',
          'Content and feature needs',
          'Conversion goal definition',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Site Architecture',
        description: 'We plan the structure and navigation to optimize user flow and conversions.',
        details: [
          'Page hierarchy planning',
          'Navigation structure',
          'User journey mapping',
          'Call-to-action placement',
          'Content organization',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Wireframing',
        description: 'We create layout blueprints showing content placement and user flow.',
        details: [
          'Homepage wireframe',
          'Key page layouts',
          'Mobile wireframes',
          'Form and CTA placement',
          'Client review and approval',
        ],
        duration: 'Week 1-2',
      },
      {
        title: 'Visual Design',
        description: 'We create the look and feel that brings your brand to life.',
        details: [
          'Color palette and typography',
          'Design mockups',
          'Image selection and styling',
          'Animation and interaction design',
          'Design revisions',
        ],
        duration: 'Week 2',
      },
      {
        title: 'Development',
        description: 'We build your design using modern, performant code.',
        details: [
          'Responsive HTML/CSS/JS',
          'CMS integration',
          'Form functionality',
          'Performance optimization',
          'SEO implementation',
        ],
        duration: 'Weeks 2-3',
      },
      {
        title: 'Launch & Support',
        description: 'We launch your site and ensure everything works perfectly.',
        details: [
          'Quality assurance testing',
          'Launch and DNS setup',
          'CMS training',
          'Analytics setup',
          '30-day support',
        ],
        duration: 'Week 3-4',
      },
    ],
    timeline: 'Most custom website designs launch within 3-4 weeks. Larger sites with extensive content may take 5-6 weeks.',
    deliverables: [
      'Custom website design',
      'Responsive development',
      'Content management system',
      'SEO foundation',
      'Training and 30-day support',
    ],
  },
  industries: {
    intro: 'We design websites for businesses across industries:',
    list: [
      { name: 'Service Businesses', description: 'Lead-generating designs for contractors, consultants, and professional services.' },
      { name: 'Small Businesses', description: 'Professional presence for local businesses ready to grow.' },
      { name: 'Startups', description: 'Modern, scalable designs that establish credibility from day one.' },
      { name: 'Healthcare', description: 'Trust-building designs for medical practices and wellness providers.' },
      { name: 'B2B Companies', description: 'Professional designs that communicate expertise and reliability.' },
    ],
  },
  faqs: [
    {
      question: 'How much does custom website design cost?',
      answer: 'Our custom website design packages start at $1,500. Pricing depends on the number of pages, custom functionality required, and design complexity. We provide detailed quotes after understanding your specific needs during our discovery call.',
    },
    {
      question: 'What\'s included in website design services?',
      answer: 'Our website design includes discovery and strategy, wireframing, visual design, responsive development, CMS setup, SEO foundation, content integration, and training. You receive a complete, launch-ready website with 30 days of post-launch support.',
    },
    {
      question: 'How many design revisions do I get?',
      answer: 'Our process includes two rounds of revisions at the wireframe stage and two at the visual design stage. We involve you throughout the process, so designs are collaborative rather than requiring extensive revisions.',
    },
    {
      question: 'Do you design for mobile?',
      answer: 'Yes, every website we design is mobile-first. We design the mobile experience first, then enhance for larger screens. You\'ll see and approve mobile designs before development begins.',
    },
    {
      question: 'Can I see examples of your design work?',
      answer: 'Absolutely. Visit our portfolio page to see recent projects. We\'re happy to share examples relevant to your industry and discuss our design approach for businesses like yours.',
    },
    {
      question: 'Do I need to provide content?',
      answer: 'You\'ll need to provide the core information about your business, services, and unique selling points. We can write or optimize your content for SEO as an add-on service, or work with content you provide.',
    },
    {
      question: 'Will I be able to update the website myself?',
      answer: 'Yes. We set up a user-friendly content management system and provide training so you can update text, images, and basic content. We\'re also available for more complex changes.',
    },
    {
      question: 'What if I don\'t like the design?',
      answer: 'Our collaborative process prevents this. We start with discovery to understand your preferences, create wireframes for structural approval, then develop visual designs for your review. You approve each stage before we proceed.',
    },
  ],
  cta: {
    headline: 'Ready for a Website That Wins Customers?',
    description: 'Get a free consultation and see how professional design can transform your online presence.',
    buttonText: 'Get Your Free Design Consultation',
  },
}

// =============================================================================
// SUB-SERVICE: WEB APPLICATIONS
// =============================================================================

export const webApplicationsContent: ServiceContent = {
  hero: {
    headline: 'Custom Web Applications Built for Your Business',
    subheadline: 'Powerful Tools That Streamline Operations and Drive Growth',
    valueProposition: 'Off-the-shelf software doesn\'t fit your unique business needs. We build custom web applications using Django, Python, React, and Vue.js that automate processes, improve efficiency, and give you a competitive edge no template can provide.',
  },
  definition: {
    answer: 'Web application development creates custom software accessed through web browsers, designed to solve specific business problems. Unlike simple websites, web applications include complex functionality like user authentication, databases, dashboards, automation, and integrations-built to handle your unique workflows and scale with your business.',
    expansion: 'Web applications transform how businesses operate. Whether you need a customer portal, inventory management system, booking platform, or custom CRM, we build solutions tailored to your exact requirements. Using robust technologies like Django and Python for the backend, combined with React or Vue.js for dynamic frontends, we create applications that are secure, scalable, and maintainable for years to come.',
  },
  whyYouNeed: {
    intro: 'Generic software forces you to adapt your business to its limitations. Custom web applications adapt to your business, automating unique processes and providing competitive advantages.',
    painPoints: [
      {
        title: 'Outgrowing Spreadsheets',
        description: 'Manual processes in Excel are error-prone, time-consuming, and don\'t scale. Data gets lost, mistakes happen, and collaboration is difficult.',
      },
      {
        title: 'Software That Doesn\'t Fit',
        description: 'Off-the-shelf solutions require workarounds and don\'t match your workflow. You pay for features you don\'t need while missing ones you do.',
      },
      {
        title: 'Disconnected Systems',
        description: 'Data lives in multiple places that don\'t talk to each other. Employees waste time manually moving information between systems.',
      },
      {
        title: 'Manual Processes Draining Time',
        description: 'Tasks that should be automated still require manual work. Your team spends hours on administrative work instead of valuable activities.',
      },
    ],
    benefits: [
      {
        title: 'Tailored to Your Workflow',
        description: 'Built around how your business actually operates, not how software vendors think you should work.',
      },
      {
        title: 'Process Automation',
        description: 'Automate repetitive tasks, notifications, calculations, and workflows that currently require manual effort.',
      },
      {
        title: 'Centralized Data',
        description: 'One source of truth accessible from anywhere. No more scattered spreadsheets or disconnected systems.',
      },
      {
        title: 'Competitive Advantage',
        description: 'Capabilities your competitors don\'t have. Custom tools enable services and efficiency they can\'t match.',
      },
      {
        title: 'Scalable Growth',
        description: 'Built to handle growth without breaking. Add users, data, and features as your business expands.',
      },
    ],
  },
  process: {
    intro: 'Our web application development process ensures we build exactly what your business needs:',
    steps: [
      {
        title: 'Requirements Discovery',
        description: 'We deeply understand your business processes, pain points, and objectives.',
        details: [
          'Stakeholder interviews',
          'Current process documentation',
          'User role identification',
          'Feature prioritization',
          'Technical requirements',
        ],
        duration: 'Weeks 1-2',
      },
      {
        title: 'System Design',
        description: 'We architect the application structure, database, and user experience.',
        details: [
          'Database schema design',
          'API architecture',
          'User flow mapping',
          'Interface wireframes',
          'Technical specification document',
        ],
        duration: 'Weeks 2-3',
      },
      {
        title: 'Development Sprints',
        description: 'We build in iterative sprints, delivering working functionality regularly.',
        details: [
          'Backend development (Django/Python)',
          'Frontend development (React/Vue)',
          'Database implementation',
          'API integrations',
          'Regular demo sessions',
        ],
        duration: 'Weeks 4-10',
      },
      {
        title: 'Testing & QA',
        description: 'Thorough testing ensures reliability and security.',
        details: [
          'Unit and integration testing',
          'User acceptance testing',
          'Security audit',
          'Performance testing',
          'Bug fixes and refinement',
        ],
        duration: 'Week 10-11',
      },
      {
        title: 'Deployment',
        description: 'We launch your application and ensure smooth operation.',
        details: [
          'Server setup and configuration',
          'Data migration (if applicable)',
          'SSL and security configuration',
          'Monitoring setup',
          'User training',
        ],
        duration: 'Week 11-12',
      },
      {
        title: 'Support & Maintenance',
        description: 'Ongoing support keeps your application running smoothly.',
        details: [
          'Bug fixes and updates',
          'Security patches',
          'Performance monitoring',
          'Feature enhancements',
          'Technical support',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'Simple applications take 6-8 weeks. Complex applications with extensive features typically take 3-6 months. We provide detailed timelines after requirements discovery.',
    deliverables: [
      'Custom web application',
      'Admin dashboard',
      'User documentation',
      'Technical documentation',
      'Training and support',
    ],
  },
  industries: {
    intro: 'We build custom web applications for various business needs:',
    list: [
      { name: 'Customer Portals', description: 'Secure portals where clients access services, documents, and account information.' },
      { name: 'Booking Systems', description: 'Custom scheduling and appointment management tailored to your service model.' },
      { name: 'Inventory Management', description: 'Track stock, orders, and fulfillment with your specific requirements.' },
      { name: 'CRM Systems', description: 'Customer relationship management built around your sales process.' },
      { name: 'Dashboards & Reporting', description: 'Data visualization and reporting tools for business intelligence.' },
      { name: 'Workflow Automation', description: 'Custom tools that automate your specific business processes.' },
    ],
  },
  faqs: [
    {
      question: 'How much does custom web application development cost?',
      answer: 'Web application costs vary significantly based on complexity. Simple applications start around $5,000-$10,000, while complex systems with multiple integrations can range from $20,000-$100,000+. We provide detailed quotes after understanding your requirements.',
    },
    {
      question: 'How long does it take to build a web application?',
      answer: 'Timeline depends on complexity. Simple applications take 6-8 weeks, medium complexity 3-4 months, and complex systems 4-6+ months. We provide detailed timelines after our discovery phase.',
    },
    {
      question: 'What technologies do you use?',
      answer: 'We primarily use Django and Python for backend development, combined with React or Vue.js for dynamic frontends. PostgreSQL for databases. These technologies are robust, secure, and maintainable long-term.',
    },
    {
      question: 'Will I own the code?',
      answer: 'Yes, you own 100% of the code we develop for you. We deliver complete source code, documentation, and everything needed to maintain or modify the application independently if you choose.',
    },
    {
      question: 'Can you integrate with existing systems?',
      answer: 'Yes, we regularly build integrations with accounting software, CRMs, payment processors, email services, and other business tools. We can work with most systems that have APIs.',
    },
    {
      question: 'How do you handle security?',
      answer: 'Security is built into our development process. We follow security best practices, implement proper authentication, encrypt sensitive data, and conduct security audits. We also ensure compliance with relevant regulations.',
    },
    {
      question: 'What about ongoing maintenance?',
      answer: 'We offer maintenance packages that include bug fixes, security updates, monitoring, and support. Many clients also add ongoing development hours for new features and improvements.',
    },
    {
      question: 'Can the application grow with my business?',
      answer: 'Yes, scalability is a core consideration in our architecture. We build applications that handle increasing users, data, and traffic. Adding new features is straightforward with our modular approach.',
    },
  ],
  cta: {
    headline: 'Ready to Build Something Powerful?',
    description: 'Get a free consultation to discuss your custom application needs and see what\'s possible.',
    buttonText: 'Get Your Free Consultation',
  },
}

// =============================================================================
// SUB-SERVICE: E-COMMERCE DEVELOPMENT
// =============================================================================

export const ecommerceDevelopmentContent: ServiceContent = {
  hero: {
    headline: 'E-commerce Websites That Turn Browsers Into Buyers',
    subheadline: 'Online Stores Built for Conversions and Growth',
    valueProposition: 'Your online store should sell for you 24/7. We build e-commerce websites optimized for conversions, with seamless checkout experiences, mobile-first design, and the technical foundation to scale as you grow.',
  },
  definition: {
    answer: 'E-commerce development creates online stores that enable businesses to sell products or services over the internet. This includes product catalog setup, shopping cart functionality, secure payment processing, inventory management, shipping integration, and optimization for conversions-everything needed to run a successful online retail operation.',
    expansion: 'Successful e-commerce goes beyond listing products online. It requires understanding customer psychology, reducing friction in the buying process, and building trust at every step. We build custom e-commerce stores tailored to your specific needs, always focusing on the metrics that matter: conversion rate, average order value, and customer lifetime value.',
  },
  whyYouNeed: {
    intro: 'Global e-commerce sales exceeded $5 trillion in 2023 and continue growing. If you\'re not selling online effectively, you\'re leaving significant revenue on the table.',
    painPoints: [
      {
        title: 'Low Conversion Rates',
        description: 'Traffic is coming but not buying. Confusing navigation, slow loading, and clunky checkout kill sales before they happen.',
      },
      {
        title: 'Cart Abandonment',
        description: '70% of online shopping carts are abandoned. Poor checkout experience, unexpected costs, and friction drive customers away.',
      },
      {
        title: 'Mobile Sales Suffering',
        description: 'Over 60% of e-commerce traffic is mobile, but if your store isn\'t mobile-optimized, those visitors aren\'t converting.',
      },
      {
        title: 'Manual Order Management',
        description: 'Processing orders manually is slow and error-prone. Inventory doesn\'t sync, shipping is complicated, and customers don\'t get updates.',
      },
    ],
    benefits: [
      {
        title: 'Higher Conversion Rates',
        description: 'Strategic design, fast loading, and optimized checkout turn more browsers into buyers.',
      },
      {
        title: 'Mobile-Optimized Experience',
        description: 'Seamless mobile shopping that captures the majority of e-commerce traffic.',
      },
      {
        title: 'Streamlined Operations',
        description: 'Automated inventory, order management, and shipping that saves hours of manual work.',
      },
      {
        title: 'Secure Payments',
        description: 'PCI-compliant payment processing that builds customer trust and protects data.',
      },
      {
        title: 'Scalable Growth',
        description: 'Infrastructure that handles traffic spikes and growing product catalogs without breaking.',
      },
    ],
  },
  process: {
    intro: 'Our e-commerce development process builds stores designed to sell:',
    steps: [
      {
        title: 'Strategy & Planning',
        description: 'We understand your products, customers, and business model to plan the optimal store.',
        details: [
          'Product catalog analysis',
          'Customer journey mapping',
          'Platform selection',
          'Feature requirements',
          'Integration needs',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Design & UX',
        description: 'We design a shopping experience optimized for conversions.',
        details: [
          'Homepage and category design',
          'Product page optimization',
          'Cart and checkout design',
          'Mobile experience',
          'Trust signal placement',
        ],
        duration: 'Weeks 1-2',
      },
      {
        title: 'Development & Setup',
        description: 'We build your store with all functionality configured.',
        details: [
          'Platform configuration',
          'Product catalog setup',
          'Payment gateway integration',
          'Shipping configuration',
          'Tax automation',
        ],
        duration: 'Weeks 2-3',
      },
      {
        title: 'Optimization',
        description: 'We optimize for speed, SEO, and conversions.',
        details: [
          'Page speed optimization',
          'SEO configuration',
          'Checkout optimization',
          'Trust badge integration',
          'Upsell/cross-sell setup',
        ],
        duration: 'Week 3',
      },
      {
        title: 'Testing',
        description: 'We thoroughly test every aspect of the shopping experience.',
        details: [
          'Order flow testing',
          'Payment testing',
          'Mobile testing',
          'Cross-browser testing',
          'Performance testing',
        ],
        duration: 'Week 3-4',
      },
      {
        title: 'Launch & Training',
        description: 'We launch your store and train you on management.',
        details: [
          'Go-live deployment',
          'Order management training',
          'Product management training',
          'Analytics setup',
          'Post-launch support',
        ],
        duration: 'Week 4',
      },
    ],
    timeline: 'Most e-commerce stores launch within 3-4 weeks. Larger catalogs or custom functionality may take 6-8 weeks.',
    deliverables: [
      'Fully functional online store',
      'Payment processing setup',
      'Inventory management',
      'Order management training',
      '30-day post-launch support',
    ],
  },
  industries: {
    intro: 'We build e-commerce stores for various product types:',
    list: [
      { name: 'Physical Products', description: 'Retail stores with inventory management, shipping, and fulfillment.' },
      { name: 'Digital Products', description: 'Downloads, courses, and digital goods with instant delivery.' },
      { name: 'Subscriptions', description: 'Recurring revenue models with subscription box or membership features.' },
      { name: 'Services', description: 'Service packages sold online with booking and scheduling.' },
      { name: 'B2B E-commerce', description: 'Wholesale pricing, custom quotes, and account management.' },
    ],
  },
  faqs: [
    {
      question: 'What platform do you recommend for e-commerce?',
      answer: 'We specialize in custom e-commerce solutions that give you full control over your store. Unlike template-based platforms, custom stores offer better performance, full SEO control, and no monthly platform fees. We build solutions tailored to your specific products, volume, and business needs.',
    },
    {
      question: 'How much does an e-commerce website cost?',
      answer: 'We build custom e-commerce stores starting at $3,500. We focus on custom solutions rather than template-based platforms, ensuring your store is built specifically for your business needs with optimal performance and SEO. We provide detailed quotes based on your requirements.',
    },
    {
      question: 'Can you migrate my existing store?',
      answer: 'Yes, we handle e-commerce migrations regularly. We can move products, customers, and orders from your current platform while maintaining SEO value. We create redirects to preserve rankings and ensure a smooth transition.',
    },
    {
      question: 'How do you handle payments?',
      answer: 'We integrate secure, PCI-compliant payment processors like Stripe, PayPal, Square, or your preferred provider. These handle credit cards, digital wallets, and buy-now-pay-later options securely.',
    },
    {
      question: 'What about shipping integration?',
      answer: 'We configure shipping zones, rates, and carrier integrations (USPS, UPS, FedEx). We can set up real-time shipping quotes, flat rates, free shipping thresholds, and automatic tracking notifications.',
    },
    {
      question: 'Can I manage inventory across multiple channels?',
      answer: 'Yes, we can set up inventory sync with marketplaces like Amazon, eBay, and Etsy, as well as point-of-sale systems for brick-and-mortar stores. This prevents overselling and centralizes order management.',
    },
    {
      question: 'Will my store be mobile-friendly?',
      answer: 'Absolutely. Mobile e-commerce is essential-over 60% of traffic is mobile. Every store we build is mobile-optimized with fast loading, easy navigation, and simplified checkout for mobile users.',
    },
    {
      question: 'Can you help with ongoing marketing?',
      answer: 'Yes, we offer e-commerce SEO, email marketing setup, and conversion optimization as additional services. We can discuss a complete growth strategy for your online store.',
    },
  ],
  cta: {
    headline: 'Ready to Sell Online?',
    description: 'Get a free e-commerce consultation and see how we can build a store that drives real revenue.',
    buttonText: 'Get Your Free E-commerce Consultation',
  },
}

// =============================================================================
// MAIN SERVICE: DIGITAL MARKETING
// =============================================================================

export const digitalMarketingContent: ServiceContent = {
  hero: {
    headline: 'Digital Marketing That Drives Measurable Growth',
    subheadline: 'Strategic Online Marketing for Small Businesses',
    valueProposition: 'Great products and services don\'t sell themselves. Our digital marketing services connect you with the right customers through SEO, content marketing, paid advertising, and social media-all driven by data and focused on ROI.',
  },
  definition: {
    answer: 'Digital marketing services promote your business through online channels including search engines, social media, email, and content. These services encompass SEO, pay-per-click advertising, content marketing, social media marketing, and analytics-strategically coordinated to attract, engage, and convert your target audience into customers.',
    expansion: 'Effective digital marketing isn\'t about being everywhere-it\'s about being where your customers are, with the right message, at the right time. We take a data-driven approach, starting with understanding your ideal customer and their journey, then deploying the right mix of channels and tactics to reach them. Every campaign is measured, optimized, and tied to business outcomes, not vanity metrics.',
  },
  whyYouNeed: {
    intro: 'Traditional advertising is declining while digital channels capture more attention and budget every year. Businesses that master digital marketing grow faster and more efficiently than those relying on outdated methods.',
    painPoints: [
      {
        title: 'Wasted Marketing Budget',
        description: 'Without proper targeting and tracking, marketing spend disappears without clear results. You can\'t tell what\'s working and what isn\'t.',
      },
      {
        title: 'Inconsistent Lead Flow',
        description: 'Leads come in unpredictably through random referrals and word-of-mouth. You can\'t plan growth without predictable lead generation.',
      },
      {
        title: 'Competitors Getting Found First',
        description: 'When potential customers search for your services, competitors appear first. You\'re invisible to people actively looking to buy.',
      },
      {
        title: 'No Digital Presence',
        description: 'Customers research online before buying. If you\'re not present in their research process, you\'re not in consideration.',
      },
    ],
    benefits: [
      {
        title: 'Measurable ROI',
        description: 'Every dollar is tracked. Know exactly which campaigns generate leads and revenue.',
      },
      {
        title: 'Targeted Reach',
        description: 'Reach your ideal customers based on demographics, interests, behaviors, and search intent.',
      },
      {
        title: 'Scalable Growth',
        description: 'When you find what works, scale it. Digital channels grow with your business.',
      },
      {
        title: 'Multi-Channel Presence',
        description: 'Be where your customers are-search, social, email-with consistent messaging.',
      },
      {
        title: 'Data-Driven Decisions',
        description: 'Make marketing decisions based on data, not guesses. Optimize continuously based on results.',
      },
    ],
  },
  process: {
    intro: 'Our digital marketing process builds and optimizes campaigns that deliver results:',
    steps: [
      {
        title: 'Discovery & Strategy',
        description: 'We understand your business, customers, and goals to develop the right strategy.',
        details: [
          'Business and goal analysis',
          'Target audience research',
          'Competitor landscape review',
          'Channel opportunity assessment',
          'Strategy recommendation',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Campaign Planning',
        description: 'We plan campaigns across channels with clear objectives and KPIs.',
        details: [
          'Channel selection and prioritization',
          'Budget allocation',
          'Campaign structure',
          'Messaging and creative direction',
          'KPI and tracking setup',
        ],
        duration: 'Week 1-2',
      },
      {
        title: 'Implementation',
        description: 'We set up and launch campaigns across selected channels.',
        details: [
          'Ad account and campaign setup',
          'Creative development',
          'Landing page optimization',
          'Tracking implementation',
          'Campaign launch',
        ],
        duration: 'Weeks 2-3',
      },
      {
        title: 'Optimization',
        description: 'We monitor and optimize campaigns for maximum performance.',
        details: [
          'Performance monitoring',
          'A/B testing',
          'Budget optimization',
          'Audience refinement',
          'Creative iteration',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Reporting & Analysis',
        description: 'We provide transparent reporting on results and insights.',
        details: [
          'Weekly performance monitoring',
          'Monthly comprehensive reports',
          'ROI calculation',
          'Insight and recommendations',
          'Strategy adjustment',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Scale & Expand',
        description: 'We scale what works and explore new opportunities.',
        details: [
          'Scale successful campaigns',
          'New channel testing',
          'Advanced tactics implementation',
          'Continuous improvement',
          'Long-term strategy refinement',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'Campaigns launch within 2-3 weeks. Optimization is continuous, with significant performance improvements typically visible within 30-60 days.',
    deliverables: [
      'Custom marketing strategy',
      'Campaign setup and management',
      'Creative development',
      'Monthly performance reports',
      'Regular strategy calls',
    ],
  },
  industries: {
    intro: 'We provide digital marketing for businesses across industries:',
    list: [
      { name: 'Local Service Businesses', description: 'Plumbers, contractors, and home service pros needing local leads.' },
      { name: 'E-commerce', description: 'Online stores looking to drive traffic and sales.' },
      { name: 'Professional Services', description: 'Consultants, agencies, and B2B service providers.' },
      { name: 'Healthcare', description: 'Medical practices, dentists, and wellness providers.' },
      { name: 'Real Estate', description: 'Agents, brokerages, and property managers.' },
    ],
  },
  faqs: [
    {
      question: 'How much should I spend on digital marketing?',
      answer: 'Marketing budgets vary widely based on goals, competition, and industry. Most small businesses invest 5-10% of revenue in marketing. We recommend starting with a budget that allows meaningful testing. During your consultation, we will help determine the right investment level for your specific situation.',
    },
    {
      question: 'Which digital marketing channels should I use?',
      answer: 'It depends on your business and customers. For local service businesses, we typically recommend SEO and Google Ads. E-commerce often benefits from social media ads. We assess your situation and recommend channels with the best ROI potential.',
    },
    {
      question: 'How long until I see results from digital marketing?',
      answer: 'Paid advertising can generate leads immediately once campaigns are optimized (typically 2-4 weeks). SEO takes 3-6 months for significant results. Content marketing builds over time. We set realistic expectations based on each channel.',
    },
    {
      question: 'How do you measure success?',
      answer: 'We focus on metrics that matter: leads, sales, and revenue. We track conversions, cost per lead, cost per acquisition, and ROI. Monthly reports show exactly what you\'re getting for your investment.',
    },
    {
      question: 'Do you require long-term contracts?',
      answer: 'For most services, we work on a month-to-month basis after an initial 3-month commitment. This gives campaigns time to optimize while giving you flexibility. Some services like SEO require longer timeframes to show results.',
    },
    {
      question: 'Can you work with my small budget?',
      answer: 'We work with various budget levels and recommend starting where it makes sense. Even with limited budgets, we can often identify high-impact opportunities. We\'ll be honest if we don\'t think we can deliver results with your available budget.',
    },
    {
      question: 'What makes you different from other agencies?',
      answer: 'We specialize in small businesses and local service companies-not enterprise clients. We offer transparent pricing, clear communication, and focus on ROI rather than vanity metrics. We become an extension of your team, not just another vendor.',
    },
    {
      question: 'Do you handle everything or do I need to be involved?',
      answer: 'We handle strategy, execution, and optimization. Your involvement is mainly approving strategy, reviewing reports, and providing business updates. We make it easy to stay informed without requiring significant time investment.',
    },
  ],
  cta: {
    headline: 'Ready to Grow Your Business Online?',
    description: 'Get a free digital marketing assessment and discover the best opportunities for your business.',
    buttonText: 'Get Your Free Marketing Assessment',
  },
}

// =============================================================================
// SUB-SERVICE: CONTENT MARKETING
// =============================================================================

export const contentMarketingContent: ServiceContent = {
  hero: {
    headline: 'Content Marketing That Attracts and Converts',
    subheadline: 'SEO-Optimized Content That Builds Authority',
    valueProposition: 'Content is the fuel that powers modern marketing. We create strategic, SEO-optimized content that attracts your ideal customers, establishes your expertise, and converts readers into leads-without feeling salesy.',
  },
  definition: {
    answer: 'Content marketing services create and distribute valuable content to attract and engage your target audience. This includes blog posts, service pages, guides, case studies, and other content optimized for both search engines and readers-designed to build trust, demonstrate expertise, and ultimately drive conversions.',
    expansion: 'Effective content marketing isn\'t about churning out blog posts-it\'s about strategic content that serves business goals. Every piece we create targets specific keywords, addresses real customer questions, and moves readers toward action. We combine SEO expertise with compelling writing to create content that ranks well and resonates with your audience.',
  },
  whyYouNeed: {
    intro: 'Content marketing generates 3x more leads than traditional outbound marketing while costing 62% less. It\'s the foundation of sustainable organic growth.',
    painPoints: [
      {
        title: 'No Time to Create Content',
        description: 'Running a business leaves no time for writing blog posts or updating website copy. Content falls to the bottom of the priority list.',
      },
      {
        title: 'Content That Doesn\'t Rank',
        description: 'You\'ve tried blogging but posts get no traffic. Without SEO strategy, content is invisible no matter how good it is.',
      },
      {
        title: 'Missing Customer Questions',
        description: 'Potential customers have questions at every stage of their journey. Without content answering those questions, you lose them to competitors who do.',
      },
      {
        title: 'No Thought Leadership',
        description: 'You have expertise but no platform to demonstrate it. Potential customers can\'t see why you\'re different from everyone else.',
      },
    ],
    benefits: [
      {
        title: 'Consistent Organic Traffic',
        description: 'SEO-optimized content ranks and drives traffic month after month without ongoing ad spend.',
      },
      {
        title: 'Established Authority',
        description: 'Quality content positions you as the expert in your field, building trust before customers ever contact you.',
      },
      {
        title: 'Lead Generation',
        description: 'Strategic content guides readers toward conversion, capturing leads at every stage of the buying journey.',
      },
      {
        title: 'Better SEO Performance',
        description: 'Fresh, quality content signals relevance to Google, improving rankings across your entire site.',
      },
      {
        title: 'Sales Enablement',
        description: 'Content answers common questions, reducing sales cycles and helping close deals faster.',
      },
    ],
  },
  process: {
    intro: 'Our content marketing process creates strategic content that achieves business results:',
    steps: [
      {
        title: 'Content Strategy',
        description: 'We develop a strategy aligned with your business goals and customer journey.',
        details: [
          'Target audience research',
          'Keyword opportunity analysis',
          'Competitor content audit',
          'Content gap identification',
          'Editorial calendar creation',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Topic Research',
        description: 'We research topics that your audience cares about and search engines reward.',
        details: [
          'Keyword research and selection',
          'Search intent analysis',
          'SERP analysis for each topic',
          'Outline development',
          'Topic cluster planning',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Content Creation',
        description: 'We write expert-level content optimized for both readers and search engines.',
        details: [
          'SEO-optimized writing',
          'Expert research and sourcing',
          'Engaging, reader-friendly style',
          'Clear calls-to-action',
          'Internal linking strategy',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Editing & Optimization',
        description: 'We refine content for maximum impact and SEO performance.',
        details: [
          'Editorial review',
          'SEO element optimization',
          'Readability improvements',
          'Fact-checking',
          'Final polish',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Publishing & Promotion',
        description: 'We publish content and promote it for maximum reach.',
        details: [
          'CMS publishing',
          'Schema markup',
          'Social media promotion',
          'Email newsletter inclusion',
          'Internal link building',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Performance Tracking',
        description: 'We monitor content performance and refine strategy based on results.',
        details: [
          'Ranking tracking',
          'Traffic analysis',
          'Conversion tracking',
          'Content refresh identification',
          'Strategy adjustment',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'Content strategy development takes 1-2 weeks. Ongoing content creation follows your editorial calendar, typically 2-4 pieces per month.',
    deliverables: [
      'Content strategy document',
      'Editorial calendar',
      'SEO-optimized articles',
      'Monthly performance reports',
      'Content refresh recommendations',
    ],
  },
  industries: {
    intro: 'We create content for businesses across industries:',
    list: [
      { name: 'Service Businesses', description: 'Blog posts and service pages that attract local customers.' },
      { name: 'E-commerce', description: 'Product guides, buying guides, and comparison content.' },
      { name: 'Professional Services', description: 'Thought leadership and expertise-demonstrating content.' },
      { name: 'Healthcare', description: 'Patient education content that builds trust and authority.' },
      { name: 'B2B', description: 'Case studies, whitepapers, and decision-stage content.' },
    ],
  },
  faqs: [
    {
      question: 'What types of content do you create?',
      answer: 'We create blog posts, service pages, landing pages, guides, how-to content, case studies, FAQ content, and more. We recommend content types based on your strategy-typically a mix of informational content for awareness and commercial content for conversions.',
    },
    {
      question: 'How much does content marketing cost?',
      answer: 'Content marketing packages typically range from $500-$2,000 per month depending on content volume and complexity. This includes strategy, writing, optimization, and publishing. We customize packages to your budget and goals.',
    },
    {
      question: 'How do you know what topics to write about?',
      answer: 'We use keyword research, competitor analysis, and customer journey mapping to identify high-value topics. We prioritize content that targets keywords with search volume, reasonable competition, and alignment with your services.',
    },
    {
      question: 'Will the content be unique and high-quality?',
      answer: 'Absolutely. All content is originally written by experienced writers, researched for accuracy, and optimized for both readers and search engines. We never use AI-generated content without human expertise and editing.',
    },
    {
      question: 'How long does it take to see results from content?',
      answer: 'Individual posts typically take 2-4 months to rank, with results compounding over time as your content library grows. Consistency is key-regular publishing signals freshness and authority to search engines.',
    },
    {
      question: 'Can I review content before it\'s published?',
      answer: 'Yes, you\'ll have opportunity to review and request revisions before publishing. We want content to accurately represent your expertise and brand voice.',
    },
    {
      question: 'Do you handle publishing or just writing?',
      answer: 'We handle the full process-strategy, writing, optimization, publishing, and promotion. You receive ready-to-rank content with minimal involvement required on your end.',
    },
    {
      question: 'What makes your content different?',
      answer: 'We combine SEO expertise with quality writing. Every piece is strategically targeted at specific keywords, structured for featured snippets and AI overviews, and written to genuinely help readers-which is what Google rewards.',
    },
  ],
  cta: {
    headline: 'Ready to Build Your Content Engine?',
    description: 'Get a free content strategy assessment and see how strategic content can drive organic growth.',
    buttonText: 'Get Your Free Content Assessment',
  },
}

// =============================================================================
// SUB-SERVICE: PPC ADVERTISING
// =============================================================================

export const ppcAdvertisingContent: ServiceContent = {
  hero: {
    headline: 'PPC Advertising That Delivers Real ROI',
    subheadline: 'Data-Driven Paid Advertising Management',
    valueProposition: 'Stop wasting money on ads that don\'t convert. Our PPC management focuses on what matters: generating quality leads at profitable costs. We optimize campaigns continuously to maximize your return on every ad dollar spent.',
  },
  definition: {
    answer: 'PPC (Pay-Per-Click) advertising services manage paid advertising campaigns on platforms like Google Ads, Microsoft Ads, and social media. This includes keyword research, ad creation, bid management, landing page optimization, and continuous refinement-all focused on generating conversions at a profitable cost per acquisition.',
    expansion: 'PPC offers what SEO can\'t: immediate visibility and traffic. When set up correctly, PPC campaigns generate leads from day one. However, without proper management, ad spend quickly goes to waste on irrelevant clicks and poor-performing campaigns. Our PPC management combines strategic planning, continuous optimization, and transparent reporting to turn ad spend into predictable lead generation.',
  },
  whyYouNeed: {
    intro: 'PPC advertising puts your business in front of customers actively searching for your services. With proper management, it\'s one of the most measurable and controllable forms of marketing available.',
    painPoints: [
      {
        title: 'Wasted Ad Spend',
        description: 'Poor targeting, wrong keywords, and inadequate optimization burn through budget without generating quality leads.',
      },
      {
        title: 'No Visibility Into Performance',
        description: 'You\'re spending money but don\'t know what\'s working. Without proper tracking, optimization is impossible.',
      },
      {
        title: 'Unqualified Leads',
        description: 'Ads are generating clicks but not the right customers. You\'re paying for traffic that doesn\'t convert.',
      },
      {
        title: 'Competitors Outbidding You',
        description: 'You\'re not appearing for important keywords because competitors are outspending you with smarter strategies.',
      },
    ],
    benefits: [
      {
        title: 'Immediate Visibility',
        description: 'Unlike SEO, PPC delivers traffic immediately. Appear at the top of search results from day one.',
      },
      {
        title: 'Precise Targeting',
        description: 'Reach exactly who you want based on keywords, location, demographics, and intent.',
      },
      {
        title: 'Measurable Results',
        description: 'Track every click, call, and conversion. Know exactly what you\'re getting for your spend.',
      },
      {
        title: 'Scalable Growth',
        description: 'When campaigns are profitable, scale spending to drive more leads. Control your growth rate.',
      },
      {
        title: 'Budget Control',
        description: 'Set exactly what you want to spend. Pause anytime. No long-term commitments.',
      },
    ],
  },
  process: {
    intro: 'Our PPC management process builds and optimizes campaigns for maximum ROI:',
    steps: [
      {
        title: 'Account Audit & Strategy',
        description: 'We analyze existing campaigns or develop fresh strategy based on your goals.',
        details: [
          'Existing account audit (if applicable)',
          'Competitor ad analysis',
          'Keyword opportunity research',
          'Budget and bid strategy planning',
          'Campaign structure planning',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Campaign Setup',
        description: 'We build campaigns structured for performance and easy optimization.',
        details: [
          'Account structure setup',
          'Keyword research and selection',
          'Negative keyword lists',
          'Ad group organization',
          'Geographic and demographic targeting',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Ad Creation',
        description: 'We write compelling ads that attract clicks and qualify leads.',
        details: [
          'Multiple ad variations',
          'Ad extension setup',
          'Call-to-action optimization',
          'A/B test planning',
          'Ad policy compliance',
        ],
        duration: 'Week 1-2',
      },
      {
        title: 'Conversion Tracking',
        description: 'We implement tracking to measure every conversion and enable optimization.',
        details: [
          'Conversion action setup',
          'Phone call tracking',
          'Form submission tracking',
          'Google Analytics integration',
          'Conversion value assignment',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Launch & Optimization',
        description: 'We launch campaigns and optimize continuously based on performance data.',
        details: [
          'Campaign activation',
          'Daily monitoring',
          'Bid adjustments',
          'Search query refinement',
          'Ad performance optimization',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Reporting & Refinement',
        description: 'We provide transparent reporting and continuously improve results.',
        details: [
          'Weekly performance checks',
          'Monthly detailed reports',
          'ROI analysis',
          'Strategic recommendations',
          'Ongoing optimization',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'Campaigns launch within 1-2 weeks. Initial optimization phase is 2-4 weeks, with continuous refinement ongoing.',
    deliverables: [
      'Campaign strategy document',
      'Fully configured campaigns',
      'Conversion tracking setup',
      'Monthly performance reports',
      'Ongoing optimization',
    ],
  },
  industries: {
    intro: 'We manage PPC campaigns for businesses across industries:',
    list: [
      { name: 'Local Services', description: 'Google Local Services Ads and search campaigns for home service pros.' },
      { name: 'E-commerce', description: 'Shopping campaigns, search ads, and display remarketing.' },
      { name: 'Professional Services', description: 'Lead generation campaigns for B2B and professional services.' },
      { name: 'Healthcare', description: 'HIPAA-compliant advertising for medical practices.' },
      { name: 'Real Estate', description: 'Lead generation for agents, brokerages, and property managers.' },
    ],
  },
  faqs: [
    {
      question: 'How much should I budget for PPC advertising?',
      answer: 'Ad budgets vary based on industry, competition, and goals. The right budget depends on your specific market and objectives. We can work with various budgets and will be honest about what\'s realistic during your consultation.',
    },
    {
      question: 'How quickly will I see results from PPC?',
      answer: 'PPC can generate leads from day one, but campaigns need 2-4 weeks of data to optimize properly. Initial results are typically within the first week, with performance improving as we gather data and optimize.',
    },
    {
      question: 'What\'s your management fee?',
      answer: 'Our PPC management fees are customized based on campaign complexity and scope. We believe in alignment-we succeed when your campaigns succeed. Contact us for specific pricing based on your needs.',
    },
    {
      question: 'Do I own my Google Ads account?',
      answer: 'Yes, absolutely. We set up campaigns in your account which you own completely. If you ever leave, you keep your account, campaign history, and all accumulated data.',
    },
    {
      question: 'What platforms do you manage?',
      answer: 'We primarily manage Google Ads (Search, Display, Local Services) and Microsoft Ads. We also manage social media advertising on Facebook, Instagram, and LinkedIn. We recommend platforms based on where your customers are.',
    },
    {
      question: 'How do you track conversions?',
      answer: 'We implement comprehensive conversion tracking including phone calls, form submissions, and other valuable actions. This lets us optimize toward actual leads, not just clicks, and report on real ROI.',
    },
    {
      question: 'What happens if the campaigns don\'t work?',
      answer: 'PPC involves testing and optimization. Not every approach works immediately, but data tells us what to adjust. We\'re transparent about performance and will recommend strategy changes or honest assessment if PPC isn\'t right for your market.',
    },
    {
      question: 'Can you work with my existing campaigns?',
      answer: 'Yes, we can audit and optimize existing campaigns. Often there are quick improvements possible with current accounts. We\'ll review what\'s working, what isn\'t, and develop an optimization plan.',
    },
  ],
  cta: {
    headline: 'Ready to Get More From Your Ad Spend?',
    description: 'Get a free PPC audit and see how we can improve your campaign performance.',
    buttonText: 'Get Your Free PPC Audit',
  },
}

// =============================================================================
// SUB-SERVICE: SOCIAL MEDIA MARKETING
// =============================================================================

export const socialMediaContent: ServiceContent = {
  hero: {
    headline: 'Social Media Marketing That Builds Your Brand',
    subheadline: 'Strategic Social Presence for Business Growth',
    valueProposition: 'Social media isn\'t just about likes-it\'s about building relationships that drive business results. We help you connect with your audience authentically, build brand awareness, and generate leads through strategic social media marketing.',
  },
  definition: {
    answer: 'Social media marketing services promote your business through platforms like Facebook, Instagram, LinkedIn, and others. This includes content strategy, post creation, community management, paid social advertising, and analytics-all aimed at building brand awareness, engaging your audience, and driving traffic and leads to your business.',
    expansion: 'For local businesses, social media serves as a trust-building channel. It\'s where potential customers see your work, read reviews, and get a sense of who you are before reaching out. Our approach focuses on authentic engagement and strategic content that showcases your expertise and personality, turning followers into customers.',
  },
  whyYouNeed: {
    intro: '70% of consumers feel more connected to brands with CEOs active on social media. Social presence builds trust and keeps your business top-of-mind.',
    painPoints: [
      {
        title: 'No Time for Social Media',
        description: 'Running a business leaves no time for consistent posting. Your profiles are neglected or nonexistent.',
      },
      {
        title: 'Not Sure What to Post',
        description: 'You know you should be on social media but don\'t know what content works or what your audience wants.',
      },
      {
        title: 'No Engagement or Growth',
        description: 'You\'re posting but nobody\'s engaging. Followers aren\'t growing and social isn\'t driving business.',
      },
      {
        title: 'Competitors Have Strong Presence',
        description: 'Competitors are active on social media while you\'re not. They\'re building relationships you\'re missing.',
      },
    ],
    benefits: [
      {
        title: 'Brand Awareness',
        description: 'Stay visible to your audience and reach new potential customers through shareable content.',
      },
      {
        title: 'Trust and Credibility',
        description: 'Active social presence shows you\'re established and engaged. Reviews and customer interactions build trust.',
      },
      {
        title: 'Customer Relationships',
        description: 'Direct communication with customers builds loyalty and provides valuable feedback.',
      },
      {
        title: 'Website Traffic',
        description: 'Strategic content drives traffic to your website where visitors can convert to leads.',
      },
      {
        title: 'Local Visibility',
        description: 'Social media amplifies local presence through check-ins, reviews, and community engagement.',
      },
    ],
  },
  process: {
    intro: 'Our social media marketing process builds an authentic, effective presence:',
    steps: [
      {
        title: 'Strategy Development',
        description: 'We develop a social strategy aligned with your business goals.',
        details: [
          'Platform selection',
          'Audience analysis',
          'Competitor review',
          'Content pillar development',
          'KPI definition',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Profile Optimization',
        description: 'We optimize your social profiles for maximum impact.',
        details: [
          'Profile and bio optimization',
          'Visual branding consistency',
          'Contact information',
          'Pinned content',
          'Link optimization',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Content Planning',
        description: 'We create a content calendar with strategic, engaging posts.',
        details: [
          'Monthly content calendar',
          'Content themes and pillars',
          'Post types mix',
          'Hashtag strategy',
          'Posting schedule',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Content Creation',
        description: 'We create engaging content tailored to each platform.',
        details: [
          'Post copywriting',
          'Image and graphic creation',
          'Video content (as applicable)',
          'Story content',
          'User-generated content curation',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Community Management',
        description: 'We engage with your audience and manage your online community.',
        details: [
          'Comment responses',
          'Message management',
          'Review responses',
          'Engagement with relevant content',
          'Community building',
        ],
        duration: 'Ongoing',
      },
      {
        title: 'Reporting & Optimization',
        description: 'We track performance and refine strategy based on results.',
        details: [
          'Monthly analytics reports',
          'Engagement analysis',
          'Content performance review',
          'Strategy adjustments',
          'Growth tracking',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'Social media management is ongoing. Strategy and setup take 1-2 weeks, with regular posting and engagement continuing monthly.',
    deliverables: [
      'Social media strategy',
      'Content calendar',
      'Regular posting (frequency based on package)',
      'Community management',
      'Monthly analytics reports',
    ],
  },
  industries: {
    intro: 'We manage social media for various business types:',
    list: [
      { name: 'Local Businesses', description: 'Build local presence and showcase work to attract nearby customers.' },
      { name: 'Service Providers', description: 'Share expertise, testimonials, and behind-the-scenes content.' },
      { name: 'E-commerce', description: 'Product showcases, user-generated content, and shoppable posts.' },
      { name: 'Professional Services', description: 'Thought leadership and industry engagement on LinkedIn.' },
      { name: 'Restaurants & Hospitality', description: 'Food photography, events, and customer engagement.' },
    ],
  },
  faqs: [
    {
      question: 'Which social media platforms should my business be on?',
      answer: 'It depends on your audience. Most local businesses benefit from Facebook and Instagram. B2B companies need LinkedIn. We recommend platforms where your customers actually spend time, rather than trying to be everywhere.',
    },
    {
      question: 'How often should I post on social media?',
      answer: 'Quality beats quantity. For most businesses, 3-5 posts per week on main platforms is effective. Consistency matters more than volume-it\'s better to post regularly at a sustainable pace than burn out after a week of daily posts.',
    },
    {
      question: 'How much does social media management cost?',
      answer: 'Social media management packages typically range from $500-$1,500/month depending on platforms, posting frequency, and services included. This covers strategy, content creation, posting, and basic community management.',
    },
    {
      question: 'Will social media actually generate leads?',
      answer: 'Social media is typically a top-of-funnel, awareness-building channel. It builds trust and keeps you top-of-mind, which supports lead generation through other channels. Paid social advertising can generate direct leads.',
    },
    {
      question: 'Can you create content using my photos?',
      answer: 'Yes, we love working with your authentic photos of work, team, and customers. We can also create graphics, source stock photos, and help you capture better content. Your photos typically perform best because they\'re authentic.',
    },
    {
      question: 'Do you respond to comments and messages?',
      answer: 'Yes, community management is included. We monitor and respond to comments, questions, and messages in your brand voice. For sensitive issues, we\'ll flag them for your direct response.',
    },
    {
      question: 'What about paid social advertising?',
      answer: 'Paid social ads are available as a separate or add-on service. We can run targeted campaigns on Facebook, Instagram, and LinkedIn to reach specific audiences. Ad spend is separate from management fees.',
    },
    {
      question: 'How do you measure social media success?',
      answer: 'We track engagement (likes, comments, shares), reach, follower growth, website traffic, and relevant actions. We provide monthly reports showing performance and insights for improvement.',
    },
  ],
  cta: {
    headline: 'Ready to Build Your Social Presence?',
    description: 'Get a free social media audit and see how we can help you connect with your audience.',
    buttonText: 'Get Your Free Social Audit',
  },
}

// =============================================================================
// SUB-SERVICE: ANALYTICS & REPORTING
// =============================================================================

export const analyticsContent: ServiceContent = {
  hero: {
    headline: 'Analytics That Drive Smarter Decisions',
    subheadline: 'Turn Data Into Actionable Insights',
    valueProposition: 'You can\'t improve what you don\'t measure. Our analytics services help you understand exactly how your website and marketing perform, where opportunities exist, and how to optimize for better results.',
  },
  definition: {
    answer: 'Analytics and reporting services set up tracking systems and create reports that measure your website and marketing performance. This includes Google Analytics configuration, conversion tracking, dashboard creation, and regular reporting that translates data into insights you can act on to improve results.',
    expansion: 'Most businesses have Google Analytics installed but don\'t know how to use it. Data sits unused while decisions are made on gut feelings. Our analytics services bridge this gap, setting up proper tracking, creating understandable dashboards, and delivering reports that highlight what matters for your business.',
  },
  whyYouNeed: {
    intro: 'Companies that use data-driven marketing are 6x more likely to be profitable year-over-year. Analytics transforms guesswork into informed strategy.',
    painPoints: [
      {
        title: 'Flying Blind',
        description: 'You don\'t know which marketing channels drive results. Money is spent without understanding what works.',
      },
      {
        title: 'Data Overwhelm',
        description: 'You have analytics but don\'t understand what the numbers mean or which metrics actually matter.',
      },
      {
        title: 'No Conversion Tracking',
        description: 'You can\'t tell which traffic sources generate leads. Attribution is impossible.',
      },
      {
        title: 'Reports Nobody Reads',
        description: 'You receive data dumps that don\'t provide actionable insights. Numbers without meaning.',
      },
    ],
    benefits: [
      {
        title: 'Informed Decisions',
        description: 'Make marketing decisions based on data, not guesses. Know what works and double down.',
      },
      {
        title: 'ROI Visibility',
        description: 'Track which channels generate leads and revenue. Calculate actual marketing ROI.',
      },
      {
        title: 'Optimization Opportunities',
        description: 'Identify underperforming areas and improvement opportunities in your funnel.',
      },
      {
        title: 'Actionable Insights',
        description: 'Receive reports that explain what the data means and what to do about it.',
      },
      {
        title: 'Budget Efficiency',
        description: 'Stop wasting money on what doesn\'t work. Reallocate to high-performing channels.',
      },
    ],
  },
  process: {
    intro: 'Our analytics process creates visibility into what\'s working and what isn\'t:',
    steps: [
      {
        title: 'Audit & Assessment',
        description: 'We review current tracking and identify gaps.',
        details: [
          'Current analytics review',
          'Tracking gap identification',
          'KPI definition',
          'Data quality assessment',
          'Recommendations',
        ],
        duration: 'Week 1',
      },
      {
        title: 'Tracking Setup',
        description: 'We implement comprehensive tracking across your digital presence.',
        details: [
          'Google Analytics 4 configuration',
          'Conversion tracking setup',
          'Event tracking',
          'UTM parameter standards',
          'Cross-domain tracking (if needed)',
        ],
        duration: 'Week 1-2',
      },
      {
        title: 'Dashboard Creation',
        description: 'We create custom dashboards showing metrics that matter.',
        details: [
          'KPI dashboard',
          'Traffic source dashboard',
          'Conversion dashboard',
          'Campaign performance views',
          'Executive summary dashboard',
        ],
        duration: 'Week 2',
      },
      {
        title: 'Integration',
        description: 'We connect data sources for complete visibility.',
        details: [
          'Google Search Console connection',
          'Ad platform integration',
          'CRM integration (if applicable)',
          'Call tracking integration',
          'Form tracking',
        ],
        duration: 'Week 2',
      },
      {
        title: 'Testing & Validation',
        description: 'We verify all tracking is working correctly.',
        details: [
          'Conversion testing',
          'Data accuracy validation',
          'Cross-device testing',
          'Real-time monitoring',
          'Documentation',
        ],
        duration: 'Week 2-3',
      },
      {
        title: 'Ongoing Reporting',
        description: 'We deliver regular reports with insights and recommendations.',
        details: [
          'Monthly performance reports',
          'Trend analysis',
          'Optimization recommendations',
          'Goal tracking',
          'Quarterly reviews',
        ],
        duration: 'Ongoing',
      },
    ],
    timeline: 'Analytics setup takes 2-3 weeks. Ongoing reporting is monthly with quarterly strategy reviews.',
    deliverables: [
      'Analytics audit report',
      'Complete tracking setup',
      'Custom dashboards',
      'Monthly performance reports',
      'Quarterly strategy reviews',
    ],
  },
  industries: {
    intro: 'Analytics services benefit any business with digital presence:',
    list: [
      { name: 'Service Businesses', description: 'Track leads, calls, and form submissions from your website.' },
      { name: 'E-commerce', description: 'Full funnel tracking from traffic to purchase and customer lifetime value.' },
      { name: 'B2B', description: 'Lead tracking and attribution across longer sales cycles.' },
      { name: 'Multi-Location', description: 'Compare performance across locations and markets.' },
      { name: 'Marketing Teams', description: 'Campaign attribution and channel performance comparison.' },
    ],
  },
  faqs: [
    {
      question: 'What is Google Analytics 4 and do I need to upgrade?',
      answer: 'Google Analytics 4 (GA4) is Google\'s current analytics platform, replacing Universal Analytics. If you haven\'t migrated, you\'re likely missing data. We help set up GA4 properly, with tracking configured for your specific needs.',
    },
    {
      question: 'What should I be tracking?',
      answer: 'At minimum: traffic sources, user behavior, and conversions (form submissions, calls, purchases). What constitutes a "conversion" depends on your business. We help identify and track the metrics that actually matter for your goals.',
    },
    {
      question: 'How much do analytics services cost?',
      answer: 'Analytics setup is $100 when included with website development, or available as a standalone service. Ongoing reporting and analysis is included in our SEO packages, or available separately for custom needs.',
    },
    {
      question: 'I have Google Analytics installed. Isn\'t that enough?',
      answer: 'Installation is step one. Most sites have analytics but aren\'t tracking conversions, have incorrect setup, or aren\'t using the data. Proper configuration and understanding turn data into action.',
    },
    {
      question: 'Can you track phone calls?',
      answer: 'Yes, we implement call tracking that attributes calls to traffic sources. You\'ll know which marketing channels generate phone leads, enabling proper ROI calculation.',
    },
    {
      question: 'What about privacy regulations?',
      answer: 'We configure analytics to respect privacy regulations like GDPR and CCPA. This includes cookie consent, data retention settings, and anonymization options as required for your markets.',
    },
    {
      question: 'Will I be able to understand the reports?',
      answer: 'Our reports explain what the numbers mean, not just what they are. We focus on insights and recommendations, not data dumps. Reports are designed for business owners, not data scientists.',
    },
    {
      question: 'Can you access my existing analytics?',
      answer: 'Yes, with your permission we can access and audit your existing analytics setup. We\'ll identify issues, recommend improvements, and can implement changes or guide your team.',
    },
  ],
  cta: {
    headline: 'Ready to Make Data-Driven Decisions?',
    description: 'Get a free analytics audit and see what insights you\'re missing.',
    buttonText: 'Get Your Free Analytics Audit',
  },
}

// =============================================================================
// Export all content organized by service slug
// =============================================================================

export const serviceContentMap: Record<string, ServiceContent> = {
  // Main services
  'seo': seoServiceContent,
  'web-development': webDevelopmentContent,
  'digital-marketing': digitalMarketingContent,
  // SEO sub-services
  'local-seo': localSeoContent,
  'technical-seo': technicalSeoContent,
  'ecommerce-seo': ecommerceSeoContent,
  'international-seo': internationalSeoContent,
  // Web development sub-services
  'website-design': websiteDesignContent,
  'web-applications': webApplicationsContent,
  'ecommerce-development': ecommerceDevelopmentContent,
  // Digital marketing sub-services
  'content-marketing': contentMarketingContent,
  'ppc-advertising': ppcAdvertisingContent,
  'social-media': socialMediaContent,
  'analytics': analyticsContent,
}

// Default author bio for all services
const defaultAuthorBio: AuthorBio = {
  teamName: 'WebWise Digital Team',
  credentials: [
    'Google Partner Certified',
    '5+ Years Experience',
    '50+ Successful Projects',
  ],
  experience: 'over 5 years of combined experience helping local service businesses grow their online presence',
  approach: 'We combine data-driven strategies with industry-specific knowledge to deliver measurable results.',
}

// Helper function to generate TL;DR from service content
function generateTldr(content: ServiceContent, serviceName: string): string[] {
  return [
    `${serviceName} helps businesses increase visibility and generate more leads from search engines`,
    `Our proven process delivers results within 3-6 months with transparent monthly reporting`,
    `Pricing starts at $480/month for small businesses with no long-term contracts required`,
    `Includes comprehensive audit, custom strategy, and ongoing optimization`,
    `Average client sees 340%+ increase in organic traffic within 6 months`,
  ]
}

// Helper function to get content for a service with defaults applied
export function getServiceContent(slug: string): ServiceContent | undefined {
  const content = serviceContentMap[slug]
  if (!content) return undefined

  // Apply defaults for new fields if not present
  const serviceName = content.hero.headline.split(':')[0] || slug.replace(/-/g, ' ')

  return {
    ...content,
    // Add TL;DR if not present
    tldr: content.tldr || generateTldr(content, serviceName),
    // Add question format to definition if not present
    definition: {
      ...content.definition,
      question: content.definition.question || `What Is ${serviceName}?`,
    },
    // Add question format to whyYouNeed if not present
    whyYouNeed: {
      ...content.whyYouNeed,
      question: content.whyYouNeed.question || `Why Does Your Business Need ${serviceName}?`,
    },
    // Add question format to process if not present
    process: {
      ...content.process,
      question: content.process.question || `How Does Our ${serviceName} Process Work?`,
    },
    // Add question format to industries if not present
    industries: {
      ...content.industries,
      question: content.industries.question || `Which Industries Benefit From ${serviceName}?`,
    },
    // Add empty case studies placeholder if not present (user will add real data)
    caseStudies: content.caseStudies || {
      intro: 'See real results from businesses we\'ve helped grow.',
      studies: [], // Empty - user will populate with real client data
    },
    // Add default author bio if not present
    authorBio: content.authorBio || defaultAuthorBio,
  }
}
