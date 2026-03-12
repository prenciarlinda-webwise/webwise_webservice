'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import { Pencil, ExternalLink, Globe, Phone, Mail, MapPin, ChevronDown, ChevronRight, FileText, Download, Plus, Trash2, BarChart3, TrendingUp, Search } from 'lucide-react'

// ── Types ──
interface Deliverable {
  id: number; category: string; category_display: string
  title: string; description: string; status: string; link: string; live_url: string
  due_date: string | null; completed_date: string | null
}
interface PlanReport { id: number; title: string; pdf: string; uploaded_by_name: string; created_at: string }
interface MonthlyPlan {
  id: number; month: string; month_display: string; status: string
  progress: { total: number; completed: number; in_progress: number; percent: number }
  deliverables: Deliverable[]; reports: PlanReport[]
}

interface GBPMetrics {
  id: number; month: string; calls: number; chat_clicks: number; bookings: number
  direction_clicks: number; website_clicks: number; total_interactions: number
  interactions_change_pct: string | null; profile_views: number; profile_views_change_pct: string | null
  review_count: number; review_avg_rating: string; new_reviews: number; posts_published: number; notes: string
}
interface GA4Metrics {
  id: number; month: string; active_users: number; new_users: number; total_sessions: number
  avg_engagement_time_sec: number; page_views: number; phone_clicks: number
  estimate_requests: number; whatsapp_clicks: number; email_clicks: number; direction_clicks: number
  traffic_sources: { source: string; sessions: number }[]; notes: string
}
interface SearchTerm {
  id: number; month: string; source: string; keyword: string
  impressions: number; clicks: number; avg_position: string | null; local_pack: boolean
}
interface Service { id: number; name: string; description: string; status: string; monthly_plans: MonthlyPlan[] }
interface CatalogItem { id: number; item_type: string; name: string; description: string; price: string | null; price_unit: string; duration_days: number | null; specifications: Record<string, string>; sort_order: number }
interface Project {
  id: number; name: string; business_phone: string; business_email: string; business_address: string
  website_url: string; business_hours: string; service_areas: string[]
  google_business_url: string; facebook_url: string; instagram_url: string
  google_drive_url: string; image_folder_url: string; citations_url: string; booking_url: string
  industry: string; target_audience: string[]; competitors: { name: string; notes?: string }[]; usps: string[]; marketing_channels: string[]; nap_status: string
  status: string; notes: string; services: Service[]; catalog: CatalogItem[]
}

const emptyCatalogForm = { item_type: 'service' as string, name: '', description: '', price: '', price_unit: '', duration_days: '', specs: [] as { key: string; value: string }[], sort_order: '0' }

const STATUS_STYLE: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-50 text-blue-700',
  scheduled: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  published: 'bg-green-50 text-green-700',
}

const statusIcon = (s: string) => s === 'completed' || s === 'published' ? '✓' : s === 'in_progress' ? '●' : '○'
const statusColor = (s: string) => s === 'completed' || s === 'published' ? 'text-green-600' : s === 'in_progress' ? 'text-blue-500' : 'text-gray-300'

