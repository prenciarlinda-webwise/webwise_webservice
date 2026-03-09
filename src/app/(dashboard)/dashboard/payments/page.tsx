'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import Modal from '@/components/dashboard/Modal'
import { Plus, Trash2, Pencil, ChevronDown, ChevronRight } from 'lucide-react'

interface Summary { total_revenue: string; total_paid: string; total_pending: string; total_upcoming: string; total_overdue: string; total_costs: string; net_profit: string; this_month_revenue: string; this_month_costs: string; this_month_profit: string; next_month_planned: string; monthly_tool_costs: string }
interface Payment { id: number; client_name: string; project_name: string; service_name: string; amount: string; payment_type: string; status: string; description: string; due_date: string; paid_date: string | null; project_service: number }
interface Cost { id: number; project_name: string; description: string; amount: string; date: string; project: number }
interface Expense { id: number; name: string; amount: string; frequency: string; category: string; start_date: string; end_date: string | null; notes: string; is_active: boolean; monthly_cost: string }
interface Client { id: number; business_name: string; projects: { id: number; name: string; services: { id: number; name: string }[] }[] }
interface ExRate { id: number; from_currency: string; to_currency: string; rate: string; updated_at: string }

type Section = 'payments' | 'costs' | 'expenses' | 'currency'
const statusTabs = ['all', 'paid', 'pending', 'overdue', 'upcoming', 'cancelled'] as const

