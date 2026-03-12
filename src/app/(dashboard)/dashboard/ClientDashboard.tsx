'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { ChevronRight, Globe, ExternalLink } from 'lucide-react'

interface Deliverable {
  id: number; title: string; category_display: string; status: string
  link: string; live_url: string
}
interface MonthlyPlan {
  id: number; service_name: string; project_name: string; month_display: string
  progress: { total: number; completed: number; percent: number }
  deliverables: Deliverable[]
}
interface Service { id: number; name: string; status: string }
interface Project { id: number; slug: string; name: string; website_url: string; status: string; services: Service[] }
interface Payment { id: number; service_name: string; status: string; due_date: string }

export default function ClientDashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [plans, setPlans] = useState<MonthlyPlan[]>([])

  useEffect(() => {
    api.get<{ results: Project[] }>('/clients/projects/').then(d => setProjects(d.results))
    api.get<{ results: Payment[] }>('/payments/').then(d => setPayments(d.results))
    api.get<{ results: MonthlyPlan[] }>('/clients/plans/').then(d => setPlans(d.results))
  }, [])

  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalServices = projects.reduce((s, p) => s + p.services.length, 0)
  const allDels = plans.flatMap(p => p.deliverables)
  const completedDels = allDels.filter(d => d.status === 'completed' || d.status === 'published').length
  const nextPayment = payments
    .filter(p => p.status === 'upcoming' || p.status === 'pending')
    .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))[0]

  // Latest active plans
  const activePlans = plans.filter(p => p.deliverables.some(d => d.status !== 'completed' && d.status !== 'published')).slice(0, 3)

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.first_name}`} description="Your business overview" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Active Businesses" value={String(activeProjects)} color="blue" />
        <StatsCard label="Services Active" value={String(totalServices)} color="green" />
        <StatsCard label="Deliverables Done" value={String(completedDels)} color="green" />
        <StatsCard
          label="Next Payment"
          value={nextPayment ? nextPayment.due_date : 'None'}
          color={nextPayment ? 'yellow' : 'default'}
        />
      </div>

      {/* My Businesses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Businesses</h2>
          <Link href="/dashboard/my-projects" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="grid gap-3">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/dashboard/my-projects/${project.slug}`}
              className="flex items-center justify-between bg-white rounded-xl border border-border p-5 hover:border-accent/30 hover:shadow-sm transition-all group"
            >
              <div>
                <h3 className="font-semibold group-hover:text-accent transition-colors">{project.name}</h3>
                {project.website_url && (
                  <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                    <Globe size={11} /> {project.website_url}
                  </div>
                )}
                <div className="flex gap-1.5 mt-2">
                  {project.services.map(s => (
                    <span key={s.id} className="text-xs bg-bg-secondary px-2 py-0.5 rounded">{s.name}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                <ChevronRight size={18} className="text-text-muted group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Current Work Progress */}
      {activePlans.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Current Progress</h2>
            <Link href="/dashboard/progress" className="text-sm text-accent hover:underline">View full progress</Link>
          </div>
          {activePlans.map(plan => (
            <div key={plan.id} className="bg-white rounded-xl border border-border mb-3 overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{plan.service_name}</span>
                  <span className="text-xs text-text-muted ml-2">{plan.project_name} · {plan.month_display}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${plan.progress.percent}%` }} />
                  </div>
                  <span className="text-xs font-medium">{plan.progress.percent}%</span>
                </div>
              </div>
              <div className="divide-y divide-border/50">
                {plan.deliverables.filter(d => d.status !== 'completed' && d.status !== 'published').slice(0, 5).map(d => (
                  <div key={d.id} className="flex items-center justify-between px-5 py-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${d.status === 'in_progress' ? 'text-blue-500' : 'text-gray-300'}`}>
                        {d.status === 'in_progress' ? '●' : '○'}
                      </span>
                      <span className="text-sm">{d.title}</span>
                      <span className="text-[10px] text-text-muted">{d.category_display}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {d.link && <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline" onClick={e => e.stopPropagation()}>Draft</a>}
                      {d.live_url && <a href={d.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline flex items-center gap-0.5" onClick={e => e.stopPropagation()}><ExternalLink size={10} />Live</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upgrade CTA */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">Want to see better results?</h3>
        <p className="text-sm text-white/80 mb-4">
          Upgrading your package means more deliverables, faster keyword rankings, and increased lead generation every month.
        </p>
        <Link href="/dashboard/progress" className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
          View Full Progress
        </Link>
      </div>
    </div>
  )
}
