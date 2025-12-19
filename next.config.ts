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

  async redirects() {
    return [
      // Old WordPress page redirects to new pages
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact-us/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/pricing-plans',
        destination: '/pricing',
        permanent: true,
      },
      {
        source: '/pricing-plans/',
        destination: '/pricing',
        permanent: true,
      },
      {
        source: '/pricing-plans/:path*',
        destination: '/pricing',
        permanent: true,
      },

      // Old service pages to new service pages
      {
        source: '/expert-seo-services',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/expert-seo-services/',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/professional-web-development',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/professional-web-development/',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/web-app-development',
        destination: '/services/web-development/web-applications',
        permanent: true,
      },
      {
        source: '/web-app-development/',
        destination: '/services/web-development/web-applications',
        permanent: true,
      },
      {
        source: '/free-website-audit',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/free-website-audit/',
        destination: '/contact',
        permanent: true,
      },

      // Old blog posts to new blog or relevant pages
      {
        source: '/the-ultimate-guide-to-local-seo',
        destination: '/blog/local-seo-for-plumbers-complete-guide',
        permanent: true,
      },
      {
        source: '/the-ultimate-guide-to-local-seo/',
        destination: '/blog/local-seo-for-plumbers-complete-guide',
        permanent: true,
      },
      {
        source: '/the-ultimate-guide-to-local-seo/:path*',
        destination: '/blog/local-seo-for-plumbers-complete-guide',
        permanent: true,
      },
      {
        source: '/the-ultimate-guide-to-ecommerce-seo-services',
        destination: '/services/seo/ecommerce-seo',
        permanent: true,
      },
      {
        source: '/the-ultimate-guide-to-ecommerce-seo-services/',
        destination: '/services/seo/ecommerce-seo',
        permanent: true,
      },
      {
        source: '/the-ultimate-guide-to-ecommerce-seo-services/:path*',
        destination: '/services/seo/ecommerce-seo',
        permanent: true,
      },
      {
        source: '/how-local-seo-services-drive-targeted-traffic',
        destination: '/services/seo/local-seo',
        permanent: true,
      },
      {
        source: '/how-local-seo-services-drive-targeted-traffic/',
        destination: '/services/seo/local-seo',
        permanent: true,
      },
      {
        source: '/how-local-seo-services-drive-targeted-traffic/:path*',
        destination: '/services/seo/local-seo',
        permanent: true,
      },
      {
        source: '/partnering-with-904-dumpster-a-journey-to-seo-growth',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/partnering-with-904-dumpster-a-journey-to-seo-growth/',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/partnering-with-904-dumpster-a-journey-to-seo-growth/:path*',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/search-engine-optimization-seo-starter-guide',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/search-engine-optimization-seo-starter-guide/',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/search-engine-optimization-seo-starter-guide/:path*',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/why-digital-marketing-is-essential-for-modern-businesses',
        destination: '/services/digital-marketing',
        permanent: true,
      },
      {
        source: '/why-digital-marketing-is-essential-for-modern-businesses/',
        destination: '/services/digital-marketing',
        permanent: true,
      },
      {
        source: '/why-digital-marketing-is-essential-for-modern-businesses/:path*',
        destination: '/services/digital-marketing',
        permanent: true,
      },

      // Old blog posts to blog index
      {
        source: '/seo-vs-ppc-which-one-is-right-for-your-business',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/seo-vs-ppc-which-one-is-right-for-your-business/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/seo-vs-ppc-which-one-is-right-for-your-business/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/understanding-the-basics-of-on-page-seo',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/understanding-the-basics-of-on-page-seo/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/maximizing-user-engagement-with-custom-web-design',
        destination: '/services/web-development/website-design',
        permanent: true,
      },
      {
        source: '/maximizing-user-engagement-with-custom-web-design/',
        destination: '/services/web-development/website-design',
        permanent: true,
      },
      {
        source: '/maximizing-user-engagement-with-custom-web-design/:path*',
        destination: '/services/web-development/website-design',
        permanent: true,
      },
      {
        source: '/improving-website-speed-for-better-seo-results',
        destination: '/services/seo/technical-seo',
        permanent: true,
      },
      {
        source: '/improving-website-speed-for-better-seo-results/',
        destination: '/services/seo/technical-seo',
        permanent: true,
      },
      {
        source: '/improving-website-speed-for-better-seo-results/:path*',
        destination: '/services/seo/technical-seo',
        permanent: true,
      },
      {
        source: '/the-role-of-backlinks-in-seo',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/the-role-of-backlinks-in-seo/',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/how-mobile-optimization-impacts-seo',
        destination: '/services/seo/technical-seo',
        permanent: true,
      },
      {
        source: '/how-mobile-optimization-impacts-seo/',
        destination: '/services/seo/technical-seo',
        permanent: true,
      },
      {
        source: '/how-to-choose-the-right-website-development-agency',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/how-to-choose-the-right-website-development-agency/',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/why-every-business-needs-seo-services-in-2024',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/why-every-business-needs-seo-services-in-2024/',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/why-every-business-needs-seo-services-in-2024/:path*',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/top-5-reasons-custom-websites-improve-business-performance',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/top-5-reasons-custom-websites-improve-business-performance/',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/essential-seo-strategies-for-small-businesses',
        destination: '/blog/how-much-does-seo-cost-for-small-business',
        permanent: true,
      },
      {
        source: '/essential-seo-strategies-for-small-businesses/',
        destination: '/blog/how-much-does-seo-cost-for-small-business',
        permanent: true,
      },
      {
        source: '/why-hire-a-website-design-and-development-company',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/why-hire-a-website-design-and-development-company/',
        destination: '/services/web-development',
        permanent: true,
      },

      // Old category pages to relevant sections
      {
        source: '/category/e-commerce-marketing',
        destination: '/services/seo/ecommerce-seo',
        permanent: true,
      },
      {
        source: '/category/e-commerce-marketing/',
        destination: '/services/seo/ecommerce-seo',
        permanent: true,
      },
      {
        source: '/category/search-engine-optimization',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/category/search-engine-optimization/',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/category/search-engine-optimization/:path*',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/category/local-seo',
        destination: '/services/seo/local-seo',
        permanent: true,
      },
      {
        source: '/category/local-seo/',
        destination: '/services/seo/local-seo',
        permanent: true,
      },
      {
        source: '/category/local-seo/:path*',
        destination: '/services/seo/local-seo',
        permanent: true,
      },
      {
        source: '/category/digital-marketing',
        destination: '/services/digital-marketing',
        permanent: true,
      },
      {
        source: '/category/digital-marketing/',
        destination: '/services/digital-marketing',
        permanent: true,
      },
      {
        source: '/category/digital-marketing/:path*',
        destination: '/services/digital-marketing',
        permanent: true,
      },
      {
        source: '/category/website',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/category/website/',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/category/website/:path*',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/category/case-studies-success-stories',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/category/case-studies-success-stories/',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/category/case-studies-success-stories/:path*',
        destination: '/portfolio',
        permanent: true,
      },

      // Author pages to about
      {
        source: '/author/:path*',
        destination: '/about',
        permanent: true,
      },

      // Date archives to blog
      {
        source: '/2024/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/2023/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/2022/:path*',
        destination: '/blog',
        permanent: true,
      },

      // Feed URLs to homepage - catch all patterns
      {
        source: '/feed',
        destination: '/',
        permanent: true,
      },
      {
        source: '/feed/',
        destination: '/',
        permanent: true,
      },
      {
        source: '/feed/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:path*/feed',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:path*/feed/',
        destination: '/',
        permanent: true,
      },

      // Old home subpages to relevant pages
      {
        source: '/home/:path*',
        destination: '/',
        permanent: true,
      },

      // WooCommerce placeholder
      {
        source: '/woocommerce-placeholder',
        destination: '/',
        permanent: true,
      },
      {
        source: '/woocommerce-placeholder/',
        destination: '/',
        permanent: true,
      },

      // Old service pages
      {
        source: '/seo-agency-3',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/seo-agency-3/',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/seo-services-2',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/seo-services-2/',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/web-development',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/web-development/',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/website-and-seo',
        destination: '/',
        permanent: true,
      },
      {
        source: '/website-and-seo/',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
