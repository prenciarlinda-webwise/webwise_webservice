'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import StatsCard from '@/components/dashboard/StatsCard'
import StatusBadge from '@/components/dashboard/StatusBadge'
import PageHeader from '@/components/dashboard/PageHeader'
import { ArrowRight, TrendingUp, Calendar, DollarSign, Users } from 'lucide-react'

interface Summary {
  total_revenue: string
  total_paid: string
  total_pending: string
  total_upcoming: string
  total_overdue: string
  total_costs: string
  net_profit: string
  total_clients: number
  this_month_revenue: string
  this_month_costs: string
  this_month_profit: string
  next_month_planned: string
  monthly_tool_costs: string
}

interface Payment {
  id: number
  client_name: string
  service_name: string
  amount: string
  status: string
  due_date: string
}

interface Expense {
  id: number
  name: string
  amount: string
  frequency: string
  category: string
  is_active: boolean
  monthly_cost: string
}

interface Deliverable {
  id: number
  title: string
  status: string
  due_date: string | null
  assigned_to_name: string | null
  category_display: string
}

interface MonthlyPlan {
  id: number
  client_name: string
  service_name: string
  month_display: string
  progress: { total: number; completed: number; percent: number }
  deliverables: Deliverable[]
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [actionPayments, setActionPayments] = useState<Payment[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [plans, setPlans] = useState<MonthlyPlan[]>([])

  useEffect(() => {
    api.get<Summary>('/payments/summary/').then(setSummary)
    api.get<{ results: Expense[] }>('/payments/expenses/').then(d => setExpenses(d.results))
    // Get current month plans
    const now = new Date()
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    api.get<{ results: MonthlyPlan[] }>(`/clients/plans/?month=${monthStr}`).then(d => setPlans(d.results))
    // Pending + overdue payments
    Promise.all([
      api.get<{ results: Payment[] }>('/payments/?status=pending'),
      api.get<{ results: Payment[] }>('/payments/?status=overdue'),
    ]).then(([p, o]) => setActionPayments([...o.results, ...p.results]))
  }, [])

  const now = new Date()
  const currentMonth = monthNames[now.getMonth()]
  const nextMonth = monthNames[(now.getMonth() + 1) % 12]
  const activeExpenses = expenses.filter(e => e.is_active)
  const totalMonthlyTools = activeExpenses.reduce((s, e) => s + Number(e.monthly_cost), 0)

  return (
    <div>
      <PageHeader title="Dashboard" description={`${currentMonth} ${now.getFullYear()} — Business overview`} />

      {/* This month / next month planning */}
      {summary && (
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-3">
              <Calendar size={14} /> THIS MONTH — {currentMonth.toUpperCase()}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Planned Revenue</span>
                <span className="text-sm font-semibold">€{Number(summary.this_month_revenue).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Costs (project + tools)</span>
                <span className="text-sm font-semibold text-red-600">-€{Number(summary.this_month_costs).toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-sm font-medium">Projected Profit</span>
                <span className={`text-sm font-bold ${Number(summary.this_month_profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{Number(summary.this_month_profit).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-3">
              <TrendingUp size={14} /> NEXT MONTH — {nextMonth.toUpperCase()}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Planned Revenue</span>
                <span className="text-sm font-semibold">€{Number(summary.next_month_planned).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Tool Subscriptions</span>
                <span className="text-sm font-semibold text-red-600">-€{totalMonthlyTools.toFixed(0)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-sm font-medium">Est. Profit (excl. project costs)</span>
                <span className="text-sm font-bold text-green-600">
                  €{(Number(summary.next_month_planned) - totalMonthlyTools).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-3">
              <DollarSign size={14} /> ALL TIME
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Total Collected</span>
                <span className="text-sm font-semibold text-green-600">€{Number(summary.total_paid).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Outstanding</span>
                <span className="text-sm font-semibold text-amber-600">€{(Number(summary.total_pending) + Number(summary.total_overdue)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Total Costs</span>
                <span className="text-sm font-semibold text-red-600">-€{Number(summary.total_costs).toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-sm font-medium">Net Profit</span>
                <span className="text-sm font-bold text-green-600">€{Number(summary.net_profit).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick stats row */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <StatsCard label="Clients" value={String(summary.total_clients)} color="default" />
          <StatsCard label="Paid" value={`€${Number(summary.total_paid).toLocaleString()}`} color="green" />
          <StatsCard label="Pending" value={`€${Number(summary.total_pending).toLocaleString()}`} color="yellow" />
          <StatsCard label="Overdue" value={`€${Number(summary.total_overdue).toLocaleString()}`} color={Number(summary.total_overdue) > 0 ? 'red' : 'default'} />
          <StatsCard label="Upcoming" value={`€${Number(summary.total_upcoming).toLocaleString()}`} color="blue" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Action needed: payments */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Payments Needing Action</h2>
            <Link href="/dashboard/payments" className="text-xs text-accent hover:underline flex items-center gap-1">All payments <ArrowRight size={12} /></Link>
          </div>
          {actionPayments.length > 0 ? (
            <div className="divide-y divide-border">
              {actionPayments.slice(0, 8).map(p => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.client_name}</p>
                    <p className="text-xs text-text-muted">{p.service_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">€{Number(p.amount).toLocaleString()}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-text-muted text-sm">All caught up!</div>
          )}
        </div>

        {/* Monthly tool costs */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Monthly Subscriptions</h2>
            <span className="text-sm font-semibold text-text-secondary">€{totalMonthlyTools.toFixed(0)}/mo</span>
          </div>
          {activeExpenses.length > 0 ? (
            <div className="divide-y divide-border">
              {activeExpenses.map(e => (
                <div key={e.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{e.name}</p>
                    {e.category && <p className="text-xs text-text-muted">{e.category}</p>}
                  </div>
                  <span className="text-sm font-semibold">
                    ${Number(e.amount).toLocaleString()}/{e.frequency === 'yearly' ? 'yr' : e.frequency === 'one_time' ? 'once' : 'mo'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-text-muted text-sm">
              <p>No subscriptions tracked yet</p>
              <Link href="/dashboard/payments" className="text-accent hover:underline text-xs mt-1 inline-block">Add expenses →</Link>
            </div>
          )}
        </div>
      </div>

      {/* This month's work overview */}
      {plans.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{currentMonth} Work Progress</h2>
          </div>
          <div className="grid gap-3">
            {plans.map(plan => {
              const overdue = plan.deliverables.filter(d =>
                d.due_date && d.due_date < new Date().toISOString().split('T')[0] &&
                d.status !== 'completed' && d.status !== 'published'
              ).length
              return (
                <div key={plan.id} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-semibold">{plan.client_name}</p>
                      <p className="text-xs text-text-muted">{plan.service_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {overdue > 0 && <span className="text-xs text-red-600 font-medium">{overdue} overdue</span>}
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${plan.progress.percent}%` }} />
                      </div>
                      <span className="text-xs font-medium text-text-secondary">{plan.progress.completed}/{plan.progress.total}</span>
                    </div>
                    <span className="text-sm font-semibold">{plan.progress.percent}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
