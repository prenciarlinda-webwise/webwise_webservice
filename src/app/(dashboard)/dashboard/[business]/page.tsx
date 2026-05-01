'use client'

import { useEffect, useState, useMemo, use } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import {
  ArrowRight, Plus, MapPin, Globe, Phone, Mail, ExternalLink, Edit2,
  Trash2, ChevronDown, ChevronRight,
} from 'lucide-react'

interface Business {
  id: number
  slug: string
  name: string
  client: number
  client_name?: string
  client_slug?: string
  business_phone: string
  business_email: string
  business_address: string
  city: string
  state: string
  zip_code: string
  country: string
  website_url: string
  domain: string
  business_hours: string
  google_business_url: string
  google_business_name: string
  google_place_id: string
  google_cid: string
  facebook_url: string
  instagram_url: string
  industry: string
  service_areas: string[]
  status: string
  notes: string
  is_seo_tracked: boolean
  catalog?: CatalogItem[]
  contract_start_date: string | null
  contract_end_date: string | null
  monthly_budget_usd: string | null
}

interface CatalogItem {
  id: number
  business: number
  item_type: 'product' | 'service'
  name: string
  description: string
  price: string | null
  price_unit: string
  duration_days: number | null
  specifications: Record<string, unknown>
  sort_order: number
}

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
  created_at: string
}

interface RankingsLatest {
  summary: {
    total_keywords: number
    desktop: { avg_rank: number | null; found: number; in_top_10: number }
    mobile: { avg_rank: number | null; found: number; in_top_10: number }
    local_pack: { avg_rank: number | null; found: number; in_top_10: number }
    local_finder: { avg_rank: number | null; found: number; in_top_10: number }
  }
  keywords: Array<{ keyword_id: number; last_checked: string | null }>
}

interface GBPMetrics {
  id: number
  month: string
  calls: number
  direction_clicks: number
  website_clicks: number
  total_interactions: number
}

interface GA4Metrics {
  id: number
  month: string
  active_users: number
  total_sessions: number
  estimate_requests: number
  email_clicks: number
  phone_clicks: number
}

const ENGAGEMENT_KINDS = [
  { value: 'website_build', label: 'Website Build' },
  { value: 'local_seo', label: 'Local SEO' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'content', label: 'Content' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'one_off', label: 'One-off' },
]

