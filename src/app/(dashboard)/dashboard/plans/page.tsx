'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Deliverable {
  id: number
  monthly_plan: number
  category: string
  category_display: string
  title: string
  description: string
  target_keyword: string
  status: string
  frequency: string
  quantity: number
  assigned_to: number | null
  assigned_to_name: string | null
  link: string
  live_url: string
  due_date: string | null
  completed_date: string | null
  notes: string
  sort_order: number
}

interface MonthlyPlan {
  id: number
  project_service: number
  service_name: string
  project_name: string
  client_name: string
  client_id: number
  project_id: number
  business_slug: string
  month: string
  month_display: string
  status: string
  notes: string
  progress: { total: number; completed: number; in_progress: number; not_started: number; percent: number }
  monthly_retainer: string | null
  content_writer_cost: string | null
  tool_costs: string | null
  link_building_spend: string | null
  other_costs: string | null
  total_costs: string | null
  deliverables: Deliverable[]
}

interface Employee { id: number; first_name: string; last_name: string }
interface ServiceTemplate { id: number; name: string; description: string }
interface Client { id: number; business_name: string; projects?: { id: number; name: string; services: { id: number; name: string }[] }[]; businesses?: { id: number; name: string; services: { id: number; name: string }[] }[] }

const categoryColors: Record<string, string> = {
  audit: 'bg-amber-100 text-amber-700',
  gbp_post: 'bg-green-100 text-green-700',
  gbp_setup: 'bg-green-100 text-green-700',
  blog_post: 'bg-blue-100 text-blue-700',
  content: 'bg-blue-100 text-blue-700',
  citation: 'bg-purple-100 text-purple-700',
  backlink: 'bg-indigo-100 text-indigo-700',
  on_page: 'bg-yellow-100 text-yellow-700',
  technical: 'bg-orange-100 text-orange-700',
  aeo: 'bg-teal-100 text-teal-700',
  review: 'bg-pink-100 text-pink-700',
  reporting: 'bg-cyan-100 text-cyan-700',
  social: 'bg-rose-100 text-rose-700',
  design: 'bg-violet-100 text-violet-700',
  development: 'bg-emerald-100 text-emerald-700',
  logo: 'bg-fuchsia-100 text-fuchsia-700',
  branding: 'bg-fuchsia-100 text-fuchsia-700',
  ads: 'bg-red-100 text-red-700',
  leads: 'bg-lime-100 text-lime-700',
  keyword_research: 'bg-teal-100 text-teal-700',
  competitor: 'bg-slate-100 text-slate-700',
  account: 'bg-stone-100 text-stone-700',
  qa: 'bg-sky-100 text-sky-700',
  other: 'bg-gray-100 text-gray-600',
}

const CATEGORIES = [
  { value: 'audit', label: 'Audit' },
  { value: 'gbp_post', label: 'GBP Post' },
  { value: 'gbp_setup', label: 'GBP Setup' },
  { value: 'blog_post', label: 'Blog Post' },
  { value: 'content', label: 'Content' },
  { value: 'citation', label: 'Citation' },
  { value: 'backlink', label: 'Backlink' },
  { value: 'on_page', label: 'On-Page SEO' },
  { value: 'technical', label: 'Technical SEO' },
  { value: 'aeo', label: 'AEO' },
  { value: 'review', label: 'Review' },
  { value: 'reporting', label: 'Reporting' },
  { value: 'social', label: 'Social' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'logo', label: 'Logo' },
  { value: 'branding', label: 'Branding' },
  { value: 'ads', label: 'Ads' },
  { value: 'leads', label: 'Leads' },
  { value: 'keyword_research', label: 'Keyword Research' },
  { value: 'competitor', label: 'Competitor' },
  { value: 'account', label: 'Account' },
  { value: 'qa', label: 'QA' },
  { value: 'other', label: 'Other' },
]

