'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import Modal from '@/components/dashboard/Modal'
import { Plus, Trash2, Edit2 } from 'lucide-react'

type Tab = 'gbp' | 'ga4' | 'combined'

interface GBPMetrics {
  id: number
  business: number
  month: string
  // Absolute view counts (source of truth, from BrightLocal)
  search_mobile_views: number
  search_desktop_views: number
  maps_mobile_views: number
  maps_desktop_views: number
  // Derived
  profile_views: number
  profile_views_change_pct: string | null
  total_interactions: number
  interactions_change_pct: string | null
  search_mobile_pct: string
  search_desktop_pct: string
  maps_mobile_pct: string
  maps_desktop_pct: string
  // Interactions (absolute)
  calls: number
  chat_clicks: number
  bookings: number
  direction_clicks: number
  website_clicks: number
  // Manual entry
  photo_count: number
  review_count: number
  review_avg_rating: string
  new_reviews: number
  posts_published: number
  gbp_store_code: string
  notes: string
}

interface GA4Metrics {
  id: number
  business: number
  month: string
  active_users: number
  new_users: number
  total_sessions: number
  avg_engagement_time_sec: number
  total_events: number
  page_views: number
  phone_clicks: number
  estimate_requests: number
  whatsapp_clicks: number
  email_clicks: number
  direction_clicks: number
  high_intent_pages: number
}

interface Business {
  id: number
  slug: string
  name: string
}

