'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'

interface Deliverable {
  id: number
  category: string
  category_display: string
  title: string
  status: string
  link: string
  live_url: string
  completed_date: string | null
}

interface MonthlyPlan {
  id: number
  service_name: string
  project_name: string
  month_display: string
  status: string
  progress: { total: number; completed: number; in_progress: number; percent: number }
  deliverables: Deliverable[]
}

const categoryColors: Record<string, string> = {
  gbp_post: 'bg-green-100 text-green-700',
  blog_post: 'bg-blue-100 text-blue-700',
  citation: 'bg-purple-100 text-purple-700',
  backlink: 'bg-indigo-100 text-indigo-700',
  on_page: 'bg-yellow-100 text-yellow-700',
  technical: 'bg-orange-100 text-orange-700',
  review: 'bg-pink-100 text-pink-700',
  reporting: 'bg-cyan-100 text-cyan-700',
  keyword_research: 'bg-teal-100 text-teal-700',
  competitor: 'bg-slate-100 text-slate-700',
  design: 'bg-violet-100 text-violet-700',
  development: 'bg-emerald-100 text-emerald-700',
  other: 'bg-gray-100 text-gray-600',
}

const statusIcon = (status: string) => {
  if (status === 'completed') return '✓'
  if (status === 'in_progress') return '●'
  return '○'
}

const statusColor = (status: string) => {
  if (status === 'completed') return 'text-green-600'
  if (status === 'in_progress') return 'text-blue-500'
  return 'text-gray-300'
}

export default function ClientProgressPage() {
  const [plans, setPlans] = useState<MonthlyPlan[]>([])

  useEffect(() => {
    api.get<{ results: MonthlyPlan[] }>('/clients/plans/').then(d => setPlans(d.results))
  }, [])

  return (
    <div>
      <PageHeader title="Work Progress" description="See what the Web Wise team is doing for you each month" />

      {plans.map(plan => (
        <div key={plan.id} className="bg-white rounded-xl border border-border mb-6">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{plan.service_name}</h3>
              <p className="text-sm text-text-muted">{plan.project_name} · {plan.month_display}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-28 h-2 bg-bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${plan.progress.percent}%` }} />
                </div>
                <span className="text-sm font-medium">{plan.progress.percent}%</span>
              </div>
              <StatusBadge status={plan.status} />
            </div>
          </div>

          <div className="divide-y divide-border">
            {plan.deliverables.map(d => (
              <div key={d.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${statusColor(d.status)}`}>{statusIcon(d.status)}</span>
                  <div>
                    <p className={`text-sm ${d.status === 'completed' ? 'line-through text-text-muted' : ''}`}>{d.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[d.category] || categoryColors.other}`}>
                      {d.category_display}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {d.link && (
                    <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Draft</a>
                  )}
                  {d.live_url && (
                    <a href={d.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">Live</a>
                  )}
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {plans.length === 0 && (
        <div className="bg-white rounded-xl border border-border p-8 text-center text-text-muted">
          No monthly plans yet. Your progress will appear here once work begins.
        </div>
      )}

      {/* Package upgrade CTA */}
      <div className="mt-8 bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">Want to see better results?</h3>
        <p className="text-sm text-white/80 mb-4">
          Upgrading your package means more deliverables, faster keyword rankings, and increased lead generation every month.
          {plans.length <= 1 && (
            <span className="block mt-1 text-amber-300">You&apos;re currently on a starter plan — results build gradually over 3-6 months. Upgrading accelerates this significantly.</span>
          )}
        </p>
        <a href="/dashboard/plans" className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
          Explore Upgrade Options
        </a>
      </div>
    </div>
  )
}
