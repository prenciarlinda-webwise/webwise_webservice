// Structured content for bespoke /local-seo/[industry] pages (Trust/Proof archetype).
// Each entry replaces what used to be a blog post rendered through the generic blog template.
// Add a new industry here, then point its route file at IndustryPage with this data.

export interface IndustryStat {
  stat: string
  label: string
}

export interface IndustryService {
  title: string
  description: string
  featured?: boolean
}

export interface IndustryProcessStep {
  number: string
  title: string
  timeframe: string
  description: string
}

export interface IndustryPricingTier {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
}

export interface IndustryFAQ {
  question: string
  answer: string
}

export interface IndustryCaseStudy {
  clientKey: string
  caseStudySlug: string
  summary: string
  metrics: { metric: string; label: string }[]
}

export interface IndustryPageContent {
  slug: string
  tradeName: string
  tradePlural: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  h1: string
  underlineWord: string
  heroH2: string
  heroH2Answer: string
  heroSubhead: string
  aeoQuestion: string
  aeoAnswer: string
  aeoIntro: string
  stats: IndustryStat[]
  services: IndustryService[]
  process: IndustryProcessStep[]
  pricingTiers: IndustryPricingTier[]
  caseStudy?: IndustryCaseStudy
  faqs: IndustryFAQ[]
  relatedIndustries: { name: string; slug: string }[]
}

