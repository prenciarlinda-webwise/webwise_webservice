import { redirect } from 'next/navigation'

export default async function LegacyRankingsRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/dashboard/${slug}/rankings`)
}
