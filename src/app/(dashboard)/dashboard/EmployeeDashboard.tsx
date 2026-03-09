'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatsCard from '@/components/dashboard/StatsCard'

interface Deliverable {
  id: number
  title: string
  category_display: string
  status: string
  due_date: string | null
  plan?: { client_name: string; service_name: string }
}

interface MonthlyPlan {
  id: number
  service_name: string
  project_name: string
  client_name: string
  deliverables: Deliverable[]
}

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<MonthlyPlan[]>([])

  useEffect(() => {
    api.get<{ results: MonthlyPlan[] }>('/clients/plans/').then(d => setPlans(d.results))
  }, [])

  const allDels = plans.flatMap(p => p.deliverables.map(d => ({ ...d, plan: p })))
  const todo = allDels.filter(d => d.status === 'not_started')
  const inProgress = allDels.filter(d => d.status === 'in_progress')
  const completed = allDels.filter(d => d.status === 'completed' || d.status === 'published')
  const today = new Date().toISOString().split('T')[0]
  const overdue = allDels.filter(d => d.due_date && d.due_date < today && d.status !== 'completed' && d.status !== 'published')

  // Upcoming tasks sorted by due date
  const upcoming = allDels
    .filter(d => d.status !== 'completed' && d.status !== 'published')
    .sort((a, b) => (a.due_date || '9999').localeCompare(b.due_date || '9999'))
    .slice(0, 10)

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.first_name}`} description="Your assigned tasks overview" />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatsCard label="To Do" value={String(todo.length)} color="default" />
        <StatsCard label="In Progress" value={String(inProgress.length)} color="blue" />
        <StatsCard label="Overdue" value={String(overdue.length)} color="red" />
        <StatsCard label="Completed" value={String(completed.length)} color="green" />
      </div>

      <div className="bg-white rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Upcoming Tasks</h2>
          <Link href="/dashboard/tasks" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-border">
              <th className="px-6 py-3">Client</th>
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
                  <p className="text-sm font-medium">{d.plan?.client_name}</p>
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
