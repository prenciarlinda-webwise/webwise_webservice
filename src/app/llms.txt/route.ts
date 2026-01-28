import { NextResponse } from 'next/server'

const llmsContent = `# WebWise - Professional Web Design & SEO Agency

> WebWise is a professional web design and SEO agency helping local businesses in the USA, UK, and Albania grow their online presence.

## About Us
WebWise specializes in creating high-converting websites and implementing effective SEO strategies for local service businesses including plumbers, roofers, HVAC contractors, auto detailers, electricians, landscapers, and more.

## Services

### SEO Services
- Local SEO: Dominate Google Maps and local search results
- Technical SEO: Site speed, mobile optimization, schema markup
- International SEO: Multi-market expansion strategies
- E-commerce SEO: Product optimization and category pages

### Web Development
- Custom Website Design: Modern, responsive, conversion-focused
- E-commerce Development: Custom online store solutions from $3,500
- Web Applications: Custom dashboards, booking systems, portals

### Digital Marketing
- PPC Advertising: Google Ads, Facebook Ads management
- Content Marketing: Blog posts, guides, industry content
- Social Media Marketing: Strategy and management

## Contact Information
- Website: https://www.websiteandseoagency.com
- Email: info@websiteandseoagency.com
- Phone: +355685121313

## Service Areas
- United States (all states)
- United Kingdom
- Albania

## Industries We Serve
- Plumbing companies
- Roofing contractors
- HVAC businesses
- Auto detailing services
- Electricians
- Landscaping companies
- Pest control services
- Cleaning companies
- Moving companies
- Construction contractors
- Home remodeling services
- Dumpster rental companies

## Why Choose WebWise
- Proven results with 300%+ traffic increases
- Industry-specific expertise
- Transparent reporting
- No long-term contracts
- Dedicated account managers

## Pricing
- Starter SEO from $480/month
- Medium SEO from $780/month
- Premium SEO from $1,100/month
- Website development from $1,500

For a free quote, visit: https://www.websiteandseoagency.com/contact
`

export async function GET() {
  return new NextResponse(llmsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
