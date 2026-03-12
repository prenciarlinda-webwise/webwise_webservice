'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import { ExternalLink, Globe, ChevronRight, Plus } from 'lucide-react'

interface Service {
  id: number
  name: string
  description: string
  status: string
}

interface Project {
  id: number
  slug: string
  name: string
  website_url: string
  business_phone: string
  business_address: string
  industry: string
  status: string
  services: Service[]
}

const emptyForm = {
  name: '', website_url: '', business_phone: '', business_email: '', business_address: '',
  business_hours: '', industry: '', service_areas: '', target_audience: '', usps: '',
  competitors: '', marketing_channels: '', nap_status: '',
  google_business_url: '', facebook_url: '', instagram_url: '', booking_url: '',
  google_drive_url: '', image_folder_url: '', citations_url: '', notes: '',
}

export default function MyProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => api.get<{ results: Project[] }>('/clients/projects/').then(d => setProjects(d.results))
  useEffect(() => { load() }, [])

  const toArr = (v: string) => v.split(',').map(s => s.trim()).filter(Boolean)
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        service_areas: toArr(form.service_areas),
        target_audience: toArr(form.target_audience),
        usps: form.usps.split('\n').map(s => s.trim()).filter(Boolean),
        competitors: form.competitors.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
          const [name, ...rest] = line.split('—')
          return { name: name.trim(), notes: rest.join('—').trim() || undefined }
        }),
        marketing_channels: toArr(form.marketing_channels),
      }
      const created = await api.post<{ slug: string }>('/clients/projects/', payload)
      setShowAdd(false)
      setForm(emptyForm)
      router.push(`/dashboard/my-projects/${created.slug}`)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader
        title="My Businesses"
        description={`${projects.length} business${projects.length !== 1 ? 'es' : ''}`}
        action={
          <button onClick={() => { setForm(emptyForm); setShowAdd(true) }} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
            <Plus size={16} /> Add Business
          </button>
        }
      />

      <div className="grid gap-4">
        {projects.map(project => (
          <Link
            key={project.id}
            href={`/dashboard/my-projects/${project.slug}`}
            className="block bg-white rounded-xl border border-border p-6 hover:border-accent/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">{project.name}</h3>
                <div className="flex items-center gap-3 text-sm text-text-muted mt-0.5">
                  {project.industry && <span>{project.industry}</span>}
                  {project.business_address && <span>{project.business_address}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                <ChevronRight size={18} className="text-text-muted group-hover:text-accent transition-colors" />
              </div>
            </div>

            {project.website_url && (
              <div className="flex items-center gap-1.5 text-sm text-accent mb-3">
                <Globe size={13} />
                <span>{project.website_url}</span>
                <ExternalLink size={11} />
              </div>
            )}

            {project.services.length > 0 && (
              <div className="flex flex-wrap gap-2" onClick={e => e.preventDefault()}>
                {project.services.map(s => (
                  <a key={s.id} href="/pricing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-1.5 px-3 bg-bg-secondary rounded-lg text-sm hover:bg-accent/10 transition-colors">
                    <span>{s.name}</span>
                    <StatusBadge status={s.status} />
                  </a>
                ))}
              </div>
            )}
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-8 text-center text-text-muted">No businesses yet. Click &quot;Add Business&quot; to get started.</div>
        )}
      </div>

      {/* Add Business Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Business">
        <form onSubmit={handleAdd} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Core Info */}
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Basic Info</p>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. 904 Dumpster" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input value={form.website_url} onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. Roofing, Plumbing" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={form.business_phone} onChange={e => setForm(f => ({ ...f, business_phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input value={form.business_email} onChange={e => setForm(f => ({ ...f, business_email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input value={form.business_address} onChange={e => setForm(f => ({ ...f, business_address: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="123 Main St, City, State ZIP" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Hours</label>
            <input value={form.business_hours} onChange={e => setForm(f => ({ ...f, business_hours: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Mon-Fri 8AM-6PM, Sat 9AM-2PM" />
          </div>

          {/* Online Presence */}
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide pt-2">Online Presence</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Google Business Profile URL</label>
              <input value={form.google_business_url} onChange={e => setForm(f => ({ ...f, google_business_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="https://g.page/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Booking / Estimate URL</label>
              <input value={form.booking_url} onChange={e => setForm(f => ({ ...f, booking_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="https://..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook URL</label>
              <input value={form.facebook_url} onChange={e => setForm(f => ({ ...f, facebook_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram URL</label>
              <input value={form.instagram_url} onChange={e => setForm(f => ({ ...f, instagram_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="https://instagram.com/..." />
            </div>
          </div>

          {/* Internal Links */}
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide pt-2">Internal Links</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Google Drive Folder</label>
              <input value={form.google_drive_url} onChange={e => setForm(f => ({ ...f, google_drive_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image Assets Folder</label>
              <input value={form.image_folder_url} onChange={e => setForm(f => ({ ...f, image_folder_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Citations Spreadsheet</label>
            <input value={form.citations_url} onChange={e => setForm(f => ({ ...f, citations_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>

          {/* Marketing Info */}
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide pt-2">Marketing Info</p>
          <div>
            <label className="block text-sm font-medium mb-1">Service Areas (comma-separated)</label>
            <input value={form.service_areas} onChange={e => setForm(f => ({ ...f, service_areas: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Jacksonville FL, Orange Park FL" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience (comma-separated)</label>
            <input value={form.target_audience} onChange={e => setForm(f => ({ ...f, target_audience: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Homeowners, Property managers" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unique Selling Points (one per line)</label>
            <textarea value={form.usps} onChange={e => setForm(f => ({ ...f, usps: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20" placeholder={"Same-day delivery\nLicensed & insured\nFree estimates"} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Competitors (one per line, &quot;Name — Notes&quot;)</label>
            <textarea value={form.competitors} onChange={e => setForm(f => ({ ...f, competitors: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20" placeholder={"Competitor A — local franchise\nCompetitor B"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Marketing Channels (comma-separated)</label>
              <input value={form.marketing_channels} onChange={e => setForm(f => ({ ...f, marketing_channels: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Google, Facebook, Yelp" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NAP Status</label>
              <select value={form.nap_status} onChange={e => setForm(f => ({ ...f, nap_status: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">—</option>
                <option value="consistent">Consistent</option>
                <option value="inconsistent">Inconsistent</option>
                <option value="not_checked">Not Checked</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20" placeholder="Any additional details about this business..." />
          </div>

          <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white pb-1">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50">
              {saving ? 'Creating…' : 'Create Business'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
