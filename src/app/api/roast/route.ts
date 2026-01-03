import { NextResponse } from 'next/server'

const PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY

interface PageSpeedResult {
  lighthouseResult: {
    categories: {
      performance: { score: number }
      accessibility: { score: number }
      'best-practices': { score: number }
      seo: { score: number }
    }
    audits: {
      'first-contentful-paint': { numericValue: number }
      'largest-contentful-paint': { numericValue: number }
      'speed-index': { numericValue: number }
      'total-blocking-time': { numericValue: number }
      'cumulative-layout-shift': { numericValue: number }
      'is-on-https': { score: number }
      'viewport': { score: number }
      'document-title': { score: number }
      'meta-description': { score: number }
      'image-alt': { score: number }
      'render-blocking-resources': { score: number }
      'uses-optimized-images': { score: number }
      'uses-text-compression': { score: number }
      'uses-responsive-images': { score: number }
    }
  }
}

interface RoastIssue {
  type: string
  severity: 'critical' | 'warning' | 'good'
  roast: string
  detail: string
}

// Roast copy for different issues
const roastCopy = {
  // Performance roasts
  performanceTerrible: {
    roast: "Your website loads slower than a sloth on sedatives.",
    detail: "Users abandon sites that take more than 3 seconds to load. Yours is giving them time to make coffee."
  },
  performanceBad: {
    roast: "Your site speed is giving dial-up internet flashbacks.",
    detail: "Performance issues are costing you visitors. Every second of load time = 7% fewer conversions."
  },
  performanceMeh: {
    roast: "Your speed is... acceptable. Like a C+ in school.",
    detail: "Not terrible, but definitely not winning any races. Room for improvement here."
  },
  performanceGood: {
    roast: "Actually impressed with your speed. Gold star!",
    detail: "Your site loads quickly. This is helping you convert more visitors."
  },

  // Mobile roasts
  mobileTerrible: {
    roast: "Your mobile experience belongs in a museum. The 'What Not To Do' exhibit.",
    detail: "Over 60% of web traffic is mobile. You're basically telling most visitors to leave."
  },
  mobileBad: {
    roast: "Trying to use your site on mobile is like reading a menu through a keyhole.",
    detail: "Google prioritizes mobile-friendly sites. Yours is getting buried in search results."
  },
  mobileGood: {
    roast: "Mobile experience is solid. Your thumbs thank you.",
    detail: "Responsive design is working well across devices."
  },

  // SEO roasts
  seoTerrible: {
    roast: "Google doesn't even know you exist. You're basically a digital ghost.",
    detail: "Major SEO issues detected. Your competitors are eating your lunch in search results."
  },
  seoBad: {
    roast: "Your SEO is like a library book nobody can find.",
    detail: "Missing critical SEO elements. You're invisible to potential customers searching for your services."
  },
  seoMeh: {
    roast: "SEO basics are there, but you're leaving money on the table.",
    detail: "Some optimization done, but there's significant room to improve your search visibility."
  },
  seoGood: {
    roast: "SEO game is strong. Search engines actually like you.",
    detail: "Good technical SEO foundation. Keep building on this."
  },

  // SSL roasts
  noSSL: {
    roast: "No SSL? It's 2024, not 1999. Browsers literally warn people away from your site.",
    detail: "Chrome shows 'Not Secure' warnings. This destroys trust and tanks your SEO."
  },
  hasSSL: {
    roast: "At least you have SSL. The bare minimum of security.",
    detail: "Your site is secure with HTTPS. This is expected, not exceptional."
  },

  // Specific issues
  noMetaDescription: {
    roast: "No meta description? Google is literally making up how to describe you.",
    detail: "Meta descriptions control what appears in search results. You're letting Google decide."
  },
  noTitle: {
    roast: "Missing a proper title tag. That's like a store with no sign.",
    detail: "Title tags are the #1 on-page SEO factor. This is SEO 101."
  },
  missingAltTags: {
    roast: "Images without alt tags? Screen readers and Google are both confused.",
    detail: "Alt tags improve accessibility and image SEO. Easy win you're missing."
  },
  renderBlocking: {
    roast: "Your resources are blocking rendering like a traffic jam on the highway.",
    detail: "JavaScript and CSS are slowing down your initial page load."
  },
  unoptimizedImages: {
    roast: "Your images are so heavy they need their own loading dock.",
    detail: "Large images are killing your page speed. Compress or use modern formats."
  },
  noCompression: {
    roast: "Not using text compression? Enjoy wasting bandwidth.",
    detail: "Enable GZIP/Brotli compression to reduce file sizes by up to 70%."
  },
  layoutShift: {
    roast: "Your layout jumps around like it had too much coffee.",
    detail: "Cumulative Layout Shift issues make your site feel janky and unprofessional."
  },
  slowLCP: {
    roast: "Your main content takes so long to appear, users think it's broken.",
    detail: "Largest Contentful Paint is too slow. The main content should appear in under 2.5 seconds."
  },
}

