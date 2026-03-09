'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')
  const isLogin = pathname?.startsWith('/login')

  if (isLogin || isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
