'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  subtitle?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  variant = 'default',
}: StatsCardProps) {
  const iconColors = {
    default: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p className="mt-2 text-sm">
              <span
                className={
                  trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {trend.value >= 0 ? '+' : ''}
                {trend.value}%
              </span>{' '}
              <span className="text-text-muted">{trend.label}</span>
            </p>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColors[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
