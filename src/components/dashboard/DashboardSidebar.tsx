'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { siteConfig } from '@/data/site'
import {
  LayoutDashboard, Users, FolderOpen, CreditCard, FileText,
  UserCog, ClipboardList, Building2, Briefcase, Receipt, LogOut,
  CalendarDays, Bell
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: string[]
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'employee', 'client'] },
  // Admin
  { label: 'Clients', href: '/dashboard/clients', icon: Users, roles: ['admin'] },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen, roles: ['admin', 'employee'] },
  { label: 'Finances', href: '/dashboard/finances', icon: CreditCard, roles: ['admin'], children: [
    { label: 'Business', href: '/dashboard/finances/business' },
    { label: 'Personal', href: '/dashboard/finances/personal' },
  ]},
  { label: 'Employees', href: '/dashboard/employees', icon: UserCog, roles: ['admin'] },
  { label: 'PDF Reports', href: '/dashboard/reports', icon: FileText, roles: ['admin'] },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, roles: ['admin', 'employee'] },
  // Employee
  { label: 'My Deliverables', href: '/dashboard/tasks', icon: ClipboardList, roles: ['employee'] },
  // Client
  { label: 'My Businesses', href: '/dashboard/my-projects', icon: Building2, roles: ['client'] },
  { label: 'Progress', href: '/dashboard/progress', icon: CalendarDays, roles: ['client'] },
  { label: 'Reports', href: '/dashboard/my-reports', icon: FileText, roles: ['client'] },
  { label: 'Billing', href: '/dashboard/my-payments', icon: Receipt, roles: ['client'] },
]

export default function DashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const filteredNav = navItems.filter(item => item.roles.includes(user.role))

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-primary text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard">
          <Image src={siteConfig.logo} alt={siteConfig.name} width={130} height={35} className="h-8 w-auto brightness-0 invert" />
        </Link>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          return (
            <div key={item.href}>
              <Link
                href={item.children ? item.children[0].href : item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white border-r-3 border-accent'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
              {item.children && isActive && (
                <div className="ml-10 border-l border-white/10">
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-4 py-2 text-xs font-medium transition-colors ${
                        pathname === child.href || pathname?.startsWith(child.href + '/')
                          ? 'text-accent'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="px-2 mb-3">
          <p className="text-sm font-medium truncate">{user.first_name} {user.last_name}</p>
          <p className="text-xs text-white/50 capitalize">{user.role}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
