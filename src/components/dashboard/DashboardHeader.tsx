'use client'

import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface DashboardHeaderProps {
  title?: string
  onMenuClick?: () => void
}

export default function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-border">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          {title && (
            <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
              {user?.first_name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text-primary">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-text-muted capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