export default function MonthlyPlansPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [plans, setPlans] = useState<MonthlyPlan[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [templates, setTemplates] = useState<ServiceTemplate[]>([])
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null)

  // Add Plan state
  const [showAddPlan, setShowAddPlan] = useState(false)
  const [planForm, setPlanForm] = useState({ project_service: '', month: '', template_id: '', assigned_to: '' })

  // Add Deliverable state
  const [showAddDeliverable, setShowAddDeliverable] = useState<number | null>(null)
  const [delForm, setDelForm] = useState({ category: 'other', title: '', description: '', target_keyword: '', frequency: 'once', quantity: '1', assigned_to: '', due_date: '' })

  const reload = () => {
    api.get<{ results: MonthlyPlan[] }>('/clients/plans/').then(d => {
      setPlans(d.results)
    })
  }

  useEffect(() => {
    reload()
    if (isAdmin) {
      api.get<{ results: Employee[] }>('/auth/users/?role=employee').then(d => setEmployees(d.results))
      api.get<{ results: Client[] }>('/clients/').then(d => setClients(d.results))
      api.get<{ results: ServiceTemplate[] }>('/clients/templates/').then(d => setTemplates(d.results))
    }
  }, [isAdmin])

  const allServices = clients.flatMap(c =>
    (c.projects ?? c.businesses ?? []).flatMap(p =>
      p.services.map(s => ({ id: s.id, label: `${c.business_name} → ${p.name} → ${s.name}` }))
    )
  )

  const addPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (planForm.template_id) {
      // Use template endpoint
      await api.post('/clients/templates/apply/', {
        template_id: Number(planForm.template_id),
        project_service_id: Number(planForm.project_service),
        month: planForm.month + '-01',
        assigned_to: planForm.assigned_to ? Number(planForm.assigned_to) : null,
      })
    } else {
      // Create empty plan
      await api.post('/clients/plans/', {
        project_service: Number(planForm.project_service),
        month: planForm.month + '-01',
        status: 'planned',
      })
    }
    reload()
    setShowAddPlan(false)
    setPlanForm({ project_service: '', month: '', template_id: '', assigned_to: '' })
  }

  const deletePlan = async (id: number) => {
    if (!confirm('Delete this monthly plan and all its deliverables?')) return
    await api.delete(`/clients/plans/${id}/`)
    reload()
  }

  const addDeliverable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showAddDeliverable) return
    await api.post('/clients/deliverables/', {
      monthly_plan: showAddDeliverable,
      category: delForm.category,
      title: delForm.title,
      description: delForm.description,
      target_keyword: delForm.target_keyword,
      frequency: delForm.frequency,
      quantity: Number(delForm.quantity) || 1,
      assigned_to: delForm.assigned_to ? Number(delForm.assigned_to) : null,
      due_date: delForm.due_date || null,
    })
    reload()
    setShowAddDeliverable(null)
    setDelForm({ category: 'other', title: '', description: '', target_keyword: '', frequency: 'once', quantity: '1', assigned_to: '', due_date: '' })
  }

  const deleteDeliverable = async (id: number) => {
    if (!confirm('Delete this deliverable?')) return
    await api.delete(`/clients/deliverables/${id}/`)
    reload()
  }

  const updateDeliverable = async (deliverableId: number, planId: number, updates: Partial<Deliverable>) => {
    const updated = await api.patch<Deliverable>(`/clients/deliverables/${deliverableId}/`, updates)
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p
      const newDeliverables = p.deliverables.map(d => d.id === deliverableId ? { ...d, ...updated } : d)
      const completed = newDeliverables.filter(d => d.status === 'completed' || d.status === 'published').length
      const in_progress = newDeliverables.filter(d => d.status === 'in_progress').length
      return {
        ...p,
        deliverables: newDeliverables,
        progress: {
          total: newDeliverables.length,
          completed,
          in_progress,
          not_started: newDeliverables.length - completed - in_progress,
          percent: newDeliverables.length > 0 ? Math.round((completed / newDeliverables.length) * 100) : 0,
        },
      }
    }))
  }

  return (
    <div>
      <PageHeader
        title="Monthly Plans"
        description="Deliverables for each client service, organized by month"
        action={
          isAdmin && (
            <button onClick={() => setShowAddPlan(true)} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
              <Plus size={14} /> New Plan
            </button>
          )
        }
      />

      <div className="space-y-4">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-xl border border-border overflow-hidden">
            {/* Plan Header */}
            <div className="flex items-center justify-between px-6 py-4 hover:bg-bg-secondary/30 transition-colors">
              <button
                onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                className="flex-1 text-left"
              >
                <h3 className="font-semibold text-text-primary">{plan.client_name}</h3>
                <p className="text-sm text-text-secondary">{plan.service_name} · {plan.month_display}</p>
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${plan.progress.percent}%` }} />
                  </div>
                  <span className="text-sm font-medium text-text-secondary">{plan.progress.percent}%</span>
                </div>
                <div className="text-xs text-text-muted">{plan.progress.completed}/{plan.progress.total} done</div>
                <StatusBadge status={plan.status} />
                <Link href={`/dashboard/${plan.business_slug}`} className="text-xs text-accent hover:underline">View Business</Link>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => deletePlan(plan.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Deliverables Table */}
            {expandedPlan === plan.id && (
              <div className="border-t border-border">
                {/* Financial summary if available */}
                {(plan.monthly_retainer || plan.total_costs) && (
                  <div className="px-6 py-2 bg-bg-secondary/30 border-b border-border flex items-center gap-4 text-xs text-text-muted">
                    {plan.monthly_retainer && <span>Retainer: <span className="font-semibold text-text-primary">&euro;{Number(plan.monthly_retainer).toLocaleString()}</span></span>}
                    {plan.total_costs && <span>Total Costs: <span className="font-semibold text-text-primary">&euro;{Number(plan.total_costs).toLocaleString()}</span></span>}
                  </div>
                )}

                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-text-muted border-b border-border">
                      <th className="px-6 py-2">Category</th>
                      <th className="px-6 py-2">Deliverable</th>
                      <th className="px-6 py-2">Keyword</th>
                      <th className="px-6 py-2">Assigned To</th>
                      <th className="px-6 py-2">Status</th>
                      <th className="px-6 py-2">Draft</th>
                      <th className="px-6 py-2">Live</th>
                      <th className="px-6 py-2">Due</th>
                      {isAdmin && <th className="px-6 py-2"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {plan.deliverables.map(d => (
                      <tr key={d.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/30">
                        <td className="px-6 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[d.category] || categoryColors.other}`}>
                            {d.category_display}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-sm">{d.title}</div>
                          {d.description && <div className="text-xs text-text-muted truncate max-w-xs">{d.description}</div>}
                        </td>
                        <td className="px-6 py-3 text-xs text-text-secondary">{d.target_keyword || '—'}</td>
                        <td className="px-6 py-3">
                          {isAdmin ? (
                            <select
                              value={d.assigned_to || ''}
                              onChange={e => updateDeliverable(d.id, plan.id, { assigned_to: e.target.value ? Number(e.target.value) : null })}
                              className="text-xs border border-border rounded px-2 py-1"
                            >
                              <option value="">Unassigned</option>
                              {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-sm text-text-secondary">{d.assigned_to_name || '—'}</span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <select
                            value={d.status}
                            onChange={e => {
                              const updates: Partial<Deliverable> = { status: e.target.value }
                              if (e.target.value === 'completed') updates.completed_date = new Date().toISOString().split('T')[0]
                              updateDeliverable(d.id, plan.id, updates)
                            }}
                            className={`text-xs font-medium border-0 rounded-full px-2.5 py-1 cursor-pointer ${
                              d.status === 'completed' || d.status === 'published' ? 'bg-green-100 text-green-700' :
                              d.status === 'in_progress' || d.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="published">Published</option>
                          </select>
                        </td>
                        <td className="px-6 py-3">
                          {d.link ? (
                            <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">View</a>
                          ) : user?.role !== 'client' ? (
                            <button
                              onClick={() => {
                                const link = prompt('Enter draft link (Google Drive, etc.):')
                                if (link) updateDeliverable(d.id, plan.id, { link })
                              }}
                              className="text-xs text-text-muted hover:text-accent"
                            >+ Draft</button>
                          ) : <span className="text-xs text-text-muted">—</span>}
                        </td>
                        <td className="px-6 py-3">
                          {d.live_url ? (
                            <a href={d.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline flex items-center gap-0.5"><ExternalLink size={10} /> Live</a>
                          ) : user?.role !== 'client' ? (
                            <button
                              onClick={() => {
                                const url = prompt('Enter live URL:')
                                if (url) updateDeliverable(d.id, plan.id, { live_url: url })
                              }}
                              className="text-xs text-text-muted hover:text-accent"
                            >+ Live</button>
                          ) : <span className="text-xs text-text-muted">—</span>}
                        </td>
                        <td className="px-6 py-3 text-xs text-text-secondary">{d.completed_date || d.due_date || '—'}</td>
                        {isAdmin && (
                          <td className="px-6 py-3">
                            <button onClick={() => deleteDeliverable(d.id)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {plan.deliverables.length === 0 && (
                      <tr><td colSpan={isAdmin ? 9 : 8} className="px-6 py-6 text-center text-text-muted text-sm">No deliverables yet</td></tr>
                    )}
                  </tbody>
                </table>
                {isAdmin && (
                  <div className="px-6 py-3 border-t border-border">
                    <button onClick={() => setShowAddDeliverable(plan.id)} className="flex items-center gap-1 text-xs text-accent hover:underline"><Plus size={12} /> Add Deliverable</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {plans.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-8 text-center text-text-muted">No monthly plans yet</div>
        )}
      </div>

      {/* Add Plan Modal */}
      <Modal open={showAddPlan} onClose={() => setShowAddPlan(false)} title="New Monthly Plan" wide>
        <form onSubmit={addPlan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Service *</label>
            <select value={planForm.project_service} onChange={e => setPlanForm(f => ({ ...f, project_service: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
              <option value="">Select service</option>
              {allServices.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month *</label>
              <input type="month" value={planForm.month} onChange={e => setPlanForm(f => ({ ...f, month: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Template</label>
              <select value={planForm.template_id} onChange={e => setPlanForm(f => ({ ...f, template_id: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">No template (empty plan)</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          {planForm.template_id && (
            <div>
              <label className="block text-sm font-medium mb-1">Default Assignee</label>
              <select value={planForm.assigned_to} onChange={e => setPlanForm(f => ({ ...f, assigned_to: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">Unassigned</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>)}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddPlan(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create Plan</button>
          </div>
        </form>
      </Modal>

      {/* Add Deliverable Modal */}
      <Modal open={showAddDeliverable !== null} onClose={() => setShowAddDeliverable(null)} title="Add Deliverable" wide>
        <form onSubmit={addDeliverable} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select value={delForm.category} onChange={e => setDelForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input value={delForm.title} onChange={e => setDelForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input value={delForm.description} onChange={e => setDelForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Keyword</label>
            <input value={delForm.target_keyword} onChange={e => setDelForm(f => ({ ...f, target_keyword: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. plumber near me" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select value={delForm.frequency} onChange={e => setDelForm(f => ({ ...f, frequency: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi_weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="ongoing">Ongoing</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Qty</label>
              <input type="number" value={delForm.quantity} onChange={e => setDelForm(f => ({ ...f, quantity: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Assignee</label>
              <select value={delForm.assigned_to} onChange={e => setDelForm(f => ({ ...f, assigned_to: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">Unassigned</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input type="date" value={delForm.due_date} onChange={e => setDelForm(f => ({ ...f, due_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddDeliverable(null)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Add</button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