function generateRoast(data: PageSpeedResult): { score: number; issues: RoastIssue[]; performance: number; mobile: number; seo: number; ssl: boolean; loadTime: number } {
  const issues: RoastIssue[] = []
  const audits = data.lighthouseResult.audits
  const categories = data.lighthouseResult.categories

  const performanceScore = Math.round((categories.performance?.score || 0) * 100)
  const seoScore = Math.round((categories.seo?.score || 0) * 100)
  const accessibilityScore = Math.round((categories.accessibility?.score || 0) * 100)

  // Mobile score is approximated from performance + viewport audit
  const hasViewport = audits['viewport']?.score === 1
  const mobileScore = hasViewport ? Math.min(performanceScore + 10, 100) : Math.max(performanceScore - 20, 0)

  const hasSSL = audits['is-on-https']?.score === 1
  const loadTime = Math.round((audits['speed-index']?.numericValue || 0) / 1000 * 10) / 10

  // Performance roasts
  if (performanceScore < 30) {
    issues.push({ type: 'performance', severity: 'critical', ...roastCopy.performanceTerrible })
  } else if (performanceScore < 50) {
    issues.push({ type: 'performance', severity: 'critical', ...roastCopy.performanceBad })
  } else if (performanceScore < 70) {
    issues.push({ type: 'performance', severity: 'warning', ...roastCopy.performanceMeh })
  } else {
    issues.push({ type: 'performance', severity: 'good', ...roastCopy.performanceGood })
  }

  // Mobile roasts
  if (!hasViewport || mobileScore < 40) {
    issues.push({ type: 'mobile', severity: 'critical', ...roastCopy.mobileTerrible })
  } else if (mobileScore < 60) {
    issues.push({ type: 'mobile', severity: 'warning', ...roastCopy.mobileBad })
  } else {
    issues.push({ type: 'mobile', severity: 'good', ...roastCopy.mobileGood })
  }

  // SEO roasts
  if (seoScore < 40) {
    issues.push({ type: 'seo', severity: 'critical', ...roastCopy.seoTerrible })
  } else if (seoScore < 60) {
    issues.push({ type: 'seo', severity: 'critical', ...roastCopy.seoBad })
  } else if (seoScore < 80) {
    issues.push({ type: 'seo', severity: 'warning', ...roastCopy.seoMeh })
  } else {
    issues.push({ type: 'seo', severity: 'good', ...roastCopy.seoGood })
  }

  // SSL roast
  if (!hasSSL) {
    issues.push({ type: 'ssl', severity: 'critical', ...roastCopy.noSSL })
  } else {
    issues.push({ type: 'ssl', severity: 'good', ...roastCopy.hasSSL })
  }

  // Specific issues
  if (audits['meta-description']?.score === 0) {
    issues.push({ type: 'meta', severity: 'warning', ...roastCopy.noMetaDescription })
  }

  if (audits['document-title']?.score === 0) {
    issues.push({ type: 'title', severity: 'critical', ...roastCopy.noTitle })
  }

  if (audits['image-alt']?.score !== undefined && audits['image-alt'].score < 1) {
    issues.push({ type: 'images', severity: 'warning', ...roastCopy.missingAltTags })
  }

  if (audits['render-blocking-resources']?.score !== undefined && audits['render-blocking-resources'].score < 0.5) {
    issues.push({ type: 'render', severity: 'warning', ...roastCopy.renderBlocking })
  }

  if (audits['uses-optimized-images']?.score !== undefined && audits['uses-optimized-images'].score < 0.5) {
    issues.push({ type: 'imageOpt', severity: 'warning', ...roastCopy.unoptimizedImages })
  }

  if (audits['uses-text-compression']?.score !== undefined && audits['uses-text-compression'].score < 1) {
    issues.push({ type: 'compression', severity: 'warning', ...roastCopy.noCompression })
  }

  if (audits['cumulative-layout-shift']?.numericValue !== undefined && audits['cumulative-layout-shift'].numericValue > 0.1) {
    issues.push({ type: 'cls', severity: 'warning', ...roastCopy.layoutShift })
  }

  if (audits['largest-contentful-paint']?.numericValue !== undefined && audits['largest-contentful-paint'].numericValue > 2500) {
    issues.push({ type: 'lcp', severity: 'critical', ...roastCopy.slowLCP })
  }

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    performanceScore * 0.35 +
    seoScore * 0.30 +
    mobileScore * 0.20 +
    accessibilityScore * 0.15
  )

  return {
    score: overallScore,
    performance: performanceScore,
    mobile: mobileScore,
    seo: seoScore,
    ssl: hasSSL,
    loadTime,
    issues: issues.slice(0, 8), // Limit to 8 issues
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Call Google PageSpeed Insights API
    // With API key: 25,000 requests/day. Without: ~25 requests/day
    const apiKey = PAGESPEED_API_KEY ? `&key=${PAGESPEED_API_KEY}` : ''
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile${apiKey}`

    console.log('Fetching PageSpeed API for:', url)

    let response: Response
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({
          error: 'Request timed out. The analysis is taking too long. Try again or try a different URL.'
        }, { status: 504 })
      }
      return NextResponse.json({
        error: 'Failed to connect to analysis service. Please try again.'
      }, { status: 500 })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('PageSpeed API error status:', response.status)
      console.error('PageSpeed API error body:', errorText)

      if (response.status === 400) {
        return NextResponse.json({
          error: 'Could not analyze this URL. Make sure the website is accessible and try again.'
        }, { status: 400 })
      }

      if (response.status === 429) {
        return NextResponse.json({
          error: 'Too many requests. Please wait a moment and try again.'
        }, { status: 429 })
      }

      if (response.status === 500 || response.status === 503) {
        return NextResponse.json({
          error: 'Google PageSpeed service is temporarily unavailable. Please try again in a moment.'
        }, { status: 503 })
      }

      return NextResponse.json({
        error: `Analysis failed (${response.status}). The website may be blocking our tests or is temporarily unavailable.`
      }, { status: 500 })
    }

    const data: PageSpeedResult = await response.json()
    const roastResult = generateRoast(data)

    return NextResponse.json(roastResult)
  } catch (error) {
    console.error('Roast API error:', error)
    return NextResponse.json({
      error: 'Something went wrong. Please try again.'
    }, { status: 500 })
  }
}