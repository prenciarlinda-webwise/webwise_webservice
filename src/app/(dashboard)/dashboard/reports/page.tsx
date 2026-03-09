'use client'

import { useEffect, useState, useRef } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import Modal from '@/components/dashboard/Modal'
import { Plus, Pencil, Trash2, TrendingUp, BarChart3, Search, FileText } from 'lucide-react'

interface Report { id: number; client: number; client_name: string; title: string; pdf: string; uploaded_by_name: string; created_at: string }
interface Client { id: number; business_name: string }
interface Project { id: number; name: string; client: number }

interface GBPMetrics {
  id: number; project: number; project_name: string; month: string
  calls: number; chat_clicks: number; bookings: number; direction_clicks: number; website_clicks: number
  total_interactions: number; interactions_change_pct: string | null
  profile_views: number; profile_views_change_pct: string | null
  search_desktop_pct: string; search_mobile_pct: string; maps_desktop_pct: string; maps_mobile_pct: string
  photo_count: number; review_count: number; review_avg_rating: string; new_reviews: number
  posts_published: number; notes: string
}

interface GA4Metrics {
  id: number; project: number; project_name: string; month: string
  active_users: number; new_users: number; total_sessions: number; avg_engagement_time_sec: number
  total_events: number; page_views: number; scrolls: number
  phone_clicks: number; estimate_requests: number; whatsapp_clicks: number; email_clicks: number
  direction_clicks: number; high_intent_pages: number; financing_interest: number
  traffic_sources: { source: string; sessions: number; key_events: number }[]
  country_breakdown: { country: string; users: number; pct_change: number | null }[]
  top_pages: { page: string; views: number }[]
  page_speed: { lcp?: number; inp?: number; cls?: number; mobile_score?: number }
  notes: string
}

interface SearchTerm {
  id: number; project: number; project_name: string; month: string
  source: string; keyword: string; impressions: number; clicks: number
  avg_position: string | null; local_pack: boolean; notes: string
}

type Section = 'reports' | 'gbp' | 'ga4' | 'keywords'

const defaultGBP = { project: '', month: '', calls: 0, chat_clicks: 0, bookings: 0, direction_clicks: 0, website_clicks: 0, total_interactions: 0, interactions_change_pct: '', profile_views: 0, profile_views_change_pct: '', search_desktop_pct: '0', search_mobile_pct: '0', maps_desktop_pct: '0', maps_mobile_pct: '0', photo_count: 0, review_count: 0, review_avg_rating: '0', new_reviews: 0, posts_published: 0, notes: '' }
const defaultGA4 = { project: '', month: '', active_users: 0, new_users: 0, total_sessions: 0, avg_engagement_time_sec: 0, total_events: 0, page_views: 0, scrolls: 0, phone_clicks: 0, estimate_requests: 0, whatsapp_clicks: 0, email_clicks: 0, direction_clicks: 0, high_intent_pages: 0, financing_interest: 0, traffic_sources: '[]', country_breakdown: '[]', top_pages: '[]', page_speed: '{}', notes: '' }
const defaultKW = { project: '', month: '', source: 'gbp', keyword: '', impressions: 0, clicks: 0, avg_position: '', local_pack: false, notes: '' }

