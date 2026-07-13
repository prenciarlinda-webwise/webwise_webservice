import { Metadata } from 'next'
import { siteConfig } from '@/data/site'
import IndustryPage from '@/components/industry-pages/IndustryPage'
import { getIndustryPageContent } from '@/data/industryPages'

const content = getIndustryPageContent('painters')!

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: `${siteConfig.url}/local-seo/painters` },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `${siteConfig.url}/local-seo/painters`,
    },
  }
}

export default function PaintersSEOPage() {
  return <IndustryPage content={content} />
}
