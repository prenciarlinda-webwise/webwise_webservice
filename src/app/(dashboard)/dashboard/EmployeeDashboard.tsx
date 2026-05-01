'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import StatusBadge from '@/components/dashboard/StatusBadge'

interface Deliverable {
  id: number
  title: string
  category_display: string
  status: string
  due_date: string | null
  assigned_to: number | null
  approval_state?: 'draft' | 'submitted' | 'approved' | 'rejected'
  rejection_reason?: string
  plan?: { client_name: string; service_name: string; project_name: string; business_slug: string }
}

interface MonthlyPlan {
  id: number
  service_name: string
  project_name: string
  business_slug: string
  client_name: string
  deliverables: Deliverable[]
}

interface EmpSummary {
  month: string
  total_hours: string
  total_logs: number
  active_tasks: number
  completed_tasks: number
  projects: { id: number; slug: string; name: string; status: string }[]
}

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<MonthlyPlan[]>([])
  const [summary, setSummary] = useState<EmpSummary | null>(null)

  useEffect(() => {
    api.get<{ results: MonthlyPlan[] }>('/clients/plans/').then(d => setPlans(d.results))
    api.get<EmpSummary>('/employees/summary/').then(setSummary)
  }, [])

  const allDels = plans.flatMap(p => p.deliverables.map(d => ({ ...d, plan: { client_name: p.client_name, service_name: p.service_name, project_name: p.project_name, business_slug: p.business_slug } })))
  const todo = allDels.filter(d => d.status === 'not_started')
  const inProgress = allDels.filter(d => d.status === 'in_progress')
  const completed = allDels.filter(d => d.status === 'completed' || d.status === 'published')
  const today = new Date().toISOString().split('T')[0]
  const overdue = allDels.filter(d => d.due_date && d.due_date < today && d.status !== 'completed' && d.status !== 'published')
  const rejected = allDels.filter(d => d.approval_state === 'rejected')

  const upcoming = allDels
    .filter(d => d.status !== 'completed' && d.status !== 'published')
    .sort((a, b) => (a.due_date || '9999').localeCompare(b.due_date || '9999'))
    .slice(0, 10)

  const monthHours = summary ? Number(summary.total_hours) : 0

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.first_name}`} description="Your work overview" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard label="To Do" value={String(todo.length)} color="default" />
        <StatsCard label="In Progress" value={String(inProgress.length)} color="blue" />
        <StatsCard label="Overdue" value={String(overdue.length)} color="red" />
        <StatsCard label="Completed" value={String(completed.length)} color="green" />
        <StatsCard label="Hours This Month" value={monthHours.toFixed(1)} color="default" />
      </div>

      {rejected.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-red-900 mb-2">Needs rework — {rejected.length} rejected</h2>
          <ul className="space-y-1.5">
            {rejected.slice(0, 5).map(d => (
              <li key={d.id} className="text-sm">
                <Link href={`/dashboard/${d.plan?.business_slug}`} className="text-red-900 hover:underline">
                  {d.title}
                </Link>
                {d.rejection_reason && <span className="text-xs text-red-700 ml-2">— {d.rejection_reason}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* My Projects */}
      {summary && summary.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">My Projects</h2>
          <div className="space-y-2">
            {summary.projects.map(p => (
              <Link
                key={p.id}
                href={`/dashboard/${p.slug}`}
                className="flex items-center justify-between bg-white rounded-xl border border-border p-4 hover:border-accent/30 hover:shadow-sm transition-all"
              >
                <h3 className="font-medium text-sm">{p.name}</h3>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Upcoming Tasks</h2>
          <Link href="/dashboard/tasks" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-border">
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Task</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map(d => (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/50">
                <td className="px-6 py-3">
                  <Link href={`/dashboard/${d.plan?.business_slug}`} className="text-sm font-medium hover:text-accent">{d.plan?.project_name}</Link>
                  <p className="text-xs text-text-muted">{d.plan?.service_name}</p>
                </td>
                <td className="px-6 py-3 text-sm">{d.title}</td>
                <td className="px-6 py-3 text-xs text-text-secondary">{d.category_display}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    d.status === 'in_progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className={`px-6 py-3 text-xs ${d.due_date && d.due_date < today ? 'text-red-600 font-medium' : 'text-text-secondary'}`}>
                  {d.due_date || '—'}
                </td>
              </tr>
            ))}
            {upcoming.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted text-sm">No tasks assigned yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
