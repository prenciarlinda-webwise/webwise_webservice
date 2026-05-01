'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import { Send, Check, X, AlertCircle, Inbox } from 'lucide-react'

interface ReviewDeliverable {
  id: number
  title: string
  category_display: string
  kind: string
  kind_display: string
  status: string
  assigned_to_name?: string
  due_date: string | null
  monthly_plan: number
  requires_approval: boolean
  client_visible: boolean
  submitted_at: string | null
  submitted_by_name?: string | null
  approved_at: string | null
  approved_by_name?: string | null
  rejection_reason: string
  approval_state: 'draft' | 'submitted' | 'approved' | 'rejected'
}

interface PlanLite {
  id: number
  business_name: string
  business_slug: string
  service_name: string
  month_display: string
  project_kind?: string
  project_slug?: string
}

const TABS: Array<{ key: 'submitted' | 'approved' | 'rejected'; label: string; tone: string }> = [
  { key: 'submitted', label: 'Awaiting review', tone: 'bg-blue-50 text-blue-700' },
  { key: 'approved', label: 'Approved', tone: 'bg-green-50 text-green-700' },
  { key: 'rejected', label: 'Rejected', tone: 'bg-red-50 text-red-700' },
]

export default function ReviewQueuePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [items, setItems] = useState<ReviewDeliverable[]>([])
  const [planById, setPlanById] = useState<Record<number, PlanLite>>({})
  const [tab, setTab] = useState<'submitted' | 'approved' | 'rejected'>('submitted')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const isPrivileged = user?.role === 'admin' || user?.is_supervisor === true

  useEffect(() => {
    if (user && !isPrivileged) router.replace('/dashboard')
  }, [user, isPrivileged, router])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const d = await api.get<{ results: ReviewDeliverable[] } | ReviewDeliverable[]>(
        `/clients/deliverables/?approval_state=${tab}`
      )
      const list = Array.isArray(d) ? d : (d.results ?? [])
      setItems(list)
      const planIds = Array.from(new Set(list.map(x => x.monthly_plan)))
      if (planIds.length > 0) {
        const plans = await api.get<{ results: PlanLite[] } | PlanLite[]>(`/clients/plans/`)
        const all = Array.isArray(plans) ? plans : (plans.results ?? [])
        const map: Record<number, PlanLite> = {}
        all.forEach(p => { map[p.id] = p })
        setPlanById(map)
      } else {
        setPlanById({})
      }
    } finally { setLoading(false) }
  }, [tab])

  useEffect(() => { if (isPrivileged) load() }, [load, isPrivileged])

  const approve = async (id: number) => {
    setBusyId(id)
    try { await api.post(`/clients/deliverables/${id}/approve/`, {}); await load() } finally { setBusyId(null) }
  }
  const reject = async (id: number) => {
    if (!rejectReason.trim()) return
    setBusyId(id)
    try {
      await api.post(`/clients/deliverables/${id}/reject/`, { rejection_reason: rejectReason.trim() })
      setRejectingId(null); setRejectReason(''); await load()
    } finally { setBusyId(null) }
  }

  if (!isPrivileged) return null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review queue"
        description="Approve or reject submitted deliverables before clients see them."
      />

      <div className="flex gap-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'bg-white border border-border text-text-secondary hover:bg-bg-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-border px-6 py-16 text-center text-text-muted flex flex-col items-center gap-2">
          <Inbox size={32} className="text-text-muted/60" />
          <p className="text-sm">{tab === 'submitted' ? 'Nothing waiting for review.' : `No ${tab} deliverables.`}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border divide-y divide-border">
          {items.map(d => {
            const plan = planById[d.monthly_plan]
            return (
              <div key={d.id} className="px-5 py-3">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{d.title}</span>
                      <span className="text-[10px] uppercase text-text-muted bg-bg-secondary px-1.5 py-0.5 rounded">{d.category_display}</span>
                      {d.kind !== 'work' && (
                        <span className="text-[10px] uppercase text-text-muted bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{d.kind_display}</span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-2 flex-wrap">
                      {plan && (
                        <Link href={`/dashboard/${plan.business_slug}`} className="hover:text-accent">
                          {plan.business_name}
                        </Link>
                      )}
                      {plan && <span>· {plan.service_name}</span>}
                      {plan && <span>· {plan.month_display}</span>}
                      {d.assigned_to_name && <span>· {d.assigned_to_name}</span>}
                      {d.submitted_at && <span>· submitted {new Date(d.submitted_at).toLocaleDateString()}</span>}
                      {d.due_date && <span>· due {new Date(d.due_date).toLocaleDateString()}</span>}
                    </div>
                    {d.approval_state === 'rejected' && d.rejection_reason && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                        <AlertCircle size={11} className="mt-0.5 shrink-0" />
                        <span>{d.rejection_reason}</span>
                      </div>
                    )}
                  </div>
                  {tab === 'submitted' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approve(d.id)}
                        disabled={busyId === d.id}
                        className="text-xs px-2.5 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        onClick={() => { setRejectingId(rejectingId === d.id ? null : d.id); setRejectReason('') }}
                        disabled={busyId === d.id}
                        className="text-xs px-2.5 py-1 border border-border text-red-600 rounded hover:bg-red-50 disabled:opacity-50 flex items-center gap-1"
                      >
                        <X size={12} /> Reject
                      </button>
                    </div>
                  )}
                </div>
                {rejectingId === d.id && (
                  <div className="mt-3 flex items-center gap-2 ml-0">
                    <input
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason — what needs to change before approval?"
                      className="flex-1 px-3 py-1.5 text-sm border border-border rounded"
                      autoFocus
                    />
                    <button onClick={() => reject(d.id)} disabled={busyId === d.id || !rejectReason.trim()} className="text-sm px-3 py-1.5 bg-red-600 text-white rounded disabled:opacity-50">
                      Send rejection
                    </button>
                    <button onClick={() => { setRejectingId(null); setRejectReason('') }} className="text-sm text-text-muted">Cancel</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
