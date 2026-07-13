import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import IndustryPage from '@/components/industry-pages/IndustryPage'
import { getIndustryPageContent } from '@/data/industryPages'

const content = getIndustryPageContent('locksmiths')!

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: `${siteConfig.url}/local-seo/locksmiths` },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `${siteConfig.url}/local-seo/locksmiths`,
    },
  }
}

export default function LocksmithSEOPage() {
  return <IndustryPage content={content} />
}
