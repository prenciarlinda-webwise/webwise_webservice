'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import Modal from '@/components/dashboard/Modal'
import { Plus, Pencil, Trash2, Check, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Types ──
interface PIncome { id: number; source: string; source_display: string; description: string; planned_amount: string | null; amount: string | null; currency: string; date: string | null; month: string; month_display: string; is_recurring: boolean; recurring_day: number | null; notes: string }
interface PExpense { id: number; category: string; category_display: string; description: string; planned_amount: string | null; amount: string | null; currency: string; date: string | null; month: string; month_display: string; is_recurring: boolean; recurring_day: number | null; notes: string }
interface Transaction { id: number; type: 'income' | 'expense' | 'savings'; date: string; description: string; label: string; planned_amount: string | null; amount: string | null; effective_amount: string; currency: string; is_actual: boolean; is_recurring: boolean; recurring_day: number | null; running_balance: string; category?: string }
interface PSummary { month: string; month_display: string; previous_balance: string; total_income: string; total_expenses: string; total_savings: string; savings_rate: string; end_of_month_balance: string; planned_income: string; planned_expenses: string; planned_savings: string; planned_end_balance: string; income_by_source: Record<string, { planned: string; actual: string }>; expenses_by_category: Record<string, { planned: string; actual: string }>; transactions: Transaction[] }

const fmtL = (v: number) => `Lek${v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
const fmtShortDate = (d: string) => {
  const dt = new Date(d + 'T00:00:00')
  return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`
}

const EXPENSE_CATEGORIES = [
  { value: 'rent', label: 'Rent' }, { value: 'home', label: 'Home' },
  { value: 'utilities', label: 'Utilities' }, { value: 'groceries', label: 'Groceries' },
  { value: 'dining', label: 'Dining Out' }, { value: 'delivery', label: 'Food Delivery' },
  { value: 'transport', label: 'Transport' }, { value: 'gym', label: 'Gym/Fitness' },
  { value: 'health', label: 'Health/Medical' }, { value: 'entertainment', label: 'Entertainment' },
  { value: 'clothing', label: 'Clothing' }, { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'education', label: 'Education' }, { value: 'savings', label: 'Savings/Investment' },
  { value: 'debt', label: 'Debt' }, { value: 'personal', label: 'Personal' },
  { value: 'gifts', label: 'Gifts' }, { value: 'pets', label: 'Pets' },
  { value: 'travel', label: 'Travel' }, { value: 'other', label: 'Other' },
]

const INCOME_SOURCES = [
  { value: 'salary', label: 'Salary' }, { value: 'owners_draw', label: "Owner's Draw" },
  { value: 'freelance', label: 'Freelance' }, { value: 'other', label: 'Other' },
]

