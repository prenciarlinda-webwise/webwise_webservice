'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  User,
  Package,
  LogOut,
  ListTodo,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import NotificationBell from './NotificationBell'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/plan', label: 'My Plan', icon: Package },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            WebWise
          </Link>
          <NotificationBell isAdmin={false} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info & Logout */}
        <div className="p-4 border-t border-border">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-text-primary truncate">
              {user?.full_name || user?.email}
            </p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  )
}
