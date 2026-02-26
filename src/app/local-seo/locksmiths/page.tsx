import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import BlogPostPage from '@/app/blog/[slug]/page'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SEO for Locksmiths - Get More Emergency Lockout Calls From Google',
    description: 'We help locksmith businesses dominate Google Maps and local search. Emergency lockout calls, 24/7 visibility, and zero per-lead fees. Free audit.',
    keywords: ['seo for locksmiths', 'locksmith seo', 'locksmith keywords', 'locksmith seo services', 'locksmith marketing', 'emergency locksmith seo', 'locksmith local seo', 'locksmith lead generation'],
    alternates: { canonical: `${siteConfig.url}/local-seo/locksmiths` },
    openGraph: {
      title: 'SEO for Locksmiths - Get More Emergency Lockout Calls From Google',
      description: 'We help locksmith businesses dominate Google Maps and local search. Emergency lockout calls, 24/7 visibility, and zero per-lead fees.',
      url: `${siteConfig.url}/local-seo/locksmiths`,
    },
  }
}

export default function LocksmithSEOPage() {
  return BlogPostPage({ params: Promise.resolve({ slug: 'locksmith-seo-guide' }) })
}
