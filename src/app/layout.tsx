import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { siteConfig } from "@/data/site"
import Script from "next/script"
import GoogleAnalytics, { GTMNoScript } from "@/components/analytics/GoogleAnalytics"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "web development",
    "SEO services",
    "local SEO",
    "website design",
    "digital marketing",
    "plumber SEO",
    "roofing SEO",
    "contractor website",
    "small business SEO",
    "UK SEO agency",
    "USA SEO services",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

// JSON-LD Structured Data - Organization only (site-wide)
// Page-specific schemas are added in individual page components
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.url}${siteConfig.logo}`,
    width: 512,
    height: 512,
  },
  image: `${siteConfig.url}${siteConfig.logo}`,
  description: siteConfig.description,
  foundingDate: "2020",
  founders: [
    {
      "@type": "Person",
      name: "WebWise Team",
    }
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "UK",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "customer service",
      availableLanguage: ["English", "Albanian"],
      areaServed: ["GB", "US", "AL"],
    },
    {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "sales",
      availableLanguage: ["English"],
      areaServed: ["GB", "US"],
    }
  ],
  sameAs: [
    // Add your social profiles here
    // "https://www.facebook.com/webwise",
    // "https://www.linkedin.com/company/webwise",
    // "https://twitter.com/webwise",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "50",
    bestRating: "5",
    worstRating: "1",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased`}>
        <GTMNoScript />
        <GoogleAnalytics />
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