export default function ClientProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const projectId = project?.id
  const [expandedService, setExpandedService] = useState<number | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null)

  // Metrics (read-only for clients)
  const [gbpByMonth, setGbpByMonth] = useState<Record<string, GBPMetrics>>({})
  const [ga4ByMonth, setGa4ByMonth] = useState<Record<string, GA4Metrics>>({})
  const [kwByMonth, setKwByMonth] = useState<Record<string, SearchTerm[]>>({})
  const [metricsTab, setMetricsTab] = useState<Record<number, 'gbp' | 'ga4' | 'keywords'>>({})

  // Edit business modal
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '', business_phone: '', business_email: '', business_address: '', website_url: '',
    business_hours: '', service_areas: '', industry: '', notes: '',
    google_business_url: '', facebook_url: '', instagram_url: '',
    google_drive_url: '', image_folder_url: '', citations_url: '', booking_url: '',
    target_audience: '', competitors: '', usps: '', marketing_channels: '', nap_status: '',
  })

  // Catalog CRUD
  const [showCatalog, setShowCatalog] = useState(false)
  const [catalogForm, setCatalogForm] = useState(emptyCatalogForm)
  const [editingCatalogId, setEditingCatalogId] = useState<number | null>(null)

  const reload = () => {
    api.get<Project>(`/clients/projects/by-slug/${slug}/`).then(p => {
      setProject(p)
      if (p.services.length > 0 && expandedService === null) {
        setExpandedService(p.services[0].id)
        if (p.services[0].monthly_plans.length > 0) setExpandedPlan(p.services[0].monthly_plans[0].id)
      }
      // Fetch metrics using numeric ID
      api.get<{ results: GBPMetrics[] }>(`/reports/gbp/?project=${p.id}`).then(d => {
        const map: Record<string, GBPMetrics> = {}
        d.results.forEach(g => { map[g.month] = g })
        setGbpByMonth(map)
      }).catch(() => {})
      api.get<{ results: GA4Metrics[] }>(`/reports/ga4/?project=${p.id}`).then(d => {
        const map: Record<string, GA4Metrics> = {}
        d.results.forEach(g => { map[g.month] = g })
        setGa4ByMonth(map)
      }).catch(() => {})
      api.get<{ results: SearchTerm[] }>(`/reports/search-terms/?project=${p.id}`).then(d => {
        const map: Record<string, SearchTerm[]> = {}
        d.results.forEach(k => { if (!map[k.month]) map[k.month] = []; map[k.month].push(k) })
        setKwByMonth(map)
      }).catch(() => {})
    })
  }

  useEffect(() => { reload() }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Business edit ──
  const openEdit = () => {
    if (!project) return
    setEditForm({
      name: project.name,
      business_phone: project.business_phone, business_email: project.business_email,
      business_address: project.business_address, website_url: project.website_url,
      business_hours: project.business_hours, service_areas: (project.service_areas || []).join(', '),
      industry: project.industry, notes: project.notes,
      google_business_url: project.google_business_url || '', facebook_url: project.facebook_url || '',
      instagram_url: project.instagram_url || '',
      google_drive_url: project.google_drive_url || '', image_folder_url: project.image_folder_url || '',
      citations_url: project.citations_url || '', booking_url: project.booking_url || '',
      target_audience: (project.target_audience || []).join(', '),
      competitors: (project.competitors || []).map((c: { name?: string; notes?: string } | string) => typeof c === 'object' && c.name ? (c.notes ? `${c.name} — ${c.notes}` : c.name) : String(c)).join('\n'),
      usps: (project.usps || []).join(', '),
      marketing_channels: (project.marketing_channels || []).join(', '),
      nap_status: project.nap_status || '',
    })
    setShowEdit(true)
  }
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    const toArr = (v: string) => v.split(',').map(s => s.trim()).filter(Boolean)
    await api.patch(`/clients/projects/${projectId}/`, {
      ...editForm,
      service_areas: toArr(editForm.service_areas),
      target_audience: toArr(editForm.target_audience),
      competitors: editForm.competitors.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
        const [name, ...rest] = line.split('—')
        return { name: name.trim(), notes: rest.join('—').trim() }
      }),
      usps: toArr(editForm.usps),
      marketing_channels: toArr(editForm.marketing_channels),
    })
    reload(); setShowEdit(false)
  }

  // ── Catalog CRUD ──
  const openAddCatalog = () => {
    setCatalogForm(emptyCatalogForm)
    setEditingCatalogId(null)
    setShowCatalog(true)
  }
  const openEditCatalog = (item: CatalogItem) => {
    const specObj = item.specifications || {}
    setCatalogForm({
      item_type: item.item_type, name: item.name, description: item.description || '',
      price: item.price || '', price_unit: item.price_unit || '',
      duration_days: item.duration_days?.toString() || '',
      specs: Object.entries(specObj).map(([key, value]) => ({ key, value })),
      sort_order: item.sort_order?.toString() || '0',
    })
    setEditingCatalogId(item.id)
    setShowCatalog(true)
  }
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    setCatalogForm(f => {
      const specs = [...f.specs]
      specs[i] = { ...specs[i], [field]: val }
      return { ...f, specs }
    })
  }
  const addSpec = () => setCatalogForm(f => ({ ...f, specs: [...f.specs, { key: '', value: '' }] }))
  const removeSpec = (i: number) => setCatalogForm(f => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }))
  const saveCatalog = async (e: React.FormEvent) => {
    e.preventDefault()
    const specifications: Record<string, string> = {}
    catalogForm.specs.forEach(s => { if (s.key.trim()) specifications[s.key.trim()] = s.value.trim() })
    const payload = {
      project: projectId!,
      item_type: catalogForm.item_type,
      name: catalogForm.name,
      description: catalogForm.description,
      price: catalogForm.price || null,
      price_unit: catalogForm.price_unit,
      duration_days: catalogForm.duration_days ? Number(catalogForm.duration_days) : null,
      specifications,
      sort_order: Number(catalogForm.sort_order) || 0,
    }
    if (editingCatalogId) {
      await api.patch(`/clients/catalog/${editingCatalogId}/`, payload)
    } else {
      await api.post('/clients/catalog/', payload)
    }
    reload(); setShowCatalog(false)
  }
  const deleteCatalog = async (itemId: number) => {
    if (!confirm('Delete this item?')) return
    await api.delete(`/clients/catalog/${itemId}/`)
    reload()
  }

  if (!project) return <div className="animate-pulse h-8 w-48 bg-bg-secondary rounded" />

  // Overall progress
  const totalDel = project.services.reduce((s, svc) => s + svc.monthly_plans.reduce((s2, p) => s2 + p.progress.total, 0), 0)
  const doneDel = project.services.reduce((s, svc) => s + svc.monthly_plans.reduce((s2, p) => s2 + p.progress.completed, 0), 0)
  const pct = totalDel > 0 ? Math.round((doneDel / totalDel) * 100) : 0

  return (
    <div>
      <PageHeader
        title={project.name}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <Link href="/dashboard/my-projects" className="text-sm text-text-muted hover:text-accent">← My Businesses</Link>
          </div>
        }
      />

      {/* ── Business Info Card ── */}
      <div className="bg-white rounded-xl border border-border mb-6">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Business Information</h2>
          <div className="flex items-center gap-4">
            <button onClick={openEdit} className="text-xs text-text-muted hover:text-accent"><Pencil size={14} /></button>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-semibold">{doneDel}/{totalDel} ({pct}%)</span>
            </div>
          </div>
        </div>

        <div className="p-5 grid lg:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm">
            {project.website_url && (
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-text-muted" />
                <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{project.website_url}</a>
              </div>
            )}
            {project.business_phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-text-muted" />
                <span>{project.business_phone}</span>
              </div>
            )}
            {project.business_email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-text-muted" />
                <span>{project.business_email}</span>
              </div>
            )}
            {project.business_address && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-text-muted" />
                <span>{project.business_address}</span>
              </div>
            )}
            {project.business_hours && <p className="text-xs text-text-muted">Hours: {project.business_hours}</p>}
            {project.industry && <p className="text-xs text-text-muted">Industry: {project.industry}</p>}
            {project.nap_status && <p className="text-xs text-text-muted">NAP Status: {project.nap_status}</p>}
            {/* Social & Links */}
            {(project.google_business_url || project.facebook_url || project.instagram_url || project.booking_url) && (
              <div className="pt-2 space-y-1">
                {project.google_business_url && (
                  <a href={project.google_business_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline"><ExternalLink size={11} /> Google Business Profile</a>
                )}
                {project.facebook_url && (
                  <a href={project.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline"><ExternalLink size={11} /> Facebook</a>
                )}
                {project.instagram_url && (
                  <a href={project.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline"><ExternalLink size={11} /> Instagram</a>
                )}
                {project.booking_url && (
                  <a href={project.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline"><ExternalLink size={11} /> Booking Page</a>
                )}
              </div>
            )}
            {/* Internal Links */}
            {(project.google_drive_url || project.image_folder_url || project.citations_url) && (
              <div className="pt-2 space-y-1">
                <p className="font-medium text-text-muted text-xs mb-1">Internal Links</p>
                {project.google_drive_url && (
                  <a href={project.google_drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline"><ExternalLink size={11} /> Google Drive</a>
                )}
                {project.image_folder_url && (
                  <a href={project.image_folder_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline"><ExternalLink size={11} /> Image Assets</a>
                )}
                {project.citations_url && (
                  <a href={project.citations_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline"><ExternalLink size={11} /> Citations Sheet</a>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2 text-xs">
            {project.service_areas?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Service Areas</p>
                <div className="flex flex-wrap gap-1">
                  {project.service_areas.map((a, i) => <span key={i} className="bg-bg-secondary px-2 py-0.5 rounded">{a}</span>)}
                </div>
              </div>
            )}
            {project.usps?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Key Strengths</p>
                <div className="flex flex-wrap gap-1">
                  {project.usps.map((u, i) => <span key={i} className="bg-green-50 text-green-700 px-2 py-0.5 rounded">{u}</span>)}
                </div>
              </div>
            )}
            {project.target_audience?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Target Audience</p>
                <div className="flex flex-wrap gap-1">
                  {project.target_audience.map((t, i) => <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{t}</span>)}
                </div>
              </div>
            )}
            {project.competitors?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Competitors</p>
                <div className="flex flex-wrap gap-1">
                  {project.competitors.map((c, i) => {
                    const comp = typeof c === 'object' ? (c as { name: string; notes?: string }) : { name: String(c), notes: '' }
                    return <span key={i} className="bg-red-50 text-red-700 px-2 py-0.5 rounded">{comp.name}{comp.notes ? ` — ${comp.notes}` : ''}</span>
                  })}
                </div>
              </div>
            )}
            {project.marketing_channels?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Marketing Channels</p>
                <div className="flex flex-wrap gap-1">
                  {project.marketing_channels.map((m, i) => <span key={i} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{m}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Catalog (Products & Services) ── */}
      <div className="bg-white rounded-xl border border-border mb-6">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Products & Services</h2>
          <button onClick={openAddCatalog} className="flex items-center gap-1 text-xs text-accent hover:underline"><Plus size={14} /> Add</button>
        </div>
        <div className="divide-y divide-border">
          {project.catalog?.map(item => (
            <div key={item.id} className="px-5 py-3 flex items-center justify-between group">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${item.item_type === 'product' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {item.item_type === 'product' ? 'Product' : 'Service'}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {item.description && <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{item.description}</p>}
              </div>
              <div className="flex items-center gap-3">
                {item.price && (
                  <span className="text-sm font-medium">${Number(item.price).toLocaleString()}{item.price_unit && <span className="text-xs text-text-muted ml-1">/{item.price_unit}</span>}</span>
                )}
                <button onClick={() => openEditCatalog(item)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent transition-opacity"><Pencil size={13} /></button>
                <button onClick={() => deleteCatalog(item.id)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 transition-opacity"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          {(!project.catalog || project.catalog.length === 0) && (
            <div className="px-5 py-6 text-center text-text-muted text-sm">No products or services yet. Click &quot;Add&quot; to get started.</div>
          )}
        </div>
      </div>

      {/* ── Services & Monthly Plans ── */}
      <div className="space-y-3 mb-6">
        {project.services.map(service => {
          const isExpanded = expandedService === service.id
          return (
            <div key={service.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => { setExpandedService(isExpanded ? null : service.id); setExpandedPlan(null) }}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="font-semibold text-sm">{service.name}</span>
                  <StatusBadge status={service.status} />
                </div>
                <span className="text-xs text-text-muted">{service.monthly_plans.length} month{service.monthly_plans.length !== 1 ? 's' : ''}</span>
              </button>

              {isExpanded && (
                <div className="border-t border-border">
                  {service.monthly_plans.map(plan => {
                    const isPlanExpanded = expandedPlan === plan.id
                    return (
                      <div key={plan.id}>
                        <button
                          onClick={() => setExpandedPlan(isPlanExpanded ? null : plan.id)}
                          className="w-full px-5 py-3 flex items-center justify-between hover:bg-bg-secondary/20 border-b border-border/50"
                        >
                          <div className="flex items-center gap-3">
                            {isPlanExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span className="text-sm font-medium">{plan.month_display}</span>
                            <StatusBadge status={plan.status} />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${plan.progress.percent}%` }} />
                            </div>
                            <span className="text-xs font-medium">{plan.progress.percent}%</span>
                          </div>
                        </button>

                        {isPlanExpanded && (
                          <div className="bg-bg-secondary/10">
                            {/* Deliverables */}
                            <div className="divide-y divide-border/50">
                              {plan.deliverables.map(d => (
                                <div key={d.id} className="flex items-center justify-between px-8 py-2.5">
                                  <div className="flex items-center gap-3">
                                    <span className={`text-base ${statusColor(d.status)}`}>{statusIcon(d.status)}</span>
                                    <div>
                                      <p className={`text-sm ${d.status === 'completed' || d.status === 'published' ? 'line-through text-text-muted' : ''}`}>{d.title}</p>
                                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${STATUS_STYLE[d.status] || STATUS_STYLE.not_started}`}>
                                        {d.category_display}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {d.link && (
                                      <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Draft</a>
                                    )}
                                    {d.live_url && (
                                      <a href={d.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline flex items-center gap-0.5">
                                        <ExternalLink size={10} /> Live
                                      </a>
                                    )}
                                    {d.due_date && <span className="text-xs text-text-muted">{d.due_date}</span>}
                                  </div>
                                </div>
                              ))}
                              {plan.deliverables.length === 0 && (
                                <div className="px-8 py-6 text-center text-text-muted text-sm">No deliverables yet</div>
                              )}
                            </div>

                            {/* Performance Metrics (read-only) */}
                            {(() => {
                              const gbp = gbpByMonth[plan.month]
                              const ga4 = ga4ByMonth[plan.month]
                              const kws = kwByMonth[plan.month] || []
                              const hasData = gbp || ga4 || kws.length > 0
                              if (!hasData) return null
                              const tab = metricsTab[plan.id] || 'gbp'
                              return (
                                <div className="px-8 py-3 border-t border-border bg-gradient-to-r from-blue-50/30 to-green-50/30">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-text-muted flex items-center gap-1"><BarChart3 size={12} /> Performance Metrics</span>
                                  </div>
                                  <div className="flex gap-1 mb-3">
                                    {[
                                      { key: 'gbp' as const, label: 'GBP', icon: TrendingUp, has: !!gbp },
                                      { key: 'ga4' as const, label: 'GA4', icon: BarChart3, has: !!ga4 },
                                      { key: 'keywords' as const, label: `Keywords (${kws.length})`, icon: Search, has: kws.length > 0 },
                                    ].map(t => (
                                      <button key={t.key} onClick={() => setMetricsTab({ ...metricsTab, [plan.id]: t.key })} className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${tab === t.key ? 'bg-primary text-white' : t.has ? 'bg-white text-text-secondary border border-border hover:bg-bg-secondary' : 'bg-white/50 text-text-muted border border-border/50'}`}>
                                        <t.icon size={12} /> {t.label}
                                      </button>
                                    ))}
                                  </div>

                                  {tab === 'gbp' && gbp && (
                                    <div>
                                      <div className="grid grid-cols-5 gap-2 mb-2">
                                        {[
                                          { label: 'Calls', val: gbp.calls },
                                          { label: 'Chat', val: gbp.chat_clicks },
                                          { label: 'Bookings', val: gbp.bookings },
                                          { label: 'Directions', val: gbp.direction_clicks },
                                          { label: 'Website', val: gbp.website_clicks },
                                        ].map(s => (
                                          <div key={s.label} className="bg-white rounded-lg p-2 text-center border border-border">
                                            <p className="text-lg font-bold">{s.val}</p>
                                            <p className="text-[10px] text-text-muted">{s.label}</p>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="grid grid-cols-4 gap-2">
                                        <div className="bg-white rounded-lg p-2 text-center border border-border">
                                          <p className="text-sm font-bold">{gbp.total_interactions}</p>
                                          <p className="text-[10px] text-text-muted">Interactions {gbp.interactions_change_pct && <span className="text-green-600">(+{gbp.interactions_change_pct}%)</span>}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 text-center border border-border">
                                          <p className="text-sm font-bold">{gbp.profile_views}</p>
                                          <p className="text-[10px] text-text-muted">Views {gbp.profile_views_change_pct && <span className="text-green-600">(+{gbp.profile_views_change_pct}%)</span>}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 text-center border border-border">
                                          <p className="text-sm font-bold">{gbp.review_count} ({gbp.review_avg_rating}★)</p>
                                          <p className="text-[10px] text-text-muted">Reviews ({gbp.new_reviews} new)</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 text-center border border-border">
                                          <p className="text-sm font-bold">{gbp.posts_published}</p>
                                          <p className="text-[10px] text-text-muted">Posts Published</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {tab === 'gbp' && !gbp && <p className="text-xs text-text-muted">No GBP data for this month</p>}

                                  {tab === 'ga4' && ga4 && (
                                    <div>
                                      <div className="grid grid-cols-4 gap-2 mb-2">
                                        {[
                                          { label: 'Active Users', val: ga4.active_users },
                                          { label: 'New Users', val: ga4.new_users },
                                          { label: 'Sessions', val: ga4.total_sessions },
                                          { label: 'Avg Engagement', val: `${ga4.avg_engagement_time_sec}s` },
                                        ].map(s => (
                                          <div key={s.label} className="bg-white rounded-lg p-2 text-center border border-border">
                                            <p className="text-lg font-bold">{s.val}</p>
                                            <p className="text-[10px] text-text-muted">{s.label}</p>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="grid grid-cols-5 gap-2">
                                        {[
                                          { label: 'Page Views', val: ga4.page_views },
                                          { label: 'Phone', val: ga4.phone_clicks },
                                          { label: 'Estimates', val: ga4.estimate_requests },
                                          { label: 'WhatsApp', val: ga4.whatsapp_clicks },
                                          { label: 'Email', val: ga4.email_clicks },
                                        ].map(s => (
                                          <div key={s.label} className="bg-white rounded-lg p-2 text-center border border-border">
                                            <p className="text-sm font-bold">{s.val}</p>
                                            <p className="text-[10px] text-text-muted">{s.label}</p>
                                          </div>
                                        ))}
                                      </div>
                                      {ga4.traffic_sources?.length > 0 && (
                                        <div className="bg-white rounded-lg p-2 border border-border text-xs space-y-1 mt-2">
                                          <p className="font-medium text-text-muted">Top Traffic Sources</p>
                                          {ga4.traffic_sources.slice(0, 5).map((s, i) => (
                                            <div key={i} className="flex justify-between"><span>{s.source}</span><span className="font-medium">{s.sessions} sessions</span></div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {tab === 'ga4' && !ga4 && <p className="text-xs text-text-muted">No GA4 data for this month</p>}

                                  {tab === 'keywords' && kws.length > 0 && (
                                    <div className="bg-white rounded-lg border border-border overflow-hidden">
                                      <table className="w-full text-xs">
                                        <thead>
                                          <tr className="text-left text-text-muted border-b border-border">
                                            <th className="px-3 py-2">Keyword</th>
                                            <th className="px-3 py-2">Source</th>
                                            <th className="px-3 py-2">Impressions</th>
                                            <th className="px-3 py-2">Clicks</th>
                                            <th className="px-3 py-2">Position</th>
                                            <th className="px-3 py-2">Local Pack</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {kws.map(k => (
                                            <tr key={k.id} className="border-b border-border last:border-0">
                                              <td className="px-3 py-1.5 font-medium">{k.keyword}</td>
                                              <td className="px-3 py-1.5"><span className="px-1.5 py-0.5 rounded bg-bg-secondary">{k.source.toUpperCase()}</span></td>
                                              <td className="px-3 py-1.5">{k.impressions.toLocaleString()}</td>
                                              <td className="px-3 py-1.5">{k.clicks}</td>
                                              <td className="px-3 py-1.5 font-medium">{k.avg_position || '—'}</td>
                                              <td className="px-3 py-1.5">{k.local_pack ? <span className="text-green-600 font-medium">Yes</span> : '—'}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                  {tab === 'keywords' && kws.length === 0 && <p className="text-xs text-text-muted">No keyword data for this month</p>}
                                </div>
                              )
                            })()}

                            {/* Reports */}
                            {plan.reports?.length > 0 && (
                              <div className="px-8 py-3 border-t border-border bg-bg-secondary/30">
                                <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1"><FileText size={12} /> Reports</p>
                                <div className="space-y-1.5">
                                  {plan.reports.map(r => (
                                    <div key={r.id} className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg text-sm">
                                      <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-red-500" />
                                        <span className="font-medium">{r.title}</span>
                                      </div>
                                      <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent hover:underline">
                                        <Download size={11} /> Download
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {service.monthly_plans.length === 0 && (
                    <div className="px-5 py-6 text-center text-text-muted text-sm">Work hasn&apos;t started yet for this service</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Upgrade CTA */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">Want to see better results?</h3>
        <p className="text-sm text-white/80 mb-4">
          Upgrading your package means more deliverables, faster keyword rankings, and increased lead generation every month.
        </p>
        <Link href="/dashboard/progress" className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
          View Full Progress
        </Link>
      </div>

      {/* ── Edit Business Info Modal ── */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Business Information">
        <form onSubmit={saveEdit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={editForm.business_phone} onChange={e => setEditForm(f => ({ ...f, business_phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={editForm.business_email} onChange={e => setEditForm(f => ({ ...f, business_email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input value={editForm.business_address} onChange={e => setEditForm(f => ({ ...f, business_address: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input value={editForm.website_url} onChange={e => setEditForm(f => ({ ...f, website_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Hours</label>
              <input value={editForm.business_hours} onChange={e => setEditForm(f => ({ ...f, business_hours: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Mon-Fri 8am-6pm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input value={editForm.industry} onChange={e => setEditForm(f => ({ ...f, industry: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>

          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide pt-2">Online Presence</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Google Business URL</label>
              <input value={editForm.google_business_url} onChange={e => setEditForm(f => ({ ...f, google_business_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Booking URL</label>
              <input value={editForm.booking_url} onChange={e => setEditForm(f => ({ ...f, booking_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook URL</label>
              <input value={editForm.facebook_url} onChange={e => setEditForm(f => ({ ...f, facebook_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram URL</label>
              <input value={editForm.instagram_url} onChange={e => setEditForm(f => ({ ...f, instagram_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>

          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide pt-2">Internal Links</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Google Drive URL</label>
              <input value={editForm.google_drive_url} onChange={e => setEditForm(f => ({ ...f, google_drive_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image Folder URL</label>
              <input value={editForm.image_folder_url} onChange={e => setEditForm(f => ({ ...f, image_folder_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Citations URL</label>
            <input value={editForm.citations_url} onChange={e => setEditForm(f => ({ ...f, citations_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>

          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide pt-2">Marketing Info</p>
          <div>
            <label className="block text-sm font-medium mb-1">Service Areas (comma-separated)</label>
            <input value={editForm.service_areas} onChange={e => setEditForm(f => ({ ...f, service_areas: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Jacksonville FL, Orange Park FL" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience (comma-separated)</label>
            <input value={editForm.target_audience} onChange={e => setEditForm(f => ({ ...f, target_audience: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Homeowners, Property managers" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Competitors (one per line, &quot;Name — Notes&quot;)</label>
            <textarea value={editForm.competitors} onChange={e => setEditForm(f => ({ ...f, competitors: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20" placeholder={"Competitor A — local franchise\nCompetitor B"} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unique Selling Points (comma-separated)</label>
            <input value={editForm.usps} onChange={e => setEditForm(f => ({ ...f, usps: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="24/7 availability, Licensed & insured" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Marketing Channels (comma-separated)</label>
              <input value={editForm.marketing_channels} onChange={e => setEditForm(f => ({ ...f, marketing_channels: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Google, Facebook, Yelp" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NAP Status</label>
              <select value={editForm.nap_status} onChange={e => setEditForm(f => ({ ...f, nap_status: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">—</option>
                <option value="consistent">Consistent</option>
                <option value="inconsistent">Inconsistent</option>
                <option value="not_checked">Not Checked</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>

      {/* ── Catalog Add/Edit Modal ── */}
      <Modal open={showCatalog} onClose={() => setShowCatalog(false)} title={editingCatalogId ? 'Edit Item' : 'Add Product / Service'}>
        <form onSubmit={saveCatalog} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={catalogForm.item_type} onChange={e => setCatalogForm(f => ({ ...f, item_type: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="service">Service</option>
                <option value="product">Product</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input required value={catalogForm.name} onChange={e => setCatalogForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={catalogForm.description} onChange={e => setCatalogForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" rows={2} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input type="number" step="0.01" value={catalogForm.price} onChange={e => setCatalogForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price Unit</label>
              <input value={catalogForm.price_unit} onChange={e => setCatalogForm(f => ({ ...f, price_unit: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="per rental, per sqft" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (days)</label>
              <input type="number" value={catalogForm.duration_days} onChange={e => setCatalogForm(f => ({ ...f, duration_days: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Specifications</label>
              <button type="button" onClick={addSpec} className="text-xs text-accent hover:underline flex items-center gap-0.5"><Plus size={12} /> Add</button>
            </div>
            {catalogForm.specs.length === 0 && (
              <p className="text-xs text-text-muted">No specs yet. Click &quot;Add&quot; to add details like capacity, dimensions, etc.</p>
            )}
            <div className="space-y-2">
              {catalogForm.specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s.key} onChange={e => updateSpec(i, 'key', e.target.value)} placeholder="e.g. Capacity" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm" />
                  <input value={s.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="e.g. 2 tons" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm" />
                  <button type="button" onClick={() => removeSpec(i)} className="text-text-muted hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input type="number" value={catalogForm.sort_order} onChange={e => setCatalogForm(f => ({ ...f, sort_order: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowCatalog(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">{editingCatalogId ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
