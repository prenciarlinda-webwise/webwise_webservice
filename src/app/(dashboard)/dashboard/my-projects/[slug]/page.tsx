import { redirect } from 'next/navigation'

export default async function LegacyMyProjectDetailRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/dashboard/${slug}`)
}