export default function PersonalFinancesPage() {
  const searchParams = useSearchParams()
  const qMonth = searchParams.get('month')

  const now = new Date()
  const defaultMonth = qMonth ? qMonth + (qMonth.length === 7 ? '-01' : '') : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const [personalMonth, setPersonalMonth] = useState(defaultMonth)
  const [pSummary, setPSummary] = useState<PSummary | null>(null)
  const [pIncomes, setPIncomes] = useState<PIncome[]>([])
  const [pExpenses, setPExpenses] = useState<PExpense[]>([])
  const [activeView, setActiveView] = useState<'transactions' | 'summary'>('transactions')

  // ── Modal state ──
  const [showAddPIncome, setShowAddPIncome] = useState(false)
  const [showEditPIncome, setShowEditPIncome] = useState(false)
  const [showAddPExpense, setShowAddPExpense] = useState(false)
  const [showEditPExpense, setShowEditPExpense] = useState(false)
  const [showRecordActual, setShowRecordActual] = useState(false)
  const [recordActualType, setRecordActualType] = useState<'income' | 'expense'>('expense')
  const [recordActualId, setRecordActualId] = useState(0)
  const [recordActualDesc, setRecordActualDesc] = useState('')
  const [recordActualPlanned, setRecordActualPlanned] = useState('')
  const [recordActualAmount, setRecordActualAmount] = useState('')

  // ── Form state ──
  const [piForm, setPiForm] = useState({ id: 0, source: 'salary', description: '', planned_amount: '', amount: '', currency: 'LEK', date: '', month: defaultMonth, is_recurring: true, recurring_day: '', notes: '' })
  const [peForm, setPeForm] = useState({ id: 0, category: 'rent', description: '', planned_amount: '', amount: '', currency: 'LEK', date: '', month: defaultMonth, is_recurring: false, recurring_day: '', notes: '' })

  // ── Data loading ──
  const reloadPersonal = (month?: string) => {
    const m = month || personalMonth
    api.get<{ results: PIncome[] }>(`/payments/personal/income/?month=${m}`).then(d => setPIncomes(d.results))
    api.get<{ results: PExpense[] }>(`/payments/personal/expenses/?month=${m}`).then(d => setPExpenses(d.results))
    api.get<PSummary>(`/payments/personal/summary/?month=${m}`).then(setPSummary)
  }

  useEffect(() => { reloadPersonal() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Month navigation ──
  const changeMonth = (m: string) => { setPersonalMonth(m); reloadPersonal(m) }
  const prevMonth = () => {
    const d = new Date(personalMonth); d.setMonth(d.getMonth() - 1)
    changeMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`)
  }
  const nextMonth = () => {
    const d = new Date(personalMonth); d.setMonth(d.getMonth() + 1)
    changeMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`)
  }

  // ── Personal Income CRUD ──
  const resetPiForm = () => setPiForm({ id: 0, source: 'salary', description: '', planned_amount: '', amount: '', currency: 'LEK', date: '', month: personalMonth, is_recurring: true, recurring_day: '', notes: '' })
  const addPIncome = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id: _, ...data } = piForm
    await api.post('/payments/personal/income/', { ...data, planned_amount: data.planned_amount || null, amount: data.amount || null, date: data.date || null, recurring_day: data.recurring_day || null })
    reloadPersonal(); setShowAddPIncome(false); resetPiForm()
  }
  const editPIncome = (i: PIncome) => {
    setPiForm({ id: i.id, source: i.source, description: i.description, planned_amount: i.planned_amount || '', amount: i.amount || '', currency: i.currency, date: i.date || '', month: i.month, is_recurring: i.is_recurring, recurring_day: i.recurring_day ? String(i.recurring_day) : '', notes: i.notes })
    setShowEditPIncome(true)
  }
  const savePIncome = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, ...data } = piForm
    await api.patch(`/payments/personal/income/${id}/`, { ...data, planned_amount: data.planned_amount || null, amount: data.amount || null, date: data.date || null, recurring_day: data.recurring_day || null })
    reloadPersonal(); setShowEditPIncome(false); resetPiForm()
  }
  const deletePIncome = async (id: number) => {
    if (!confirm('Delete this income entry?')) return
    await api.delete(`/payments/personal/income/${id}/`); reloadPersonal()
  }

  // ── Personal Expense CRUD ──
  const resetPeForm = () => setPeForm({ id: 0, category: 'rent', description: '', planned_amount: '', amount: '', currency: 'LEK', date: '', month: personalMonth, is_recurring: false, recurring_day: '', notes: '' })
  const addPExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id: _, ...data } = peForm
    await api.post('/payments/personal/expenses/', { ...data, planned_amount: data.planned_amount || null, amount: data.amount || null, date: data.date || null, recurring_day: data.recurring_day || null })
    reloadPersonal(); setShowAddPExpense(false); resetPeForm()
  }
  const editPExpense = (exp: PExpense) => {
    setPeForm({ id: exp.id, category: exp.category, description: exp.description, planned_amount: exp.planned_amount || '', amount: exp.amount || '', currency: exp.currency, date: exp.date || '', month: exp.month, is_recurring: exp.is_recurring, recurring_day: exp.recurring_day ? String(exp.recurring_day) : '', notes: exp.notes })
    setShowEditPExpense(true)
  }
  const savePExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    const { id, ...data } = peForm
    await api.patch(`/payments/personal/expenses/${id}/`, { ...data, planned_amount: data.planned_amount || null, amount: data.amount || null, date: data.date || null, recurring_day: data.recurring_day || null })
    reloadPersonal(); setShowEditPExpense(false); resetPeForm()
  }
  const deletePExpense = async (id: number) => {
    if (!confirm('Delete this expense?')) return
    await api.delete(`/payments/personal/expenses/${id}/`); reloadPersonal()
  }

  // ── Record Actual (quick action for ? items) ──
  const openRecordActualExpense = (exp: PExpense) => {
    setRecordActualType('expense'); setRecordActualId(exp.id)
    setRecordActualDesc(exp.description); setRecordActualPlanned(exp.planned_amount || '')
    setRecordActualAmount(exp.planned_amount || ''); setShowRecordActual(true)
  }
  const openRecordActualIncome = (inc: PIncome) => {
    setRecordActualType('income'); setRecordActualId(inc.id)
    setRecordActualDesc(inc.description); setRecordActualPlanned(inc.planned_amount || '')
    setRecordActualAmount(inc.planned_amount || ''); setShowRecordActual(true)
  }
  const submitRecordActual = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = recordActualType === 'income' ? 'income' : 'expenses'
    await api.patch(`/payments/personal/${endpoint}/${recordActualId}/`, { amount: recordActualAmount })
    reloadPersonal(); setShowRecordActual(false)
  }

  // ── Derived values ──
  const prevBal = pSummary ? Number(pSummary.previous_balance) : 0
  const pInc = pSummary ? Number(pSummary.total_income) : 0
  const pExp = pSummary ? Number(pSummary.total_expenses) : 0
  const pSav = pSummary ? Number(pSummary.total_savings) : 0
  const endBal = pSummary ? Number(pSummary.end_of_month_balance) : 0
  const plannedInc = pSummary ? Number(pSummary.planned_income) : 0
  const plannedExp = pSummary ? Number(pSummary.planned_expenses) : 0
  const plannedSav = pSummary ? Number(pSummary.planned_savings) : 0

  // Sort expenses and incomes by date
  const sortedExpenses = [...pExpenses].sort((a, b) => (a.date || a.month).localeCompare(b.date || b.month))
  const sortedIncomes = [...pIncomes].sort((a, b) => (a.date || a.month).localeCompare(b.date || b.month))

  const monthLabel = pSummary?.month_display || new Date(personalMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // ── Income form modal content (shared) ──
  const incomeFormFields = (form: typeof piForm, setForm: typeof setPiForm) => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Source *</label>
          <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
            {INCOME_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. Quanta Core salary" required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Planned</label>
          <input type="number" step="0.01" value={form.planned_amount} onChange={e => setForm(f => ({ ...f, planned_amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Done</label>
          <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
            <option value="LEK">LEK</option><option value="EUR">EUR</option><option value="USD">USD</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Month *</label>
          <input type="month" value={form.month.slice(0, 7)} onChange={e => setForm(f => ({ ...f, month: e.target.value + '-01' }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recurring Day</label>
          <input type="number" min="1" max="31" value={form.recurring_day} onChange={e => setForm(f => ({ ...f, recurring_day: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. 5" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.is_recurring} onChange={e => setForm(f => ({ ...f, is_recurring: e.target.checked }))} className="rounded" />
        <label className="text-sm">Recurring monthly</label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" rows={2} />
      </div>
    </>
  )

  // ── Expense form modal content (shared) ──
  const expenseFormFields = (form: typeof peForm, setForm: typeof setPeForm) => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
            {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. Monthly rent" required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Planned</label>
          <input type="number" step="0.01" value={form.planned_amount} onChange={e => setForm(f => ({ ...f, planned_amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Done</label>
          <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
            <option value="LEK">LEK</option><option value="EUR">EUR</option><option value="USD">USD</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Month *</label>
          <input type="month" value={form.month.slice(0, 7)} onChange={e => setForm(f => ({ ...f, month: e.target.value + '-01' }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recurring Day</label>
          <input type="number" min="1" max="31" value={form.recurring_day} onChange={e => setForm(f => ({ ...f, recurring_day: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. 7" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.is_recurring} onChange={e => setForm(f => ({ ...f, is_recurring: e.target.checked }))} className="rounded" />
        <label className="text-sm">Recurring monthly</label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" rows={2} />
      </div>
    </>
  )

  return (
    <div>
      <PageHeader title="Personal Finances" action={
        <div className="flex gap-2">
          <button onClick={() => { resetPeForm(); setShowAddPExpense(true) }} className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"><Plus size={14} /> Expense</button>
          <button onClick={() => { resetPiForm(); setShowAddPIncome(true) }} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"><Plus size={14} /> Income</button>
        </div>
      } />

      {/* ── Month Navigation + View Toggle ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-border hover:bg-bg-secondary"><ChevronLeft size={16} /></button>
          <input type="month" value={personalMonth.slice(0, 7)} onChange={e => changeMonth(e.target.value + '-01')} className="px-3 py-2 border border-border rounded-lg text-sm font-medium" />
          <button onClick={nextMonth} className="p-2 rounded-lg border border-border hover:bg-bg-secondary"><ChevronRight size={16} /></button>
        </div>
        <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
          <button onClick={() => setActiveView('transactions')} className={`px-4 py-1.5 text-xs font-medium rounded-md ${activeView === 'transactions' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted'}`}>Transactions</button>
          <button onClick={() => setActiveView('summary')} className={`px-4 py-1.5 text-xs font-medium rounded-md ${activeView === 'summary' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted'}`}>Summary</button>
        </div>
      </div>

      {/* ════════════════════ TRANSACTIONS VIEW ════════════════════ */}
      {activeView === 'transactions' && (
        <div className="grid lg:grid-cols-2 gap-4">

          {/* ── LEFT: Expenses Table ── */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-red-50/50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-red-700">Expenses</h3>
              <button onClick={() => { resetPeForm(); setShowAddPExpense(true) }} className="text-red-600 hover:text-red-800"><Plus size={16} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-text-muted uppercase tracking-wide border-b border-border bg-gray-50/50">
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5 text-right">Planned</th>
                    <th className="px-3 py-2.5 text-right">Done</th>
                    <th className="px-3 py-2.5">Description</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map(exp => {
                    const isPending = exp.amount === null
                    return (
                      <tr key={exp.id} className={`border-b border-border/50 last:border-0 hover:bg-bg-secondary/20 ${exp.category === 'savings' ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-3 py-2 text-text-muted text-xs whitespace-nowrap">{exp.date ? fmtShortDate(exp.date) : '—'}</td>
                        <td className="px-3 py-2 text-right text-xs whitespace-nowrap">{exp.planned_amount ? fmtL(Number(exp.planned_amount)) : '—'}</td>
                        <td className={`px-3 py-2 text-right text-xs font-medium whitespace-nowrap ${isPending ? 'text-amber-600' : ''}`}>
                          {isPending ? '?' : exp.amount ? fmtL(Number(exp.amount)) : '—'}
                        </td>
                        <td className="px-3 py-2 text-xs max-w-[160px]">
                          <span className="line-clamp-2">{exp.description}</span>
                        </td>
                        <td className="px-3 py-2 text-xs text-text-muted whitespace-nowrap">{exp.category_display}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            {isPending && (
                              <button onClick={() => openRecordActualExpense(exp)} title="Record actual" className="text-amber-500 hover:text-green-600 p-0.5"><Check size={12} /></button>
                            )}
                            <button onClick={() => editPExpense(exp)} className="text-text-muted hover:text-accent p-0.5"><Pencil size={11} /></button>
                            <button onClick={() => deletePExpense(exp.id)} className="text-text-muted hover:text-red-600 p-0.5"><Trash2 size={11} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {sortedExpenses.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-8 text-center text-text-muted text-xs">No expenses for {monthLabel}</td></tr>
                  )}
                </tbody>
                {sortedExpenses.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50 border-t border-border font-medium text-xs">
                      <td className="px-3 py-2">Total</td>
                      <td className="px-3 py-2 text-right">{fmtL(plannedExp + plannedSav)}</td>
                      <td className="px-3 py-2 text-right">{fmtL(pExp + pSav)}</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* ── RIGHT: Income Table ── */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-green-50/50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-green-700">Income</h3>
              <button onClick={() => { resetPiForm(); setShowAddPIncome(true) }} className="text-green-600 hover:text-green-800"><Plus size={16} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-text-muted uppercase tracking-wide border-b border-border bg-gray-50/50">
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5 text-right">Planned</th>
                    <th className="px-3 py-2.5 text-right">Done</th>
                    <th className="px-3 py-2.5">Description</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedIncomes.map(inc => {
                    const isPending = inc.amount === null
                    return (
                      <tr key={inc.id} className="border-b border-border/50 last:border-0 hover:bg-bg-secondary/20">
                        <td className="px-3 py-2 text-text-muted text-xs whitespace-nowrap">{inc.date ? fmtShortDate(inc.date) : '—'}</td>
                        <td className="px-3 py-2 text-right text-xs whitespace-nowrap">{inc.planned_amount ? fmtL(Number(inc.planned_amount)) : '—'}</td>
                        <td className={`px-3 py-2 text-right text-xs font-medium whitespace-nowrap ${isPending ? 'text-amber-600' : ''}`}>
                          {isPending ? '?' : inc.amount ? fmtL(Number(inc.amount)) : '—'}
                        </td>
                        <td className="px-3 py-2 text-xs max-w-[160px]">
                          <span className="line-clamp-2">{inc.description}</span>
                        </td>
                        <td className="px-3 py-2 text-xs text-text-muted whitespace-nowrap">{inc.source_display}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            {isPending && (
                              <button onClick={() => openRecordActualIncome(inc)} title="Record actual" className="text-amber-500 hover:text-green-600 p-0.5"><Check size={12} /></button>
                            )}
                            <button onClick={() => editPIncome(inc)} className="text-text-muted hover:text-accent p-0.5"><Pencil size={11} /></button>
                            <button onClick={() => deletePIncome(inc.id)} className="text-text-muted hover:text-red-600 p-0.5"><Trash2 size={11} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {sortedIncomes.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-8 text-center text-text-muted text-xs">No income for {monthLabel}</td></tr>
                  )}
                </tbody>
                {sortedIncomes.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50 border-t border-border font-medium text-xs">
                      <td className="px-3 py-2">Total</td>
                      <td className="px-3 py-2 text-right">{fmtL(plannedInc)}</td>
                      <td className="px-3 py-2 text-right">{fmtL(pInc)}</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ SUMMARY VIEW ════════════════════ */}
      {activeView === 'summary' && pSummary && (
        <div className="space-y-5">

          {/* ── Balance Overview ── */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-5">Monthly Budget</h3>

            {/* Start → End Balance visual */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase mb-1">Start Balance</p>
                <p className={`text-2xl font-bold ${prevBal >= 0 ? 'text-text-primary' : 'text-red-600'}`}>{fmtL(prevBal)}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-0.5 bg-border relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">&#8594;</div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase mb-1">End Balance</p>
                <p className={`text-2xl font-bold ${endBal >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmtL(endBal)}</p>
              </div>
            </div>

            {/* Savings highlight */}
            <div className="text-center mb-6 py-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">Increase in total savings</p>
              <p className="text-xl font-bold text-blue-700">{fmtL(pSav)}</p>
              {pSummary.savings_rate !== '0.0' && <p className="text-[10px] text-blue-500 mt-0.5">Savings rate: {pSummary.savings_rate}%</p>}
            </div>

            {/* Planned vs Actual summary boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-bold text-sm text-red-600 mb-2">Expenses</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-text-muted">Planned</span><span className="font-medium">{fmtL(plannedExp + plannedSav)}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Actual</span><span className="font-bold">{fmtL(pExp + pSav)}</span></div>
                </div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-bold text-sm text-green-600 mb-2">Income</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-text-muted">Planned</span><span className="font-medium">{fmtL(plannedInc)}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Actual</span><span className="font-bold">{fmtL(pInc)}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Category Breakdowns side by side ── */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Expenses by Category */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-red-50/30">
                <h4 className="font-bold text-sm text-red-700">Expenses</h4>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-text-muted uppercase tracking-wide border-b border-border bg-gray-50/50">
                    <th className="px-4 py-2"></th>
                    <th className="px-4 py-2 text-right">Planned</th>
                    <th className="px-4 py-2 text-right">Actual</th>
                    <th className="px-4 py-2 text-right">Diff.</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Totals row */}
                  <tr className="border-b border-border bg-gray-50/30 font-bold text-xs">
                    <td className="px-4 py-2">Totals</td>
                    <td className="px-4 py-2 text-right">{fmtL(plannedExp + plannedSav)}</td>
                    <td className="px-4 py-2 text-right">{fmtL(pExp + pSav)}</td>
                    <td className={`px-4 py-2 text-right ${(plannedExp + plannedSav) - (pExp + pSav) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(plannedExp + plannedSav) - (pExp + pSav) >= 0 ? '' : '-'}{fmtL(Math.abs((plannedExp + plannedSav) - (pExp + pSav)))}
                    </td>
                  </tr>
                  <tr className="h-1"><td colSpan={4}></td></tr>
                  {Object.entries(pSummary.expenses_by_category).sort(([, a], [, b]) => Number(b.actual) - Number(a.actual)).map(([cat, vals]) => {
                    const planned = Number(vals.planned); const actual = Number(vals.actual); const diff = planned - actual
                    return (
                      <tr key={cat} className="border-b border-border/30 text-xs">
                        <td className="px-4 py-2">{cat}</td>
                        <td className="px-4 py-2 text-right">{fmtL(planned)}</td>
                        <td className="px-4 py-2 text-right font-medium">{fmtL(actual)}</td>
                        <td className={`px-4 py-2 text-right font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {diff >= 0 ? '' : '-'}{fmtL(Math.abs(diff))}
                        </td>
                      </tr>
                    )
                  })}
                  {/* Show zero categories */}
                  {EXPENSE_CATEGORIES.filter(c => !pSummary.expenses_by_category[EXPENSE_CATEGORIES.find(ec => ec.value === c.value)?.label || c.label]).map(c => (
                    <tr key={c.value} className="border-b border-border/30 text-xs text-text-muted">
                      <td className="px-4 py-2">{c.label}</td>
                      <td className="px-4 py-2 text-right">{fmtL(0)}</td>
                      <td className="px-4 py-2 text-right">{fmtL(0)}</td>
                      <td className="px-4 py-2 text-right">{fmtL(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Income by Source */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-green-50/30">
                <h4 className="font-bold text-sm text-green-700">Income</h4>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-text-muted uppercase tracking-wide border-b border-border bg-gray-50/50">
                    <th className="px-4 py-2"></th>
                    <th className="px-4 py-2 text-right">Planned</th>
                    <th className="px-4 py-2 text-right">Actual</th>
                    <th className="px-4 py-2 text-right">Diff.</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Totals row */}
                  <tr className="border-b border-border bg-gray-50/30 font-bold text-xs">
                    <td className="px-4 py-2">Totals</td>
                    <td className="px-4 py-2 text-right">{fmtL(plannedInc)}</td>
                    <td className="px-4 py-2 text-right">{fmtL(pInc)}</td>
                    <td className={`px-4 py-2 text-right ${pInc - plannedInc >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pInc - plannedInc >= 0 ? '' : '-'}{fmtL(Math.abs(pInc - plannedInc))}
                    </td>
                  </tr>
                  <tr className="h-1"><td colSpan={4}></td></tr>
                  {Object.entries(pSummary.income_by_source).sort(([, a], [, b]) => Number(b.actual) - Number(a.actual)).map(([source, vals]) => {
                    const planned = Number(vals.planned); const actual = Number(vals.actual); const diff = actual - planned
                    return (
                      <tr key={source} className="border-b border-border/30 text-xs">
                        <td className="px-4 py-2">{source}</td>
                        <td className="px-4 py-2 text-right">{fmtL(planned)}</td>
                        <td className="px-4 py-2 text-right font-medium">{fmtL(actual)}</td>
                        <td className={`px-4 py-2 text-right font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {diff >= 0 ? '' : '-'}{fmtL(Math.abs(diff))}
                        </td>
                      </tr>
                    )
                  })}
                  {/* Show zero sources */}
                  {INCOME_SOURCES.filter(s => !pSummary.income_by_source[INCOME_SOURCES.find(is2 => is2.value === s.value)?.label || s.label]).map(s => (
                    <tr key={s.value} className="border-b border-border/30 text-xs text-text-muted">
                      <td className="px-4 py-2">{s.label}</td>
                      <td className="px-4 py-2 text-right">{fmtL(0)}</td>
                      <td className="px-4 py-2 text-right">{fmtL(0)}</td>
                      <td className="px-4 py-2 text-right">{fmtL(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeView === 'summary' && !pSummary && (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-text-muted text-sm">No data for {monthLabel}</div>
      )}

      {/* ═══════════════════ MODALS ═══════════════════ */}

      {/* Add Income */}
      <Modal open={showAddPIncome} onClose={() => { setShowAddPIncome(false); resetPiForm() }} title="Add Income">
        <form onSubmit={addPIncome} className="space-y-4">
          {incomeFormFields(piForm, setPiForm)}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowAddPIncome(false); resetPiForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Add</button>
          </div>
        </form>
      </Modal>

      {/* Edit Income */}
      <Modal open={showEditPIncome} onClose={() => { setShowEditPIncome(false); resetPiForm() }} title="Edit Income">
        <form onSubmit={savePIncome} className="space-y-4">
          {incomeFormFields(piForm, setPiForm)}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowEditPIncome(false); resetPiForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>

      {/* Add Expense */}
      <Modal open={showAddPExpense} onClose={() => { setShowAddPExpense(false); resetPeForm() }} title="Add Expense">
        <form onSubmit={addPExpense} className="space-y-4">
          {expenseFormFields(peForm, setPeForm)}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowAddPExpense(false); resetPeForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600">Add</button>
          </div>
        </form>
      </Modal>

      {/* Edit Expense */}
      <Modal open={showEditPExpense} onClose={() => { setShowEditPExpense(false); resetPeForm() }} title="Edit Expense">
        <form onSubmit={savePExpense} className="space-y-4">
          {expenseFormFields(peForm, setPeForm)}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowEditPExpense(false); resetPeForm() }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>

      {/* Record Actual (quick ? → done) */}
      <Modal open={showRecordActual} onClose={() => setShowRecordActual(false)} title="Record Actual Amount">
        <form onSubmit={submitRecordActual} className="space-y-4">
          <div className="bg-bg-secondary/50 rounded-lg p-3">
            <p className="text-sm font-medium">{recordActualDesc}</p>
            {recordActualPlanned && <p className="text-xs text-text-muted mt-1">Planned: {fmtL(Number(recordActualPlanned))}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Actual Amount (Done)</label>
            <input type="number" step="0.01" value={recordActualAmount} onChange={e => setRecordActualAmount(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required autoFocus />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowRecordActual(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Confirm</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
