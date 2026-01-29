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
      { source: '/services', destination: '/seo-services', permanent: true },
      { source: '/services/', destination: '/seo-services', permanent: true },
      { source: '/services/seo', destination: '/seo-services', permanent: true },
      { source: '/services/seo/', destination: '/seo-services', permanent: true },
      { source: '/services/seo/local-seo', destination: '/local-seo', permanent: true },
      { source: '/services/seo/local-seo/', destination: '/local-seo', permanent: true },
      { source: '/services/seo/technical-seo', destination: '/technical-seo', permanent: true },
      { source: '/services/seo/technical-seo/', destination: '/technical-seo', permanent: true },
      { source: '/services/seo/ecommerce-seo', destination: '/ecommerce-seo', permanent: true },
      { source: '/services/seo/ecommerce-seo/', destination: '/ecommerce-seo', permanent: true },
      { source: '/services/seo/international-seo', destination: '/international-seo', permanent: true },
      { source: '/services/seo/international-seo/', destination: '/international-seo', permanent: true },

      // Web Development → Web Design
      { source: '/services/web-development', destination: '/development', permanent: true },
      { source: '/services/web-development/', destination: '/development', permanent: true },
      { source: '/services/web-development/website-design', destination: '/development', permanent: true },
      { source: '/services/web-development/website-design/', destination: '/development', permanent: true },
      { source: '/services/web-development/web-applications', destination: '/development/applications', permanent: true },
      { source: '/services/web-development/web-applications/', destination: '/development/applications', permanent: true },
      { source: '/services/web-development/ecommerce-development', destination: '/development/ecommerce', permanent: true },
      { source: '/services/web-development/ecommerce-development/', destination: '/development/ecommerce', permanent: true },

      // Digital Marketing - Shorten paths
      { source: '/services/digital-marketing', destination: '/digital-marketing', permanent: true },
      { source: '/services/digital-marketing/', destination: '/digital-marketing', permanent: true },
      { source: '/services/digital-marketing/content-marketing', destination: '/digital-marketing/content', permanent: true },
      { source: '/services/digital-marketing/content-marketing/', destination: '/digital-marketing/content', permanent: true },
      { source: '/services/digital-marketing/ppc-advertising', destination: '/digital-marketing/ppc', permanent: true },
      { source: '/services/digital-marketing/ppc-advertising/', destination: '/digital-marketing/ppc', permanent: true },
      { source: '/services/digital-marketing/social-media', destination: '/digital-marketing/social-management', permanent: true },
      { source: '/services/digital-marketing/social-media/', destination: '/digital-marketing/social-management', permanent: true },
      { source: '/services/digital-marketing/analytics', destination: '/digital-marketing/analytics', permanent: true },
      { source: '/services/digital-marketing/analytics/', destination: '/digital-marketing/analytics', permanent: true },

      // Blog → Local SEO Industry Pages (blog posts becoming service pages)
      { source: '/blog/local-seo-for-plumbers-complete-guide', destination: '/local-seo/plumbers', permanent: true },
      { source: '/blog/local-seo-for-plumbers-complete-guide/', destination: '/local-seo/plumbers', permanent: true },
      { source: '/blog/hvac-seo-complete-guide', destination: '/local-seo/hvac', permanent: true },
      { source: '/blog/hvac-seo-complete-guide/', destination: '/local-seo/hvac', permanent: true },
      { source: '/blog/roofing-company-seo-strategy', destination: '/local-seo/roofing', permanent: true },
      { source: '/blog/roofing-company-seo-strategy/', destination: '/local-seo/roofing', permanent: true },
      { source: '/blog/electrician-seo-guide', destination: '/local-seo/electricians', permanent: true },
      { source: '/blog/electrician-seo-guide/', destination: '/local-seo/electricians', permanent: true },
      { source: '/blog/auto-detailing-seo-get-more-customers', destination: '/local-seo/auto-detailing', permanent: true },
      { source: '/blog/auto-detailing-seo-get-more-customers/', destination: '/local-seo/auto-detailing', permanent: true },
      { source: '/blog/dumpster-rental-seo-dominate-local-search', destination: '/local-seo/dumpster-rental', permanent: true },
      { source: '/blog/dumpster-rental-seo-dominate-local-search/', destination: '/local-seo/dumpster-rental', permanent: true },
      { source: '/blog/landscaping-seo-grow-your-business', destination: '/local-seo/landscaping', permanent: true },
      { source: '/blog/landscaping-seo-grow-your-business/', destination: '/local-seo/landscaping', permanent: true },
      { source: '/blog/pest-control-seo-strategy', destination: '/local-seo/pest-control', permanent: true },
      { source: '/blog/pest-control-seo-strategy/', destination: '/local-seo/pest-control', permanent: true },
      { source: '/blog/cleaning-company-seo-guide', destination: '/local-seo/cleaning', permanent: true },
      { source: '/blog/cleaning-company-seo-guide/', destination: '/local-seo/cleaning', permanent: true },
      { source: '/blog/moving-company-seo-guide', destination: '/local-seo/moving', permanent: true },
      { source: '/blog/moving-company-seo-guide/', destination: '/local-seo/moving', permanent: true },
      { source: '/blog/construction-company-seo-strategy', destination: '/local-seo/construction', permanent: true },
      { source: '/blog/construction-company-seo-strategy/', destination: '/local-seo/construction', permanent: true },

      // Blog URL Shortening (remaining blog posts)
      { source: '/blog/how-much-does-seo-cost-for-small-business', destination: '/blog/seo-pricing', permanent: true },
      { source: '/blog/how-much-does-seo-cost-for-small-business/', destination: '/blog/seo-pricing', permanent: true },
      { source: '/blog/how-long-does-seo-take-to-work', destination: '/blog/seo-timeline', permanent: true },
      { source: '/blog/how-long-does-seo-take-to-work/', destination: '/blog/seo-timeline', permanent: true },
      { source: '/blog/google-business-profile-optimization-guide', destination: '/blog/gbp-optimization', permanent: true },
      { source: '/blog/google-business-profile-optimization-guide/', destination: '/blog/gbp-optimization', permanent: true },
      { source: '/blog/local-seo-uk-vs-usa-differences', destination: '/blog/local-seo-uk-vs-usa', permanent: true },
      { source: '/blog/local-seo-uk-vs-usa-differences/', destination: '/blog/local-seo-uk-vs-usa', permanent: true },

      // Portfolio → Case Studies
      { source: '/portfolio', destination: '/case-studies', permanent: true },
      { source: '/portfolio/', destination: '/case-studies', permanent: true },
      { source: '/portfolio/illyrian-group-plumbing-seo-web-development', destination: '/case-studies/illyrian-group', permanent: true },
      { source: '/portfolio/gimos-roofing-local-seo-website-design', destination: '/case-studies/gimos-roofing', permanent: true },
      { source: '/portfolio/albros-premium-detailing-seo-website-design', destination: '/case-studies/albros-detailing', permanent: true },
      { source: '/portfolio/northstar-home-improvement-seo-website-development', destination: '/case-studies/northstar', permanent: true },
      { source: '/portfolio/904-dumpster-rental-jacksonville-seo-website', destination: '/case-studies/904-dumpster', permanent: true },
      { source: '/portfolio/gjej-pro-marketplace-web-application-seo', destination: '/case-studies/gjej-pro', permanent: true },
      { source: '/portfolio/paint-techs-painting-contractor-seo-website-redesign', destination: '/case-studies/paint-techs', permanent: true },
      { source: '/portfolio/sunrise-auto-rent-car-rental-website-design', destination: '/case-studies/sunrise-auto', permanent: true },
      { source: '/portfolio/kn-flooring-contractor-website-design', destination: '/case-studies/kn-flooring', permanent: true },
      { source: '/portfolio/kryemadhi-car-rental-albania-website-design', destination: '/case-studies/kryemadhi', permanent: true },
      { source: '/portfolio/gnt-home-remodeling-contractor-website-design', destination: '/case-studies/gnt-remodeling', permanent: true },
      { source: '/portfolio/eli-taxi-durres-albania-website-design', destination: '/case-studies/eli-taxi', permanent: true },
      { source: '/portfolio/msc-certification-web-application-development', destination: '/case-studies/msc-certification', permanent: true },
      { source: '/portfolio/aaa-remodels-jacksonville-home-remodeling-seo-website', destination: '/case-studies/aaa-remodels', permanent: true },

      // ============================================
      // OLD WORDPRESS REDIRECTS (updated destinations to new URLs)
      // ============================================
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/contact-us/', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/about-us/', destination: '/about', permanent: true },
      { source: '/pricing-plans', destination: '/pricing', permanent: true },
      { source: '/pricing-plans/', destination: '/pricing', permanent: true },
      { source: '/pricing-plans/:path*', destination: '/pricing', permanent: true },

      // Old service pages → new URLs
      { source: '/expert-seo-services', destination: '/seo-services', permanent: true },
      { source: '/expert-seo-services/', destination: '/seo-services', permanent: true },
      { source: '/professional-web-development', destination: '/development', permanent: true },
      { source: '/professional-web-development/', destination: '/development', permanent: true },
      { source: '/web-app-development', destination: '/development/applications', permanent: true },
      { source: '/web-app-development/', destination: '/development/applications', permanent: true },
      { source: '/free-website-audit', destination: '/contact', permanent: true },
      { source: '/free-website-audit/', destination: '/contact', permanent: true },

      // Old blog posts → new URLs
      { source: '/the-ultimate-guide-to-local-seo', destination: '/local-seo/plumbers', permanent: true },
      { source: '/the-ultimate-guide-to-local-seo/', destination: '/local-seo/plumbers', permanent: true },
      { source: '/the-ultimate-guide-to-local-seo/:path*', destination: '/local-seo/plumbers', permanent: true },
      { source: '/the-ultimate-guide-to-ecommerce-seo-services', destination: '/ecommerce-seo', permanent: true },
      { source: '/the-ultimate-guide-to-ecommerce-seo-services/', destination: '/ecommerce-seo', permanent: true },
      { source: '/the-ultimate-guide-to-ecommerce-seo-services/:path*', destination: '/ecommerce-seo', permanent: true },
      { source: '/how-local-seo-services-drive-targeted-traffic', destination: '/local-seo', permanent: true },
      { source: '/how-local-seo-services-drive-targeted-traffic/', destination: '/local-seo', permanent: true },
      { source: '/how-local-seo-services-drive-targeted-traffic/:path*', destination: '/local-seo', permanent: true },
      { source: '/partnering-with-904-dumpster-a-journey-to-seo-growth', destination: '/case-studies', permanent: true },
      { source: '/partnering-with-904-dumpster-a-journey-to-seo-growth/', destination: '/case-studies', permanent: true },
      { source: '/partnering-with-904-dumpster-a-journey-to-seo-growth/:path*', destination: '/case-studies', permanent: true },
      { source: '/search-engine-optimization-seo-starter-guide', destination: '/seo-services', permanent: true },
      { source: '/search-engine-optimization-seo-starter-guide/', destination: '/seo-services', permanent: true },
      { source: '/search-engine-optimization-seo-starter-guide/:path*', destination: '/seo-services', permanent: true },
      { source: '/why-digital-marketing-is-essential-for-modern-businesses', destination: '/digital-marketing', permanent: true },
      { source: '/why-digital-marketing-is-essential-for-modern-businesses/', destination: '/digital-marketing', permanent: true },
      { source: '/why-digital-marketing-is-essential-for-modern-businesses/:path*', destination: '/digital-marketing', permanent: true },

      // More old blog posts
      { source: '/seo-vs-ppc-which-one-is-right-for-your-business', destination: '/blog', permanent: true },
      { source: '/seo-vs-ppc-which-one-is-right-for-your-business/', destination: '/blog', permanent: true },
      { source: '/seo-vs-ppc-which-one-is-right-for-your-business/:path*', destination: '/blog', permanent: true },
      { source: '/understanding-the-basics-of-on-page-seo', destination: '/blog', permanent: true },
      { source: '/understanding-the-basics-of-on-page-seo/', destination: '/blog', permanent: true },
      { source: '/maximizing-user-engagement-with-custom-web-design', destination: '/development', permanent: true },
      { source: '/maximizing-user-engagement-with-custom-web-design/', destination: '/development', permanent: true },
      { source: '/maximizing-user-engagement-with-custom-web-design/:path*', destination: '/development', permanent: true },
      { source: '/improving-website-speed-for-better-seo-results', destination: '/technical-seo', permanent: true },
      { source: '/improving-website-speed-for-better-seo-results/', destination: '/technical-seo', permanent: true },
      { source: '/improving-website-speed-for-better-seo-results/:path*', destination: '/technical-seo', permanent: true },
      { source: '/the-role-of-backlinks-in-seo', destination: '/seo-services', permanent: true },
      { source: '/the-role-of-backlinks-in-seo/', destination: '/seo-services', permanent: true },
      { source: '/how-mobile-optimization-impacts-seo', destination: '/technical-seo', permanent: true },
      { source: '/how-mobile-optimization-impacts-seo/', destination: '/technical-seo', permanent: true },
      { source: '/how-to-choose-the-right-website-development-agency', destination: '/development', permanent: true },
      { source: '/how-to-choose-the-right-website-development-agency/', destination: '/development', permanent: true },
      { source: '/why-every-business-needs-seo-services-in-2024', destination: '/seo-services', permanent: true },
      { source: '/why-every-business-needs-seo-services-in-2024/', destination: '/seo-services', permanent: true },
      { source: '/why-every-business-needs-seo-services-in-2024/:path*', destination: '/seo-services', permanent: true },
      { source: '/top-5-reasons-custom-websites-improve-business-performance', destination: '/development', permanent: true },
      { source: '/top-5-reasons-custom-websites-improve-business-performance/', destination: '/development', permanent: true },
      { source: '/essential-seo-strategies-for-small-businesses', destination: '/blog/seo-pricing', permanent: true },
      { source: '/essential-seo-strategies-for-small-businesses/', destination: '/blog/seo-pricing', permanent: true },
      { source: '/why-hire-a-website-design-and-development-company', destination: '/development', permanent: true },
      { source: '/why-hire-a-website-design-and-development-company/', destination: '/development', permanent: true },

      // Old category pages → new URLs
      { source: '/category/e-commerce-marketing', destination: '/ecommerce-seo', permanent: true },
      { source: '/category/e-commerce-marketing/', destination: '/ecommerce-seo', permanent: true },
      { source: '/category/search-engine-optimization', destination: '/seo-services', permanent: true },
      { source: '/category/search-engine-optimization/', destination: '/seo-services', permanent: true },
      { source: '/category/search-engine-optimization/:path*', destination: '/seo-services', permanent: true },
      { source: '/category/local-seo', destination: '/local-seo', permanent: true },
      { source: '/category/local-seo/', destination: '/local-seo', permanent: true },
      { source: '/category/local-seo/:path*', destination: '/local-seo', permanent: true },
      { source: '/category/digital-marketing', destination: '/digital-marketing', permanent: true },
      { source: '/category/digital-marketing/', destination: '/digital-marketing', permanent: true },
      { source: '/category/digital-marketing/:path*', destination: '/digital-marketing', permanent: true },
      { source: '/category/website', destination: '/development', permanent: true },
      { source: '/category/website/', destination: '/development', permanent: true },
      { source: '/category/website/:path*', destination: '/development', permanent: true },
      { source: '/category/case-studies-success-stories', destination: '/case-studies', permanent: true },
      { source: '/category/case-studies-success-stories/', destination: '/case-studies', permanent: true },
      { source: '/category/case-studies-success-stories/:path*', destination: '/case-studies', permanent: true },

      // Author, date archives, feeds
      { source: '/author/:path*', destination: '/about', permanent: true },
      { source: '/2024/:path*', destination: '/blog', permanent: true },
      { source: '/2023/:path*', destination: '/blog', permanent: true },
      { source: '/2022/:path*', destination: '/blog', permanent: true },
      { source: '/feed', destination: '/', permanent: true },
      { source: '/feed/', destination: '/', permanent: true },
      { source: '/feed/:path*', destination: '/', permanent: true },
      { source: '/:path*/feed', destination: '/', permanent: true },
      { source: '/:path*/feed/', destination: '/', permanent: true },
      { source: '/home/:path*', destination: '/', permanent: true },
      { source: '/woocommerce-placeholder', destination: '/', permanent: true },
      { source: '/woocommerce-placeholder/', destination: '/', permanent: true },

      // Privacy and Terms
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/privacy/', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-and-agreements', permanent: true },
      { source: '/terms/', destination: '/terms-and-agreements', permanent: true },

      // Other old service pages
      { source: '/seo-agency-3', destination: '/seo-services', permanent: true },
      { source: '/seo-agency-3/', destination: '/seo-services', permanent: true },
      { source: '/seo-services-2', destination: '/seo-services', permanent: true },
      { source: '/seo-services-2/', destination: '/seo-services', permanent: true },
      { source: '/web-development', destination: '/development', permanent: true },
      { source: '/web-development/', destination: '/development', permanent: true },
      { source: '/website-and-seo', destination: '/', permanent: true },
      { source: '/website-and-seo/', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
