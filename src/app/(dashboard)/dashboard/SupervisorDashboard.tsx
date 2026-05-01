'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { ArrowRight, AlertCircle, Building2, ClipboardList, Inbox } from 'lucide-react'

interface Business {
  id: number
  slug: string
  name: string
  status: string
  domain: string
}

interface Plan {
  id: number
  business_name: string
  business_slug: string
  service_name: string
  month: string
  month_display: string
  status: string
  progress: { total: number; completed: number; percent: number }
}

export default function SupervisorDashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [pendingReview, setPendingReview] = useState(0)

  useEffect(() => {
    api.get<{ results: Business[] } | Business[]>('/clients/projects/').then(d => {
      setBusinesses(Array.isArray(d) ? d : (d.results ?? []))
    }).catch(() => setBusinesses([]))
    const month = new Date().toISOString().slice(0, 7) + '-01'
    api.get<{ results: Plan[] } | Plan[]>(`/clients/plans/?month=${month}`).then(d => {
      setPlans(Array.isArray(d) ? d : (d.results ?? []))
    }).catch(() => setPlans([]))
    api.get<{ results: { id: number }[] } | { id: number }[]>('/clients/deliverables/?approval_state=submitted').then(d => {
      const list = Array.isArray(d) ? d : (d.results ?? [])
      setPendingReview(list.length)
    }).catch(() => setPendingReview(0))
  }, [])

  const overdue = plans.filter(p => p.status !== 'completed' && p.progress.percent < 50)
  const onTrack = plans.filter(p => p.progress.percent >= 50 && p.status !== 'completed')
  const done = plans.filter(p => p.status === 'completed')

  return (
    <div className="space-y-8">
      <PageHeader
        title="Supervisor dashboard"
        description="Work overview · this month"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/dashboard/review" className="block">
          <Card icon={<Inbox className="text-blue-500" />} title="Awaiting review" value={pendingReview} hint={pendingReview > 0 ? 'Click to review' : 'All caught up'} />
        </Link>
        <Card icon={<AlertCircle className="text-red-500" />} title="Needs attention" value={overdue.length} hint="< 50% done" />
        <Card icon={<ClipboardList className="text-blue-500" />} title="On track" value={onTrack.length} hint="≥ 50% done" />
        <Card icon={<Building2 className="text-green-500" />} title="Active businesses" value={businesses.filter(b => b.status === 'active').length} hint={`${businesses.length} total`} />
      </div>

      {overdue.length > 0 && (
        <section className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Plans needing attention</h2>
          <div className="space-y-2">
            {overdue.slice(0, 8).map(p => (
              <Link
                key={p.id}
                href={`/dashboard/${p.business_slug}`}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-accent/50"
              >
                <div>
                  <p className="font-medium">{p.business_name}</p>
                  <p className="text-xs text-text-muted">{p.service_name} · {p.month_display}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted">{p.progress.completed}/{p.progress.total} · {p.progress.percent}%</span>
                  <StatusBadge status={p.status} />
                  <ArrowRight size={14} className="text-text-muted" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active businesses</h2>
          <Link href="/dashboard/clients" className="text-sm text-accent hover:underline">All clients →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.filter(b => b.status === 'active').map(b => (
            <div
              key={b.id}
              className="p-4 border border-border rounded-lg hover:border-accent/50 transition-colors"
            >
              <Link href={`/dashboard/${b.slug}`} className="block">
                <h3 className="font-medium">{b.name}</h3>
                {b.domain && <p className="text-xs text-text-muted mt-1">{b.domain}</p>}
              </Link>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Link href={`/dashboard/${b.slug}/rankings`} className="text-accent hover:underline">Rankings</Link>
                <span className="text-text-muted">·</span>
                <Link href={`/dashboard/${b.slug}/events`} className="text-accent hover:underline">Events</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {done.length > 0 && (
        <section className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Completed this month ({done.length})</h2>
          <ul className="text-sm space-y-1 text-text-secondary">
            {done.slice(0, 5).map(p => (
              <li key={p.id}>{p.business_name} — {p.service_name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function Card({ icon, title, value, hint }: { icon: React.ReactNode; title: string; value: number; hint: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-2">{icon}<span className="text-sm text-text-muted">{title}</span></div>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-xs text-text-muted mt-1">{hint}</p>
    </div>
  )
}
