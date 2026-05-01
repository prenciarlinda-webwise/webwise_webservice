'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import { CreditCard, AlertTriangle, TrendingUp, FileText } from 'lucide-react'

interface Summary {
  total_revenue: string
  total_paid: string
  total_pending: string
  total_upcoming: string
  total_overdue: string
  total_costs: string
  net_profit: string
  this_month_revenue: string
  this_month_costs: string
  this_month_profit: string
  next_month_planned: string
  monthly_tool_costs: string
}

interface Payment {
  id: number
  client_name: string
  business_name: string
  business_slug: string
  service_name: string
  amount: string
  status: string
  due_date: string
}

export default function EconomistDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [pending, setPending] = useState<Payment[]>([])
  const [overdue, setOverdue] = useState<Payment[]>([])

  useEffect(() => {
    api.get<Summary>('/payments/summary/').then(setSummary).catch(() => setSummary(null))
    api.get<{ results: Payment[] }>('/payments/?status=pending').then(d => setPending(d.results)).catch(() => setPending([]))
    api.get<{ results: Payment[] }>('/payments/?status=overdue').then(d => setOverdue(d.results)).catch(() => setOverdue([]))
  }, [])

  const fmt = (v: string | undefined | null) => v ? `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'

  return (
    <div className="space-y-8">
      <PageHeader
        title="Economist dashboard"
        description="Finance overview"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FinanceCard icon={<CreditCard className="text-green-500" />} title="This month revenue" value={fmt(summary?.this_month_revenue)} />
        <FinanceCard icon={<TrendingUp className="text-blue-500" />} title="Net profit (MTD)" value={fmt(summary?.this_month_profit)} />
        <FinanceCard icon={<AlertTriangle className="text-red-500" />} title="Overdue" value={fmt(summary?.total_overdue)} />
        <FinanceCard icon={<FileText className="text-yellow-500" />} title="Pending" value={fmt(summary?.total_pending)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Overdue ({overdue.length})</h2>
            <Link href="/dashboard/finances/business?status=overdue" className="text-sm text-accent hover:underline">All →</Link>
          </div>
          {overdue.length === 0 ? (
            <p className="text-sm text-text-muted">No overdue payments.</p>
          ) : (
            <ul className="space-y-2">
              {overdue.slice(0, 6).map(p => (
                <li key={p.id} className="flex items-center justify-between p-2 border border-border rounded">
                  <div>
                    <p className="text-sm font-medium">{p.business_name || p.client_name}</p>
                    <p className="text-xs text-text-muted">{p.service_name} · due {new Date(p.due_date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-red-600">{fmt(p.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pending ({pending.length})</h2>
            <Link href="/dashboard/finances/business?status=pending" className="text-sm text-accent hover:underline">All →</Link>
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-text-muted">No pending payments.</p>
          ) : (
            <ul className="space-y-2">
              {pending.slice(0, 6).map(p => (
                <li key={p.id} className="flex items-center justify-between p-2 border border-border rounded">
                  <div>
                    <p className="text-sm font-medium">{p.business_name || p.client_name}</p>
                    <p className="text-xs text-text-muted">{p.service_name} · due {new Date(p.due_date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-yellow-600">{fmt(p.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Totals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-text-muted text-xs">Total revenue</p><p className="font-semibold">{fmt(summary?.total_revenue)}</p></div>
          <div><p className="text-text-muted text-xs">Paid</p><p className="font-semibold">{fmt(summary?.total_paid)}</p></div>
          <div><p className="text-text-muted text-xs">Costs (all)</p><p className="font-semibold">{fmt(summary?.total_costs)}</p></div>
          <div><p className="text-text-muted text-xs">Net profit</p><p className="font-semibold">{fmt(summary?.net_profit)}</p></div>
          <div><p className="text-text-muted text-xs">This month costs</p><p className="font-semibold">{fmt(summary?.this_month_costs)}</p></div>
          <div><p className="text-text-muted text-xs">Next month planned</p><p className="font-semibold">{fmt(summary?.next_month_planned)}</p></div>
          <div><p className="text-text-muted text-xs">Monthly tool costs</p><p className="font-semibold">{fmt(summary?.monthly_tool_costs)}</p></div>
        </div>
      </section>
    </div>
  )
}

function FinanceCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-2">{icon}<span className="text-sm text-text-muted">{title}</span></div>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}