export default function ReportsPage() {
  const { user } = useAuth()
  const [section, setSection] = useState<Section>('gbp')
  const [reports, setReports] = useState<Report[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [gbpList, setGbpList] = useState<GBPMetrics[]>([])
  const [ga4List, setGa4List] = useState<GA4Metrics[]>([])
  const [kwList, setKwList] = useState<SearchTerm[]>([])
  const [filterProject, setFilterProject] = useState('')

  // Modals
  const [showUpload, setShowUpload] = useState(false)
  const [uploadClient, setUploadClient] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [showGBP, setShowGBP] = useState(false)
  const [gbpForm, setGbpForm] = useState<Record<string, unknown>>({ ...defaultGBP })
  const [editGBPId, setEditGBPId] = useState<number | null>(null)

  const [showGA4, setShowGA4] = useState(false)
  const [ga4Form, setGa4Form] = useState<Record<string, unknown>>({ ...defaultGA4 })
  const [editGA4Id, setEditGA4Id] = useState<number | null>(null)

  const [showKW, setShowKW] = useState(false)
  const [kwForm, setKwForm] = useState<Record<string, unknown>>({ ...defaultKW })
  const [editKWId, setEditKWId] = useState<number | null>(null)

  const reload = () => {
    const pq = filterProject ? `?project=${filterProject}` : ''
    api.get<{ results: Report[] }>('/reports/').then(d => setReports(d.results)).catch(() => {})
    api.get<{ results: GBPMetrics[] }>(`/reports/gbp/${pq}`).then(d => setGbpList(d.results)).catch(() => {})
    api.get<{ results: GA4Metrics[] }>(`/reports/ga4/${pq}`).then(d => setGa4List(d.results)).catch(() => {})
    api.get<{ results: SearchTerm[] }>(`/reports/search-terms/${pq}`).then(d => setKwList(d.results)).catch(() => {})
  }

  useEffect(() => {
    reload()
    if (user?.role === 'admin') {
      api.get<{ results: Client[] }>('/clients/').then(d => setClients(d.results)).catch(() => {})
      api.get<{ results: Project[] }>('/clients/projects/').then(d => setProjects(d.results)).catch(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filterProject])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file || !uploadClient || !uploadTitle) return
    const form = new FormData()
    form.append('client', uploadClient)
    form.append('title', uploadTitle)
    form.append('pdf', file)
    await api.post('/reports/', form)
    reload()
    setShowUpload(false)
    setUploadTitle('')
    setUploadClient('')
  }

  // GBP CRUD
  const saveGBP = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...gbpForm, interactions_change_pct: gbpForm.interactions_change_pct || null, profile_views_change_pct: gbpForm.profile_views_change_pct || null }
    if (editGBPId) await api.put(`/reports/gbp/${editGBPId}/`, data)
    else await api.post('/reports/gbp/', data)
    reload(); setShowGBP(false); setEditGBPId(null); setGbpForm({ ...defaultGBP })
  }
  const editGBP = (g: GBPMetrics) => { setGbpForm({ ...g }); setEditGBPId(g.id); setShowGBP(true) }
  const deleteGBP = async (id: number) => { if (confirm('Delete GBP metrics?')) { await api.delete(`/reports/gbp/${id}/`); reload() } }

  // GA4 CRUD
  const saveGA4 = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...ga4Form,
      traffic_sources: typeof ga4Form.traffic_sources === 'string' ? JSON.parse(ga4Form.traffic_sources as string) : ga4Form.traffic_sources,
      country_breakdown: typeof ga4Form.country_breakdown === 'string' ? JSON.parse(ga4Form.country_breakdown as string) : ga4Form.country_breakdown,
      top_pages: typeof ga4Form.top_pages === 'string' ? JSON.parse(ga4Form.top_pages as string) : ga4Form.top_pages,
      page_speed: typeof ga4Form.page_speed === 'string' ? JSON.parse(ga4Form.page_speed as string) : ga4Form.page_speed,
    }
    if (editGA4Id) await api.put(`/reports/ga4/${editGA4Id}/`, data)
    else await api.post('/reports/ga4/', data)
    reload(); setShowGA4(false); setEditGA4Id(null); setGa4Form({ ...defaultGA4 })
  }
  const editGA4 = (g: GA4Metrics) => {
    setGa4Form({ ...g, traffic_sources: JSON.stringify(g.traffic_sources, null, 2), country_breakdown: JSON.stringify(g.country_breakdown, null, 2), top_pages: JSON.stringify(g.top_pages, null, 2), page_speed: JSON.stringify(g.page_speed, null, 2) })
    setEditGA4Id(g.id); setShowGA4(true)
  }
  const deleteGA4 = async (id: number) => { if (confirm('Delete GA4 metrics?')) { await api.delete(`/reports/ga4/${id}/`); reload() } }

  // Search Terms CRUD
  const saveKW = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...kwForm, avg_position: kwForm.avg_position || null }
    if (editKWId) await api.put(`/reports/search-terms/${editKWId}/`, data)
    else await api.post('/reports/search-terms/', data)
    reload(); setShowKW(false); setEditKWId(null); setKwForm({ ...defaultKW })
  }
  const editKW = (k: SearchTerm) => { setKwForm({ ...k }); setEditKWId(k.id); setShowKW(true) }
  const deleteKW = async (id: number) => { if (confirm('Delete search term?')) { await api.delete(`/reports/search-terms/${id}/`); reload() } }

  const tabs: { key: Section; label: string; icon: React.ElementType }[] = [
    { key: 'gbp', label: 'GBP Metrics', icon: TrendingUp },
    { key: 'ga4', label: 'GA4 Analytics', icon: BarChart3 },
    { key: 'keywords', label: 'Search Terms', icon: Search },
    { key: 'reports', label: 'PDF Reports', icon: FileText },
  ]

  const inp = (label: string, key: string, form: Record<string, unknown>, setForm: (f: Record<string, unknown>) => void, type = 'number') => (
    <div>
      <label className="block text-xs font-medium mb-1 text-text-muted">{label}</label>
      <input type={type} value={String(form[key] ?? '')} onChange={e => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Track GBP, GA4, and keyword performance"
        action={
          user?.role === 'admin' && (
            <div className="flex gap-2">
              <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {section === 'reports' && <button onClick={() => setShowUpload(!showUpload)} className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">Upload PDF</button>}
              {section === 'gbp' && <button onClick={() => { setGbpForm({ ...defaultGBP }); setEditGBPId(null); setShowGBP(true) }} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Add GBP</button>}
              {section === 'ga4' && <button onClick={() => { setGa4Form({ ...defaultGA4 }); setEditGA4Id(null); setShowGA4(true) }} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Add GA4</button>}
              {section === 'keywords' && <button onClick={() => { setKwForm({ ...defaultKW }); setEditKWId(null); setShowKW(true) }} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Add Term</button>}
            </div>
          )
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-border p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setSection(t.key)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors flex-1 justify-center ${section === t.key ? 'bg-primary text-white' : 'text-text-secondary hover:bg-bg-secondary'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* GBP Metrics */}
      {section === 'gbp' && (
        <div className="space-y-4">
          {gbpList.map(g => (
            <div key={g.id} className="bg-white rounded-xl border border-border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{g.project_name} — {new Date(g.month + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                  {g.interactions_change_pct && <p className="text-xs text-green-600">+{g.interactions_change_pct}% interactions vs prior period</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => editGBP(g)} className="p-1.5 text-text-muted hover:text-accent"><Pencil size={14} /></button>
                  <button onClick={() => deleteGBP(g.id)} className="p-1.5 text-text-muted hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3 mb-4">
                <div className="bg-bg-secondary rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.calls}</p><p className="text-xs text-text-muted">Calls</p></div>
                <div className="bg-bg-secondary rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.chat_clicks}</p><p className="text-xs text-text-muted">Chat Clicks</p></div>
                <div className="bg-bg-secondary rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.bookings}</p><p className="text-xs text-text-muted">Bookings</p></div>
                <div className="bg-bg-secondary rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.direction_clicks}</p><p className="text-xs text-text-muted">Directions</p></div>
                <div className="bg-bg-secondary rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.website_clicks}</p><p className="text-xs text-text-muted">Website</p></div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="border border-border rounded-lg p-3 text-center"><p className="text-lg font-bold">{g.total_interactions}</p><p className="text-xs text-text-muted">Total Interactions</p></div>
                <div className="border border-border rounded-lg p-3 text-center"><p className="text-lg font-bold">{g.profile_views}</p><p className="text-xs text-text-muted">Profile Views</p></div>
                <div className="border border-border rounded-lg p-3 text-center"><p className="text-lg font-bold">{g.review_count} ({g.review_avg_rating}★)</p><p className="text-xs text-text-muted">Reviews ({g.new_reviews} new)</p></div>
                <div className="border border-border rounded-lg p-3 text-center"><p className="text-lg font-bold">{g.posts_published}</p><p className="text-xs text-text-muted">Posts Published</p></div>
              </div>
              {(Number(g.search_desktop_pct) > 0 || Number(g.maps_desktop_pct) > 0) && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-text-muted mb-2">Discovery Breakdown</p>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="flex justify-between"><span>Search Desktop</span><span className="font-medium">{g.search_desktop_pct}%</span></div>
                    <div className="flex justify-between"><span>Search Mobile</span><span className="font-medium">{g.search_mobile_pct}%</span></div>
                    <div className="flex justify-between"><span>Maps Desktop</span><span className="font-medium">{g.maps_desktop_pct}%</span></div>
                    <div className="flex justify-between"><span>Maps Mobile</span><span className="font-medium">{g.maps_mobile_pct}%</span></div>
                  </div>
                </div>
              )}
              {g.notes && <p className="mt-3 text-sm text-text-muted border-t border-border pt-3">{g.notes}</p>}
            </div>
          ))}
          {gbpList.length === 0 && <div className="bg-white rounded-xl border border-border p-12 text-center text-text-muted">No GBP metrics recorded yet</div>}
        </div>
      )}

      {/* GA4 Metrics */}
      {section === 'ga4' && (
        <div className="space-y-4">
          {ga4List.map(g => (
            <div key={g.id} className="bg-white rounded-xl border border-border p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold">{g.project_name} — {new Date(g.month + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <div className="flex gap-1">
                  <button onClick={() => editGA4(g)} className="p-1.5 text-text-muted hover:text-accent"><Pencil size={14} /></button>
                  <button onClick={() => deleteGA4(g.id)} className="p-1.5 text-text-muted hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.active_users}</p><p className="text-xs text-text-muted">Active Users</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.new_users}</p><p className="text-xs text-text-muted">New Users</p></div>
                <div className="bg-purple-50 rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.total_sessions}</p><p className="text-xs text-text-muted">Sessions</p></div>
                <div className="bg-orange-50 rounded-lg p-3 text-center"><p className="text-xl font-bold">{g.avg_engagement_time_sec}s</p><p className="text-xs text-text-muted">Avg Engagement</p></div>
              </div>
              <p className="text-xs font-medium text-text-muted mb-2">Events</p>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {[
                  { label: 'Page Views', val: g.page_views },
                  { label: 'Phone Clicks', val: g.phone_clicks },
                  { label: 'Estimate Requests', val: g.estimate_requests },
                  { label: 'WhatsApp', val: g.whatsapp_clicks },
                  { label: 'Email Clicks', val: g.email_clicks },
                  { label: 'Directions', val: g.direction_clicks },
                  { label: 'High Intent', val: g.high_intent_pages },
                  { label: 'Scrolls', val: g.scrolls },
                  { label: 'Financing', val: g.financing_interest },
                  { label: 'Total Events', val: g.total_events },
                ].map(e => (
                  <div key={e.label} className="border border-border rounded-lg p-2 text-center">
                    <p className="text-sm font-bold">{e.val}</p><p className="text-[10px] text-text-muted">{e.label}</p>
                  </div>
                ))}
              </div>
              {g.traffic_sources.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-text-muted mb-1">Traffic Sources</p>
                  <div className="text-sm space-y-1">
                    {g.traffic_sources.slice(0, 7).map((s, i) => (
                      <div key={i} className="flex justify-between"><span className="text-text-secondary">{s.source}</span><span className="font-medium">{s.sessions} sessions</span></div>
                    ))}
                  </div>
                </div>
              )}
              {g.country_breakdown.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-text-muted mb-1">Top Countries</p>
                  <div className="text-sm flex flex-wrap gap-2">
                    {g.country_breakdown.slice(0, 6).map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-bg-secondary rounded text-xs">{c.country}: {c.users} users</span>
                    ))}
                  </div>
                </div>
              )}
              {g.notes && <p className="text-sm text-text-muted border-t border-border pt-3 mt-3">{g.notes}</p>}
            </div>
          ))}
          {ga4List.length === 0 && <div className="bg-white rounded-xl border border-border p-12 text-center text-text-muted">No GA4 metrics recorded yet</div>}
        </div>
      )}

      {/* Search Terms / Keywords */}
      {section === 'keywords' && (
        <div className="bg-white rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-text-muted border-b border-border">
                <th className="px-4 py-3">Keyword</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Impressions</th>
                <th className="px-4 py-3">Clicks</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Local Pack</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {kwList.map(k => (
                <tr key={k.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/50">
                  <td className="px-4 py-3 text-sm font-medium">{k.keyword}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{k.project_name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{new Date(k.month + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-bg-secondary font-medium">{k.source.toUpperCase()}</span></td>
                  <td className="px-4 py-3 text-sm">{k.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{k.clicks}</td>
                  <td className="px-4 py-3 text-sm font-medium">{k.avg_position || '—'}</td>
                  <td className="px-4 py-3">{k.local_pack ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Yes</span> : <span className="text-xs text-text-muted">No</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => editKW(k)} className="p-1 text-text-muted hover:text-accent"><Pencil size={13} /></button>
                      <button onClick={() => deleteKW(k.id)} className="p-1 text-text-muted hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {kwList.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center text-text-muted">No search terms recorded yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* PDF Reports */}
      {section === 'reports' && (
        <>
          {showUpload && (
            <form onSubmit={handleUpload} className="bg-white rounded-xl border border-border p-6 mb-6 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Client</label>
                <select value={uploadClient} onChange={e => setUploadClient(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. March 2026 SEO Report" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">PDF</label>
                <input ref={fileRef} type="file" accept=".pdf" className="text-sm" required />
              </div>
              <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg">Upload</button>
            </form>
          )}
          <div className="bg-white rounded-xl border border-border">
            <table className="w-full">
              <thead><tr className="text-left text-xs text-text-muted border-b border-border"><th className="px-6 py-3">Title</th><th className="px-6 py-3">Client</th><th className="px-6 py-3">Uploaded By</th><th className="px-6 py-3">Date</th><th className="px-6 py-3"></th></tr></thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/50">
                    <td className="px-6 py-3 text-sm font-medium">{r.title}</td>
                    <td className="px-6 py-3 text-sm text-text-secondary">{r.client_name}</td>
                    <td className="px-6 py-3 text-sm text-text-secondary">{r.uploaded_by_name}</td>
                    <td className="px-6 py-3 text-sm text-text-secondary">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3"><a href={r.pdf} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">Download</a></td>
                  </tr>
                ))}
                {reports.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No reports yet</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* GBP Modal */}
      <Modal open={showGBP} onClose={() => setShowGBP(false)} title={editGBPId ? 'Edit GBP Metrics' : 'Add GBP Metrics'} wide>
        <form onSubmit={saveGBP} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Project *</label>
              <select value={String(gbpForm.project)} onChange={e => setGbpForm({ ...gbpForm, project: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
                <option value="">Select project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Month *</label>
              <input type="month" value={String(gbpForm.month).slice(0, 7)} onChange={e => setGbpForm({ ...gbpForm, month: e.target.value + '-01' })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Interactions</p>
          <div className="grid grid-cols-5 gap-3">
            {inp('Calls', 'calls', gbpForm, setGbpForm)}
            {inp('Chat Clicks', 'chat_clicks', gbpForm, setGbpForm)}
            {inp('Bookings', 'bookings', gbpForm, setGbpForm)}
            {inp('Directions', 'direction_clicks', gbpForm, setGbpForm)}
            {inp('Website Clicks', 'website_clicks', gbpForm, setGbpForm)}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {inp('Total Interactions', 'total_interactions', gbpForm, setGbpForm)}
            {inp('Change %', 'interactions_change_pct', gbpForm, setGbpForm, 'text')}
            {inp('Profile Views', 'profile_views', gbpForm, setGbpForm)}
            {inp('Views Change %', 'profile_views_change_pct', gbpForm, setGbpForm, 'text')}
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Discovery Breakdown (%)</p>
          <div className="grid grid-cols-4 gap-3">
            {inp('Search Desktop', 'search_desktop_pct', gbpForm, setGbpForm, 'text')}
            {inp('Search Mobile', 'search_mobile_pct', gbpForm, setGbpForm, 'text')}
            {inp('Maps Desktop', 'maps_desktop_pct', gbpForm, setGbpForm, 'text')}
            {inp('Maps Mobile', 'maps_mobile_pct', gbpForm, setGbpForm, 'text')}
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Reviews & Posts</p>
          <div className="grid grid-cols-5 gap-3">
            {inp('Photo Count', 'photo_count', gbpForm, setGbpForm)}
            {inp('Review Count', 'review_count', gbpForm, setGbpForm)}
            {inp('Avg Rating', 'review_avg_rating', gbpForm, setGbpForm, 'text')}
            {inp('New Reviews', 'new_reviews', gbpForm, setGbpForm)}
            {inp('Posts Published', 'posts_published', gbpForm, setGbpForm)}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-text-muted">Notes</label>
            <textarea rows={2} value={String(gbpForm.notes)} onChange={e => setGbpForm({ ...gbpForm, notes: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowGBP(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">{editGBPId ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      {/* GA4 Modal */}
      <Modal open={showGA4} onClose={() => setShowGA4(false)} title={editGA4Id ? 'Edit GA4 Metrics' : 'Add GA4 Metrics'} wide>
        <form onSubmit={saveGA4} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Project *</label>
              <select value={String(ga4Form.project)} onChange={e => setGa4Form({ ...ga4Form, project: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
                <option value="">Select project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Month *</label>
              <input type="month" value={String(ga4Form.month).slice(0, 7)} onChange={e => setGa4Form({ ...ga4Form, month: e.target.value + '-01' })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Users & Sessions</p>
          <div className="grid grid-cols-4 gap-3">
            {inp('Active Users', 'active_users', ga4Form, setGa4Form)}
            {inp('New Users', 'new_users', ga4Form, setGa4Form)}
            {inp('Total Sessions', 'total_sessions', ga4Form, setGa4Form)}
            {inp('Avg Engagement (sec)', 'avg_engagement_time_sec', ga4Form, setGa4Form)}
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Events</p>
          <div className="grid grid-cols-5 gap-3">
            {inp('Total Events', 'total_events', ga4Form, setGa4Form)}
            {inp('Page Views', 'page_views', ga4Form, setGa4Form)}
            {inp('Phone Clicks', 'phone_clicks', ga4Form, setGa4Form)}
            {inp('Estimate Requests', 'estimate_requests', ga4Form, setGa4Form)}
            {inp('WhatsApp', 'whatsapp_clicks', ga4Form, setGa4Form)}
            {inp('Email Clicks', 'email_clicks', ga4Form, setGa4Form)}
            {inp('Directions', 'direction_clicks', ga4Form, setGa4Form)}
            {inp('High Intent', 'high_intent_pages', ga4Form, setGa4Form)}
            {inp('Scrolls', 'scrolls', ga4Form, setGa4Form)}
            {inp('Financing', 'financing_interest', ga4Form, setGa4Form)}
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">JSON Data</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Traffic Sources (JSON)</label>
              <textarea rows={4} value={String(ga4Form.traffic_sources)} onChange={e => setGa4Form({ ...ga4Form, traffic_sources: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-xs font-mono" placeholder='[{"source":"google / organic","sessions":44,"key_events":252}]' />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Country Breakdown (JSON)</label>
              <textarea rows={4} value={String(ga4Form.country_breakdown)} onChange={e => setGa4Form({ ...ga4Form, country_breakdown: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-xs font-mono" placeholder='[{"country":"United States","users":32}]' />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Top Pages (JSON)</label>
              <textarea rows={4} value={String(ga4Form.top_pages)} onChange={e => setGa4Form({ ...ga4Form, top_pages: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-xs font-mono" placeholder='[{"page":"/","views":500}]' />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Page Speed (JSON)</label>
              <textarea rows={4} value={String(ga4Form.page_speed)} onChange={e => setGa4Form({ ...ga4Form, page_speed: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-xs font-mono" placeholder='{"lcp":2.1,"inp":150,"cls":0.05,"mobile_score":85}' />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-text-muted">Notes</label>
            <textarea rows={2} value={String(ga4Form.notes)} onChange={e => setGa4Form({ ...ga4Form, notes: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowGA4(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">{editGA4Id ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      {/* Search Term Modal */}
      <Modal open={showKW} onClose={() => setShowKW(false)} title={editKWId ? 'Edit Search Term' : 'Add Search Term'} wide>
        <form onSubmit={saveKW} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Project *</label>
              <select value={String(kwForm.project)} onChange={e => setKwForm({ ...kwForm, project: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
                <option value="">Select project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Month *</label>
              <input type="month" value={String(kwForm.month).slice(0, 7)} onChange={e => setKwForm({ ...kwForm, month: e.target.value + '-01' })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Source *</label>
              <select value={String(kwForm.source)} onChange={e => setKwForm({ ...kwForm, source: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="gbp">Google Business Profile</option>
                <option value="gsc">Google Search Console</option>
                <option value="brightlocal">BrightLocal</option>
                <option value="ahrefs">Ahrefs</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-text-muted">Keyword *</label>
            <input value={String(kwForm.keyword)} onChange={e => setKwForm({ ...kwForm, keyword: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required placeholder="e.g. roofing company jacksonville fl" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {inp('Impressions', 'impressions', kwForm as Record<string, unknown>, (f) => setKwForm(f))}
            {inp('Clicks', 'clicks', kwForm as Record<string, unknown>, (f) => setKwForm(f))}
            {inp('Avg Position', 'avg_position', kwForm as Record<string, unknown>, (f) => setKwForm(f), 'text')}
            <div>
              <label className="block text-xs font-medium mb-1 text-text-muted">Local Pack?</label>
              <select value={kwForm.local_pack ? 'true' : 'false'} onChange={e => setKwForm({ ...kwForm, local_pack: e.target.value === 'true' })} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-text-muted">Notes</label>
            <input value={String(kwForm.notes)} onChange={e => setKwForm({ ...kwForm, notes: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowKW(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">{editKWId ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
