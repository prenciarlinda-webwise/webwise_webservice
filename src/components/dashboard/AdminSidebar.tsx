'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Package,
  FileText,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import NotificationBell from './NotificationBell'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/plans', label: 'Plans', icon: Package },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-primary text-white">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-primary-light">
          <Link href="/admin" className="text-xl font-bold">
            Web Wise Admin
          </Link>
          <NotificationBell isAdmin={true} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-white/70 hover:bg-primary-light hover:text-white'
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
        <div className="p-4 border-t border-primary-light">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium truncate">
              {user?.full_name || user?.email}
            </p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-primary-light hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  )
}