export const industryPages: Record<string, IndustryPageContent> = {
  plumbers: {
    slug: 'plumbers',
    tradeName: 'Plumbers',
    tradePlural: 'plumbing companies',
    metaTitle: 'Local SEO for Plumbers - SEO Leads',
    metaDescription:
      'We help plumbing companies dominate Google Maps and local search. Emergency plumber keywords, Map Pack rankings, and real traffic growth. Free local SEO audit.',
    keywords: [
      'seo for plumbers',
      'plumber seo',
      'local seo for plumbers',
      'plumbing seo',
      'seo for plumbing companies',
      'plumber seo services',
      'plumbing marketing agency',
      'plumber seo company',
      'plumber seo agency',
      'seo services for plumbers',
    ],
    h1: 'Local SEO for Plumbers',
    underlineWord: 'Plumbers',
    heroH2: 'How to Get Found on Google Maps',
    heroH2Answer:
      'You get found on Google Maps by fully optimizing your Google Business Profile, building consistent local citations, earning steady reviews, and publishing dedicated pages for emergency and repiping searches, the mix of fast and high-value jobs that drive plumbing revenue.',
    heroSubhead:
      'Rank for emergency plumber searches and high-value repiping jobs, generate calls without paying per lead, and grow your plumbing business with SEO built specifically for the trade.',
    aeoQuestion: 'What Is Local SEO for Plumbers, and Why Does It Matter?',
    aeoAnswer:
      'Local SEO for plumbers is the process of optimizing a plumbing company’s online presence, its Google Business Profile, citations, reviews, and website, so it ranks at the top of Google when homeowners search for emergency plumbing, water heater repair, or repiping in its service area. The goal is to capture high-intent local searches and convert them into booked jobs without paying per lead on platforms like Angi or HomeAdvisor.',
    aeoIntro:
      'Plumbing searches split into two very different buyers. Someone searching "emergency plumber near me" at 2am has a burst pipe and is calling whoever answers first. Someone searching "whole house repiping cost" is planning a five-figure job and comparing quotes over days. A complete plumbing SEO strategy has to win both, not just the easy emergency traffic.',
    stats: [
      { stat: '50%+', label: 'conversion rate on emergency plumbing searches' },
      { stat: '44%', label: 'of local clicks go to the Map Pack' },
      { stat: '$10,000+', label: 'average value of a repiping job' },
      { stat: '76%', label: 'of local searchers visit or call within 24 hours' },
      { stat: '60 to 90', label: 'days to first Map Pack movement' },
    ],
    services: [
      {
        title: 'Emergency & High-Value Keyword Targeting',
        description:
          'We build for both intent layers, emergency plumber searches that convert the moment they rank, and planned repiping or water heater jobs worth five figures.',
        featured: true,
      },
      {
        title: 'Google Business Profile Optimization',
        description:
          'Complete GBP setup covering service categories, service area configuration, photos, posts, and Q&A, to maximize your Map Pack visibility for emergency and planned searches alike.',
      },
      {
        title: 'Review Request Coaching',
        description:
          'Scripts and timing for asking customers to leave a review right after a job, the habit that builds the star rating and review count Google rewards in the Map Pack.',
      },
      {
        title: 'Service & City Landing Pages',
        description:
          'Dedicated pages for repiping, water heater repair, gas line work, and emergency service, each with city-specific landing pages for every area you serve.',
      },
      {
        title: 'Local Citation Building',
        description:
          'Build and audit citations across Yelp, Apple Maps, Bing Places, and plumbing-specific directories. Fix inconsistent NAP data that suppresses your rankings.',
      },
      {
        title: 'Local Link Building',
        description:
          'Earn backlinks from local news, supplier and manufacturer mentions, and industry associations. Authority links are the fastest path to sustained Map Pack presence.',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Plumbing SEO Audit',
        timeframe: 'Week 1',
        description:
          'We audit your Google Business Profile, existing citations, review standing, competitor Map Pack positions, and website on-page signals. You receive a full findings report.',
      },
      {
        number: '02',
        title: 'Foundation Fixes',
        timeframe: 'Weeks 2 to 4',
        description:
          'Optimize your GBP from top to bottom, fix NAP inconsistencies across directories, build your first batch of core citations, and implement LocalBusiness schema on your site.',
      },
      {
        number: '03',
        title: 'Money-Keyword Pages',
        timeframe: 'Months 2 to 3',
        description:
          'Build dedicated pages for repiping, water heater work, and gas line service, plus city landing pages for every area you serve, then roll out review request coaching.',
      },
      {
        number: '04',
        title: 'Rank & Report',
        timeframe: 'Ongoing',
        description:
          'Track Map Pack positions weekly, report on ranking movements and calls generated, and continuously optimize based on Google algorithm updates.',
      },
    ],
    pricingTiers: [
      {
        name: 'Starter',
        price: '$480',
        description: 'For plumbers just starting local SEO or in lower-competition markets.',
        features: [
          'Google Business Profile optimization',
          'Basic on-page SEO',
          'Monthly reporting',
        ],
      },
      {
        name: 'Growth',
        price: '$780',
        description: 'For plumbing companies ready to compete seriously for Map Pack rankings.',
        popular: true,
        features: [
          'Everything in Starter',
          'Service and city landing pages',
          'Review request coaching',
          'Content creation',
        ],
      },
      {
        name: 'Domination',
        price: '$1,100',
        description: 'For multi-city plumbing companies that need to dominate, not just appear.',
        features: [
          'Everything in Growth',
          'Multi-city aggressive targeting',
          'Emergency-response content',
          'Priority support',
        ],
      },
    ],
    caseStudy: {
      clientKey: 'illyrianplumber',
      caseStudySlug: 'illyrian-group',
      summary:
        'A newer plumbing business in one of the most saturated markets in New Jersey, competing against established companies with thousands of reviews. After a full local SEO campaign and website rebuild, the results were significant.',
      metrics: [
        { metric: '+553%', label: 'Search Impressions' },
        { metric: '+245%', label: 'Monthly Leads' },
        { metric: '911+', label: 'Keywords Ranked' },
        { metric: '#1', label: 'For PEX Repiping NJ' },
      ],
    },
    faqs: [
      {
        question: 'How Much Does Plumber SEO Cost?',
        answer:
          'Our plumbing SEO packages start at $480 a month, with most plumbing companies choosing our $780 a month Growth plan. Given the value of jobs like repiping and water heater replacement, even one additional booked job per month typically covers the investment many times over.',
      },
      {
        question: 'How Long Until My Plumbing Company Ranks on Google?',
        answer:
          'Most plumbing clients see Google Business Profile improvements within 2 to 4 weeks and meaningful ranking gains within 90 days. Emergency keyword rankings often move faster than competitive, planned-job terms like repiping.',
      },
      {
        question: 'Do You Target Both Emergency Calls and Planned Jobs Like Repiping?',
        answer:
          'Yes. We build for both intent layers deliberately. Emergency searches convert fast but are lower value, planned jobs like whole-house repiping are slower but worth five figures. A complete strategy needs both.',
      },
      {
        question: 'Can You Help Us Rank in Multiple Towns?',
        answer:
          'Yes. We build a dedicated, genuinely unique landing page for every town or service area you cover, not thin pages that just swap the city name.',
      },
      {
        question: 'Is SEO Better Than Paying for Plumbing Leads on Angi or HomeAdvisor?',
        answer:
          'Lead marketplaces sell the same homeowner lead to multiple plumbers and charge per lead regardless of whether you win the job. SEO costs a flat monthly fee and every call from your own Google ranking is exclusive to you.',
      },
      {
        question: 'What Should I Look for in an SEO Company for Plumbers?',
        answer:
          'Look for plumbing-specific case studies with real keyword rankings, not just generic testimonials, a strategy that covers both emergency and high-value planned work, and transparent monthly reporting tied to calls, not just rankings.',
      },
    ],
    relatedIndustries: [
      { name: 'roofers', slug: 'roofing' },
      { name: 'painters', slug: 'painters' },
      { name: 'locksmiths', slug: 'locksmiths' },
    ],
  },
  painters: {
    slug: 'painters',
    tradeName: 'Painters',
    tradePlural: 'painting contractors',
    metaTitle: 'Local SEO for Painters - SEO Leads',
    metaDescription:
      'We help painting contractors dominate Google Maps and local search. Exterior repaint keywords, Map Pack rankings, and real traffic growth. Free local SEO audit.',
    keywords: [
      'seo for painters',
      'painter seo',
      'local seo for painters',
      'painting seo',
      'seo for painting companies',
      'painter seo services',
      'painting contractor marketing agency',
      'painter seo company',
      'painter seo agency',
      'seo services for painters',
    ],
    h1: 'Local SEO for Painters',
    underlineWord: 'Painters',
    heroH2: 'How to Get Found on Google Maps',
    heroH2Answer:
      'You get found on Google Maps by fully optimizing your Google Business Profile, building consistent local citations, earning steady reviews, and publishing dedicated pages for exterior, interior, and commercial searches, so your ranking holds up in every season.',
    heroSubhead:
      'Rank for exterior repaint searches and high-value commercial contracts, generate calls without paying per lead, and grow your painting business with SEO built specifically for the trade.',
    aeoQuestion: 'What Is Local SEO for Painters, and Why Does It Matter?',
    aeoAnswer:
      'Local SEO for painters is the process of optimizing a painting contractor’s online presence, its Google Business Profile, citations, reviews, and website, so it ranks at the top of Google when homeowners and property managers search for exterior painting, interior painting, or cabinet refinishing in its service area. The goal is to capture high-intent local searches and convert them into booked jobs without paying per lead on platforms like Angi or Thumbtack.',
    aeoIntro:
      'Painting searches split into two very different rhythms. Exterior repaint searches spike hard every spring and summer and dry up in winter, while interior painting, cabinet refinishing, and commercial contracts stay steady year round. A complete painting SEO strategy has to win the seasonal rush without the pipeline going quiet the rest of the year.',
    stats: [
      { stat: '$3,000 to $9,000+', label: 'average value of a full exterior repaint job' },
      { stat: '44%', label: 'of local clicks go to the Map Pack' },
      { stat: '76%', label: 'of local searchers visit or call within 24 hours' },
      { stat: '60 to 90', label: 'days to first Map Pack movement' },
      { stat: '6 to 12', label: 'months to full market dominance in competitive metros' },
    ],
    services: [
      {
        title: 'Exterior & Interior Keyword Targeting',
        description:
          'We build for both intent layers, seasonal exterior repaint searches that spike every spring, and steady interior and commercial work that keeps the pipeline full year round.',
        featured: true,
      },
      {
        title: 'Google Business Profile Optimization',
        description:
          'Complete GBP setup covering service categories, service area configuration, photos, posts, and Q&A, to maximize your Map Pack visibility in and out of season.',
      },
      {
        title: 'Review Request Coaching',
        description:
          'Scripts and timing for asking customers to leave a review right after a job, the habit that builds the star rating and review count Google rewards in the Map Pack.',
      },
      {
        title: 'Service & City Landing Pages',
        description:
          'Dedicated pages for exterior painting, interior painting, cabinet refinishing, and commercial work, each with city-specific landing pages for every area you serve.',
      },
      {
        title: 'Before & After Gallery Pages',
        description:
          'Project galleries built to actually rank, not just look good, giving homeowners the visual proof they need before they commit to a color and a crew.',
      },
      {
        title: 'Local Citation Building',
        description:
          'Build and audit citations across Yelp, Apple Maps, Bing Places, and painting-specific directories. Fix inconsistent NAP data that suppresses your rankings.',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Painting SEO Audit',
        timeframe: 'Week 1',
        description:
          'We audit your Google Business Profile, existing citations, review standing, competitor Map Pack positions, and website on-page signals. You receive a full findings report.',
      },
      {
        number: '02',
        title: 'Foundation Fixes',
        timeframe: 'Weeks 2 to 4',
        description:
          'Optimize your GBP from top to bottom, fix NAP inconsistencies across directories, build your first batch of core citations, and implement LocalBusiness schema on your site.',
      },
      {
        number: '03',
        title: 'Money-Keyword Pages',
        timeframe: 'Months 2 to 3',
        description:
          'Build dedicated pages for exterior, interior, cabinet refinishing, and commercial work, plus city landing pages and before-and-after galleries, then roll out review request coaching.',
      },
      {
        number: '04',
        title: 'Rank & Report',
        timeframe: 'Ongoing',
        description:
          'Track Map Pack positions weekly, report on ranking movements and calls generated, and continuously optimize based on Google algorithm updates.',
      },
    ],
    pricingTiers: [
      {
        name: 'Starter',
        price: '$480',
        description: 'For painters just starting local SEO or in lower-competition markets.',
        features: [
          'Google Business Profile optimization',
          'Basic on-page SEO',
          'Monthly reporting',
        ],
      },
      {
        name: 'Growth',
        price: '$780',
        description: 'For painting contractors ready to compete seriously for Map Pack rankings.',
        popular: true,
        features: [
          'Everything in Starter',
          'Service and city landing pages',
          'Review request coaching',
          'Content creation',
        ],
      },
      {
        name: 'Domination',
        price: '$1,100',
        description: 'For multi-crew painting companies that need to dominate, not just appear.',
        features: [
          'Everything in Growth',
          'Multi-city aggressive targeting',
          'Commercial and property-management outreach content',
          'Priority support',
        ],
      },
    ],
    caseStudy: {
      clientKey: 'painttechs',
      caseStudySlug: 'paint-techs',
      summary:
        'A residential and commercial painting contractor that needed to stop relying on word of mouth and directory referrals. After a full local SEO campaign and website redesign, the results were significant.',
      metrics: [
        { metric: '+320%', label: 'Organic Traffic' },
        { metric: '+275%', label: 'Monthly Leads' },
        { metric: '45+', label: 'Keywords Ranked' },
        { metric: 'Top 3', label: 'Map Pack Rankings' },
      ],
    },
    faqs: [
      {
        question: 'How Much Does Painting Contractor SEO Cost?',
        answer:
          'Our painting SEO packages start at $480 a month, with most painting contractors choosing our $780 a month Growth plan. Given average job values of $3,000 to $9,000 or more for a full exterior repaint, even one additional booked job per month typically covers the investment many times over.',
      },
      {
        question: 'How Long Until My Painting Company Ranks on Google?',
        answer:
          'Most painting clients see Google Business Profile improvements within 2 to 4 weeks and meaningful ranking gains within 90 days. Painting is seasonal and competitive in most markets, so full market dominance typically takes 6 to 12 months of consistent work.',
      },
      {
        question: 'Does Painting SEO Work for Both Residential and Commercial Contractors?',
        answer:
          'Yes. We build separate keyword strategies and landing pages for residential work like exterior repaints, interior rooms, and cabinet refinishing, and commercial work like office buildings, HOAs, and property management contracts, since the buyers and search terms are completely different.',
      },
      {
        question: 'How Do You Handle the Seasonality of Exterior Painting?',
        answer:
          'Exterior painting demand is highly seasonal in most climates, while interior painting, cabinet refinishing, and commercial work stay steadier year round. We build content and landing pages that ramp exterior visibility ahead of your busy season and keep interior and commercial keywords working through the slower months.',
      },
      {
        question: 'Can You Help Us Rank in Multiple Cities?',
        answer:
          'Yes. We build a dedicated, genuinely unique landing page for every town or service area you cover, not thin pages that just swap the city name.',
      },
      {
        question: 'Is SEO Better Than Paying for Painting Leads on Angi or Thumbtack?',
        answer:
          'Lead marketplaces sell the same homeowner lead to multiple painting contractors and charge per lead regardless of whether you win the job. SEO costs a flat monthly fee and every call from your own Google ranking is exclusive to you.',
      },
    ],
    relatedIndustries: [
      { name: 'plumbers', slug: 'plumbers' },
      { name: 'roofers', slug: 'roofing' },
      { name: 'locksmiths', slug: 'locksmiths' },
    ],
  },
  roofing: {
    slug: 'roofing',
    tradeName: 'Roofers',
    tradePlural: 'roofing companies',
    metaTitle: 'Local SEO for Roofers - SEO Leads',
    metaDescription:
      'We help roofing companies dominate Google Maps and local search. Storm damage and roof replacement keywords, Map Pack rankings, and real traffic growth. Free local SEO audit.',
    keywords: [
      'seo for roofers',
      'roofer seo',
      'local seo for roofers',
      'roofing seo',
      'seo for roofing companies',
      'roofer seo services',
      'roofing marketing agency',
      'roofer seo company',
      'roofer seo agency',
      'seo services for roofers',
    ],
    h1: 'Local SEO for Roofers',
    underlineWord: 'Roofers',
    heroH2: 'How to Get Found on Google Maps',
    heroH2Answer:
      'You get found on Google Maps by fully optimizing your Google Business Profile, building consistent local citations, earning steady reviews, and publishing dedicated pages for storm damage and roof replacement searches, the two intents that drive the highest-value roofing jobs.',
    heroSubhead:
      'Rank for emergency storm-damage searches and high-value roof replacement jobs, generate calls without paying per lead, and grow your roofing business with SEO built specifically for the trade.',
    aeoQuestion: 'What Is Local SEO for Roofers, and Why Does It Matter?',
    aeoAnswer:
      'Local SEO for roofers is the process of optimizing a roofing company’s online presence, its Google Business Profile, citations, reviews, and website, so it ranks at the top of Google when homeowners search for roof replacement, storm damage repair, or emergency roofing in its service area. The goal is to capture high-intent local searches and convert them into booked jobs without paying per lead on platforms like Angi or HomeAdvisor.',
    aeoIntro:
      'Roofing searches split into two very different buyers. Someone searching "storm damage roof repair near me" the day after a hailstorm needs a crew now and is calling whoever answers first. Someone searching "roof replacement cost" is planning a five-figure project and comparing quotes over weeks. A complete roofing SEO strategy has to win both, not just the easy emergency traffic.',
    stats: [
      { stat: '$8,000 to $15,000+', label: 'average value of a roof replacement job' },
      { stat: '44%', label: 'of local clicks go to the Map Pack' },
      { stat: '76%', label: 'of local searchers visit or call within 24 hours' },
      { stat: '60 to 90', label: 'days to first Map Pack movement' },
      { stat: '6 to 12', label: 'months to full market dominance in competitive metros' },
    ],
    services: [
      {
        title: 'Storm & High-Value Keyword Targeting',
        description:
          'We build for both intent layers, storm and emergency searches that spike the moment a hailstorm or hurricane hits, and planned roof replacement jobs worth five figures.',
        featured: true,
      },
      {
        title: 'Google Business Profile Optimization',
        description:
          'Complete GBP setup covering service categories, service area configuration, photos, posts, and Q&A, to maximize your Map Pack visibility for emergency and planned searches alike.',
      },
      {
        title: 'Review Request Coaching',
        description:
          'Scripts and timing for asking customers to leave a review right after a job, the habit that builds the star rating and review count Google rewards in the Map Pack.',
      },
      {
        title: 'Service & City Landing Pages',
        description:
          'Dedicated pages for roof replacement, storm damage repair, and emergency service, each with city-specific landing pages for every area you serve.',
      },
      {
        title: 'Local Citation Building',
        description:
          'Build and audit citations across Yelp, Apple Maps, Bing Places, and roofing-specific directories. Fix inconsistent NAP data that suppresses your rankings.',
      },
      {
        title: 'Local Link Building',
        description:
          'Earn backlinks from local news, supplier and manufacturer mentions, and industry associations. Authority links are the fastest path to sustained Map Pack presence.',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Roofing SEO Audit',
        timeframe: 'Week 1',
        description:
          'We audit your Google Business Profile, existing citations, review standing, competitor Map Pack positions, and website on-page signals. You receive a full findings report.',
      },
      {
        number: '02',
        title: 'Foundation Fixes',
        timeframe: 'Weeks 2 to 4',
        description:
          'Optimize your GBP from top to bottom, fix NAP inconsistencies across directories, build your first batch of core citations, and implement LocalBusiness schema on your site.',
      },
      {
        number: '03',
        title: 'Money-Keyword Pages',
        timeframe: 'Months 2 to 3',
        description:
          'Build dedicated pages for roof replacement, storm damage, and emergency service, plus city landing pages for every area you serve, then roll out review request coaching.',
      },
      {
        number: '04',
        title: 'Rank & Report',
        timeframe: 'Ongoing',
        description:
          'Track Map Pack positions weekly, report on ranking movements and calls generated, and continuously optimize based on Google algorithm updates.',
      },
    ],
    pricingTiers: [
      {
        name: 'Starter',
        price: '$480',
        description: 'For roofers just starting local SEO or in lower-competition markets.',
        features: [
          'Google Business Profile optimization',
          'Basic on-page SEO',
          'Monthly reporting',
        ],
      },
      {
        name: 'Growth',
        price: '$780',
        description: 'For roofing companies ready to compete seriously for Map Pack rankings.',
        popular: true,
        features: [
          'Everything in Starter',
          'Service and city landing pages',
          'Review request coaching',
          'Content creation',
        ],
      },
      {
        name: 'Domination',
        price: '$1,100',
        description: 'For multi-city roofing companies that need to dominate, not just appear.',
        features: [
          'Everything in Growth',
          'Multi-city aggressive targeting',
          'Storm damage rapid-response content',
          'Priority support',
        ],
      },
    ],
    caseStudy: {
      clientKey: 'gimosroofing',
      caseStudySlug: 'gimos-roofing',
      summary:
        'A Jacksonville-area roofing company competing against established contractors across Northeast Florida. After a full local SEO campaign and website build, the results were significant.',
      metrics: [
        { metric: '+380%', label: 'Organic Traffic' },
        { metric: '+295%', label: 'Monthly Leads' },
        { metric: '52+', label: 'Keywords Ranked' },
        { metric: 'AI Overview', label: 'Cited as a Top-Rated 24/7 Contractor' },
      ],
    },
    faqs: [
      {
        question: 'How Much Does Roofing SEO Cost?',
        answer:
          'Our roofing SEO packages start at $480 a month, with most roofing companies choosing our $780 a month Growth plan. Given average job values of $8,000 to $15,000 or more, even one additional booked job per month typically covers the investment many times over.',
      },
      {
        question: 'How Long Until My Roofing Company Ranks on Google?',
        answer:
          'Most roofing clients see Google Business Profile improvements within 2 to 4 weeks and meaningful ranking gains within 90 days. Roofing is highly competitive, so full market dominance typically takes 6 to 12 months of consistent work.',
      },
      {
        question: 'Do You Help With Storm Damage and Emergency Keywords?',
        answer:
          'Yes. We build strategies that capture emergency storm damage searches the moment they spike, alongside homeowners researching planned roof replacements. Both are valuable, and we target both.',
      },
      {
        question: 'Can You Help Us Rank in Multiple Cities?',
        answer:
          'Yes. We build a dedicated, genuinely unique landing page for every town or service area you cover, not thin pages that just swap the city name.',
      },
      {
        question: 'What Makes Roofing SEO Different?',
        answer:
          'Roofing has uniquely high job values, storm-driven demand spikes, and intense local competition. We build strategies around those dynamics instead of running a generic local SEO playbook.',
      },
      {
        question: 'Is SEO Better Than Paying for Roofing Leads on Angi or HomeAdvisor?',
        answer:
          'Lead marketplaces sell the same homeowner lead to multiple roofers and charge per lead regardless of whether you win the job. SEO costs a flat monthly fee and every call from your own Google ranking is exclusive to you.',
      },
    ],
    relatedIndustries: [
      { name: 'plumbers', slug: 'plumbers' },
      { name: 'painters', slug: 'painters' },
      { name: 'locksmiths', slug: 'locksmiths' },
    ],
  },
  locksmiths: {
    slug: 'locksmiths',
    tradeName: 'Locksmiths',
    tradePlural: 'locksmith businesses',
    metaTitle: 'Local SEO for Locksmiths - SEO Leads',
    metaDescription:
      'We help locksmith businesses dominate Google Maps and local search. Emergency lockout keywords, Map Pack rankings, and real call growth. Free local SEO audit.',
    keywords: [
      'seo for locksmiths',
      'locksmith seo',
      'local seo for locksmiths',
      'locksmith seo services',
      'locksmith marketing agency',
      'emergency locksmith seo',
      'locksmith seo company',
      'locksmith seo agency',
      'seo services for locksmiths',
      'locksmith lead generation',
    ],
    h1: 'Local SEO for Locksmiths',
    underlineWord: 'Locksmiths',
    heroH2: 'How to Get Found on Google Maps',
    heroH2Answer:
      'You get found on Google Maps by fully optimizing your Google Business Profile, building consistent local citations, earning steady reviews, and publishing dedicated pages for every lockout and key service you offer, since the Google Maps pack drives roughly 70% of all locksmith calls.',
    heroSubhead:
      'Rank for emergency lockout searches and every service call in between, generate calls without paying per lead, and grow your locksmith business with SEO built specifically for the trade.',
    aeoQuestion: 'What Is Local SEO for Locksmiths, and Why Does It Matter?',
    aeoAnswer:
      'Local SEO for locksmiths is the process of optimizing a locksmith business’s online presence, its Google Business Profile, citations, reviews, and website, so it ranks at the top of Google when customers search for emergency lockouts, rekeying, or car key replacement in its service area. The goal is to capture high-intent local searches and convert them into exclusive calls without paying per lead on platforms like Angi or HomeAdvisor.',
    aeoIntro:
      'Locksmith searches are almost entirely emergency-driven. Someone locked out of their house or car does not compare ten options, they call the first business that looks trustworthy on Google and answers the phone. That makes the Map Pack the single most important factor in the entire business, and it is exactly where unlicensed operators try to outrank legitimate locksmiths with aggressive, low-quality SEO tactics.',
    stats: [
      { stat: '97%', label: 'of people search online when they need a locksmith' },
      { stat: '70%', label: 'of all locksmith calls come from the Google Maps pack' },
      { stat: '40%+', label: 'call rate on emergency lockout searches' },
      { stat: '$150 to $400', label: 'typical value of a single emergency lockout call' },
      { stat: '60 to 90', label: 'days to measurable Map Pack improvement' },
    ],
    services: [
      {
        title: 'Emergency & Service-Category Keyword Targeting',
        description:
          'We build for every service category, emergency lockouts that convert the moment they rank, plus rekeying, car key replacement, and commercial access work.',
        featured: true,
      },
      {
        title: 'Google Business Profile Optimization',
        description:
          'Complete GBP setup covering service categories, service area configuration, photos, posts, and Q&A, to maximize your visibility in the Google Maps 3-pack.',
      },
      {
        title: 'Review Request Coaching',
        description:
          'Scripts and timing for asking customers to leave a review right after a job, the habit that builds the star rating and review count Google rewards in the Map Pack.',
      },
      {
        title: 'Service & City Landing Pages',
        description:
          'Dedicated pages for emergency lockouts, residential, commercial, and automotive key services, each with city and neighborhood landing pages for every area you serve.',
      },
      {
        title: 'Local Citation Building',
        description:
          'Build and audit citations across Yelp, Apple Maps, Bing Places, and locksmith-specific directories like ALOA. Fix inconsistent NAP data that suppresses your rankings.',
      },
      {
        title: 'Trust & Legitimacy Signals',
        description:
          'Consistent citations, verified reviews, and a trustworthy, well-optimized website, exactly the signals scam and unlicensed listings tend to lack, so your real business outranks them.',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Locksmith SEO Audit',
        timeframe: 'Week 1',
        description:
          'We audit your Google Business Profile, existing citations, review standing, competitor Map Pack positions, and website on-page signals. You receive a full findings report.',
      },
      {
        number: '02',
        title: 'Foundation Fixes',
        timeframe: 'Week 2',
        description:
          'Optimize your GBP from top to bottom, fix NAP inconsistencies across directories, build your first batch of core citations including ALOA and industry directories, and implement LocalBusiness schema on your site.',
      },
      {
        number: '03',
        title: 'Service & City Pages',
        timeframe: 'Weeks 2 to 4',
        description:
          'Build dedicated pages for emergency lockouts, residential, commercial, and automotive key services, plus city and neighborhood landing pages, then roll out review request coaching.',
      },
      {
        number: '04',
        title: 'Rank & Report',
        timeframe: 'Ongoing',
        description:
          'Track Map Pack positions weekly, report on ranking movements and calls generated, and continuously optimize based on Google algorithm updates.',
      },
    ],
    pricingTiers: [
      {
        name: 'Starter',
        price: '$480',
        description: 'For locksmiths just starting local SEO or in lower-competition markets.',
        features: [
          'Google Business Profile optimization',
          'Basic on-page SEO',
          'Monthly reporting',
        ],
      },
      {
        name: 'Growth',
        price: '$780',
        description: 'For locksmith businesses ready to compete seriously for Map Pack rankings.',
        popular: true,
        features: [
          'Everything in Starter',
          'Service and city landing pages',
          'Review request coaching',
          'Content creation',
        ],
      },
      {
        name: 'Domination',
        price: '$1,100',
        description: 'For multi-city locksmith businesses that need to dominate, not just appear.',
        features: [
          'Everything in Growth',
          'Multi-city aggressive targeting',
          'Emergency-response content',
          'Priority support',
        ],
      },
    ],
    faqs: [
      {
        question: 'How Much Does Locksmith SEO Cost?',
        answer:
          'Our locksmith SEO packages start at $480 a month, with most locksmith businesses choosing our $780 a month Growth plan. A single emergency lockout call is often worth $150 to $400, so even a modest increase in organic calls typically covers the investment many times over.',
      },
      {
        question: 'How Long Does Locksmith SEO Take to Show Results?',
        answer:
          'Most locksmith businesses see measurable Google Maps improvements within 60 to 90 days. Quick wins from Google Business Profile optimization can start generating new calls within the first month.',
      },
      {
        question: 'How Is Locksmith SEO Different From Paying for Leads on Angi or HomeAdvisor?',
        answer:
          'Lead marketplaces charge $30 to $75 per lead and send the same customer to three to five locksmiths at once. SEO costs a flat monthly fee and every call from your own Google ranking is exclusive to you.',
      },
      {
        question: 'Can You Help Us Rank in Multiple Cities?',
        answer:
          'Yes. Locksmiths often cover 15 or more towns with a single generic page, so Google does not know which areas to rank them in. We build a dedicated, genuinely unique landing page for every city and neighborhood you serve.',
      },
      {
        question: 'How Do You Handle Competition From Fake or Scam Locksmith Listings?',
        answer:
          'Google increasingly rewards businesses that prove legitimacy through consistent citations, verified reviews, and a trustworthy website, exactly the signals scam listings tend to lack. We build those trust signals deliberately so your real business outranks them.',
      },
      {
        question: 'How Important Are Google Reviews for Locksmith SEO?',
        answer:
          'Reviews are one of the top three ranking factors for Google Maps. Locksmiths with 50 or more reviews and a 4.7 star rating or higher consistently outrank competitors in the local pack, so we coach you on the timing and scripts that build that review count.',
      },
    ],
    relatedIndustries: [
      { name: 'plumbers', slug: 'plumbers' },
      { name: 'roofers', slug: 'roofing' },
      { name: 'painters', slug: 'painters' },
    ],
  },
}

export const getIndustryPageContent = (slug: string): IndustryPageContent | undefined => industryPages[slug]
