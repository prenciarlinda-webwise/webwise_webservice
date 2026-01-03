'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if we're in dashboard/admin routes (they have their own layout)
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')
  const isLogin = pathname?.startsWith('/login')

  // Login page - no header/footer
  if (isLogin) {
    return <>{children}</>
  }

  // Dashboard/Admin - no header, footer with sidebar margin
  if (isDashboard) {
    return (
      <>
        {children}
        <div className="ml-64">
          <Footer />
        </div>
      </>
    )
  }

  // Regular pages - full header and footer
  return (
    <>
      <Header />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}
