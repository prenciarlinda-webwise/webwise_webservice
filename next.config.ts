import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
      },
      {
        protocol: 'https',
        hostname: 'image.thum.io',
      },
    ],
  },

  // Prevent Next.js from auto-redirecting trailing slashes (avoids redirect chains)
  skipTrailingSlashRedirect: true,

  // No rewrites needed - all URLs now have actual page files with correct canonicals
  // Redirects handle old URL → new URL mapping

  async redirects() {
    return [
      // ============================================
      // URL RESTRUCTURE 2026 - Old URLs → New Short URLs (301 redirects)
      // ============================================

      // SEO Services - Old deep URLs to new flat URLs
      { source: '/services', destination: '/seo-services', statusCode: 301 },
      { source: '/services/', destination: '/seo-services', statusCode: 301 },
      { source: '/services/seo', destination: '/seo-services', statusCode: 301 },
      { source: '/services/seo/', destination: '/seo-services', statusCode: 301 },
      { source: '/services/seo/local-seo', destination: '/local-seo', statusCode: 301 },
      { source: '/services/seo/local-seo/', destination: '/local-seo', statusCode: 301 },
      { source: '/services/seo/technical-seo', destination: '/technical-seo', statusCode: 301 },
      { source: '/services/seo/technical-seo/', destination: '/technical-seo', statusCode: 301 },
      { source: '/services/seo/ecommerce-seo', destination: '/ecommerce-seo', statusCode: 301 },
      { source: '/services/seo/ecommerce-seo/', destination: '/ecommerce-seo', statusCode: 301 },
      { source: '/services/seo/international-seo', destination: '/international-seo', statusCode: 301 },
      { source: '/services/seo/international-seo/', destination: '/international-seo', statusCode: 301 },

      // Web Development → Web Design
      { source: '/services/web-development', destination: '/development', statusCode: 301 },
      { source: '/services/web-development/', destination: '/development', statusCode: 301 },
      { source: '/services/web-development/website-design', destination: '/development', statusCode: 301 },
      { source: '/services/web-development/website-design/', destination: '/development', statusCode: 301 },
      { source: '/services/web-development/web-applications', destination: '/development/applications', statusCode: 301 },
      { source: '/services/web-development/web-applications/', destination: '/development/applications', statusCode: 301 },
      { source: '/services/web-development/ecommerce-development', destination: '/development/ecommerce', statusCode: 301 },
      { source: '/services/web-development/ecommerce-development/', destination: '/development/ecommerce', statusCode: 301 },

      // Digital Marketing - Shorten paths
      { source: '/services/digital-marketing', destination: '/digital-marketing', statusCode: 301 },
      { source: '/services/digital-marketing/', destination: '/digital-marketing', statusCode: 301 },
      { source: '/services/digital-marketing/content-marketing', destination: '/digital-marketing/content', statusCode: 301 },
      { source: '/services/digital-marketing/content-marketing/', destination: '/digital-marketing/content', statusCode: 301 },
      { source: '/services/digital-marketing/ppc-advertising', destination: '/digital-marketing/ppc', statusCode: 301 },
      { source: '/services/digital-marketing/ppc-advertising/', destination: '/digital-marketing/ppc', statusCode: 301 },
      { source: '/services/digital-marketing/social-media', destination: '/digital-marketing/social-management', statusCode: 301 },
      { source: '/services/digital-marketing/social-media/', destination: '/digital-marketing/social-management', statusCode: 301 },
      { source: '/services/digital-marketing/analytics', destination: '/digital-marketing/analytics', statusCode: 301 },
      { source: '/services/digital-marketing/analytics/', destination: '/digital-marketing/analytics', statusCode: 301 },

      // Blog → Local SEO Industry Pages (blog posts becoming service pages)
      { source: '/blog/local-seo-for-plumbers-complete-guide', destination: '/local-seo/plumbers', statusCode: 301 },
      { source: '/blog/local-seo-for-plumbers-complete-guide/', destination: '/local-seo/plumbers', statusCode: 301 },
      { source: '/blog/hvac-seo-complete-guide', destination: '/local-seo/hvac', statusCode: 301 },
      { source: '/blog/hvac-seo-complete-guide/', destination: '/local-seo/hvac', statusCode: 301 },
      { source: '/blog/roofing-company-seo-strategy', destination: '/local-seo/roofing', statusCode: 301 },
      { source: '/blog/roofing-company-seo-strategy/', destination: '/local-seo/roofing', statusCode: 301 },
      { source: '/blog/electrician-seo-guide', destination: '/local-seo/electricians', statusCode: 301 },
      { source: '/blog/electrician-seo-guide/', destination: '/local-seo/electricians', statusCode: 301 },
      { source: '/blog/auto-detailing-seo-get-more-customers', destination: '/local-seo/auto-detailing', statusCode: 301 },
      { source: '/blog/auto-detailing-seo-get-more-customers/', destination: '/local-seo/auto-detailing', statusCode: 301 },
      { source: '/blog/dumpster-rental-seo-dominate-local-search', destination: '/local-seo/dumpster-rental', statusCode: 301 },
      { source: '/blog/dumpster-rental-seo-dominate-local-search/', destination: '/local-seo/dumpster-rental', statusCode: 301 },
      { source: '/blog/landscaping-seo-grow-your-business', destination: '/local-seo/landscaping', statusCode: 301 },
      { source: '/blog/landscaping-seo-grow-your-business/', destination: '/local-seo/landscaping', statusCode: 301 },
      { source: '/blog/pest-control-seo-strategy', destination: '/local-seo/pest-control', statusCode: 301 },
      { source: '/blog/pest-control-seo-strategy/', destination: '/local-seo/pest-control', statusCode: 301 },
      { source: '/blog/cleaning-company-seo-guide', destination: '/local-seo/cleaning', statusCode: 301 },
      { source: '/blog/cleaning-company-seo-guide/', destination: '/local-seo/cleaning', statusCode: 301 },
      { source: '/blog/moving-company-seo-guide', destination: '/local-seo/moving', statusCode: 301 },
      { source: '/blog/moving-company-seo-guide/', destination: '/local-seo/moving', statusCode: 301 },
      { source: '/blog/construction-company-seo-strategy', destination: '/local-seo/construction', statusCode: 301 },
      { source: '/blog/construction-company-seo-strategy/', destination: '/local-seo/construction', statusCode: 301 },

      // Blog URL Shortening (remaining blog posts)
      { source: '/blog/how-much-does-seo-cost-for-small-business', destination: '/blog/seo-pricing', statusCode: 301 },
      { source: '/blog/how-much-does-seo-cost-for-small-business/', destination: '/blog/seo-pricing', statusCode: 301 },
      { source: '/blog/how-long-does-seo-take-to-work', destination: '/blog/seo-timeline', statusCode: 301 },
      { source: '/blog/how-long-does-seo-take-to-work/', destination: '/blog/seo-timeline', statusCode: 301 },
      { source: '/blog/google-business-profile-optimization-guide', destination: '/blog/gbp-optimization', statusCode: 301 },
      { source: '/blog/google-business-profile-optimization-guide/', destination: '/blog/gbp-optimization', statusCode: 301 },
      { source: '/blog/local-seo-uk-vs-usa-differences', destination: '/blog/local-seo-uk-vs-usa', statusCode: 301 },
      { source: '/blog/local-seo-uk-vs-usa-differences/', destination: '/blog/local-seo-uk-vs-usa', statusCode: 301 },

      // Portfolio → Case Studies
      { source: '/portfolio', destination: '/case-studies', statusCode: 301 },
      { source: '/portfolio/', destination: '/case-studies', statusCode: 301 },
      { source: '/portfolio/illyrian-group-plumbing-seo-web-development', destination: '/case-studies/illyrian-group', statusCode: 301 },
      { source: '/portfolio/gimos-roofing-local-seo-website-design', destination: '/case-studies/gimos-roofing', statusCode: 301 },
      { source: '/portfolio/albros-premium-detailing-seo-website-design', destination: '/case-studies/albros-detailing', statusCode: 301 },
      { source: '/portfolio/northstar-home-improvement-seo-website-development', destination: '/case-studies/northstar', statusCode: 301 },
      { source: '/portfolio/904-dumpster-rental-jacksonville-seo-website', destination: '/case-studies/904-dumpster', statusCode: 301 },
      { source: '/portfolio/gjej-pro-marketplace-web-application-seo', destination: '/case-studies/gjej-pro', statusCode: 301 },
      { source: '/portfolio/paint-techs-painting-contractor-seo-website-redesign', destination: '/case-studies/paint-techs', statusCode: 301 },
      { source: '/portfolio/sunrise-auto-rent-car-rental-website-design', destination: '/case-studies/sunrise-auto', statusCode: 301 },
      { source: '/portfolio/kn-flooring-contractor-website-design', destination: '/case-studies/kn-flooring', statusCode: 301 },
      { source: '/portfolio/kryemadhi-car-rental-albania-website-design', destination: '/case-studies/kryemadhi', statusCode: 301 },
      { source: '/portfolio/gnt-home-remodeling-contractor-website-design', destination: '/case-studies/gnt-remodeling', statusCode: 301 },
      { source: '/portfolio/eli-taxi-durres-albania-website-design', destination: '/case-studies/eli-taxi', statusCode: 301 },
      { source: '/portfolio/msc-certification-web-application-development', destination: '/case-studies/msc-certification', statusCode: 301 },
      { source: '/portfolio/aaa-remodels-jacksonville-home-remodeling-seo-website', destination: '/case-studies/aaa-remodels', statusCode: 301 },

      // ============================================
      // OLD WORDPRESS REDIRECTS (updated destinations to new URLs)
      // ============================================
      { source: '/contact-us', destination: '/contact', statusCode: 301 },
      { source: '/contact-us/', destination: '/contact', statusCode: 301 },
      { source: '/about-us', destination: '/about', statusCode: 301 },
      { source: '/about-us/', destination: '/about', statusCode: 301 },
      { source: '/pricing-plans', destination: '/pricing', statusCode: 301 },
      { source: '/pricing-plans/', destination: '/pricing', statusCode: 301 },
      { source: '/pricing-plans/:path*', destination: '/pricing', statusCode: 301 },

      // Old service pages → new URLs
      { source: '/expert-seo-services', destination: '/seo-services', statusCode: 301 },
      { source: '/expert-seo-services/', destination: '/seo-services', statusCode: 301 },
      { source: '/professional-web-development', destination: '/development', statusCode: 301 },
      { source: '/professional-web-development/', destination: '/development', statusCode: 301 },
      { source: '/web-app-development', destination: '/development/applications', statusCode: 301 },
      { source: '/web-app-development/', destination: '/development/applications', statusCode: 301 },
      { source: '/free-website-audit', destination: '/contact', statusCode: 301 },
      { source: '/free-website-audit/', destination: '/contact', statusCode: 301 },

      // Old blog posts → new URLs
      { source: '/the-ultimate-guide-to-local-seo', destination: '/local-seo/plumbers', statusCode: 301 },
      { source: '/the-ultimate-guide-to-local-seo/', destination: '/local-seo/plumbers', statusCode: 301 },
      { source: '/the-ultimate-guide-to-local-seo/:path*', destination: '/local-seo/plumbers', statusCode: 301 },
      { source: '/the-ultimate-guide-to-ecommerce-seo-services', destination: '/ecommerce-seo', statusCode: 301 },
      { source: '/the-ultimate-guide-to-ecommerce-seo-services/', destination: '/ecommerce-seo', statusCode: 301 },
      { source: '/the-ultimate-guide-to-ecommerce-seo-services/:path*', destination: '/ecommerce-seo', statusCode: 301 },
      { source: '/how-local-seo-services-drive-targeted-traffic', destination: '/local-seo', statusCode: 301 },
      { source: '/how-local-seo-services-drive-targeted-traffic/', destination: '/local-seo', statusCode: 301 },
      { source: '/how-local-seo-services-drive-targeted-traffic/:path*', destination: '/local-seo', statusCode: 301 },
      { source: '/partnering-with-904-dumpster-a-journey-to-seo-growth', destination: '/case-studies/904-dumpster', statusCode: 301 },
      { source: '/partnering-with-904-dumpster-a-journey-to-seo-growth/', destination: '/case-studies/904-dumpster', statusCode: 301 },
      { source: '/partnering-with-904-dumpster-a-journey-to-seo-growth/:path*', destination: '/case-studies/904-dumpster', statusCode: 301 },
      { source: '/search-engine-optimization-seo-starter-guide', destination: '/seo-services', statusCode: 301 },
      { source: '/search-engine-optimization-seo-starter-guide/', destination: '/seo-services', statusCode: 301 },
      { source: '/search-engine-optimization-seo-starter-guide/:path*', destination: '/seo-services', statusCode: 301 },
      { source: '/why-digital-marketing-is-essential-for-modern-businesses', destination: '/digital-marketing', statusCode: 301 },
      { source: '/why-digital-marketing-is-essential-for-modern-businesses/', destination: '/digital-marketing', statusCode: 301 },
      { source: '/why-digital-marketing-is-essential-for-modern-businesses/:path*', destination: '/digital-marketing', statusCode: 301 },

      // More old blog posts
      { source: '/seo-vs-ppc-which-one-is-right-for-your-business', destination: '/blog/seo-vs-ppc', statusCode: 301 },
      { source: '/seo-vs-ppc-which-one-is-right-for-your-business/', destination: '/blog/seo-vs-ppc', statusCode: 301 },
      { source: '/seo-vs-ppc-which-one-is-right-for-your-business/:path*', destination: '/blog/seo-vs-ppc', statusCode: 301 },
      { source: '/understanding-the-basics-of-on-page-seo', destination: '/blog', statusCode: 301 },
      { source: '/understanding-the-basics-of-on-page-seo/', destination: '/blog', statusCode: 301 },
      { source: '/maximizing-user-engagement-with-custom-web-design', destination: '/development', statusCode: 301 },
      { source: '/maximizing-user-engagement-with-custom-web-design/', destination: '/development', statusCode: 301 },
      { source: '/maximizing-user-engagement-with-custom-web-design/:path*', destination: '/development', statusCode: 301 },
      { source: '/improving-website-speed-for-better-seo-results', destination: '/technical-seo', statusCode: 301 },
      { source: '/improving-website-speed-for-better-seo-results/', destination: '/technical-seo', statusCode: 301 },
      { source: '/improving-website-speed-for-better-seo-results/:path*', destination: '/technical-seo', statusCode: 301 },
      { source: '/the-role-of-backlinks-in-seo', destination: '/seo-services', statusCode: 301 },
      { source: '/the-role-of-backlinks-in-seo/', destination: '/seo-services', statusCode: 301 },
      { source: '/how-mobile-optimization-impacts-seo', destination: '/technical-seo', statusCode: 301 },
      { source: '/how-mobile-optimization-impacts-seo/', destination: '/technical-seo', statusCode: 301 },
      { source: '/how-to-choose-the-right-website-development-agency', destination: '/development', statusCode: 301 },
      { source: '/how-to-choose-the-right-website-development-agency/', destination: '/development', statusCode: 301 },
      { source: '/why-every-business-needs-seo-services-in-2024', destination: '/seo-services', statusCode: 301 },
      { source: '/why-every-business-needs-seo-services-in-2024/', destination: '/seo-services', statusCode: 301 },
      { source: '/why-every-business-needs-seo-services-in-2024/:path*', destination: '/seo-services', statusCode: 301 },
      { source: '/top-5-reasons-custom-websites-improve-business-performance', destination: '/development', statusCode: 301 },
      { source: '/top-5-reasons-custom-websites-improve-business-performance/', destination: '/development', statusCode: 301 },
      { source: '/essential-seo-strategies-for-small-businesses', destination: '/local-seo', statusCode: 301 },
      { source: '/essential-seo-strategies-for-small-businesses/', destination: '/local-seo', statusCode: 301 },
      { source: '/why-hire-a-website-design-and-development-company', destination: '/development', statusCode: 301 },
      { source: '/why-hire-a-website-design-and-development-company/', destination: '/development', statusCode: 301 },

      // NOTE: Old category, author, date archives, feeds, blog/page, home, woocommerce-placeholder
      // are handled in middleware.ts as 410 Gone

      // Privacy and Terms
      { source: '/privacy', destination: '/privacy-policy', statusCode: 301 },
      { source: '/privacy/', destination: '/privacy-policy', statusCode: 301 },
      { source: '/terms', destination: '/terms-and-agreements', statusCode: 301 },
      { source: '/terms/', destination: '/terms-and-agreements', statusCode: 301 },

      // Old WordPress media/image URLs
      { source: '/favicon-website-and-seo-company-04', destination: '/', statusCode: 301 },
      { source: '/favicon-website-and-seo-company-04/', destination: '/', statusCode: 301 },
      { source: '/ezgif-2-4efa954176', destination: '/', statusCode: 301 },
      { source: '/ezgif-2-4efa954176/', destination: '/', statusCode: 301 },

      // Other old service pages
      { source: '/seo-agency-3', destination: '/seo-services', statusCode: 301 },
      { source: '/seo-agency-3/', destination: '/seo-services', statusCode: 301 },
      { source: '/seo-services-2', destination: '/seo-services', statusCode: 301 },
      { source: '/seo-services-2/', destination: '/seo-services', statusCode: 301 },
      { source: '/web-development', destination: '/development', statusCode: 301 },
      { source: '/web-development/', destination: '/development', statusCode: 301 },
      { source: '/website-and-seo', destination: '/', statusCode: 301 },
      { source: '/website-and-seo/', destination: '/', statusCode: 301 },
    ];
  },
};

export default nextConfig;
