'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { ArrowRight, Wallet, Briefcase, Filter } from 'lucide-react'

interface Summary {
  total_revenue: string; total_paid: string; total_pending: string; total_upcoming: string
  total_overdue: string; total_planned: string; total_costs: string; net_profit: string; total_clients: number
  this_month_revenue: string; this_month_costs: string; this_month_profit: string
  next_month_planned: string; monthly_tool_costs: string
}
interface Payment { id: number; client_name: string; client_id: number; project_id: number; service_name: string; amount: string; status: string; due_date: string }
interface Expense { id: number; name: string; amount: string; frequency: string; category: string; is_active: boolean; monthly_cost: string }
interface PSummary {
  total_income: string; total_expenses: string; total_savings: string; savings_rate: string
  planned_income: string; planned_expenses: string; planned_savings: string
  income_by_source: Record<string, { planned: string; actual: string }>; expenses_by_category: Record<string, { planned: string; actual: string }>
}
interface Deliverable { id: number; title: string; status: string; due_date: string | null; assigned_to_name: string | null; category_display: string }
interface MonthlyPlan { id: number; client_name: string; service_name: string; project_id: number; month: string; month_display: string; progress: { total: number; completed: number; percent: number }; deliverables: Deliverable[] }

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [actionPayments, setActionPayments] = useState<Payment[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [plans, setPlans] = useState<MonthlyPlan[]>([])
  const [pSummary, setPSummary] = useState<PSummary | null>(null)

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

  const loadData = (monthYM: string) => {
    const monthStr = monthYM + '-01'
    api.get<Summary>(`/payments/summary/?month=${monthStr}`).then(setSummary)
    api.get<{ results: Expense[] }>('/payments/expenses/').then(d => setExpenses(d.results))
    api.get<{ results: MonthlyPlan[] }>(`/clients/plans/?month=${monthStr}`).then(d => setPlans(d.results))
    api.get<PSummary>(`/payments/personal/summary/?month=${monthStr}`).then(setPSummary)
    Promise.all([
      api.get<{ results: Payment[] }>('/payments/?status=pending'),
      api.get<{ results: Payment[] }>('/payments/?status=overdue'),
    ]).then(([p, o]) => setActionPayments([...o.results, ...p.results]))
  }

  useEffect(() => { loadData(selectedMonth) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const changeMonth = (m: string) => { setSelectedMonth(m); loadData(m) }

  const [monthYear, monthNum] = selectedMonth.split('-').map(Number)
  const displayMonth = monthNames[monthNum - 1]
  const nextMonthName = monthNames[monthNum % 12]
  const activeExpenses = expenses.filter(e => e.is_active)
  const totalMonthlyTools = activeExpenses.reduce((s, e) => s + Number(e.monthly_cost), 0)
  const monthStr = selectedMonth + '-01'

  // Business numbers
  const bizRevenue = summary ? Number(summary.this_month_revenue) : 0
  const bizCosts = summary ? Number(summary.this_month_costs) : 0
  const bizProfit = bizRevenue - bizCosts
  const bizPlannedRevenue = summary ? Number(summary.next_month_planned) : 0
  const bizPlannedCosts = totalMonthlyTools
  const bizPlannedProfit = bizPlannedRevenue - bizPlannedCosts
  const bizOutstanding = summary ? Number(summary.total_pending) + Number(summary.total_overdue) : 0

  // Personal numbers
  const pInc = pSummary ? Number(pSummary.total_income) : 0
  const pExp = pSummary ? Number(pSummary.total_expenses) : 0
  const pSav = pSummary ? Number(pSummary.total_savings) : 0
  const pRemaining = pInc - pExp - pSav
  const pPlannedInc = pSummary ? Number(pSummary.planned_income) : 0
  const pPlannedExp = pSummary ? Number(pSummary.planned_expenses) : 0
  const pPlannedSav = pSummary ? Number(pSummary.planned_savings) : 0
  const pPlannedRemaining = pPlannedInc - pPlannedExp - pPlannedSav

  // All-time
  const allTimePaid = summary ? Number(summary.total_paid) : 0
  const allTimeProfit = summary ? Number(summary.net_profit) : 0

  return (
    <div>
      {/* Header + month filter */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted">{displayMonth} {monthYear}</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-muted" />
          <input type="month" value={selectedMonth} onChange={e => changeMonth(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm" />
        </div>
      </div>

      {/* ═══ FINANCIAL OVERVIEW — Two separate boxes ═══ */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">

        {/* ── Business Finances Box ── */}
        <div className="bg-bg-secondary/50 rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              <span className="text-sm font-bold text-primary">Business</span>
              <span className="text-xs text-text-muted">({displayMonth} &middot; EUR)</span>
            </div>
            <Link href={`/dashboard/finances/business?month=${selectedMonth}`} className="text-xs text-accent hover:underline">Details &rarr;</Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase">Revenue</p>
              <p className="text-lg font-bold text-green-600">&euro;{bizRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase">Costs</p>
              <p className="text-lg font-bold text-red-600">-&euro;{bizCosts.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase">Profit</p>
              <p className={`text-lg font-bold ${bizProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>&euro;{bizProfit.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase">Outstanding</p>
              <p className="text-lg font-bold text-amber-600">&euro;{bizOutstanding.toLocaleString()}</p>
            </div>
          </div>

          {/* Planned row */}
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            <div className="bg-white rounded-lg p-2.5 border-l-2 border-blue-300">
              <p className="text-[10px] text-blue-500 uppercase">Planned Rev</p>
              <p className="text-sm font-bold">&euro;{bizPlannedRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border-l-2 border-blue-300">
              <p className="text-[10px] text-blue-500 uppercase">Planned Costs</p>
              <p className="text-sm font-bold text-red-600">-&euro;{bizPlannedCosts.toFixed(0)}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border-l-2 border-blue-300">
              <p className="text-[10px] text-blue-500 uppercase">Planned Profit</p>
              <p className={`text-sm font-bold ${bizPlannedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>&euro;{bizPlannedProfit.toFixed(0)}</p>
            </div>
          </div>

          {/* All-time */}
          {summary && (
            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-border/50">
              <div className="text-center">
                <p className="text-[10px] text-text-muted uppercase">All-Time Collected</p>
                <p className="text-xs font-bold text-green-600">&euro;{allTimePaid.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-text-muted uppercase">All-Time Profit</p>
                <p className="text-xs font-bold text-green-600">&euro;{allTimeProfit.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-text-muted uppercase">Subscriptions</p>
                <p className="text-xs font-bold">&euro;{totalMonthlyTools.toFixed(0)}/mo</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Personal Finances Box ── */}
        <div className="bg-bg-secondary/50 rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-accent" />
              <span className="text-sm font-bold text-accent">Personal</span>
              <span className="text-xs text-text-muted">({displayMonth} &middot; LEK)</span>
            </div>
            <Link href={`/dashboard/finances/personal?month=${selectedMonth}`} className="text-xs text-accent hover:underline">Details &rarr;</Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase">Income</p>
              <p className="text-lg font-bold text-green-600">{pInc.toLocaleString()} L</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase">Expenses</p>
              <p className="text-lg font-bold text-red-600">{pExp.toLocaleString()} L</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase">Savings</p>
              <p className="text-lg font-bold text-blue-600">{pSav.toLocaleString()} L</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase">Remaining</p>
              <p className={`text-lg font-bold ${pRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>{pRemaining.toLocaleString()} L</p>
            </div>
          </div>

          {/* Planned row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3">
            <div className="bg-white rounded-lg p-2.5 border-l-2 border-blue-300">
              <p className="text-[10px] text-blue-500 uppercase">Planned Inc</p>
              <p className="text-sm font-bold">{pPlannedInc.toLocaleString()} L</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border-l-2 border-blue-300">
              <p className="text-[10px] text-blue-500 uppercase">Planned Exp</p>
              <p className="text-sm font-bold text-red-600">{pPlannedExp.toLocaleString()} L</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border-l-2 border-blue-300">
              <p className="text-[10px] text-blue-500 uppercase">Planned Sav</p>
              <p className="text-sm font-bold text-blue-600">{pPlannedSav.toLocaleString()} L</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border-l-2 border-blue-300">
              <p className="text-[10px] text-blue-500 uppercase">Planned Rem</p>
              <p className={`text-sm font-bold ${pPlannedRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>{pPlannedRemaining.toLocaleString()} L</p>
            </div>
          </div>

          {/* Income/Expense breakdown */}
          {pSummary && Object.keys(pSummary.income_by_source).length > 0 && (
            <div className="pt-3 border-t border-border/50 space-y-1.5">
              {Object.entries(pSummary.income_by_source).map(([src, vals]) => (
                <div key={src} className="flex justify-between text-xs">
                  <span className="text-text-muted">{src}</span>
                  <span className="font-medium text-green-600">{Number(vals.actual).toLocaleString()} L</span>
                </div>
              ))}
              {Object.entries(pSummary.expenses_by_category).sort(([,a],[,b]) => Number(b.actual) - Number(a.actual)).slice(0, 5).map(([cat, vals]) => (
                <div key={cat} className="flex justify-between text-xs">
                  <span className="text-text-muted">{cat}</span>
                  <span className={`font-medium ${cat === 'Savings/Investment' ? 'text-blue-600' : 'text-red-500'}`}>-{Number(vals.actual).toLocaleString()} L</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ DETAILS ═══ */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Payments needing action */}
        <div className="bg-white rounded-xl border border-border lg:col-span-2">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Payments Needing Action</h3>
            <Link href="/dashboard/finances/business" className="text-xs text-accent hover:underline flex items-center gap-1">All <ArrowRight size={12} /></Link>
          </div>
          {actionPayments.length > 0 ? (
            <div className="divide-y divide-border">
              {actionPayments.slice(0, 8).map(p => (
                <Link key={p.id} href={`/dashboard/finances/business?client=${p.client_id}`} className="px-5 py-2.5 flex items-center justify-between hover:bg-bg-secondary/30 transition-colors block">
                  <div>
                    <p className="text-sm font-medium">{p.client_name}</p>
                    <p className="text-xs text-text-muted">{p.service_name} &middot; {p.due_date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">&euro;{Number(p.amount).toLocaleString()}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-6 text-center text-text-muted text-sm">All caught up!</div>
          )}
        </div>

        {/* Subscriptions */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Subscriptions</h3>
            <span className="text-xs font-semibold text-text-secondary">&euro;{totalMonthlyTools.toFixed(0)}/mo</span>
          </div>
          {activeExpenses.length > 0 ? (
            <div className="divide-y divide-border">
              {activeExpenses.map(e => (
                <div key={e.id} className="px-5 py-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{e.name}</p>
                    {e.category && <p className="text-[10px] text-text-muted">{e.category}</p>}
                  </div>
                  <span className="text-sm font-semibold">${Number(e.amount).toLocaleString()}/{e.frequency === 'yearly' ? 'yr' : 'mo'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-6 text-center text-text-muted text-sm">No subscriptions</div>
          )}
        </div>
      </div>

      {/* Work progress — links carry month context */}
      {plans.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-3">{displayMonth} Work Progress</h3>
          <div className="grid gap-2">
            {plans.map(plan => {
              const overdue = plan.deliverables.filter(d =>
                d.due_date && d.due_date < new Date().toISOString().split('T')[0] &&
                d.status !== 'completed' && d.status !== 'published'
              ).length
              return (
                <Link key={plan.id} href={`/dashboard/projects/${plan.project_id}?month=${monthStr}`} className="bg-white rounded-xl border border-border p-3 flex items-center justify-between hover:border-accent/40 transition-colors">
                  <div>
                    <p className="text-sm font-semibold">{plan.client_name}</p>
                    <p className="text-xs text-text-muted">{plan.service_name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {overdue > 0 && <span className="text-xs text-red-600 font-medium">{overdue} overdue</span>}
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${plan.progress.percent}%` }} />
                      </div>
                      <span className="text-xs font-medium text-text-secondary">{plan.progress.completed}/{plan.progress.total}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
