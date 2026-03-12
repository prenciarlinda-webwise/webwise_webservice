'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FinancesRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Preserve query params when redirecting
    const params = searchParams.toString()
    const section = searchParams.get('section')
    if (section === 'personal') {
      router.replace(`/dashboard/finances/personal${params ? '?' + params : ''}`)
    } else {
      router.replace(`/dashboard/finances/business${params ? '?' + params : ''}`)
    }
  }, [router, searchParams])

  return <div className="animate-pulse h-8 w-48 bg-bg-secondary rounded" />
}
