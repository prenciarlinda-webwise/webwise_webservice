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
  calls: number
  chat_clicks: number
  bookings: number
  direction_clicks: number
  website_clicks: number
  total_interactions: number
  profile_views: number
  photo_count: number
  review_count: number
  review_avg_rating: string
  new_reviews: number
  posts_published: number
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
            <p className="text-sm text-text-muted">No GBP records {filterMonth ? 'for this month' : 'yet'}.</p>
          ) : (
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-bg-secondary text-xs text-text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-right">Calls</th>
                    <th className="px-4 py-3 text-right">Directions</th>
                    <th className="px-4 py-3 text-right">Website clicks</th>
                    <th className="px-4 py-3 text-right">Profile views</th>
                    <th className="px-4 py-3 text-right">Total interactions</th>
                    <th className="px-4 py-3 text-right">Reviews</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGbp.sort((a, b) => b.month.localeCompare(a.month)).map(m => (
                    <tr key={m.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{new Date(m.month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</td>
                      <td className="px-4 py-3 text-right">{m.calls}</td>
                      <td className="px-4 py-3 text-right">{m.direction_clicks}</td>
                      <td className="px-4 py-3 text-right">{m.website_clicks}</td>
                      <td className="px-4 py-3 text-right">{m.profile_views}</td>
                      <td className="px-4 py-3 text-right font-semibold">{m.total_interactions}</td>
                      <td className="px-4 py-3 text-right">{m.review_count} ({m.review_avg_rating}⭐)</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <button onClick={() => openGbp(m)} className="text-text-muted hover:text-text-primary"><Edit2 size={14} /></button>
                        <button onClick={() => deleteGbp(m.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Bars
            label="Total GBP interactions"
            data={filteredGbp.sort((a, b) => a.month.localeCompare(b.month)).map(m => ({ x: m.month.slice(0, 7), y: m.total_interactions }))}
          />
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Month *" type="date" value={(gbpForm.month as string) ?? ''} onChange={v => setGbpForm(f => ({ ...f, month: v }))} required />
            <Field label="Calls" type="number" value={String(gbpForm.calls ?? 0)} onChange={v => setGbpForm(f => ({ ...f, calls: Number(v) }))} />
            <Field label="Direction clicks" type="number" value={String(gbpForm.direction_clicks ?? 0)} onChange={v => setGbpForm(f => ({ ...f, direction_clicks: Number(v) }))} />
            <Field label="Website clicks" type="number" value={String(gbpForm.website_clicks ?? 0)} onChange={v => setGbpForm(f => ({ ...f, website_clicks: Number(v) }))} />
            <Field label="Bookings" type="number" value={String(gbpForm.bookings ?? 0)} onChange={v => setGbpForm(f => ({ ...f, bookings: Number(v) }))} />
            <Field label="Chat clicks" type="number" value={String(gbpForm.chat_clicks ?? 0)} onChange={v => setGbpForm(f => ({ ...f, chat_clicks: Number(v) }))} />
            <Field label="Total interactions" type="number" value={String(gbpForm.total_interactions ?? 0)} onChange={v => setGbpForm(f => ({ ...f, total_interactions: Number(v) }))} />
            <Field label="Profile views" type="number" value={String(gbpForm.profile_views ?? 0)} onChange={v => setGbpForm(f => ({ ...f, profile_views: Number(v) }))} />
            <Field label="Review count" type="number" value={String(gbpForm.review_count ?? 0)} onChange={v => setGbpForm(f => ({ ...f, review_count: Number(v) }))} />
            <Field label="Avg rating" type="number" value={String(gbpForm.review_avg_rating ?? '0')} onChange={v => setGbpForm(f => ({ ...f, review_avg_rating: v }))} />
            <Field label="New reviews" type="number" value={String(gbpForm.new_reviews ?? 0)} onChange={v => setGbpForm(f => ({ ...f, new_reviews: Number(v) }))} />
            <Field label="Posts published" type="number" value={String(gbpForm.posts_published ?? 0)} onChange={v => setGbpForm(f => ({ ...f, posts_published: Number(v) }))} />
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