const STATUS_COLORS: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  upcoming: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function PaymentsPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [costs, setCosts] = useState<Cost[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [clients, setClients] = useState<Client[]>([])

  const [section, setSection] = useState<Section>('payments')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set())

  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showEditPayment, setShowEditPayment] = useState(false)
  const [showAddCost, setShowAddCost] = useState(false)
  const [showEditCost, setShowEditCost] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showEditExpense, setShowEditExpense] = useState(false)

  const [payForm, setPayForm] = useState({ id: 0, project_service: '', amount: '', payment_type: 'predetermined', status: 'upcoming', description: '', due_date: '', paid_date: '' })
  const [costForm, setCostForm] = useState({ id: 0, project: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] })
  const [expForm, setExpForm] = useState({ id: 0, name: '', amount: '', frequency: 'monthly', category: '', start_date: new Date().toISOString().split('T')[0], end_date: '', notes: '' })

  // Currency
  const [rates, setRates] = useState<ExRate[]>([])
  const [rateForm, setRateForm] = useState({ from_currency: 'USD', to_currency: 'LEK', rate: '' })
  const [convertAmount, setConvertAmount] = useState('')
  const [convertDirection, setConvertDirection] = useState<'to' | 'from'>('to') // 'to' = USD→LEK, 'from' = LEK→USD

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
  }, [])

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
  const resetCostForm = () => setCostForm({ id: 0, project: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] })

  const addCost = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id: _, ...data } = costForm
    await api.post('/payments/costs/', data)
    reload(); setShowAddCost(false); resetCostForm()
  }

  const editCost = (c: Cost) => {
    setCostForm({ id: c.id, project: String(c.project), description: c.description, amount: c.amount, date: c.date })
    setShowEditCost(true)
  }

  const saveCost = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, ...data } = costForm
    await api.patch(`/payments/costs/${id}/`, data)
    reload(); setShowEditCost(false); resetCostForm()
  }

  const deleteCost = async (id: number) => {
    if (!confirm('Delete this cost?')) return
    await api.delete(`/payments/costs/${id}/`); reload()
  }

  // ── Expense CRUD ──
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

  // ── Exchange Rate ──
  const saveRate = async () => {
    if (!rateForm.rate) return
    await api.post('/payments/exchange-rates/', rateForm)
    reload()
  }

  const usdToLek = rates.find(r => r.from_currency === 'USD' && r.to_currency === 'LEK')
  const currentRate = usdToLek ? Number(usdToLek.rate) : 0

  const convertedAmount = (() => {
    const amt = Number(convertAmount)
    if (!amt || !currentRate) return null
    if (convertDirection === 'to') return { result: amt * currentRate, label: `$${amt.toLocaleString()} = ${(amt * currentRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} LEK` }
    return { result: amt / currentRate, label: `${amt.toLocaleString()} LEK = $${(amt / currentRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}` }
  })()

  // ── Derived data ──
  const filtered = activeTab === 'all' ? payments : payments.filter(p => p.status === activeTab)
  const activeExpenses = expenses.filter(e => e.is_active)
  const inactiveExpenses = expenses.filter(e => !e.is_active)
  const totalMonthlyExpenses = activeExpenses.reduce((s, e) => s + Number(e.monthly_cost), 0)
  const allServices = clients.flatMap(c => c.projects.flatMap(p => p.services.map(s => ({ ...s, clientName: c.business_name, projectName: p.name }))))

  // Group payments by client
  const grouped = filtered.reduce<Record<string, Payment[]>>((acc, p) => {
    const key = p.client_name || 'Unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  // Group costs by project
  const costsByProject = costs.reduce<Record<string, Cost[]>>((acc, c) => {
    const key = c.project_name || 'Unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})

  const toggleClient = (name: string) => {
    setExpandedClients(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  // Expand all by default when data loads
  useEffect(() => {
    setExpandedClients(new Set(Object.keys(grouped)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments.length, activeTab])

  const clientSummary = (paymentsList: Payment[]) => {
    const paid = paymentsList.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)
    const overdue = paymentsList.filter(p => p.status === 'overdue').reduce((s, p) => s + Number(p.amount), 0)
    const upcoming = paymentsList.filter(p => p.status === 'upcoming').reduce((s, p) => s + Number(p.amount), 0)
    const pending = paymentsList.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)
    return { paid, overdue, upcoming, pending }
  }

  return (
    <div>
      <PageHeader
        title="Payments & Finances"
        action={
          <div className="flex gap-2">
            {section === 'expenses' && <button onClick={() => setShowAddExpense(true)} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Add Expense</button>}
            {section === 'costs' && <button onClick={() => setShowAddCost(true)} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Add Cost</button>}
            {section === 'payments' && <button onClick={() => setShowAddPayment(true)} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Add Payment</button>}
          </div>
        }
      />

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard label="Total Paid" value={`€${Number(summary.total_paid).toLocaleString()}`} color="green" />
          <StatsCard label="Pending" value={`€${Number(summary.total_pending).toLocaleString()}`} color="yellow" />
          <StatsCard label="Overdue" value={`€${Number(summary.total_overdue).toLocaleString()}`} color="red" />
          <StatsCard label="Upcoming" value={`€${Number(summary.total_upcoming).toLocaleString()}`} color="blue" />
          <StatsCard label="Total Revenue" value={`€${Number(summary.total_revenue).toLocaleString()}`} />
          <StatsCard label="Total Costs" value={`€${Number(summary.total_costs).toLocaleString()}`} />
          <StatsCard label="Net Profit" value={`€${Number(summary.net_profit).toLocaleString()}`} color="green" />
          <StatsCard label="Subscriptions" value={`€${totalMonthlyExpenses.toFixed(0)}/mo`} />
        </div>
      )}

      {/* Section tabs */}
      <div className="flex gap-1 mb-4 bg-bg-secondary rounded-lg p-1 w-fit">
        {([['payments', 'Client Payments'], ['costs', 'Project Costs'], ['expenses', 'Business Expenses'], ['currency', 'Currency']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setSection(key)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${section === key ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'}`}>{label}</button>
        ))}
      </div>

      {/* ═══ PAYMENTS SECTION ═══ */}
      {section === 'payments' && (
        <>
          <div className="flex gap-1 mb-4 bg-bg-secondary rounded-lg p-1 w-fit">
            {statusTabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${activeTab === tab ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'}`}>{tab}</button>
            ))}
          </div>

          {Object.keys(grouped).length === 0 && (
            <div className="bg-white rounded-xl border border-border px-6 py-12 text-center text-text-muted">No payments found</div>
          )}

          {Object.entries(grouped).map(([clientName, clientPayments]) => {
            const isExpanded = expandedClients.has(clientName)
            const cs = clientSummary(clientPayments)
            return (
              <div key={clientName} className="bg-white rounded-xl border border-border mb-4">
                {/* Client header */}
                <button onClick={() => toggleClient(clientName)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={16} className="text-text-muted" /> : <ChevronRight size={16} className="text-text-muted" />}
                    <h3 className="font-semibold">{clientName}</h3>
                    <span className="text-xs text-text-muted">{clientPayments.length} payments</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    {cs.paid > 0 && <span className="text-green-600 font-medium">Paid: €{cs.paid.toLocaleString()}</span>}
                    {cs.overdue > 0 && <span className="text-red-600 font-medium">Overdue: €{cs.overdue.toLocaleString()}</span>}
                    {cs.pending > 0 && <span className="text-yellow-600 font-medium">Pending: €{cs.pending.toLocaleString()}</span>}
                    {cs.upcoming > 0 && <span className="text-blue-600 font-medium">Upcoming: €{cs.upcoming.toLocaleString()}</span>}
                  </div>
                </button>

                {/* Payment rows */}
                {isExpanded && (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-text-muted border-t border-border">
                        <th className="px-5 py-2">Service</th>
                        <th className="px-5 py-2">Description</th>
                        <th className="px-5 py-2">Amount</th>
                        <th className="px-5 py-2">Due Date</th>
                        <th className="px-5 py-2">Paid Date</th>
                        <th className="px-5 py-2">Status</th>
                        <th className="px-5 py-2 w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientPayments.map(p => (
                        <tr key={p.id} className="border-t border-border hover:bg-bg-secondary/30">
                          <td className="px-5 py-2.5 text-sm">{p.service_name}</td>
                          <td className="px-5 py-2.5 text-sm text-text-secondary">{p.description || '—'}</td>
                          <td className="px-5 py-2.5 text-sm font-medium">€{Number(p.amount).toLocaleString()}</td>
                          <td className="px-5 py-2.5 text-sm text-text-secondary">{p.due_date || '—'}</td>
                          <td className="px-5 py-2.5 text-sm text-text-secondary">{p.paid_date || '—'}</td>
                          <td className="px-5 py-2.5">
                            <select
                              value={p.status}
                              onChange={e => updatePaymentStatus(p.id, e.target.value)}
                              className={`text-xs font-medium border-0 rounded-full px-2.5 py-1 cursor-pointer ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-5 py-2.5">
                            <div className="flex items-center gap-2">
                              <button onClick={() => editPayment(p)} className="text-text-muted hover:text-accent"><Pencil size={13} /></button>
                              <button onClick={() => deletePayment(p.id)} className="text-text-muted hover:text-red-600"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )
          })}
        </>
      )}

      {/* ═══ COSTS SECTION ═══ */}
      {section === 'costs' && (
        <>
          {Object.keys(costsByProject).length === 0 && (
            <div className="bg-white rounded-xl border border-border px-6 py-12 text-center text-text-muted">No project costs recorded</div>
          )}

          {Object.entries(costsByProject).map(([projectName, projectCosts]) => {
            const total = projectCosts.reduce((s, c) => s + Number(c.amount), 0)
            return (
              <div key={projectName} className="bg-white rounded-xl border border-border mb-4">
                <div className="px-5 py-4 flex items-center justify-between border-b border-border">
                  <h3 className="font-semibold">{projectName}</h3>
                  <span className="text-sm font-medium text-text-secondary">Total: €{total.toLocaleString()}</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-text-muted">
                      <th className="px-5 py-2">Description</th>
                      <th className="px-5 py-2">Amount</th>
                      <th className="px-5 py-2">Date</th>
                      <th className="px-5 py-2 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectCosts.map(c => (
                      <tr key={c.id} className="border-t border-border hover:bg-bg-secondary/30">
                        <td className="px-5 py-2.5 text-sm">{c.description}</td>
                        <td className="px-5 py-2.5 text-sm font-medium">€{Number(c.amount).toLocaleString()}</td>
                        <td className="px-5 py-2.5 text-sm text-text-secondary">{c.date}</td>
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => editCost(c)} className="text-text-muted hover:text-accent"><Pencil size={13} /></button>
                            <button onClick={() => deleteCost(c.id)} className="text-text-muted hover:text-red-600"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
        </>
      )}

      {/* ═══ EXPENSES SECTION ═══ */}
      {section === 'expenses' && (
        <>
          <div className="bg-white rounded-xl border border-border p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Active monthly burn: <span className="text-lg font-bold">€{totalMonthlyExpenses.toFixed(2)}/mo</span></p>
              <p className="text-xs text-text-muted">{activeExpenses.length} active, {inactiveExpenses.length} inactive</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted border-b border-border">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Frequency</th>
                  <th className="px-5 py-3">Monthly</th>
                  <th className="px-5 py-3">Start</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {activeExpenses.map(exp => (
                  <tr key={exp.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/30">
                    <td className="px-5 py-2.5 text-sm font-medium">{exp.name}</td>
                    <td className="px-5 py-2.5 text-sm text-text-secondary">{exp.category || '—'}</td>
                    <td className="px-5 py-2.5 text-sm font-medium">€{Number(exp.amount).toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-sm text-text-secondary capitalize">{exp.frequency === 'one_time' ? 'One-time' : exp.frequency}</td>
                    <td className="px-5 py-2.5 text-sm font-medium">€{Number(exp.monthly_cost).toFixed(2)}</td>
                    <td className="px-5 py-2.5 text-sm text-text-secondary">{exp.start_date}</td>
                    <td className="px-5 py-2.5">
                      <button onClick={() => toggleExpenseActive(exp)} className="text-xs font-medium bg-green-100 text-green-700 rounded-full px-2.5 py-1 hover:bg-green-200">Active</button>
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => editExpense(exp)} className="text-text-muted hover:text-accent"><Pencil size={13} /></button>
                        <button onClick={() => deleteExpense(exp.id)} className="text-text-muted hover:text-red-600"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {inactiveExpenses.map(exp => (
                  <tr key={exp.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/30 opacity-50">
                    <td className="px-5 py-2.5 text-sm font-medium">{exp.name}</td>
                    <td className="px-5 py-2.5 text-sm text-text-secondary">{exp.category || '—'}</td>
                    <td className="px-5 py-2.5 text-sm font-medium">€{Number(exp.amount).toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-sm text-text-secondary capitalize">{exp.frequency === 'one_time' ? 'One-time' : exp.frequency}</td>
                    <td className="px-5 py-2.5 text-sm font-medium">€{Number(exp.monthly_cost).toFixed(2)}</td>
                    <td className="px-5 py-2.5 text-sm text-text-secondary">{exp.start_date}</td>
                    <td className="px-5 py-2.5">
                      <button onClick={() => toggleExpenseActive(exp)} className="text-xs font-medium bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 hover:bg-gray-200">Inactive</button>
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => editExpense(exp)} className="text-text-muted hover:text-accent"><Pencil size={13} /></button>
                        <button onClick={() => deleteExpense(exp.id)} className="text-text-muted hover:text-red-600"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-text-muted">No expenses tracked yet</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ═══ CURRENCY SECTION ═══ */}
      {section === 'currency' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Set Exchange Rate */}
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
                <input
                  type="number" step="0.01" placeholder="e.g. 98.50"
                  value={rateForm.rate}
                  onChange={e => setRateForm(f => ({ ...f, rate: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
              </div>
              <span className="pb-2 text-sm font-medium text-text-secondary">LEK</span>
              <button onClick={saveRate} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg">
                {currentRate > 0 ? 'Update' : 'Set Rate'}
              </button>
            </div>
          </div>

          {/* Converter */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold mb-4">Currency Converter</h3>
            {currentRate === 0 ? (
              <p className="text-sm text-text-muted">Set the exchange rate first to use the converter.</p>
            ) : (
              <>
                <div className="flex gap-2 mb-4 bg-bg-secondary rounded-lg p-1 w-fit">
                  <button onClick={() => { setConvertDirection('to'); setConvertAmount('') }} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${convertDirection === 'to' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted'}`}>USD → LEK</button>
                  <button onClick={() => { setConvertDirection('from'); setConvertAmount('') }} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${convertDirection === 'from' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted'}`}>LEK → USD</button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {convertDirection === 'to' ? 'Amount in USD ($)' : 'Amount in LEK'}
                  </label>
                  <input
                    type="number" step="0.01"
                    placeholder={convertDirection === 'to' ? 'e.g. 500' : 'e.g. 50000'}
                    value={convertAmount}
                    onChange={e => setConvertAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                </div>
                {convertedAmount && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-lg font-bold text-green-700">{convertedAmount.label}</p>
                    <p className="text-xs text-green-600 mt-1">Rate: 1 USD = {currentRate.toLocaleString()} LEK</p>
                  </div>
                )}

                {/* Quick convert: common amounts for employee pay */}
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2 text-text-secondary">Quick convert (USD from profit → LEK)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 200, 300, 400, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => { setConvertDirection('to'); setConvertAmount(String(amt)) }}
                        className="text-left px-3 py-2 bg-bg-secondary rounded-lg hover:bg-bg-secondary/70 transition-colors"
                      >
                        <p className="text-sm font-medium">${amt}</p>
                        <p className="text-xs text-text-muted">{(amt * currentRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} LEK</p>
                      </button>
                    ))}
                  </div>
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
              <label className="block text-sm font-medium mb-1">Amount (€) *</label>
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
              <label className="block text-sm font-medium mb-1">Amount (€) *</label>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (€) *</label>
              <input type="number" step="0.01" value={costForm.amount} onChange={e => setCostForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (€) *</label>
              <input type="number" step="0.01" value={costForm.amount} onChange={e => setCostForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
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

      {/* Add Expense */}
      <Modal open={showAddExpense} onClose={() => { setShowAddExpense(false); resetExpForm() }} title="Add Business Expense">
        <form onSubmit={addExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input value={expForm.name} onChange={e => setExpForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. Anthropic API" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (€) *</label>
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
            <input value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. AI Tools, SEO Tools, Backlinks" />
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
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <input value={expForm.notes} onChange={e => setExpForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Optional notes" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowAddExpense(false); resetExpForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      {/* Edit Expense */}
      <Modal open={showEditExpense} onClose={() => { setShowEditExpense(false); resetExpForm() }} title="Edit Business Expense">
        <form onSubmit={saveExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input value={expForm.name} onChange={e => setExpForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (€) *</label>
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
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <input value={expForm.notes} onChange={e => setExpForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
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