export default function BusinessDetailPage({ params }: { params: Promise<{ business: string }> }) {
  const { business: businessSlug } = use(params)
  const { user } = useAuth()
  const [business, setBusiness] = useState<Business | null>(null)
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [rankings, setRankings] = useState<RankingsLatest | null>(null)
  const [gbp, setGbp] = useState<GBPMetrics | null>(null)
  const [ga4, setGa4] = useState<GA4Metrics | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [showAddEngagement, setShowAddEngagement] = useState(false)
  const [engForm, setEngForm] = useState({ kind: 'local_seo', start_date: '', monthly_budget_usd: '', notes: '' })
  const [showAddCatalog, setShowAddCatalog] = useState(false)
  const [catalogForm, setCatalogForm] = useState<{ id?: number; item_type: 'product' | 'service'; name: string; description: string; price: string; price_unit: string }>({ item_type: 'service', name: '', description: '', price: '', price_unit: '' })
  const [editBusinessOpen, setEditBusinessOpen] = useState(false)
  const [bizForm, setBizForm] = useState<Partial<Business>>({})

  const isPrivileged = user?.role === 'admin' || user?.is_supervisor === true
  const canEditBusiness = isPrivileged || user?.role === 'client'

  const reload = async () => {
    try {
      const b = await api.get<Business>(`/clients/projects/by-slug/${businessSlug}/`)
      setBusiness(b)
      const engs = await api.get<{ results: Engagement[] } | Engagement[]>(`/clients/engagements/?business=${businessSlug}`)
      const engList = Array.isArray(engs) ? engs : (engs.results ?? [])
      setEngagements(engList)
      if (isPrivileged) {
        try {
          const r = await api.get<RankingsLatest>(`/seo/businesses/${businessSlug}/rankings/latest/`)
          setRankings(r)
        } catch {
          setRankings(null)
        }
        try {
          const g = await api.get<{ results: GBPMetrics[] } | GBPMetrics[]>(`/reports/gbp/?business=${b.id}`)
          const list = Array.isArray(g) ? g : (g.results ?? [])
          setGbp(list[0] ?? null)
        } catch { setGbp(null) }
        try {
          const a = await api.get<{ results: GA4Metrics[] } | GA4Metrics[]>(`/reports/ga4/?business=${b.id}`)
          const list = Array.isArray(a) ? a : (a.results ?? [])
          setGa4(list[0] ?? null)
        } catch { setGa4(null) }
      }
    } catch (e) {
      console.error('Failed to load business:', e)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessSlug])

  const rankingSummary = useMemo(() => {
    if (!rankings?.summary) return null
    const fmt = (v: number | null | undefined) => v != null ? v.toFixed(1) : null
    return {
      desktop: fmt(rankings.summary.desktop.avg_rank),
      mobile: fmt(rankings.summary.mobile.avg_rank),
      pack: fmt(rankings.summary.local_pack.avg_rank),
      finder: fmt(rankings.summary.local_finder.avg_rank),
      tracked: rankings.summary.total_keywords,
      lastScan: (rankings.keywords ?? []).map(k => k.last_checked).filter(Boolean).sort().pop() ?? null,
    }
  }, [rankings])

  const activeEngagements = engagements.filter(e => e.status === 'active' || e.status === 'paused')
  const completedEngagements = engagements.filter(e => e.status === 'completed' || e.status === 'archived')

  const handleAddEngagement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return
    await api.post('/clients/engagements/', {
      business: business.id,
      kind: engForm.kind,
      start_date: engForm.start_date || null,
      monthly_budget_usd: engForm.monthly_budget_usd || null,
      notes: engForm.notes,
      status: 'active',
    })
    setShowAddEngagement(false)
    setEngForm({ kind: 'local_seo', start_date: '', monthly_budget_usd: '', notes: '' })
    reload()
  }

  const handleSaveCatalog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return
    const data = {
      business: business.id,
      item_type: catalogForm.item_type,
      name: catalogForm.name,
      description: catalogForm.description,
      price: catalogForm.price || null,
      price_unit: catalogForm.price_unit,
    }
    if (catalogForm.id) {
      await api.patch(`/clients/catalog/${catalogForm.id}/`, data)
    } else {
      await api.post('/clients/catalog/', data)
    }
    setShowAddCatalog(false)
    setCatalogForm({ item_type: 'service', name: '', description: '', price: '', price_unit: '' })
    reload()
  }

  const handleDeleteCatalog = async (id: number) => {
    if (!confirm('Delete this catalog item?')) return
    await api.delete(`/clients/catalog/${id}/`)
    reload()
  }

  const openEditBusiness = () => {
    if (!business) return
    setBizForm({ ...business })
    setEditBusinessOpen(true)
  }

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return
    await api.patch(`/clients/projects/${business.id}/`, bizForm)
    setEditBusinessOpen(false)
    reload()
  }

  if (!business) {
    return <div className="py-20 text-center text-text-muted">Loading…</div>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={business.name}
        description={
          <span className="flex items-center gap-3 text-sm">
            {business.domain && (
              <a href={business.website_url || `https://${business.domain}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline">
                <Globe size={14} /> {business.domain}
              </a>
            )}
            {business.google_business_url && (
              <a href={business.google_business_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline">
                <MapPin size={14} /> Google Business
              </a>
            )}
            <StatusBadge status={business.status} />
          </span>
        }
        action={
          <Link
            href="/dashboard/clients"
            className="text-sm text-text-muted hover:text-text-primary"
          >
            ← Back to clients
          </Link>
        }
      />

      {/* === Events summary (supervisor/admin only) === */}
      {isPrivileged && (
        <section className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Events summary</h2>
            <Link
              href={`/dashboard/${business.slug}/events`}
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View details <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard label="Calls (GBP)" value={gbp?.calls} />
            <SummaryCard label="Directions (GBP)" value={gbp?.direction_clicks} />
            <SummaryCard label="Website clicks (GBP)" value={gbp?.website_clicks} />
            <SummaryCard label="Form fills (GA4)" value={ga4?.estimate_requests} />
          </div>
          {!gbp && !ga4 && (
            <p className="text-sm text-text-muted mt-4">No events recorded yet. Add monthly metrics from the Events page.</p>
          )}
        </section>
      )}

      {/* === Rankings summary (supervisor/admin only) === */}
      {isPrivileged && (
        <section className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Rankings summary</h2>
            <Link
              href={`/dashboard/${business.slug}/rankings`}
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View details <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard label="Desktop avg" value={rankingSummary?.desktop} />
            <SummaryCard label="Mobile avg" value={rankingSummary?.mobile} />
            <SummaryCard label="Local Pack avg" value={rankingSummary?.pack} />
            <SummaryCard label="Local Finder avg" value={rankingSummary?.finder} />
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-text-muted">
            <span>{rankingSummary?.tracked ?? 0} tracked keywords</span>
            {rankingSummary?.lastScan && (
              <span>Last scan: {new Date(rankingSummary.lastScan).toLocaleDateString()}</span>
            )}
          </div>
        </section>
      )}

      {/* === Active engagements === */}
      <section className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active projects</h2>
          {isPrivileged && (
            <button
              onClick={() => setShowAddEngagement(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"
            >
              <Plus size={14} /> New project
            </button>
          )}
        </div>
        {activeEngagements.length === 0 ? (
          <p className="text-sm text-text-muted">No active projects.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeEngagements.map(e => (
              <Link
                key={e.id}
                href={`/dashboard/${business.slug}/${e.slug}`}
                className="block p-4 border border-border rounded-lg hover:border-accent/50 hover:bg-bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{e.name || e.kind_display}</h3>
                    <p className="text-xs text-text-muted mt-1">
                      {e.services_count} service{e.services_count !== 1 ? 's' : ''}
                      {e.start_date && ` · started ${new Date(e.start_date).toLocaleDateString()}`}
                    </p>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {completedEngagements.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <button
              onClick={() => setShowCompleted(s => !s)}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              {showCompleted ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Completed projects ({completedEngagements.length})
            </button>
            {showCompleted && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {completedEngagements.map(e => (
                  <Link
                    key={e.id}
                    href={`/dashboard/${business.slug}/${e.slug}`}
                    className="block p-4 border border-border rounded-lg opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{e.name || e.kind_display}</h3>
                        <p className="text-xs text-text-muted mt-1">
                          {e.start_date} → {e.end_date ?? '—'}
                        </p>
                      </div>
                      <StatusBadge status={e.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* === Business reference === */}
      <section className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Business reference</h2>
          {canEditBusiness && (
            <button
              onClick={openEditBusiness}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-bg-secondary"
            >
              <Edit2 size={14} /> Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <FieldRow icon={<Phone size={14} />} label="Phone" value={business.business_phone} />
          <FieldRow icon={<Mail size={14} />} label="Email" value={business.business_email} />
          <FieldRow icon={<MapPin size={14} />} label="Address" value={[business.business_address, business.city, business.state, business.zip_code].filter(Boolean).join(', ')} />
          <FieldRow label="Hours" value={business.business_hours} />
          <FieldRow label="Industry" value={business.industry} />
          <FieldRow label="Country" value={business.country} />
          {business.google_business_name && <FieldRow label="GBP name" value={business.google_business_name} />}
          {business.google_place_id && <FieldRow label="GBP place ID" value={business.google_place_id} />}
        </div>
      </section>

      {/* === Catalog (Services & products) === */}
      <section className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Services &amp; products</h2>
          {canEditBusiness && (
            <button
              onClick={() => { setCatalogForm({ item_type: 'service', name: '', description: '', price: '', price_unit: '' }); setShowAddCatalog(true) }}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"
            >
              <Plus size={14} /> Add item
            </button>
          )}
        </div>
        {(business.catalog ?? []).length === 0 ? (
          <p className="text-sm text-text-muted">No catalog items yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(business.catalog ?? []).map(item => (
              <div key={item.id} className="p-4 border border-border rounded-lg flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-bg-secondary text-text-muted">{item.item_type}</span>
                  </div>
                  {item.description && <p className="text-xs text-text-muted mt-1">{item.description}</p>}
                  {item.price && <p className="text-xs text-text-secondary mt-1">${item.price} {item.price_unit && `/ ${item.price_unit}`}</p>}
                </div>
                {canEditBusiness && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => { setCatalogForm({ id: item.id, item_type: item.item_type, name: item.name, description: item.description, price: item.price ?? '', price_unit: item.price_unit }); setShowAddCatalog(true) }}
                      className="text-text-muted hover:text-text-primary"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDeleteCatalog(item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* === Modals === */}
      <Modal open={showAddEngagement} onClose={() => setShowAddEngagement(false)} title="New project">
        <form onSubmit={handleAddEngagement} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kind *</label>
            <select
              value={engForm.kind}
              onChange={e => setEngForm(f => ({ ...f, kind: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              required
            >
              {ENGAGEMENT_KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start date</label>
            <input
              type="date"
              value={engForm.start_date}
              onChange={e => setEngForm(f => ({ ...f, start_date: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly budget (USD)</label>
            <input
              type="number"
              step="0.01"
              value={engForm.monthly_budget_usd}
              onChange={e => setEngForm(f => ({ ...f, monthly_budget_usd: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              rows={3}
              value={engForm.notes}
              onChange={e => setEngForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddEngagement(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      <Modal open={showAddCatalog} onClose={() => setShowAddCatalog(false)} title={catalogForm.id ? 'Edit catalog item' : 'Add catalog item'}>
        <form onSubmit={handleSaveCatalog} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={catalogForm.item_type}
                onChange={e => setCatalogForm(f => ({ ...f, item_type: e.target.value as 'product' | 'service' }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              >
                <option value="service">Service</option>
                <option value="product">Product</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                value={catalogForm.name}
                onChange={e => setCatalogForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={3}
                value={catalogForm.description}
                onChange={e => setCatalogForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={catalogForm.price}
                onChange={e => setCatalogForm(f => ({ ...f, price: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price unit</label>
              <input
                placeholder="per service / per sqft / etc."
                value={catalogForm.price_unit}
                onChange={e => setCatalogForm(f => ({ ...f, price_unit: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddCatalog(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>

      <Modal open={editBusinessOpen} onClose={() => setEditBusinessOpen(false)} title="Edit business reference" wide>
        <form onSubmit={handleSaveBusiness} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name *" value={bizForm.name ?? ''} onChange={v => setBizForm(f => ({ ...f, name: v }))} required />
            <Input label="Phone" value={bizForm.business_phone ?? ''} onChange={v => setBizForm(f => ({ ...f, business_phone: v }))} />
            <Input label="Email" value={bizForm.business_email ?? ''} onChange={v => setBizForm(f => ({ ...f, business_email: v }))} />
            <Input label="Website URL" value={bizForm.website_url ?? ''} onChange={v => setBizForm(f => ({ ...f, website_url: v }))} />
            <Input label="Address" value={bizForm.business_address ?? ''} onChange={v => setBizForm(f => ({ ...f, business_address: v }))} />
            <Input label="City" value={bizForm.city ?? ''} onChange={v => setBizForm(f => ({ ...f, city: v }))} />
            <Input label="State" value={bizForm.state ?? ''} onChange={v => setBizForm(f => ({ ...f, state: v }))} />
            <Input label="ZIP" value={bizForm.zip_code ?? ''} onChange={v => setBizForm(f => ({ ...f, zip_code: v }))} />
            <Input label="Industry" value={bizForm.industry ?? ''} onChange={v => setBizForm(f => ({ ...f, industry: v }))} />
            <Input label="Hours" value={bizForm.business_hours ?? ''} onChange={v => setBizForm(f => ({ ...f, business_hours: v }))} />
            <Input label="GBP listing URL" value={bizForm.google_business_url ?? ''} onChange={v => setBizForm(f => ({ ...f, google_business_url: v }))} />
            <Input label="GBP place ID" value={bizForm.google_place_id ?? ''} onChange={v => setBizForm(f => ({ ...f, google_place_id: v }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditBusinessOpen(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number | string | null | undefined }) {
  return (
    <div className="p-4 border border-border rounded-lg">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value ?? '—'}</p>
    </div>
  )
}

function FieldRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string | undefined | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      {icon && <span className="text-text-muted shrink-0 mt-0.5">{icon}</span>}
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
        required={required}
      />
    </div>
  )
}
