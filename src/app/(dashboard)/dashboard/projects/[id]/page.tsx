'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import { Plus, Trash2, ExternalLink, Pencil, ChevronDown, ChevronRight, Globe, Phone, Mail, MapPin, FileText, Upload, Download, Clock, Package, BarChart3, TrendingUp, Search } from 'lucide-react'

// ── Types ──────────────────────────────────────────────

interface Deliverable {
  id: number; monthly_plan: number; category: string; category_display: string
  title: string; description: string; target_keyword: string
  status: string; frequency: string; quantity: number
  assigned_to: number | null; assigned_to_name: string | null
  link: string; live_url: string
  start_date: string | null; due_date: string | null; completed_date: string | null
  notes: string; sort_order: number
}

interface Metrics {
  id: number; gbp_views: number; gbp_calls: number; organic_sessions: number
  keywords_top_3: number; total_reviews: number; average_rating: string
  monthly_retainer: string; total_costs: string; profit_margin: string
}

interface PlanReport {
  id: number; title: string; pdf: string; uploaded_by_name: string; created_at: string
}

interface MonthlyPlan {
  id: number; project_service: number; month: string; month_display: string; status: string
  progress: { total: number; completed: number; in_progress: number; not_started: number; percent: number }
  deliverables: Deliverable[]; metrics: Metrics | null; reports: PlanReport[]
}

interface Service {
  id: number; name: string; description: string; monthly_price: string | null; status: string
  monthly_plans: MonthlyPlan[]
}

interface CatalogItem {
  id: number; project: number; item_type: string; name: string; description: string
  price: string | null; price_unit: string; duration_days: number | null
  specifications: Record<string, string>; sort_order: number
}

interface Competitor { name: string; notes?: string }

interface Project {
  id: number; client: number; client_name: string; client_id: number
  name: string; business_phone: string; business_email: string; business_address: string
  website_url: string; business_hours: string; service_areas: string[]
  google_business_url: string; facebook_url: string; instagram_url: string; google_drive_url: string
  industry: string; target_audience: string[]; competitors: Competitor[]; usps: string[]
  marketing_channels: string[]; nap_status: string
  status: string; notes: string; services: Service[]; catalog: CatalogItem[]
}

interface Employee { id: number; first_name: string; last_name: string }
interface ServiceTemplate { id: number; name: string; description: string }

interface GBPMetrics {
  id: number; project: number; month: string
  calls: number; chat_clicks: number; bookings: number; direction_clicks: number; website_clicks: number
  total_interactions: number; interactions_change_pct: string | null
  profile_views: number; profile_views_change_pct: string | null
  search_desktop_pct: string; search_mobile_pct: string; maps_desktop_pct: string; maps_mobile_pct: string
  photo_count: number; review_count: number; review_avg_rating: string; new_reviews: number
  posts_published: number; notes: string
}

interface GA4Metrics {
  id: number; project: number; month: string
  active_users: number; new_users: number; total_sessions: number; avg_engagement_time_sec: number
  total_events: number; page_views: number; scrolls: number
  phone_clicks: number; estimate_requests: number; whatsapp_clicks: number; email_clicks: number
  direction_clicks: number; high_intent_pages: number; financing_interest: number
  traffic_sources: { source: string; sessions: number; key_events: number }[]
  country_breakdown: { country: string; users: number }[]
  top_pages: { page: string; views: number }[]
  page_speed: { lcp?: number; inp?: number; cls?: number; mobile_score?: number }
  notes: string
}

interface SearchTerm {
  id: number; project: number; month: string; source: string
  keyword: string; impressions: number; clicks: number
  avg_position: string | null; local_pack: boolean; notes: string
}

// ── Constants ──────────────────────────────────────────

const CATEGORIES = [
  { value: 'audit', label: 'Audit' }, { value: 'gbp_post', label: 'GBP Post' },
  { value: 'gbp_setup', label: 'GBP Setup' }, { value: 'blog_post', label: 'Blog Post' },
  { value: 'content', label: 'Content' }, { value: 'citation', label: 'Citation' },
  { value: 'backlink', label: 'Backlink' }, { value: 'on_page', label: 'On-Page SEO' },
  { value: 'technical', label: 'Technical SEO' }, { value: 'aeo', label: 'AEO' },
  { value: 'review', label: 'Review' }, { value: 'reporting', label: 'Reporting' },
  { value: 'social', label: 'Social' }, { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' }, { value: 'logo', label: 'Logo' },
  { value: 'branding', label: 'Branding' }, { value: 'ads', label: 'Ads' },
  { value: 'leads', label: 'Leads' }, { value: 'competitor', label: 'Competitor' },
  { value: 'account', label: 'Account' }, { value: 'qa', label: 'QA' },
  { value: 'other', label: 'Other' },
]

const STATUS_STYLE: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-50 text-blue-700',
  scheduled: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  published: 'bg-green-50 text-green-700',
}