export default function EventsDetailPage({ params }: { params: Promise<{ business: string }> }) {
  const { business: businessSlug } = use(params)
  const { user } = useAuth()
  const [biz, setBiz] = useState<Business | null>(null)
  const [tab, setTab] = useState<Tab>('gbp')
  const [gbp, setGbp] = useState<GBPMetrics[]>([])
  const [ga4, setGa4] = useState<GA4Metrics[]>([])
  const [showGbpForm, setShowGbpForm] = useState(false)
  const [showGa4Form, setShowGa4Form] = useState(false)
  const [gbpForm, setGbpForm] = useState<Partial<GBPMetrics>>({})
  const [ga4Form, setGa4Form] = useState<Partial<GA4Metrics>>({})
  const [filterMonth, setFilterMonth] = useState('')

  const isPrivileged = user?.role === 'admin' || user?.is_supervisor === true

  const reload = async () => {
    const b = await api.get<Business>(`/clients/projects/by-slug/${businessSlug}/`)
    setBiz(b)
    const gbpResp = await api.get<{ results: GBPMetrics[] } | GBPMetrics[]>(`/reports/gbp/?business=${b.id}`)
    setGbp(Array.isArray(gbpResp) ? gbpResp : (gbpResp.results ?? []))
    const ga4Resp = await api.get<{ results: GA4Metrics[] } | GA4Metrics[]>(`/reports/ga4/?business=${b.id}`)
    setGa4(Array.isArray(ga4Resp) ? ga4Resp : (ga4Resp.results ?? []))
  }

  useEffect(() => {
    if (isPrivileged) reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessSlug, isPrivileged])

  const filteredGbp = gbp.filter(m => !filterMonth || m.month.startsWith(filterMonth))
  const filteredGa4 = ga4.filter(m => !filterMonth || m.month.startsWith(filterMonth))
  // Ascending-month copy for charts (the table sorts descending separately).
  const gbpAsc = [...filteredGbp].sort((a, b) => a.month.localeCompare(b.month))

  const openGbp = (m?: GBPMetrics) => {
    setGbpForm(m ? { ...m } : { month: new Date().toISOString().slice(0, 7) + '-01' })
    setShowGbpForm(true)
  }

  const openGa4 = (m?: GA4Metrics) => {
    setGa4Form(m ? { ...m } : { month: new Date().toISOString().slice(0, 7) + '-01' })
    setShowGa4Form(true)
  }

  const saveGbp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!biz) return
    const data = { ...gbpForm, business: biz.id }
    if (gbpForm.id) {
      await api.patch(`/reports/gbp/${gbpForm.id}/`, data)
    } else {
      await api.post('/reports/gbp/', data)
    }
    setShowGbpForm(false)
    reload()
  }

  const saveGa4 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!biz) return
    const data = { ...ga4Form, business: biz.id }
    if (ga4Form.id) {
      await api.patch(`/reports/ga4/${ga4Form.id}/`, data)
    } else {
      await api.post('/reports/ga4/', data)
    }
    setShowGa4Form(false)
    reload()
  }

  const deleteGbp = async (id: number) => {
    if (!confirm('Delete this GBP record?')) return
    await api.delete(`/reports/gbp/${id}/`)
    reload()
  }

  const deleteGa4 = async (id: number) => {
    if (!confirm('Delete this GA4 record?')) return
    await api.delete(`/reports/ga4/${id}/`)
    reload()
  }

  if (!isPrivileged) {
    return <div className="py-20 text-center text-text-muted">Events are only available to supervisors and admins.</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description={biz?.name ?? businessSlug}
        action={
          <Link href={`/dashboard/${businessSlug}`} className="text-sm text-text-muted hover:text-text-primary">← Business</Link>
        }
      />

      <div className="flex items-center justify-between border-b border-border">
        <div className="flex">
          {(['gbp', 'ga4', 'combined'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium uppercase border-b-2 transition-colors ${
                tab === t ? 'border-accent text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 pb-2">
          <input
            type="month"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="px-3 py-1 border border-border rounded text-sm"
            placeholder="Filter month"
          />
          {filterMonth && (
            <button onClick={() => setFilterMonth('')} className="text-sm text-text-muted hover:text-text-primary">
              Clear
            </button>
          )}
        </div>
      </div>

      {tab === 'gbp' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Google Business Profile</h2>
            <button onClick={() => openGbp()} className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg">
              <Plus size={14} /> Add month
            </button>
          </div>
          {filteredGbp.length === 0 ? (
            <p className="text-sm text-text-muted">No GBP records {filterMonth ? 'for this month' : 'yet'}. Run <code className="text-xs">manage.py import_brightlocal_gbp</code> to load BrightLocal CSVs.</p>
          ) : (
            <>
              {/* === Monthly table — absolute counts + exact %change === */}
              <div className="bg-white rounded-xl border border-border overflow-hidden overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-bg-secondary text-xs text-text-muted whitespace-nowrap">
                    <tr>
                      <th className="px-4 py-3 text-left">Month</th>
                      <th className="px-4 py-3 text-right" title="Sum of search + maps · mobile + desktop">Profile views</th>
                      <th className="px-4 py-3 text-right">Δ %</th>
                      <th className="px-4 py-3 text-right" title="Search mobile + desktop">Search</th>
                      <th className="px-4 py-3 text-right" title="Maps mobile + desktop">Maps</th>
                      <th className="px-4 py-3 text-right">Calls</th>
                      <th className="px-4 py-3 text-right">Directions</th>
                      <th className="px-4 py-3 text-right">Website</th>
                      <th className="px-4 py-3 text-right">Messages</th>
                      <th className="px-4 py-3 text-right" title="Sum of all interactions">Interactions</th>
                      <th className="px-4 py-3 text-right">Δ %</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGbp.sort((a, b) => b.month.localeCompare(a.month)).map(m => (
                      <tr key={m.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{new Date(m.month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums">{m.profile_views}</td>
                        <td className="px-4 py-3 text-right tabular-nums"><PctChange value={m.profile_views_change_pct} /></td>
                        <td className="px-4 py-3 text-right tabular-nums">{m.search_mobile_views + m.search_desktop_views}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{m.maps_mobile_views + m.maps_desktop_views}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{m.calls}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{m.direction_clicks}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{m.website_clicks}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{m.chat_clicks}</td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums">{m.total_interactions}</td>
                        <td className="px-4 py-3 text-right tabular-nums"><PctChange value={m.interactions_change_pct} /></td>
                        <td className="px-4 py-3 flex justify-end gap-2">
                          <button onClick={() => openGbp(m)} className="text-text-muted hover:text-text-primary"><Edit2 size={14} /></button>
                          <button onClick={() => deleteGbp(m.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* === Charts: trends + platform mix === */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MultiLineChart
                  label="Profile views — Search vs Maps"
                  series={[
                    { name: 'Search (mobile+desktop)', color: '#3b82f6',
                      points: gbpAsc.map(m => ({ x: m.month.slice(0, 7), y: m.search_mobile_views + m.search_desktop_views })) },
                    { name: 'Maps (mobile+desktop)', color: '#f97316',
                      points: gbpAsc.map(m => ({ x: m.month.slice(0, 7), y: m.maps_mobile_views + m.maps_desktop_views })) },
                  ]}
                />
                <MultiLineChart
                  label="Interactions breakdown"
                  series={[
                    { name: 'Calls',     color: '#22c55e', points: gbpAsc.map(m => ({ x: m.month.slice(0, 7), y: m.calls })) },
                    { name: 'Directions',color: '#a855f7', points: gbpAsc.map(m => ({ x: m.month.slice(0, 7), y: m.direction_clicks })) },
                    { name: 'Website',   color: '#3b82f6', points: gbpAsc.map(m => ({ x: m.month.slice(0, 7), y: m.website_clicks })) },
                    { name: 'Messages',  color: '#f97316', points: gbpAsc.map(m => ({ x: m.month.slice(0, 7), y: m.chat_clicks })) },
                  ]}
                />
                <Bars
                  label="Total profile views (per month)"
                  data={gbpAsc.map(m => ({ x: m.month.slice(0, 7), y: m.profile_views }))}
                />
                <PlatformMix label="Platform mix (latest month)" rows={gbpAsc.length ? [gbpAsc[gbpAsc.length - 1]] : []} />
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'ga4' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Google Analytics 4</h2>
            <button onClick={() => openGa4()} className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg">
              <Plus size={14} /> Add month
            </button>
          </div>
          {filteredGa4.length === 0 ? (
            <p className="text-sm text-text-muted">No GA4 records {filterMonth ? 'for this month' : 'yet'}.</p>
          ) : (
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-bg-secondary text-xs text-text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-right">Active users</th>
                    <th className="px-4 py-3 text-right">Sessions</th>
                    <th className="px-4 py-3 text-right">Phone clicks</th>
                    <th className="px-4 py-3 text-right">Forms</th>
                    <th className="px-4 py-3 text-right">Email</th>
                    <th className="px-4 py-3 text-right">WhatsApp</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGa4.sort((a, b) => b.month.localeCompare(a.month)).map(m => (
                    <tr key={m.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{new Date(m.month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</td>
                      <td className="px-4 py-3 text-right">{m.active_users}</td>
                      <td className="px-4 py-3 text-right">{m.total_sessions}</td>
                      <td className="px-4 py-3 text-right">{m.phone_clicks}</td>
                      <td className="px-4 py-3 text-right font-semibold">{m.estimate_requests}</td>
                      <td className="px-4 py-3 text-right">{m.email_clicks}</td>
                      <td className="px-4 py-3 text-right">{m.whatsapp_clicks}</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <button onClick={() => openGa4(m)} className="text-text-muted hover:text-text-primary"><Edit2 size={14} /></button>
                        <button onClick={() => deleteGa4(m.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Bars
            label="Estimate requests / month"
            data={filteredGa4.sort((a, b) => a.month.localeCompare(b.month)).map(m => ({ x: m.month.slice(0, 7), y: m.estimate_requests }))}
          />
        </div>
      )}

      {tab === 'combined' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Combined view</h2>
          <Bars
            label="GBP interactions vs GA4 form fills"
            data={[...filteredGbp, ...filteredGa4]
              .map(m => ({ month: m.month, value: 'total_interactions' in m ? m.total_interactions : (m as GA4Metrics).estimate_requests }))
              .reduce<Array<{ x: string; y: number }>>((acc, m) => {
                const month = m.month.slice(0, 7)
                const existing = acc.find(a => a.x === month)
                if (existing) existing.y += m.value
                else acc.push({ x: month, y: m.value })
                return acc
              }, [])
              .sort((a, b) => a.x.localeCompare(b.x))}
          />
        </div>
      )}

      <Modal open={showGbpForm} onClose={() => setShowGbpForm(false)} title={gbpForm.id ? 'Edit GBP record' : 'Add GBP record'} wide>
        <form onSubmit={saveGbp} className="space-y-4">
          <p className="text-xs text-text-muted">
            Profile views, total interactions, the four platform percentages, and prior-month %change
            are all derived server-side from the absolute counts below — you can&apos;t enter them
            directly. They update on save.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Month *" type="date" value={(gbpForm.month as string) ?? ''} onChange={v => setGbpForm(f => ({ ...f, month: v }))} required />
            <Field label="GBP store code" value={String(gbpForm.gbp_store_code ?? '')} onChange={v => setGbpForm(f => ({ ...f, gbp_store_code: v }))} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Profile views (absolute)</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Search · Mobile views" type="number" value={String(gbpForm.search_mobile_views ?? 0)} onChange={v => setGbpForm(f => ({ ...f, search_mobile_views: Number(v) }))} />
              <Field label="Search · Desktop views" type="number" value={String(gbpForm.search_desktop_views ?? 0)} onChange={v => setGbpForm(f => ({ ...f, search_desktop_views: Number(v) }))} />
              <Field label="Maps · Mobile views" type="number" value={String(gbpForm.maps_mobile_views ?? 0)} onChange={v => setGbpForm(f => ({ ...f, maps_mobile_views: Number(v) }))} />
              <Field label="Maps · Desktop views" type="number" value={String(gbpForm.maps_desktop_views ?? 0)} onChange={v => setGbpForm(f => ({ ...f, maps_desktop_views: Number(v) }))} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Interactions</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Calls" type="number" value={String(gbpForm.calls ?? 0)} onChange={v => setGbpForm(f => ({ ...f, calls: Number(v) }))} />
              <Field label="Directions" type="number" value={String(gbpForm.direction_clicks ?? 0)} onChange={v => setGbpForm(f => ({ ...f, direction_clicks: Number(v) }))} />
              <Field label="Website clicks" type="number" value={String(gbpForm.website_clicks ?? 0)} onChange={v => setGbpForm(f => ({ ...f, website_clicks: Number(v) }))} />
              <Field label="Messages" type="number" value={String(gbpForm.chat_clicks ?? 0)} onChange={v => setGbpForm(f => ({ ...f, chat_clicks: Number(v) }))} />
              <Field label="Bookings" type="number" value={String(gbpForm.bookings ?? 0)} onChange={v => setGbpForm(f => ({ ...f, bookings: Number(v) }))} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Reviews & content</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Review count" type="number" value={String(gbpForm.review_count ?? 0)} onChange={v => setGbpForm(f => ({ ...f, review_count: Number(v) }))} />
              <Field label="Avg rating" type="number" value={String(gbpForm.review_avg_rating ?? '0')} onChange={v => setGbpForm(f => ({ ...f, review_avg_rating: v }))} />
              <Field label="New reviews" type="number" value={String(gbpForm.new_reviews ?? 0)} onChange={v => setGbpForm(f => ({ ...f, new_reviews: Number(v) }))} />
              <Field label="Photo count" type="number" value={String(gbpForm.photo_count ?? 0)} onChange={v => setGbpForm(f => ({ ...f, photo_count: Number(v) }))} />
              <Field label="Posts published" type="number" value={String(gbpForm.posts_published ?? 0)} onChange={v => setGbpForm(f => ({ ...f, posts_published: Number(v) }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowGbpForm(false)} className="px-4 py-2 text-sm">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm rounded-lg">Save</button>
          </div>
        </form>
      </Modal>

      <Modal open={showGa4Form} onClose={() => setShowGa4Form(false)} title={ga4Form.id ? 'Edit GA4 record' : 'Add GA4 record'} wide>
        <form onSubmit={saveGa4} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Month *" type="date" value={(ga4Form.month as string) ?? ''} onChange={v => setGa4Form(f => ({ ...f, month: v }))} required />
            <Field label="Active users" type="number" value={String(ga4Form.active_users ?? 0)} onChange={v => setGa4Form(f => ({ ...f, active_users: Number(v) }))} />
            <Field label="New users" type="number" value={String(ga4Form.new_users ?? 0)} onChange={v => setGa4Form(f => ({ ...f, new_users: Number(v) }))} />
            <Field label="Total sessions" type="number" value={String(ga4Form.total_sessions ?? 0)} onChange={v => setGa4Form(f => ({ ...f, total_sessions: Number(v) }))} />
            <Field label="Avg engagement (sec)" type="number" value={String(ga4Form.avg_engagement_time_sec ?? 0)} onChange={v => setGa4Form(f => ({ ...f, avg_engagement_time_sec: Number(v) }))} />
            <Field label="Page views" type="number" value={String(ga4Form.page_views ?? 0)} onChange={v => setGa4Form(f => ({ ...f, page_views: Number(v) }))} />
            <Field label="Phone clicks" type="number" value={String(ga4Form.phone_clicks ?? 0)} onChange={v => setGa4Form(f => ({ ...f, phone_clicks: Number(v) }))} />
            <Field label="Estimate requests (forms)" type="number" value={String(ga4Form.estimate_requests ?? 0)} onChange={v => setGa4Form(f => ({ ...f, estimate_requests: Number(v) }))} />
            <Field label="Email clicks" type="number" value={String(ga4Form.email_clicks ?? 0)} onChange={v => setGa4Form(f => ({ ...f, email_clicks: Number(v) }))} />
            <Field label="WhatsApp clicks" type="number" value={String(ga4Form.whatsapp_clicks ?? 0)} onChange={v => setGa4Form(f => ({ ...f, whatsapp_clicks: Number(v) }))} />
            <Field label="Direction clicks" type="number" value={String(ga4Form.direction_clicks ?? 0)} onChange={v => setGa4Form(f => ({ ...f, direction_clicks: Number(v) }))} />
            <Field label="High-intent pages" type="number" value={String(ga4Form.high_intent_pages ?? 0)} onChange={v => setGa4Form(f => ({ ...f, high_intent_pages: Number(v) }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowGa4Form(false)} className="px-4 py-2 text-sm">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm rounded-lg">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
        required={required}
      />
    </div>
  )
}

function Bars({ label, data }: { label: string; data: Array<{ x: string; y: number }> }) {
  if (!data.length) return null
  const maxY = Math.max(...data.map(d => d.y), 1)
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-sm font-medium mb-3">{label}</h3>
      <div className="flex items-end gap-2 h-40">
        {data.map(d => (
          <div key={d.x} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-text-muted">{d.y}</span>
            <div
              style={{ height: `${(d.y / maxY) * 130}px` }}
              className="w-full bg-accent rounded-t"
              title={`${d.x}: ${d.y}`}
            />
            <span className="text-xs text-text-muted">{d.x.slice(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Renders a backend-supplied %change Decimal string with green/red coloring
 * and a + sign when positive. Null/undefined renders an em-dash. Backend is
 * the source of truth for accuracy — we never recompute here.
 */
function PctChange({ value }: { value: string | null | undefined }) {
  if (value == null || value === '') return <span className="text-text-muted">—</span>
  const n = Number(value)
  if (Number.isNaN(n)) return <span className="text-text-muted">—</span>
  if (n === 0) return <span className="text-text-muted">0.0%</span>
  const cls = n > 0 ? 'text-green-600' : 'text-red-600'
  const sign = n > 0 ? '+' : ''
  return <span className={cls}>{sign}{n.toFixed(1)}%</span>
}

interface SeriesPoint { x: string; y: number }
interface ChartSeries { name: string; color: string; points: SeriesPoint[] }

/**
 * Multi-line monthly trend chart. Months are sorted ascending and treated
 * as a categorical x-axis (each month occupies the same horizontal slot).
 * SVG sized via container width so it stretches the full card.
 */
function MultiLineChart({ label, series }: { label: string; series: ChartSeries[] }) {
  if (!series.length || !series[0].points.length) return null
  const months = series[0].points.map(p => p.x)
  const allValues = series.flatMap(s => s.points.map(p => p.y))
  const maxY = Math.max(...allValues, 1)
  const w = 520, h = 220, padX = 32, padY = 14, padBottom = 28
  const innerW = w - 2 * padX
  const innerH = h - padY - padBottom
  const xAt = (i: number) => padX + (months.length === 1 ? innerW / 2 : (i / (months.length - 1)) * innerW)
  const yAt = (v: number) => padY + innerH - (v / maxY) * innerH

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-sm font-medium mb-3">{label}</h3>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
        {/* y-axis gridlines + labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const v = Math.round(maxY * t)
          return (
            <g key={t}>
              <line x1={padX} y1={yAt(v)} x2={w - padX} y2={yAt(v)} stroke="#e5e7eb" strokeDasharray="2,2" />
              <text x={padX - 6} y={yAt(v) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
            </g>
          )
        })}
        {/* x-axis labels */}
        {months.map((m, i) => (
          <text key={m} x={xAt(i)} y={h - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">{m.slice(2)}</text>
        ))}
        {/* series */}
        {series.map(s => (
          <g key={s.name}>
            {s.points.length >= 2 && (
              <polyline
                points={s.points.map((p, i) => `${xAt(i)},${yAt(p.y)}`).join(' ')}
                fill="none" stroke={s.color} strokeWidth="2"
              />
            )}
            {s.points.map((p, i) => (
              <circle key={i} cx={xAt(i)} cy={yAt(p.y)} r="3" fill={s.color}>
                <title>{`${p.x} · ${s.name}: ${p.y}`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-3 text-xs justify-center mt-1">
        {series.map(s => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Single-row stacked horizontal bar — shows what % of the latest month's
 * profile views came from each platform/device combination. Source of truth
 * is the absolute view counts (not the *_pct fields), so this stays in sync
 * with the table even if the DB has stale percentages.
 */
function PlatformMix({ label, rows }: { label: string; rows: GBPMetrics[] }) {
  if (!rows.length) return null
  const m = rows[0]
  const total = m.search_mobile_views + m.search_desktop_views + m.maps_mobile_views + m.maps_desktop_views
  if (!total) return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-sm font-medium mb-3">{label}</h3>
      <p className="text-sm text-text-muted">No view data for this month.</p>
    </div>
  )
  const segments = [
    { name: 'Search · Mobile',  value: m.search_mobile_views,  color: '#1d4ed8' },
    { name: 'Search · Desktop', value: m.search_desktop_views, color: '#3b82f6' },
    { name: 'Maps · Mobile',    value: m.maps_mobile_views,    color: '#c2410c' },
    { name: 'Maps · Desktop',   value: m.maps_desktop_views,   color: '#f97316' },
  ]
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-sm font-medium mb-3">
        {label} <span className="text-xs text-text-muted font-normal">· {new Date(m.month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
      </h3>
      <div className="flex h-3 rounded overflow-hidden mb-4">
        {segments.map(s => s.value > 0 && (
          <div
            key={s.name}
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${s.name}: ${s.value} (${((s.value / total) * 100).toFixed(1)}%)`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {segments.map(s => (
          <div key={s.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
              {s.name}
            </span>
            <span className="tabular-nums">
              {s.value} <span className="text-text-muted">· {total ? ((s.value / total) * 100).toFixed(1) : '0.0'}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
