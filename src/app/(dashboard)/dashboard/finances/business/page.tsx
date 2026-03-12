'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import Modal from '@/components/dashboard/Modal'
import { Plus, Trash2, Pencil, Filter } from 'lucide-react'

// ── Types ──
interface Summary { total_revenue: string; total_paid: string; total_pending: string; total_upcoming: string; total_overdue: string; total_costs: string; net_profit: string; this_month_revenue: string; this_month_costs: string; this_month_profit: string; next_month_planned: string; monthly_tool_costs: string }
interface Payment { id: number; client_name: string; client_id: number; project_name: string; project_id: number; service_name: string; amount: string; payment_type: string; status: string; description: string; due_date: string; paid_date: string | null; project_service: number }
interface Cost { id: number; project_name: string; description: string; planned_amount: string | null; amount: string | null; date: string; project: number }
interface Expense { id: number; name: string; amount: string; frequency: string; category: string; start_date: string; end_date: string | null; notes: string; is_active: boolean; monthly_cost: string }
interface Client { id: number; business_name: string; projects: { id: number; name: string; services: { id: number; name: string }[] }[] }
interface ExRate { id: number; from_currency: string; to_currency: string; rate: string; updated_at: string }

type Section = 'revenue' | 'costs' | 'currency'

const STATUS_COLORS: Record<string, string> = {
  planned: 'bg-purple-100 text-purple-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  upcoming: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function BusinessFinancesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const qSection = searchParams.get('section') as Section | null
  const qProject = searchParams.get('project')
  const qClient = searchParams.get('client')

  // ── Data state ──
  const [summary, setSummary] = useState<Summary | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [costs, setCosts] = useState<Cost[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [rates, setRates] = useState<ExRate[]>([])

  // ── UI state ──
  const [section, setSection] = useState<Section>(qSection || 'revenue')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [projectFilter, setProjectFilter] = useState<string>(qProject || '')
  const [clientFilter, setClientFilter] = useState<string>(qClient || '')

  // ── Date range filter ──
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // ── Modal state ──
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showEditPayment, setShowEditPayment] = useState(false)
  const [showAddCost, setShowAddCost] = useState(false)
  const [showEditCost, setShowEditCost] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showEditExpense, setShowEditExpense] = useState(false)

  // ── Form state ──
  const [payForm, setPayForm] = useState({ id: 0, project_service: '', amount: '', payment_type: 'predetermined', status: 'upcoming', description: '', due_date: '', paid_date: '' })
  const [costForm, setCostForm] = useState({ id: 0, project: '', description: '', planned_amount: '', amount: '', date: new Date().toISOString().split('T')[0] })
  const [expForm, setExpForm] = useState({ id: 0, name: '', amount: '', frequency: 'monthly', category: '', start_date: new Date().toISOString().split('T')[0], end_date: '', notes: '' })

  // ── Currency state ──
  const [rateForm, setRateForm] = useState({ from_currency: 'USD', to_currency: 'LEK', rate: '' })
  const [convertAmount, setConvertAmount] = useState('')
  const [convertDirection, setConvertDirection] = useState<'to' | 'from'>('to')

  // ── Data loading ──
  const reload = () => {
    api.get<Summary>('/payments/summary/').then(setSummary)
    api.get<{ results: Payment[] }>('/payments/').then(d => setPayments(d.results))
    api.get<{ results: Cost[] }>('/payments/costs/').then(d => setCosts(d.results))
    api.get<{ results: Expense[] }>('/payments/expenses/').then(d => setExpenses(d.results))
    api.get<ExRate[]>('/payments/exchange-rates/').then(setRates)
  }

  useEffect(() => {
    reload()
    api.get<{ results: Client[] }>('/clients/').then(d => setClients(d.results))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Date filter helper ──
  const inDateRange = (dateStr: string | null) => {
    if (!dateStr) return true
    if (dateFrom && dateStr < dateFrom) return false
    if (dateTo && dateStr > dateTo) return false
    return true
  }
  const clearDateFilter = () => { setDateFrom(''); setDateTo('') }

  // ── Payment CRUD ──
  const resetPayForm = () => setPayForm({ id: 0, project_service: '', amount: '', payment_type: 'predetermined', status: 'upcoming', description: '', due_date: '', paid_date: '' })
  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id: _, ...data } = payForm
    await api.post('/payments/', { ...data, paid_date: data.paid_date || null })
    reload(); setShowAddPayment(false); resetPayForm()
  }
  const editPayment = (p: Payment) => {
    setPayForm({ id: p.id, project_service: String(p.project_service), amount: p.amount, payment_type: p.payment_type, status: p.status, description: p.description, due_date: p.due_date || '', paid_date: p.paid_date || '' })
    setShowEditPayment(true)
  }
  const savePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, ...data } = payForm
    await api.patch(`/payments/${id}/`, { ...data, paid_date: data.paid_date || null })
    reload(); setShowEditPayment(false); resetPayForm()
  }
  const deletePayment = async (id: number) => {
    if (!confirm('Delete this payment?')) return
    await api.delete(`/payments/${id}/`); reload()
  }
  const updatePaymentStatus = async (id: number, status: string) => {
    const updates: Record<string, unknown> = { status }
    if (status === 'paid') updates.paid_date = new Date().toISOString().split('T')[0]
    await api.patch(`/payments/${id}/`, updates); reload()
  }

  // ── Cost CRUD ──
  const resetCostForm = () => setCostForm({ id: 0, project: '', description: '', planned_amount: '', amount: '', date: new Date().toISOString().split('T')[0] })
  const addCost = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id: _, ...data } = costForm
    await api.post('/payments/costs/', { ...data, planned_amount: data.planned_amount || null, amount: data.amount || null })
    reload(); setShowAddCost(false); resetCostForm()
  }
  const editCost = (c: Cost) => {
    setCostForm({ id: c.id, project: String(c.project), description: c.description, planned_amount: c.planned_amount || '', amount: c.amount || '', date: c.date })
    setShowEditCost(true)
  }
  const saveCost = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, ...data } = costForm
    await api.patch(`/payments/costs/${id}/`, { ...data, planned_amount: data.planned_amount || null, amount: data.amount || null })
    reload(); setShowEditCost(false); resetCostForm()
  }
  const deleteCost = async (id: number) => {
    if (!confirm('Delete this cost?')) return
    await api.delete(`/payments/costs/${id}/`); reload()
  }

  // ── Business Expense CRUD ──
  const resetExpForm = () => setExpForm({ id: 0, name: '', amount: '', frequency: 'monthly', category: '', start_date: new Date().toISOString().split('T')[0], end_date: '', notes: '' })
  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id: _, ...data } = expForm
    await api.post('/payments/expenses/', { ...data, end_date: data.end_date || null })
    reload(); setShowAddExpense(false); resetExpForm()
  }
  const editExpense = (exp: Expense) => {
    setExpForm({ id: exp.id, name: exp.name, amount: exp.amount, frequency: exp.frequency, category: exp.category, start_date: exp.start_date, end_date: exp.end_date || '', notes: exp.notes })
    setShowEditExpense(true)
  }
  const saveExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, ...data } = expForm
    await api.patch(`/payments/expenses/${id}/`, { ...data, end_date: data.end_date || null })
    reload(); setShowEditExpense(false); resetExpForm()
  }
  const deleteExpense = async (id: number) => {
    if (!confirm('Delete this expense?')) return
    await api.delete(`/payments/expenses/${id}/`); reload()
  }
  const toggleExpenseActive = async (exp: Expense) => {
    await api.patch(`/payments/expenses/${exp.id}/`, { is_active: !exp.is_active }); reload()
  }

  // ── Currency ──
  const saveRate = async () => {
    if (!rateForm.rate) return
    await api.post('/payments/exchange-rates/', rateForm); reload()
  }
  const usdToLek = rates.find(r => r.from_currency === 'USD' && r.to_currency === 'LEK')
  const currentRate = usdToLek ? Number(usdToLek.rate) : 0
  const convertedAmount = (() => {
    const amt = Number(convertAmount)
    if (!amt || !currentRate) return null
    if (convertDirection === 'to') return `$${amt.toLocaleString()} = ${(amt * currentRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} LEK`
    return `${amt.toLocaleString()} LEK = $${(amt / currentRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  })()

  // ── Derived data ──
  const filteredPayments = payments
    .filter(p => statusFilter === 'all' || p.status === statusFilter)
    .filter(p => inDateRange(p.due_date))
    .filter(p => !projectFilter || String(p.project_id) === projectFilter)
    .filter(p => !clientFilter || String(p.client_id) === clientFilter)
  const filteredCosts = costs
    .filter(c => inDateRange(c.date))
    .filter(c => !projectFilter || String(c.project) === projectFilter)

  const activeExpenses = expenses.filter(e => e.is_active)
  const inactiveExpenses = expenses.filter(e => !e.is_active)
  const totalMonthlyExpenses = activeExpenses.reduce((s, e) => s + Number(e.monthly_cost), 0)
  const allServices = clients.flatMap(c => c.projects.flatMap(p => p.services.map(s => ({ ...s, clientName: c.business_name, projectName: p.name }))))

  // Group payments by client
  const paymentsByClient = filteredPayments.reduce<Record<string, { clientId: number; payments: Payment[] }>>((acc, p) => {
    const key = p.client_name || 'Unknown'
    if (!acc[key]) acc[key] = { clientId: p.client_id, payments: [] }
    acc[key].payments.push(p)
    return acc
  }, {})

  // Group costs by project
  const costsByProject = filteredCosts.reduce<Record<string, { projectId: number; costs: Cost[] }>>((acc, c) => {
    const key = c.project_name || 'Unknown'
    if (!acc[key]) acc[key] = { projectId: c.project, costs: [] }
    acc[key].costs.push(c)
    return acc
  }, {})

  const hasDateFilter = dateFrom || dateTo

  // ── Comparison summary ──
  const bizRevenue = summary ? Number(summary.this_month_revenue) : 0
  const bizCosts = summary ? Number(summary.this_month_costs) : 0
  const bizProfit = summary ? Number(summary.this_month_profit) : 0

  // ── Section action buttons ──
  const sectionActions = () => {
    switch (section) {
      case 'revenue': return (
        <button onClick={() => { resetPayForm(); setShowAddPayment(true) }} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Add Payment</button>
      )
      case 'costs': return (
        <div className="flex gap-2">
          <button onClick={() => { resetCostForm(); setShowAddCost(true) }} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Project Cost</button>
          <button onClick={() => { resetExpForm(); setShowAddExpense(true) }} className="flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"><Plus size={14} /> Subscription</button>
        </div>
      )
      default: return null
    }
  }

  return (
    <div>
      <PageHeader title="Business Finances" action={sectionActions()} />

      {/* ── Business Summary Box ── */}
      <div className="mb-6">
        <div className="bg-bg-secondary/50 rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-sm font-bold text-primary">Business (EUR)</span>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-text-muted" />
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-2 py-1 border border-border rounded text-xs w-28" />
              <span className="text-text-muted text-xs">&mdash;</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-2 py-1 border border-border rounded text-xs w-28" />
              {hasDateFilter && <button onClick={clearDateFilter} className="text-xs text-accent hover:underline">Clear</button>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted uppercase">Revenue</p>
              <p className="text-lg font-bold text-green-600">&euro;{bizRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted uppercase">Costs</p>
              <p className="text-lg font-bold text-red-600">-&euro;{bizCosts.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-[10px] text-text-muted uppercase">Profit</p>
              <p className={`text-lg font-bold ${bizProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>&euro;{bizProfit.toLocaleString()}</p>
            </div>
          </div>
          {summary && (
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border/50">
              <div className="text-center"><p className="text-[10px] text-text-muted uppercase">Paid</p><p className="text-xs font-bold text-green-600">&euro;{Number(summary.total_paid).toLocaleString()}</p></div>
              <div className="text-center"><p className="text-[10px] text-text-muted uppercase">Outstanding</p><p className="text-xs font-bold text-amber-600">&euro;{(Number(summary.total_pending) + Number(summary.total_overdue)).toLocaleString()}</p></div>
              <div className="text-center"><p className="text-[10px] text-text-muted uppercase">Overdue</p><p className={`text-xs font-bold ${Number(summary.total_overdue) > 0 ? 'text-red-600' : ''}`}>&euro;{Number(summary.total_overdue).toLocaleString()}</p></div>
              <div className="text-center"><p className="text-[10px] text-text-muted uppercase">Subscriptions</p><p className="text-xs font-bold">&euro;{totalMonthlyExpenses.toFixed(0)}/mo</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
          {([['revenue', 'Client Revenue'], ['costs', 'Costs & Subscriptions'], ['currency', 'Currency']] as [Section, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSection(key)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${section === key ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* ═══ CLIENT REVENUE ═══ */}
      {section === 'revenue' && (
        <>
          {/* Active filter indicator */}
          {(projectFilter || clientFilter) && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-accent/10 border border-accent/20 rounded-lg text-sm">
              <Filter size={14} className="text-accent" />
              <span className="text-text-secondary">
                Filtered by {projectFilter ? `project: ${clients.flatMap(c => c.projects).find(p => String(p.id) === projectFilter)?.name || projectFilter}` : ''}{projectFilter && clientFilter ? ' & ' : ''}{clientFilter ? `client: ${clients.find(c => String(c.id) === clientFilter)?.business_name || clientFilter}` : ''}
              </span>
              <button onClick={() => { setProjectFilter(''); setClientFilter('') }} className="ml-auto text-xs text-accent hover:underline">Clear filter</button>
            </div>
          )}

          {/* Status filter pills */}
          <div className="flex gap-1 mb-4">
            {['all', 'paid', 'pending', 'overdue', 'upcoming', 'planned', 'cancelled'].map(tab => (
              <button key={tab} onClick={() => setStatusFilter(tab)} className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${statusFilter === tab ? 'bg-primary text-white' : 'bg-bg-secondary text-text-muted hover:text-text-primary'}`}>{tab}</button>
            ))}
          </div>

          {/* Client cards grid */}
          {Object.keys(paymentsByClient).length === 0 ? (
            <div className="bg-white rounded-xl border border-border px-6 py-12 text-center text-text-muted">No payments found</div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(paymentsByClient).map(([clientName, { clientId, payments: clientPayments }]) => {
                const paid = clientPayments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)
                const overdue = clientPayments.filter(p => p.status === 'overdue').reduce((s, p) => s + Number(p.amount), 0)
                const pending = clientPayments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)
                const upcoming = clientPayments.filter(p => p.status === 'upcoming').reduce((s, p) => s + Number(p.amount), 0)
                const total = paid + overdue + pending + upcoming
                const firstProjectId = clientPayments[0]?.project_id
                return (
                  <div key={clientName} className="bg-white rounded-xl border border-border hover:border-accent/40 transition-colors cursor-pointer" onClick={() => firstProjectId ? router.push(`/dashboard/projects/${firstProjectId}`) : router.push(`/dashboard/clients/${clientId}`)}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm">{clientName}</h3>
                        <span className="text-lg font-bold">&euro;{total.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {paid > 0 && <span className="text-xs font-medium bg-green-100 text-green-700 rounded-full px-2 py-0.5">Paid: &euro;{paid.toLocaleString()}</span>}
                        {overdue > 0 && <span className="text-xs font-medium bg-red-100 text-red-700 rounded-full px-2 py-0.5">Overdue: &euro;{overdue.toLocaleString()}</span>}
                        {pending > 0 && <span className="text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5">Pending: &euro;{pending.toLocaleString()}</span>}
                        {upcoming > 0 && <span className="text-xs font-medium bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">Upcoming: &euro;{upcoming.toLocaleString()}</span>}
                      </div>
                      {/* Recent payments list */}
                      <div className="space-y-1.5">
                        {clientPayments.slice(0, 3).map(p => (
                          <div key={p.id} className="flex items-center justify-between text-xs" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.status === 'paid' ? 'bg-green-500' : p.status === 'overdue' ? 'bg-red-500' : p.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                              <span className="text-text-secondary truncate">{p.description || p.service_name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="font-medium">&euro;{Number(p.amount).toLocaleString()}</span>
                              <select value={p.status} onChange={e => { e.stopPropagation(); updatePaymentStatus(p.id, e.target.value) }} className={`text-[10px] font-medium border-0 rounded-full px-1.5 py-0.5 cursor-pointer ${STATUS_COLORS[p.status]}`}>
                                <option value="planned">Planned</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button onClick={e => { e.stopPropagation(); editPayment(p) }} className="text-text-muted hover:text-accent"><Pencil size={11} /></button>
                              <button onClick={e => { e.stopPropagation(); deletePayment(p.id) }} className="text-text-muted hover:text-red-600"><Trash2 size={11} /></button>
                            </div>
                          </div>
                        ))}
                        {clientPayments.length > 3 && (
                          <p className="text-[10px] text-text-muted text-center pt-1">+{clientPayments.length - 3} more — click to view all</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ═══ COSTS & SUBSCRIPTIONS ═══ */}
      {section === 'costs' && (
        <>
          {/* Active filter indicator */}
          {projectFilter && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-accent/10 border border-accent/20 rounded-lg text-sm">
              <Filter size={14} className="text-accent" />
              <span className="text-text-secondary">Filtered by project: {clients.flatMap(c => c.projects).find(p => String(p.id) === projectFilter)?.name || projectFilter}</span>
              <button onClick={() => setProjectFilter('')} className="ml-auto text-xs text-accent hover:underline">Clear filter</button>
            </div>
          )}
          {/* Summary bar */}
          <div className="bg-white rounded-xl border border-border p-4 mb-4 flex items-center justify-between">
            <div className="flex gap-6 text-sm">
              <span>Project Costs: <strong className="text-blue-500">&euro;{filteredCosts.reduce((s, c) => s + Number(c.planned_amount || 0), 0).toLocaleString()}</strong> planned / <strong className="text-red-600">&euro;{filteredCosts.reduce((s, c) => s + Number(c.amount || 0), 0).toLocaleString()}</strong> actual</span>
              <span>Monthly Subscriptions: <strong>&euro;{totalMonthlyExpenses.toFixed(0)}/mo</strong></span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Project Costs */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-text-secondary uppercase tracking-wide">Project Costs</h3>
              {Object.keys(costsByProject).length === 0 ? (
                <div className="bg-white rounded-xl border border-border px-6 py-8 text-center text-text-muted text-sm">No project costs recorded</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(costsByProject).map(([projectName, { projectId, costs: projectCosts }]) => {
                    const totalPlanned = projectCosts.reduce((s, c) => s + Number(c.planned_amount || 0), 0)
                    const totalActual = projectCosts.reduce((s, c) => s + Number(c.amount || 0), 0)
                    return (
                      <div key={projectName} className="bg-white rounded-xl border border-border hover:border-accent/40 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/projects/${projectId}`)}>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{projectName}</h4>
                            <div className="text-right">
                              {totalPlanned > 0 && <span className="text-xs text-blue-500 mr-2">&euro;{totalPlanned.toLocaleString()} planned</span>}
                              <span className="font-bold text-red-600">&euro;{totalActual.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {projectCosts.map(c => (
                              <div key={c.id} className="flex items-center justify-between text-xs" onClick={e => e.stopPropagation()}>
                                <span className="text-text-secondary">{c.description}</span>
                                <div className="flex items-center gap-2">
                                  {c.planned_amount && <span className="text-blue-500">&euro;{Number(c.planned_amount).toLocaleString()}</span>}
                                  <span className="font-medium">{c.amount ? `€${Number(c.amount).toLocaleString()}` : '—'}</span>
                                  <span className="text-text-muted">{c.date}</span>
                                  <button onClick={() => editCost(c)} className="text-text-muted hover:text-accent"><Pencil size={11} /></button>
                                  <button onClick={() => deleteCost(c.id)} className="text-text-muted hover:text-red-600"><Trash2 size={11} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Subscriptions */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-text-secondary uppercase tracking-wide">Subscriptions & Tools</h3>
              <div className="bg-white rounded-xl border border-border">
                <div className="divide-y divide-border">
                  {activeExpenses.map(exp => (
                    <div key={exp.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{exp.name}</p>
                        {exp.category && <p className="text-xs text-text-muted">{exp.category}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">${Number(exp.amount).toLocaleString()}/{exp.frequency === 'yearly' ? 'yr' : exp.frequency === 'one_time' ? 'once' : 'mo'}</span>
                        <button onClick={() => toggleExpenseActive(exp)} className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">Active</button>
                        <button onClick={() => editExpense(exp)} className="text-text-muted hover:text-accent"><Pencil size={12} /></button>
                        <button onClick={() => deleteExpense(exp.id)} className="text-text-muted hover:text-red-600"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                  {inactiveExpenses.map(exp => (
                    <div key={exp.id} className="p-3 flex items-center justify-between opacity-50">
                      <div>
                        <p className="text-sm font-medium">{exp.name}</p>
                        {exp.category && <p className="text-xs text-text-muted">{exp.category}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">${Number(exp.amount).toLocaleString()}/{exp.frequency === 'yearly' ? 'yr' : 'mo'}</span>
                        <button onClick={() => toggleExpenseActive(exp)} className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">Inactive</button>
                        <button onClick={() => editExpense(exp)} className="text-text-muted hover:text-accent"><Pencil size={12} /></button>
                        <button onClick={() => deleteExpense(exp.id)} className="text-text-muted hover:text-red-600"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                  {expenses.length === 0 && <div className="p-8 text-center text-text-muted text-sm">No subscriptions tracked</div>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══ CURRENCY ═══ */}
      {section === 'currency' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4">USD / LEK Exchange Rate</h3>
            {currentRate > 0 && (
              <div className="bg-bg-secondary rounded-lg p-4 mb-4">
                <p className="text-sm text-text-muted">Current rate</p>
                <p className="text-2xl font-bold">1 USD = {currentRate.toLocaleString()} LEK</p>
                {usdToLek && <p className="text-xs text-text-muted mt-1">Last updated: {new Date(usdToLek.updated_at).toLocaleDateString()}</p>}
              </div>
            )}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">1 USD =</label>
                <input type="number" step="0.01" placeholder="e.g. 98.50" value={rateForm.rate} onChange={e => setRateForm(f => ({ ...f, rate: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
              </div>
              <span className="pb-2 text-sm font-medium text-text-secondary">LEK</span>
              <button onClick={saveRate} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg">{currentRate > 0 ? 'Update' : 'Set Rate'}</button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4">Currency Converter</h3>
            {currentRate === 0 ? (
              <p className="text-sm text-text-muted">Set the exchange rate first.</p>
            ) : (
              <>
                <div className="flex gap-2 mb-4 bg-bg-secondary rounded-lg p-1 w-fit">
                  <button onClick={() => { setConvertDirection('to'); setConvertAmount('') }} className={`px-3 py-1.5 text-xs font-medium rounded-md ${convertDirection === 'to' ? 'bg-white shadow-sm' : 'text-text-muted'}`}>USD &rarr; LEK</button>
                  <button onClick={() => { setConvertDirection('from'); setConvertAmount('') }} className={`px-3 py-1.5 text-xs font-medium rounded-md ${convertDirection === 'from' ? 'bg-white shadow-sm' : 'text-text-muted'}`}>LEK &rarr; USD</button>
                </div>
                <input type="number" step="0.01" placeholder={convertDirection === 'to' ? 'Amount in USD' : 'Amount in LEK'} value={convertAmount} onChange={e => setConvertAmount(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
                {convertedAmount && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-700">{convertedAmount}</p>
                  </div>
                )}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[100, 200, 300, 500, 1000, 2000].map(amt => (
                    <button key={amt} onClick={() => { setConvertDirection('to'); setConvertAmount(String(amt)) }} className="text-left px-3 py-2 bg-bg-secondary rounded-lg hover:bg-bg-secondary/70">
                      <p className="text-sm font-medium">${amt}</p>
                      <p className="text-xs text-text-muted">{(amt * currentRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} LEK</p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ MODALS ═══ */}

      {/* Add Payment */}
      <Modal open={showAddPayment} onClose={() => { setShowAddPayment(false); resetPayForm() }} title="Add Payment" wide>
        <form onSubmit={addPayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Service *</label>
            <select value={payForm.project_service} onChange={e => setPayForm(f => ({ ...f, project_service: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
              <option value="">Select service</option>
              {allServices.map(s => <option key={s.id} value={s.id}>{s.clientName} &rarr; {s.projectName} &rarr; {s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (&euro;) *</label>
              <input type="number" step="0.01" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input type="date" value={payForm.due_date} onChange={e => setPayForm(f => ({ ...f, due_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={payForm.payment_type} onChange={e => setPayForm(f => ({ ...f, payment_type: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="predetermined">Predetermined</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={payForm.status} onChange={e => setPayForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="planned">Planned</option>
                <option value="upcoming">Upcoming</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input value={payForm.description} onChange={e => setPayForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. Local SEO - March 2026" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowAddPayment(false); resetPayForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      {/* Edit Payment */}
      <Modal open={showEditPayment} onClose={() => { setShowEditPayment(false); resetPayForm() }} title="Edit Payment" wide>
        <form onSubmit={savePayment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (&euro;) *</label>
              <input type="number" step="0.01" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input type="date" value={payForm.due_date} onChange={e => setPayForm(f => ({ ...f, due_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={payForm.status} onChange={e => setPayForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="planned">Planned</option>
                <option value="upcoming">Upcoming</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Paid Date</label>
              <input type="date" value={payForm.paid_date} onChange={e => setPayForm(f => ({ ...f, paid_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input value={payForm.description} onChange={e => setPayForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowEditPayment(false); resetPayForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>

      {/* Add Cost */}
      <Modal open={showAddCost} onClose={() => { setShowAddCost(false); resetCostForm() }} title="Add Project Cost">
        <form onSubmit={addCost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project *</label>
            <select value={costForm.project} onChange={e => setCostForm(f => ({ ...f, project: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
              <option value="">Select project</option>
              {clients.flatMap(c => c.projects.map(p => <option key={p.id} value={p.id}>{c.business_name} &rarr; {p.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <input value={costForm.description} onChange={e => setCostForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Planned (&euro;)</label>
              <input type="number" step="0.01" value={costForm.planned_amount} onChange={e => setCostForm(f => ({ ...f, planned_amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Budget" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Actual (&euro;)</label>
              <input type="number" step="0.01" value={costForm.amount} onChange={e => setCostForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Done" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input type="date" value={costForm.date} onChange={e => setCostForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowAddCost(false); resetCostForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      {/* Edit Cost */}
      <Modal open={showEditCost} onClose={() => { setShowEditCost(false); resetCostForm() }} title="Edit Project Cost">
        <form onSubmit={saveCost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <input value={costForm.description} onChange={e => setCostForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Planned (&euro;)</label>
              <input type="number" step="0.01" value={costForm.planned_amount} onChange={e => setCostForm(f => ({ ...f, planned_amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Actual (&euro;)</label>
              <input type="number" step="0.01" value={costForm.amount} onChange={e => setCostForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input type="date" value={costForm.date} onChange={e => setCostForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowEditCost(false); resetCostForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>

      {/* Add Business Expense */}
      <Modal open={showAddExpense} onClose={() => { setShowAddExpense(false); resetExpForm() }} title="Add Subscription / Tool">
        <form onSubmit={addExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input value={expForm.name} onChange={e => setExpForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. Anthropic API" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount ($) *</label>
              <input type="number" step="0.01" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency *</label>
              <select value={expForm.frequency} onChange={e => setExpForm(f => ({ ...f, frequency: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. AI Tools, SEO Tools" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input type="date" value={expForm.start_date} onChange={e => setExpForm(f => ({ ...f, start_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={expForm.end_date} onChange={e => setExpForm(f => ({ ...f, end_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowAddExpense(false); resetExpForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      {/* Edit Business Expense */}
      <Modal open={showEditExpense} onClose={() => { setShowEditExpense(false); resetExpForm() }} title="Edit Subscription / Tool">
        <form onSubmit={saveExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input value={expForm.name} onChange={e => setExpForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount ($) *</label>
              <input type="number" step="0.01" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency *</label>
              <select value={expForm.frequency} onChange={e => setExpForm(f => ({ ...f, frequency: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input type="date" value={expForm.start_date} onChange={e => setExpForm(f => ({ ...f, start_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={expForm.end_date} onChange={e => setExpForm(f => ({ ...f, end_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowEditExpense(false); resetExpForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