// ── Component ──────────────────────────────────────────

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isEmployee = user?.role === 'employee'
  const [project, setProject] = useState<Project | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [templates, setTemplates] = useState<ServiceTemplate[]>([])
  const [expandedService, setExpandedService] = useState<number | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null)

  // Modals
  const [showAddService, setShowAddService] = useState(false)
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', monthly_price: '', template_id: '' })
  const [showAddPlan, setShowAddPlan] = useState<number | null>(null)
  const [planForm, setPlanForm] = useState({ month: '', template_id: '', assigned_to: '' })
  const [showAddDel, setShowAddDel] = useState<number | null>(null)
  const [editDel, setEditDel] = useState<Deliverable | null>(null)
  const [delForm, setDelForm] = useState({
    category: 'other', title: '', description: '', target_keyword: '',
    frequency: 'once', quantity: '1', assigned_to: '', status: 'not_started',
    link: '', live_url: '', start_date: '', due_date: '', completed_date: '', notes: '',
  })
  const [showEditProject, setShowEditProject] = useState(false)
  const [projForm, setProjForm] = useState({
    name: '', business_phone: '', business_email: '', business_address: '', website_url: '',
    business_hours: '', service_areas: '', google_business_url: '', facebook_url: '', instagram_url: '',
    google_drive_url: '', industry: '', target_audience: '', competitors: '', usps: '',
    marketing_channels: '', nap_status: '', notes: '',
  })
  const [uploadPlanId, setUploadPlanId] = useState<number | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Catalog
  const [showCatalogModal, setShowCatalogModal] = useState(false)
  const [editCatalog, setEditCatalog] = useState<CatalogItem | null>(null)
  const [catalogForm, setCatalogForm] = useState({ item_type: 'product', name: '', description: '', price: '', price_unit: '', duration_days: '', specifications: '' })
  // Payments
  const [projectPayments, setProjectPayments] = useState<{ id: number; service_name: string; amount: string; status: string; due_date: string; paid_date: string | null; description: string }[]>([])
  // Analytics metrics (keyed by month string e.g. "2026-01-01")
  const [gbpByMonth, setGbpByMonth] = useState<Record<string, GBPMetrics>>({})
  const [ga4ByMonth, setGa4ByMonth] = useState<Record<string, GA4Metrics>>({})
  const [kwByMonth, setKwByMonth] = useState<Record<string, SearchTerm[]>>({})
  const [metricsTab, setMetricsTab] = useState<Record<number, 'gbp' | 'ga4' | 'keywords'>>({})

  const reload = () => {
    api.get<Project>(`/clients/projects/${id}/`).then(p => {
      setProject(p)
      if (p.services.length > 0 && expandedService === null) {
        setExpandedService(p.services[0].id)
        const firstPlan = p.services[0].monthly_plans[0]
        if (firstPlan) setExpandedPlan(firstPlan.id)
      }
    })
    if (isAdmin) {
      api.get<{ results: typeof projectPayments }>(`/payments/?project=${id}`).then(d => setProjectPayments(d.results))
      // Fetch analytics metrics for this project
      api.get<{ results: GBPMetrics[] }>(`/reports/gbp/?project=${id}`).then(d => {
        const map: Record<string, GBPMetrics> = {}
        d.results.forEach(g => { map[g.month] = g })
        setGbpByMonth(map)
      }).catch(() => {})
      api.get<{ results: GA4Metrics[] }>(`/reports/ga4/?project=${id}`).then(d => {
        const map: Record<string, GA4Metrics> = {}
        d.results.forEach(g => { map[g.month] = g })
        setGa4ByMonth(map)
      }).catch(() => {})
      api.get<{ results: SearchTerm[] }>(`/reports/search-terms/?project=${id}`).then(d => {
        const map: Record<string, SearchTerm[]> = {}
        d.results.forEach(k => { if (!map[k.month]) map[k.month] = []; map[k.month].push(k) })
        setKwByMonth(map)
      }).catch(() => {})
    }
  }

  useEffect(() => {
    reload()
    if (isAdmin) {
      api.get<{ results: Employee[] }>('/auth/users/?role=employee').then(d => setEmployees(d.results))
      api.get<{ results: ServiceTemplate[] }>('/clients/templates/').then(d => setTemplates(d.results))
    }
  }, [id, isAdmin])

  // ── Actions ────────────────────────────────────────

  const addService = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/clients/services/', {
      project: Number(id), name: serviceForm.name, description: serviceForm.description,
      monthly_price: serviceForm.monthly_price || null,
      template_id: serviceForm.template_id ? Number(serviceForm.template_id) : undefined,
    })
    reload(); setShowAddService(false)
    setServiceForm({ name: '', description: '', monthly_price: '', template_id: '' })
  }

  const deleteService = async (sid: number) => {
    if (!confirm('Delete this service and all its deliverables?')) return
    await api.delete(`/clients/services/${sid}/`); reload()
  }

  const addPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showAddPlan) return
    if (planForm.template_id) {
      await api.post('/clients/templates/apply/', {
        template_id: Number(planForm.template_id), project_service_id: showAddPlan,
        month: planForm.month + '-01', assigned_to: planForm.assigned_to ? Number(planForm.assigned_to) : null,
      })
    } else {
      await api.post('/clients/plans/', { project_service: showAddPlan, month: planForm.month + '-01', status: 'planned' })
    }
    reload(); setShowAddPlan(null)
    setPlanForm({ month: '', template_id: '', assigned_to: '' })
  }

  const deletePlan = async (planId: number) => {
    if (!confirm('Delete this plan and all its deliverables?')) return
    await api.delete(`/clients/plans/${planId}/`); reload()
  }

  const openDelForm = (d?: Deliverable, planId?: number) => {
    if (d) {
      setEditDel(d)
      setDelForm({
        category: d.category, title: d.title, description: d.description, target_keyword: d.target_keyword,
        frequency: d.frequency, quantity: String(d.quantity), assigned_to: d.assigned_to ? String(d.assigned_to) : '',
        status: d.status, link: d.link, live_url: d.live_url,
        start_date: d.start_date || '', due_date: d.due_date || '', completed_date: d.completed_date || '', notes: d.notes,
      })
    } else {
      setEditDel(null)
      setShowAddDel(planId!)
      setDelForm({
        category: 'other', title: '', description: '', target_keyword: '',
        frequency: 'once', quantity: '1', assigned_to: '', status: 'not_started',
        link: '', live_url: '', start_date: '', due_date: '', completed_date: '', notes: '',
      })
    }
  }

  const [delError, setDelError] = useState('')

  const saveDel = async (e: React.FormEvent) => {
    e.preventDefault()
    setDelError('')
    const data = {
      ...delForm,
      quantity: Number(delForm.quantity) || 1,
      assigned_to: delForm.assigned_to ? Number(delForm.assigned_to) : null,
      start_date: delForm.start_date || null, due_date: delForm.due_date || null,
      completed_date: delForm.completed_date || null,
      monthly_plan: editDel ? editDel.monthly_plan : showAddDel,
    }
    try {
      if (editDel) {
        await api.patch(`/clients/deliverables/${editDel.id}/`, data)
      } else {
        await api.post('/clients/deliverables/', data)
      }
      reload(); setEditDel(null); setShowAddDel(null)
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'detail' in err ? String((err as Record<string, unknown>).detail) : 'Failed to save deliverable. Check all fields.'
      setDelError(msg)
    }
  }

  const deleteDel = async (did: number) => {
    if (!confirm('Delete this deliverable?')) return
    try {
      await api.delete(`/clients/deliverables/${did}/`)
      reload()
    } catch {
      alert('Failed to delete deliverable.')
    }
  }

  const openEditProject = () => {
    if (!project) return
    setProjForm({
      name: project.name, business_phone: project.business_phone, business_email: project.business_email,
      business_address: project.business_address, website_url: project.website_url,
      business_hours: project.business_hours || '', service_areas: (project.service_areas || []).join(', '),
      google_business_url: project.google_business_url || '', facebook_url: project.facebook_url || '',
      instagram_url: project.instagram_url || '', google_drive_url: project.google_drive_url || '',
      industry: project.industry || '', target_audience: (project.target_audience || []).join(', '),
      competitors: (project.competitors || []).map((c: Competitor) => c.notes ? `${c.name} — ${c.notes}` : c.name).join('\n'),
      usps: (project.usps || []).join('\n'), marketing_channels: (project.marketing_channels || []).join(', '),
      nap_status: project.nap_status || '', notes: project.notes,
    })
    setShowEditProject(true)
  }

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name: projForm.name, business_phone: projForm.business_phone, business_email: projForm.business_email,
      business_address: projForm.business_address, website_url: projForm.website_url,
      business_hours: projForm.business_hours, google_business_url: projForm.google_business_url,
      facebook_url: projForm.facebook_url, instagram_url: projForm.instagram_url,
      google_drive_url: projForm.google_drive_url, notes: projForm.notes,
      industry: projForm.industry, nap_status: projForm.nap_status,
      service_areas: projForm.service_areas.split(',').map(s => s.trim()).filter(Boolean),
      target_audience: projForm.target_audience.split(',').map(s => s.trim()).filter(Boolean),
      marketing_channels: projForm.marketing_channels.split(',').map(s => s.trim()).filter(Boolean),
      usps: projForm.usps.split('\n').map(s => s.trim()).filter(Boolean),
      competitors: projForm.competitors.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
        const [name, ...rest] = line.split('—')
        return { name: name.trim(), notes: rest.join('—').trim() || undefined }
      }),
    }
    await api.patch(`/clients/projects/${id}/`, data)
    reload(); setShowEditProject(false)
  }

  const uploadReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadPlanId || !fileInputRef.current?.files?.[0]) return
    const plan = project?.services.flatMap(s => s.monthly_plans).find(p => p.id === uploadPlanId)
    const service = project?.services.find(s => s.monthly_plans.some(p => p.id === uploadPlanId))
    const form = new FormData()
    form.append('pdf', fileInputRef.current.files[0])
    form.append('title', uploadTitle || `${plan?.month_display} Report`)
    form.append('monthly_plan', String(uploadPlanId))
    form.append('client', String(project?.client))
    if (service) {
      form.append('project', String(project?.id))
    }
    await api.post('/reports/', form)
    reload()
    setUploadPlanId(null)
    setUploadTitle('')
  }

  const deleteReport = async (reportId: number) => {
    if (!confirm('Delete this report?')) return
    await api.delete(`/reports/${reportId}/`)
    reload()
  }

  // Catalog actions
  const openCatalogForm = (item?: CatalogItem) => {
    if (item) {
      setEditCatalog(item)
      setCatalogForm({
        item_type: item.item_type, name: item.name, description: item.description,
        price: item.price || '', price_unit: item.price_unit, duration_days: item.duration_days ? String(item.duration_days) : '',
        specifications: Object.entries(item.specifications).map(([k, v]) => `${k}: ${v}`).join('\n'),
      })
    } else {
      setEditCatalog(null)
      setCatalogForm({ item_type: 'product', name: '', description: '', price: '', price_unit: '', duration_days: '', specifications: '' })
    }
    setShowCatalogModal(true)
  }

  const saveCatalog = async (e: React.FormEvent) => {
    e.preventDefault()
    const specs: Record<string, string> = {}
    catalogForm.specifications.split('\n').filter(Boolean).forEach(line => {
      const [k, ...v] = line.split(':')
      if (k && v.length) specs[k.trim()] = v.join(':').trim()
    })
    const data = {
      project: Number(id), item_type: catalogForm.item_type, name: catalogForm.name,
      description: catalogForm.description, price: catalogForm.price || null,
      price_unit: catalogForm.price_unit, duration_days: catalogForm.duration_days ? Number(catalogForm.duration_days) : null,
      specifications: specs,
    }
    if (editCatalog) {
      await api.patch(`/clients/catalog/${editCatalog.id}/`, data)
    } else {
      await api.post('/clients/catalog/', data)
    }
    reload(); setShowCatalogModal(false)
  }

  const deleteCatalog = async (cid: number) => {
    if (!confirm('Delete this item?')) return
    await api.delete(`/clients/catalog/${cid}/`); reload()
  }

  if (!project) return <div className="animate-pulse h-8 w-48 bg-bg-secondary rounded" />

  const totalDel = project.services.reduce((s, svc) => s + svc.monthly_plans.reduce((s2, p) => s2 + p.deliverables.length, 0), 0)
  const doneDel = project.services.reduce((s, svc) => s + svc.monthly_plans.reduce((s2, p) => s2 + p.deliverables.filter(d => d.status === 'completed' || d.status === 'published').length, 0), 0)
  const pct = totalDel > 0 ? Math.round((doneDel / totalDel) * 100) : 0

  return (
    <div>
      <PageHeader
        title={project.name}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <Link href={`/dashboard/clients/${project.client_id}`} className="text-sm text-text-muted hover:text-accent">← {project.client_name}</Link>
          </div>
        }
      />

      {/* Business Reference Card */}
      <div className="bg-white rounded-xl border border-border mb-6">
        {/* Header with progress */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-sm">Business Reference</h2>
            {project.industry && <span className="text-xs bg-bg-secondary px-2 py-0.5 rounded">{project.industry}</span>}
            {project.nap_status && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">NAP: {project.nap_status}</span>}
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && <button onClick={openEditProject} className="text-xs text-text-muted hover:text-accent"><Pencil size={14} /></button>}
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-semibold">{doneDel}/{totalDel} ({pct}%)</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Left: Contact & NAP */}
          <div className="p-5 space-y-3 text-sm">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {project.website_url && (
                <>
                  <span className="text-xs font-medium text-text-muted">Website</span>
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm truncate">{project.website_url}</a>
                </>
              )}
              {project.business_phone && (
                <>
                  <span className="text-xs font-medium text-text-muted">Phone</span>
                  <span>{project.business_phone}</span>
                </>
              )}
              {project.business_email && (
                <>
                  <span className="text-xs font-medium text-text-muted">Email</span>
                  <span>{project.business_email}</span>
                </>
              )}
              {project.business_address && (
                <>
                  <span className="text-xs font-medium text-text-muted">Address</span>
                  <span>{project.business_address}</span>
                </>
              )}
              {project.business_hours && (
                <>
                  <span className="text-xs font-medium text-text-muted">Hours</span>
                  <span>{project.business_hours}</span>
                </>
              )}
            </div>

            {/* Digital profiles */}
            {(project.google_business_url || project.facebook_url || project.instagram_url || project.google_drive_url) && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-text-muted mb-2">Digital Profiles</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                  {project.google_business_url && (
                    <>
                      <span className="text-xs text-text-muted">GBP</span>
                      <a href={project.google_business_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate text-xs">{project.google_business_url}</a>
                    </>
                  )}
                  {project.facebook_url && (
                    <>
                      <span className="text-xs text-text-muted">Facebook</span>
                      <a href={project.facebook_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate text-xs">{project.facebook_url}</a>
                    </>
                  )}
                  {project.instagram_url && (
                    <>
                      <span className="text-xs text-text-muted">Instagram</span>
                      <a href={project.instagram_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate text-xs">{project.instagram_url}</a>
                    </>
                  )}
                  {project.google_drive_url && (
                    <>
                      <span className="text-xs text-text-muted">Drive</span>
                      <a href={project.google_drive_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate text-xs">Google Drive Folder</a>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Intel */}
          <div className="p-5 space-y-3 text-xs">
            {project.service_areas?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Service Areas</p>
                <div className="flex flex-wrap gap-1">
                  {project.service_areas.map((a: string) => <span key={a} className="bg-bg-secondary px-2 py-0.5 rounded">{a}</span>)}
                </div>
              </div>
            )}
            {project.target_audience?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Target Audience</p>
                <div className="flex flex-wrap gap-1">
                  {project.target_audience.map(a => <span key={a} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{a}</span>)}
                </div>
              </div>
            )}
            {project.usps?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Unique Selling Points</p>
                <ul className="space-y-0.5">
                  {project.usps.map(u => <li key={u} className="text-text-secondary">• {u}</li>)}
                </ul>
              </div>
            )}
            {project.competitors?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Competitors</p>
                <div className="flex flex-wrap gap-1">
                  {project.competitors.map(c => (
                    <span key={c.name} className="bg-red-50 text-red-700 px-2 py-0.5 rounded" title={c.notes || ''}>
                      {c.name}{c.notes && ` — ${c.notes}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.marketing_channels?.length > 0 && (
              <div>
                <p className="font-medium text-text-muted mb-1">Marketing Channels</p>
                <div className="flex flex-wrap gap-1">
                  {project.marketing_channels.map(ch => <span key={ch} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{ch}</span>)}
                </div>
              </div>
            )}
            {project.notes && !isEmployee && (
              <div>
                <p className="font-medium text-text-muted mb-1">Notes</p>
                <p className="text-text-secondary">{project.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Catalog — Products & Services */}
      {project.catalog && project.catalog.length > 0 && (
        <div className="bg-white rounded-xl border border-border mb-6 overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2"><Package size={16} /> Products & Services Catalog</h2>
            {isAdmin && (
              <button onClick={() => openCatalogForm()} className="flex items-center gap-1 text-xs text-accent hover:underline"><Plus size={12} /> Add Item</button>
            )}
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-text-muted border-b border-border">
                <th className="px-5 py-2">Type</th>
                <th className="px-5 py-2">Name</th>
                <th className="px-5 py-2">Price</th>
                <th className="px-5 py-2">Duration</th>
                <th className="px-5 py-2">Specs</th>
                {isAdmin && <th className="px-5 py-2 w-16"></th>}
              </tr>
            </thead>
            <tbody>
              {project.catalog.map(item => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/30">
                  <td className="px-5 py-2.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.item_type === 'product' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                      {item.item_type}
                    </span>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="text-sm font-medium">{item.name}</div>
                    {item.description && <div className="text-xs text-text-muted mt-0.5">{item.description}</div>}
                  </td>
                  <td className="px-5 py-2.5 text-sm">
                    {item.price ? `$${item.price}` : '—'}
                    {item.price_unit && <span className="text-xs text-text-muted ml-1">{item.price_unit}</span>}
                  </td>
                  <td className="px-5 py-2.5 text-sm text-text-secondary">
                    {item.duration_days ? `${item.duration_days} days` : '—'}
                  </td>
                  <td className="px-5 py-2.5 text-xs text-text-muted">
                    {Object.entries(item.specifications || {}).map(([k, v]) => (
                      <span key={k} className="mr-2"><span className="font-medium">{k}:</span> {v}</span>
                    ))}
                    {Object.keys(item.specifications || {}).length === 0 && '—'}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openCatalogForm(item)} className="text-text-muted hover:text-accent"><Pencil size={12} /></button>
                        <button onClick={() => deleteCatalog(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add catalog button when empty */}
      {isAdmin && (!project.catalog || project.catalog.length === 0) && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6 text-center">
          <p className="text-sm text-text-muted mb-2">No products or services in the catalog yet</p>
          <button onClick={() => openCatalogForm()} className="flex items-center gap-1.5 mx-auto px-4 py-2 text-sm text-accent border border-accent rounded-lg hover:bg-accent/5">
            <Plus size={14} /> Add Product / Service
          </button>
        </div>
      )}

      {/* Payment Summary (admin only) */}
      {isAdmin && projectPayments.length > 0 && (
        <div className="bg-white rounded-xl border border-border mb-6 overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">Payment History</h2>
            <a href="/dashboard/payments" className="text-xs text-accent hover:underline">Manage all &rarr;</a>
          </div>
          <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-border bg-bg-secondary/30">
            <div>
              <p className="text-xs text-text-muted">Paid</p>
              <p className="text-sm font-semibold text-green-600">€{projectPayments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Overdue</p>
              <p className="text-sm font-semibold text-red-600">€{projectPayments.filter(p => p.status === 'overdue').reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Pending</p>
              <p className="text-sm font-semibold text-yellow-600">€{projectPayments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Upcoming</p>
              <p className="text-sm font-semibold text-blue-600">€{projectPayments.filter(p => p.status === 'upcoming').reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}</p>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-text-muted">
                <th className="px-5 py-2">Service</th>
                <th className="px-5 py-2">Description</th>
                <th className="px-5 py-2">Amount</th>
                <th className="px-5 py-2">Due</th>
                <th className="px-5 py-2">Paid</th>
                <th className="px-5 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {projectPayments.map(p => (
                <tr key={p.id} className="border-t border-border hover:bg-bg-secondary/30">
                  <td className="px-5 py-2 text-sm">{p.service_name}</td>
                  <td className="px-5 py-2 text-sm text-text-secondary">{p.description || '—'}</td>
                  <td className="px-5 py-2 text-sm font-medium">€{Number(p.amount).toLocaleString()}</td>
                  <td className="px-5 py-2 text-sm text-text-secondary">{p.due_date || '—'}</td>
                  <td className="px-5 py-2 text-sm text-text-secondary">{p.paid_date || '—'}</td>
                  <td className="px-5 py-2">
                    <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                      p.status === 'paid' ? 'bg-green-100 text-green-700' :
                      p.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      p.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Services header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Services</h2>
        {isAdmin && (
          <button onClick={() => setShowAddService(true)} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
            <Plus size={14} /> Add Service
          </button>
        )}
      </div>

      {/* Services list */}
      <div className="space-y-3">
        {project.services.map(service => {
          const isExp = expandedService === service.id
          const sTotal = service.monthly_plans.reduce((s, p) => s + p.deliverables.length, 0)
          const sDone = service.monthly_plans.reduce((s, p) => s + p.deliverables.filter(d => d.status === 'completed' || d.status === 'published').length, 0)
          const sPct = sTotal > 0 ? Math.round((sDone / sTotal) * 100) : 0

          return (
            <div key={service.id} className="bg-white rounded-xl border border-border overflow-hidden">
              {/* Service header */}
              <div className="flex items-center justify-between px-5 py-4">
                <button onClick={() => { setExpandedService(isExp ? null : service.id); setExpandedPlan(null) }} className="flex-1 flex items-center gap-3 text-left">
                  {isExp ? <ChevronDown size={16} className="text-text-muted" /> : <ChevronRight size={16} className="text-text-muted" />}
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    {service.description && <p className="text-sm text-text-muted">{service.description}</p>}
                  </div>
                </button>
                <div className="flex items-center gap-4">
                  {!isEmployee && service.monthly_price && <span className="text-sm font-medium text-accent">€{service.monthly_price}/mo</span>}
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <div className="w-20 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${sPct}%` }} />
                    </div>
                    {sDone}/{sTotal}
                  </div>
                  <StatusBadge status={service.status} />
                  {isAdmin && <button onClick={() => deleteService(service.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
                </div>
              </div>

              {/* Plans inside service */}
              {isExp && (
                <div className="border-t border-border">
                  {service.monthly_plans.map(plan => {
                    const isPlanExp = expandedPlan === plan.id
                    return (
                      <div key={plan.id}>
                        <div className="flex items-center justify-between px-5 py-2.5 bg-bg-secondary/40 border-b border-border">
                          <button onClick={() => setExpandedPlan(isPlanExp ? null : plan.id)} className="flex items-center gap-2 text-sm">
                            {isPlanExp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span className="font-medium">{plan.month_display}</span>
                            <span className="text-text-muted text-xs">{plan.progress.completed}/{plan.progress.total} done</span>
                          </button>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={plan.status} />
                            {isAdmin && <button onClick={() => deletePlan(plan.id)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>}
                          </div>
                        </div>

                        {isPlanExp && (
                          <div>
                            <table className="w-full">
                              <thead>
                                <tr className="text-left text-xs text-text-muted border-b border-border">
                                  <th className="px-5 py-2 w-8">#</th>
                                  <th className="px-5 py-2">Deliverable</th>
                                  {!isEmployee && <th className="px-5 py-2">Assigned</th>}
                                  <th className="px-5 py-2">Status</th>
                                  <th className="px-5 py-2">Due</th>
                                  <th className="px-5 py-2">Links</th>
                                  {isAdmin && <th className="px-5 py-2 w-16"></th>}
                                </tr>
                              </thead>
                              <tbody>
                                {(isEmployee ? plan.deliverables.filter(d => d.assigned_to === user?.id) : plan.deliverables).map((d, i) => (
                                  <tr
                                    key={d.id}
                                    className="border-b border-border last:border-0 hover:bg-bg-secondary/30 cursor-pointer"
                                    onClick={() => openDelForm(d)}
                                  >
                                    <td className="px-5 py-2.5 text-xs text-text-muted">{i + 1}</td>
                                    <td className="px-5 py-2.5">
                                      <div className="text-sm font-medium">{d.title}</div>
                                      <div className="text-xs text-text-muted">
                                        {d.category_display}
                                        {d.target_keyword && <> · <span className="italic">{d.target_keyword}</span></>}
                                      </div>
                                    </td>
                                    {!isEmployee && <td className="px-5 py-2.5 text-xs text-text-secondary">{d.assigned_to_name || '—'}</td>}
                                    <td className="px-5 py-2.5">
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_STYLE[d.status] || STATUS_STYLE.not_started}`}>
                                        {d.status.replace(/_/g, ' ')}
                                      </span>
                                    </td>
                                    <td className="px-5 py-2.5 text-xs text-text-secondary">{d.due_date || '—'}</td>
                                    <td className="px-5 py-2.5" onClick={e => e.stopPropagation()}>
                                      <div className="flex gap-2">
                                        {d.link && <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Draft</a>}
                                        {d.live_url && <a href={d.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline flex items-center gap-0.5"><ExternalLink size={10} />Live</a>}
                                        {!d.link && !d.live_url && <span className="text-xs text-text-muted">—</span>}
                                      </div>
                                    </td>
                                    {isAdmin && (
                                      <td className="px-5 py-2.5" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center gap-1">
                                          <button onClick={() => openDelForm(d)} className="text-text-muted hover:text-accent"><Pencil size={12} /></button>
                                          <button onClick={() => deleteDel(d.id)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                                {(isEmployee ? plan.deliverables.filter(d => d.assigned_to === user?.id) : plan.deliverables).length === 0 && (
                                  <tr><td colSpan={isAdmin ? 7 : isEmployee ? 5 : 6} className="px-5 py-6 text-center text-text-muted text-sm">{isEmployee ? 'No tasks assigned to you' : 'No deliverables yet'}</td></tr>
                                )}
                              </tbody>
                            </table>
                            {isAdmin && (
                              <div className="px-5 py-2.5 border-t border-border">
                                <button onClick={() => openDelForm(undefined, plan.id)} className="flex items-center gap-1 text-xs text-accent hover:underline"><Plus size={12} /> Add Deliverable</button>
                              </div>
                            )}

                            {/* Reports section */}
                            <div className="px-5 py-3 border-t border-border bg-bg-secondary/30">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-text-muted flex items-center gap-1"><FileText size={12} /> Reports</span>
                                {(isAdmin || isEmployee) && (
                                  <button onClick={() => { setUploadPlanId(plan.id); setUploadTitle(`${plan.month_display} Report`) }} className="flex items-center gap-1 text-xs text-accent hover:underline">
                                    <Upload size={11} /> Upload Report
                                  </button>
                                )}
                              </div>
                              {plan.reports && plan.reports.length > 0 ? (
                                <div className="space-y-1.5">
                                  {plan.reports.map(r => (
                                    <div key={r.id} className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg text-sm">
                                      <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-red-500" />
                                        <span className="font-medium">{r.title}</span>
                                        <span className="text-xs text-text-muted">by {r.uploaded_by_name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent hover:underline">
                                          <Download size={11} /> Download
                                        </a>
                                        {isAdmin && (
                                          <button onClick={() => deleteReport(r.id)} className="text-red-400 hover:text-red-600"><Trash2 size={11} /></button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-text-muted">No reports uploaded yet</p>
                              )}
                            </div>

                            {/* Performance Metrics section */}
                            {isAdmin && (() => {
                              const gbp = gbpByMonth[plan.month]
                              const ga4 = ga4ByMonth[plan.month]
                              const kws = kwByMonth[plan.month] || []
                              const hasData = gbp || ga4 || kws.length > 0
                              const tab = metricsTab[plan.id] || 'gbp'
                              return (
                                <div className="px-5 py-3 border-t border-border bg-gradient-to-r from-blue-50/30 to-green-50/30">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-text-muted flex items-center gap-1"><BarChart3 size={12} /> Performance Metrics</span>
                                    <Link href="/dashboard/reports" className="text-xs text-accent hover:underline">
                                      {hasData ? 'Edit in Reports →' : '+ Add metrics in Reports →'}
                                    </Link>
                                  </div>

                                  {hasData && (
                                    <>
                                      {/* Mini tabs */}
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

                                      {/* GBP metrics inline */}
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
                                          {gbp.notes && <p className="text-xs text-text-muted mt-2">{gbp.notes}</p>}
                                        </div>
                                      )}
                                      {tab === 'gbp' && !gbp && <p className="text-xs text-text-muted">No GBP data for this month</p>}

                                      {/* GA4 metrics inline */}
                                      {tab === 'ga4' && ga4 && (
                                        <div>
                                          <div className="grid grid-cols-4 gap-2 mb-2">
                                            <div className="bg-white rounded-lg p-2 text-center border border-border">
                                              <p className="text-lg font-bold">{ga4.active_users}</p>
                                              <p className="text-[10px] text-text-muted">Active Users</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-2 text-center border border-border">
                                              <p className="text-lg font-bold">{ga4.new_users}</p>
                                              <p className="text-[10px] text-text-muted">New Users</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-2 text-center border border-border">
                                              <p className="text-lg font-bold">{ga4.total_sessions}</p>
                                              <p className="text-[10px] text-text-muted">Sessions</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-2 text-center border border-border">
                                              <p className="text-lg font-bold">{ga4.avg_engagement_time_sec}s</p>
                                              <p className="text-[10px] text-text-muted">Avg Engagement</p>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-5 gap-2 mb-2">
                                            {[
                                              { label: 'Page Views', val: ga4.page_views },
                                              { label: 'Phone', val: ga4.phone_clicks },
                                              { label: 'Estimates', val: ga4.estimate_requests },
                                              { label: 'WhatsApp', val: ga4.whatsapp_clicks },
                                              { label: 'Email', val: ga4.email_clicks },
                                            ].map(e => (
                                              <div key={e.label} className="bg-white rounded-lg p-2 text-center border border-border">
                                                <p className="text-sm font-bold">{e.val}</p>
                                                <p className="text-[10px] text-text-muted">{e.label}</p>
                                              </div>
                                            ))}
                                          </div>
                                          {ga4.traffic_sources.length > 0 && (
                                            <div className="bg-white rounded-lg p-2 border border-border text-xs space-y-1">
                                              <p className="font-medium text-text-muted">Top Traffic Sources</p>
                                              {ga4.traffic_sources.slice(0, 5).map((s, i) => (
                                                <div key={i} className="flex justify-between"><span>{s.source}</span><span className="font-medium">{s.sessions} sessions</span></div>
                                              ))}
                                            </div>
                                          )}
                                          {ga4.notes && <p className="text-xs text-text-muted mt-2">{ga4.notes}</p>}
                                        </div>
                                      )}
                                      {tab === 'ga4' && !ga4 && <p className="text-xs text-text-muted">No GA4 data for this month</p>}

                                      {/* Keywords inline */}
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
                                    </>
                                  )}

                                  {!hasData && <p className="text-xs text-text-muted">No metrics recorded yet. Add data in Reports to see results here.</p>}
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {isAdmin && (
                    <div className="px-5 py-2.5 border-t border-border">
                      <button onClick={() => setShowAddPlan(service.id)} className="flex items-center gap-1 text-xs text-accent hover:underline"><Plus size={12} /> Add Month</button>
                    </div>
                  )}

                  {service.monthly_plans.length === 0 && (
                    <div className="px-5 py-6 text-center text-text-muted text-sm">No plans yet.</div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {project.services.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-8 text-center text-text-muted">No services yet.</div>
        )}
      </div>

      {/* ── Edit / Add Deliverable Modal ── */}
      <Modal open={editDel !== null || showAddDel !== null} onClose={() => { setEditDel(null); setShowAddDel(null) }} title={editDel ? (isEmployee ? 'Update Task' : 'Edit Deliverable') : 'Add Deliverable'} wide>
        <form onSubmit={saveDel} className="space-y-4">
          {/* Employee: simplified form — status, description, links, notes only */}
          {isEmployee ? (
            <>
              <div className="bg-bg-secondary/50 rounded-lg p-4">
                <h3 className="font-semibold text-sm">{delForm.title}</h3>
                <p className="text-xs text-text-muted mt-1">
                  {CATEGORIES.find(c => c.value === delForm.category)?.label}
                  {delForm.target_keyword && <> · <span className="italic">{delForm.target_keyword}</span></>}
                  {delForm.due_date && <> · Due: {delForm.due_date}</>}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
                <select value={delForm.status} onChange={e => setDelForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Description / Work Notes</label>
                <textarea value={delForm.description} onChange={e => setDelForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-24" placeholder="Add details about your work..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Draft / Folder Link</label>
                  <input value={delForm.link} onChange={e => setDelForm(f => ({ ...f, link: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Google Drive, Figma, etc." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Live URL</label>
                  <input value={delForm.live_url} onChange={e => setDelForm(f => ({ ...f, live_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Published page URL" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Notes</label>
                <textarea value={delForm.notes} onChange={e => setDelForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-16" placeholder="Any additional notes..." />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Category</label>
                  <select value={delForm.category} onChange={e => setDelForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
                  <select value={delForm.status} onChange={e => setDelForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Title *</label>
                <input value={delForm.title} onChange={e => setDelForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                <textarea value={delForm.description} onChange={e => setDelForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-16" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Target Keyword</label>
                  <input value={delForm.target_keyword} onChange={e => setDelForm(f => ({ ...f, target_keyword: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Assigned To</label>
                  <select value={delForm.assigned_to} onChange={e => setDelForm(f => ({ ...f, assigned_to: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                    <option value="">Unassigned</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Start Date</label>
                  <input type="date" value={delForm.start_date} onChange={e => setDelForm(f => ({ ...f, start_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Due Date</label>
                  <input type="date" value={delForm.due_date} onChange={e => setDelForm(f => ({ ...f, due_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Completed Date</label>
                  <input type="date" value={delForm.completed_date} onChange={e => setDelForm(f => ({ ...f, completed_date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Draft / Folder Link</label>
                  <input value={delForm.link} onChange={e => setDelForm(f => ({ ...f, link: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Google Drive, Figma, etc." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Live URL</label>
                  <input value={delForm.live_url} onChange={e => setDelForm(f => ({ ...f, live_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Published page URL" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Frequency</label>
                  <select value={delForm.frequency} onChange={e => setDelForm(f => ({ ...f, frequency: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                    <option value="once">Once</option><option value="daily">Daily</option><option value="weekly">Weekly</option>
                    <option value="bi_weekly">Bi-Weekly</option><option value="monthly">Monthly</option>
                    <option value="ongoing">Ongoing</option><option value="as_needed">As Needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Quantity</label>
                  <input type="number" value={delForm.quantity} onChange={e => setDelForm(f => ({ ...f, quantity: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" min="1" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Notes</label>
                <textarea value={delForm.notes} onChange={e => setDelForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-16" />
              </div>
            </>
          )}
          {delError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{delError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setEditDel(null); setShowAddDel(null); setDelError('') }} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">{editDel ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      {/* ── Add Service Modal ── */}
      <Modal open={showAddService} onClose={() => setShowAddService(false)} title="Add Service / Package" wide>
        <form onSubmit={addService} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Service Name *</label>
            <input value={serviceForm.name} onChange={e => setServiceForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder='e.g. "Premium Local SEO", "Website Build"' required />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
            <textarea value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-16" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Monthly Price (€)</label>
              <input type="number" step="0.01" value={serviceForm.monthly_price} onChange={e => setServiceForm(f => ({ ...f, monthly_price: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Leave empty for one-time" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Template</label>
              <select value={serviceForm.template_id} onChange={e => setServiceForm(f => ({ ...f, template_id: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">No template</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          {serviceForm.template_id && <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">Deliverables will be auto-generated from this template.</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddService(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      {/* ── Add Monthly Plan Modal ── */}
      <Modal open={showAddPlan !== null} onClose={() => setShowAddPlan(null)} title="Add Monthly Plan">
        <form onSubmit={addPlan} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Month *</label>
            <input type="month" value={planForm.month} onChange={e => setPlanForm(f => ({ ...f, month: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Template</label>
            <select value={planForm.template_id} onChange={e => setPlanForm(f => ({ ...f, template_id: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
              <option value="">Empty plan</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          {planForm.template_id && (
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Default Assignee</label>
              <select value={planForm.assigned_to} onChange={e => setPlanForm(f => ({ ...f, assigned_to: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">Unassigned</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>)}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddPlan(null)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      {/* ── Upload Report Modal ── */}
      <Modal open={uploadPlanId !== null} onClose={() => setUploadPlanId(null)} title="Upload Report">
        <form onSubmit={uploadReport} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Report Title</label>
            <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. March 2026 SEO Report" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">PDF File *</label>
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg" className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setUploadPlanId(null)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Upload</button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Project Details Modal ── */}
      <Modal open={showEditProject} onClose={() => setShowEditProject(false)} title="Edit Project Details" wide>
        <form onSubmit={saveProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Project Name *</label>
            <input value={projForm.name} onChange={e => setProjForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Business Phone (NAP)</label>
              <input value={projForm.business_phone} onChange={e => setProjForm(f => ({ ...f, business_phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Business Email (NAP)</label>
              <input type="email" value={projForm.business_email} onChange={e => setProjForm(f => ({ ...f, business_email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Business Address (NAP)</label>
            <input value={projForm.business_address} onChange={e => setProjForm(f => ({ ...f, business_address: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Website URL</label>
              <input value={projForm.website_url} onChange={e => setProjForm(f => ({ ...f, website_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Business Hours</label>
              <input value={projForm.business_hours} onChange={e => setProjForm(f => ({ ...f, business_hours: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Mon-Fri 8AM-6PM, Sat 9AM-2PM" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Service Areas (comma-separated)</label>
            <input value={projForm.service_areas} onChange={e => setProjForm(f => ({ ...f, service_areas: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Jacksonville FL, Orange Park FL, St. Augustine FL" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Google Business URL</label>
              <input value={projForm.google_business_url} onChange={e => setProjForm(f => ({ ...f, google_business_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Facebook URL</label>
              <input value={projForm.facebook_url} onChange={e => setProjForm(f => ({ ...f, facebook_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Instagram URL</label>
              <input value={projForm.instagram_url} onChange={e => setProjForm(f => ({ ...f, instagram_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Google Drive URL</label>
              <input value={projForm.google_drive_url} onChange={e => setProjForm(f => ({ ...f, google_drive_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Internal drive folder link" />
            </div>
          </div>

          <hr className="border-border" />
          <h4 className="text-sm font-semibold text-text-secondary">Business Intelligence</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Industry</label>
              <input value={projForm.industry} onChange={e => setProjForm(f => ({ ...f, industry: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. Waste Management, Roofing" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">NAP Consistency Status</label>
              <input value={projForm.nap_status} onChange={e => setProjForm(f => ({ ...f, nap_status: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. High, Cleaning in progress" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Target Audience (comma-separated)</label>
            <input value={projForm.target_audience} onChange={e => setProjForm(f => ({ ...f, target_audience: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="General Contractors, Homeowners, Property Managers" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Marketing Channels (comma-separated)</label>
            <input value={projForm.marketing_channels} onChange={e => setProjForm(f => ({ ...f, marketing_channels: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="GMB, Facebook Ads, Citations, Referral Partnerships" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Unique Selling Points (one per line)</label>
            <textarea value={projForm.usps} onChange={e => setProjForm(f => ({ ...f, usps: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20" placeholder={"Driveway Friendly: Use of protective boards\nSame-day or next-day delivery\nWeekend Availability"} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Competitors (one per line, optionally: Name — Notes)</label>
            <textarea value={projForm.competitors} onChange={e => setProjForm(f => ({ ...f, competitors: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20" placeholder={"Bin There Dump That — Jacksonville franchise\nDumpster Dudez\nWaste Pro"} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Notes</label>
            <textarea value={projForm.notes} onChange={e => setProjForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-16" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEditProject(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>

      {/* ── Catalog Item Modal ── */}
      <Modal open={showCatalogModal} onClose={() => setShowCatalogModal(false)} title={editCatalog ? 'Edit Catalog Item' : 'Add Product / Service'} wide>
        <form onSubmit={saveCatalog} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Type</label>
              <select value={catalogForm.item_type} onChange={e => setCatalogForm(f => ({ ...f, item_type: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Name *</label>
              <input value={catalogForm.name} onChange={e => setCatalogForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder='e.g. "10 Yard Dumpster"' required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
            <textarea value={catalogForm.description} onChange={e => setCatalogForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-16" placeholder="What this product/service includes" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Price ($)</label>
              <input type="number" step="0.01" value={catalogForm.price} onChange={e => setCatalogForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Price Unit</label>
              <input value={catalogForm.price_unit} onChange={e => setCatalogForm(f => ({ ...f, price_unit: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="per rental, per sqft, flat rate" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Duration (days)</label>
              <input type="number" value={catalogForm.duration_days} onChange={e => setCatalogForm(f => ({ ...f, duration_days: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. 7" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Specifications (one per line, key: value)</label>
            <textarea value={catalogForm.specifications} onChange={e => setCatalogForm(f => ({ ...f, specifications: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20 font-mono" placeholder={'capacity: 2 tons\ndimensions: 12x8x4 ft\nweight_limit: 4000 lbs'} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCatalogModal(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">{editCatalog ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
