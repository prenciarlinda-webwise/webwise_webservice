'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import { Plus, Trash2, CheckCircle2, Calendar, DollarSign, Send, Check, X, AlertCircle } from 'lucide-react'

interface Engagement {
  id: number
  business: number
  business_slug: string
  business_name: string
  kind: string
  kind_display: string
  slug: string
  name: string
  status: string
  status_display: string
  start_date: string | null
  end_date: string | null
  monthly_budget_usd: string | null
  notes: string
  services_count: number
}

interface Service {
  id: number
  business: number
  project: number | null
  name: string
  description: string
  monthly_price: string | null
  status: string
}

interface Plan {
  id: number
  project_service: number
  service_name: string
  business_name: string
  business_slug: string
  month: string
  month_display: string
  status: string
  monthly_retainer: string | null
  total_costs: string | null
  profit_margin: string | null
  progress: { total: number; completed: number; in_progress: number; not_started: number; percent: number }
  deliverables: Deliverable[]
}

interface Deliverable {
  id: number
  title: string
  category: string
  category_display: string
  kind: string
  status: string
  status_display: string
  assigned_to: number | null
  assigned_to_name?: string
  due_date: string | null
  requires_approval: boolean
  client_visible: boolean
  submitted_at: string | null
  submitted_by_name?: string | null
  approved_at: string | null
  approved_by_name?: string | null
  rejection_reason: string
  approval_state: 'draft' | 'submitted' | 'approved' | 'rejected'
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const APPROVAL_STYLE: Record<Deliverable['approval_state'], string> = {
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-50 text-blue-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
}

function DeliverableRow({ d, userId, isPrivileged, onChange }: { d: Deliverable; userId: number | undefined; isPrivileged: boolean; onChange: () => void }) {
  const [busy, setBusy] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const isAssignee = userId !== undefined && d.assigned_to === userId
  const canSubmit = (isAssignee || isPrivileged) && (d.approval_state === 'draft' || d.approval_state === 'rejected')
  const canApprove = isPrivileged && d.approval_state === 'submitted'

  const submit = async () => {
    setBusy(true)
    try { await api.post(`/clients/deliverables/${d.id}/submit/`, {}); onChange() } finally { setBusy(false) }
  }
  const approve = async () => {
    setBusy(true)
    try { await api.post(`/clients/deliverables/${d.id}/approve/`, {}); onChange() } finally { setBusy(false) }
  }
  const reject = async () => {
    if (!rejectReason.trim()) return
    setBusy(true)
    try {
      await api.post(`/clients/deliverables/${d.id}/reject/`, { rejection_reason: rejectReason.trim() })
      setShowReject(false); setRejectReason(''); onChange()
    } finally { setBusy(false) }
  }

  return (
    <li className="flex flex-col gap-1 py-1.5 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-2">
        <CheckCircle2
          size={14}
          className={['completed', 'published'].includes(d.status) ? 'text-green-500' : 'text-text-muted'}
        />
        <span className="flex-1">{d.title}</span>
        {d.requires_approval && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${APPROVAL_STYLE[d.approval_state]}`}>
            {d.approval_state}
          </span>
        )}
        {d.assigned_to_name && <span className="text-xs text-text-muted">{d.assigned_to_name}</span>}
        {d.due_date && <span className="text-xs text-text-muted">{new Date(d.due_date).toLocaleDateString()}</span>}
        {canSubmit && (
          <button onClick={submit} disabled={busy} className="text-xs text-accent hover:underline flex items-center gap-1 disabled:opacity-50">
            <Send size={11} /> Submit
          </button>
        )}
        {canApprove && (
          <>
            <button onClick={approve} disabled={busy} className="text-xs text-green-600 hover:underline flex items-center gap-1 disabled:opacity-50">
              <Check size={11} /> Approve
            </button>
            <button onClick={() => setShowReject(s => !s)} disabled={busy} className="text-xs text-red-600 hover:underline flex items-center gap-1 disabled:opacity-50">
              <X size={11} /> Reject
            </button>
          </>
        )}
      </div>
      {d.approval_state === 'rejected' && d.rejection_reason && (
        <div className="ml-6 flex items-start gap-1.5 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
          <AlertCircle size={11} className="mt-0.5 shrink-0" />
          <span>{d.rejection_reason}</span>
        </div>
      )}
      {showReject && canApprove && (
        <div className="ml-6 flex items-center gap-2">
          <input
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Why is this being rejected?"
            className="flex-1 px-2 py-1 text-xs border border-border rounded"
            autoFocus
          />
          <button onClick={reject} disabled={busy || !rejectReason.trim()} className="text-xs px-2 py-1 bg-red-600 text-white rounded disabled:opacity-50">
            Send
          </button>
          <button onClick={() => { setShowReject(false); setRejectReason('') }} className="text-xs text-text-muted">Cancel</button>
        </div>
      )}
    </li>
  )
}

export default function EngagementDetailPage({ params }: { params: Promise<{ business: string; project: string }> }) {
  const { business: businessSlug, project: projectSlug } = use(params)
  const { user } = useAuth()
  const [engagement, setEngagement] = useState<Engagement | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [showAddService, setShowAddService] = useState(false)
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', monthly_price: '' })

  const isPrivileged = user?.role === 'admin' || user?.is_supervisor === true

  const reload = async () => {
    try {
      const e = await api.get<Engagement>(`/clients/engagements/by-slug/${businessSlug}/${projectSlug}/`)
      setEngagement(e)
      const s = await api.get<{ results: Service[] } | Service[]>(`/clients/services/?engagement=${e.id}`)
      setServices(Array.isArray(s) ? s : (s.results ?? []))
      const p = await api.get<{ results: Plan[] } | Plan[]>(`/clients/plans/?engagement=${e.id}`)
      setPlans(Array.isArray(p) ? p : (p.results ?? []))
    } catch (err) {
      console.error('Failed to load engagement:', err)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessSlug, projectSlug])

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!engagement) return
    await api.post('/clients/services/', {
      business: engagement.business,
      project: engagement.id,
      name: serviceForm.name,
      description: serviceForm.description,
      monthly_price: serviceForm.monthly_price || null,
      status: 'in_progress',
    })
    setShowAddService(false)
    setServiceForm({ name: '', description: '', monthly_price: '' })
    reload()
  }

  const handleStatus = async (newStatus: string) => {
    if (!engagement) return
    await api.patch(`/clients/engagements/${engagement.id}/`, { status: newStatus })
    reload()
  }

  const handleDeleteService = async (id: number) => {
    if (!confirm('Delete this service and its plans/deliverables?')) return
    await api.delete(`/clients/services/${id}/`)
    reload()
  }

  if (!engagement) {
    return <div className="py-20 text-center text-text-muted">Loading…</div>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${engagement.business_name} → ${engagement.kind_display}`}
        description={
          <span className="flex items-center gap-3 text-sm">
            <StatusBadge status={engagement.status} />
            {engagement.start_date && (
              <span className="flex items-center gap-1 text-text-muted">
                <Calendar size={14} /> {new Date(engagement.start_date).toLocaleDateString()}
                {engagement.end_date && ` → ${new Date(engagement.end_date).toLocaleDateString()}`}
              </span>
            )}
            {engagement.monthly_budget_usd && (
              <span className="flex items-center gap-1 text-text-muted">
                <DollarSign size={14} /> ${engagement.monthly_budget_usd}/mo
              </span>
            )}
          </span>
        }
        action={
          <Link
            href={`/dashboard/${businessSlug}`}
            className="text-sm text-text-muted hover:text-text-primary"
          >
            ← Back to business
          </Link>
        }
      />

      {/* Status controls */}
      {isPrivileged && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Status:</span>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleStatus(opt.value)}
              disabled={engagement.status === opt.value}
              className={`px-3 py-1 text-xs rounded-lg border ${
                engagement.status === opt.value
                  ? 'bg-primary text-white border-primary cursor-default'
                  : 'border-border text-text-secondary hover:bg-bg-secondary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Services */}
      <section className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Services</h2>
          {isPrivileged && (
            <button
              onClick={() => setShowAddService(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"
            >
              <Plus size={14} /> Add service
            </button>
          )}
        </div>
        {services.length === 0 ? (
          <p className="text-sm text-text-muted">No services yet.</p>
        ) : (
          <div className="space-y-3">
            {services.map(s => (
              <div key={s.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{s.name}</h3>
                  {s.description && <p className="text-xs text-text-muted mt-1">{s.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <StatusBadge status={s.status} />
                    {s.monthly_price && <span className="text-text-secondary">${s.monthly_price}/mo</span>}
                  </div>
                </div>
                {isPrivileged && (
                  <button onClick={() => handleDeleteService(s.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Monthly plans + deliverables */}
      <section className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Monthly plans</h2>
          {isPrivileged && (
            <Link
              href={`/dashboard/plans?engagement=${engagement.id}`}
              className="text-sm text-accent hover:underline"
            >
              Manage plans →
            </Link>
          )}
        </div>
        {plans.length === 0 ? (
          <p className="text-sm text-text-muted">No monthly plans yet. Add a service first, then create a plan.</p>
        ) : (
          <div className="space-y-4">
            {plans
              .sort((a, b) => b.month.localeCompare(a.month))
              .map(plan => (
                <div key={plan.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{plan.month_display}</h3>
                      <p className="text-xs text-text-muted">{plan.service_name}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={plan.status} />
                      <p className="text-xs text-text-muted mt-1">{plan.progress.completed}/{plan.progress.total} done · {plan.progress.percent}%</p>
                    </div>
                  </div>
                  {plan.deliverables.length > 0 && (
                    <ul className="text-sm space-y-1">
                      {plan.deliverables.map(d => (
                        <DeliverableRow key={d.id} d={d} userId={user?.id} isPrivileged={isPrivileged} onChange={reload} />
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>

      {engagement.notes && (
        <section className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-sm whitespace-pre-wrap">{engagement.notes}</p>
        </section>
      )}

      <Modal open={showAddService} onClose={() => setShowAddService(false)} title="Add service">
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              value={serviceForm.name}
              onChange={e => setServiceForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              placeholder='e.g. "On-page SEO"'
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={serviceForm.description}
              onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly price (USD)</label>
            <input
              type="number"
              step="0.01"
              value={serviceForm.monthly_price}
              onChange={e => setServiceForm(f => ({ ...f, monthly_price: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddService(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Add</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
