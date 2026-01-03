'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.role === 'admin') {
        router.push('/admin')
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'client') {
    return null
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      <DashboardSidebar />
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  )
}
