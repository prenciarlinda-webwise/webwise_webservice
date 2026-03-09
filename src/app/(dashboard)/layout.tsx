'use client'

import { AuthProvider, useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { Bell } from 'lucide-react'
import { api } from '@/lib/api'

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'employee')) {
      api.get<{ unread_count: number }>('/notifications/unread-count/')
        .then(d => setUnreadCount(d.unread_count))
        .catch(() => {})
      const interval = setInterval(() => {
        api.get<{ unread_count: number }>('/notifications/unread-count/')
          .then(d => setUnreadCount(d.unread_count))
          .catch(() => {})
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-bg-secondary">
      <DashboardSidebar />
      <div className="ml-64">
        <div className="flex justify-end items-center px-8 pt-4">
          {(user.role === 'admin' || user.role === 'employee') && (
            <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-white border border-transparent hover:border-border transition-colors">
              <Bell size={20} className="text-text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>
        <main className="p-8 pt-2">{children}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  )
}
