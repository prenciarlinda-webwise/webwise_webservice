'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import { Plus, Phone, Mail, ArrowRight, Pencil, Trash2, Globe, MapPin, Briefcase } from 'lucide-react'

interface Business {
  id: number
  slug: string
  name: string
  website_url: string
  domain: string
  business_phone: string
  business_email: string
  business_address: string
  city: string
  state: string
  industry: string
  business_hours: string
  status: string
}

interface Client {
  id: number
  slug: string
  user: number
  user_email: string
  user_name: string
  user_first_name: string
  user_last_name: string
  user_phone: string
  business_name: string
  businesses?: Business[]
  projects?: Business[]
  business_phone?: string
  business_email?: string
}

export default function ClientDetailPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isPrivileged = isAdmin || user?.is_supervisor === true
  const isClient = user?.role === 'client'
  const canEditContact = isAdmin || isClient

  const [client, setClient] = useState<Client | null>(null)
  const [showAddBusiness, setShowAddBusiness] = useState(false)
  const [bizForm, setBizForm] = useState({ name: '', website_url: '', business_phone: '', business_email: '', business_address: '' })
  const [showEditContact, setShowEditContact] = useState(false)
  const [contactForm, setContactForm] = useState({ first_name: '', last_name: '', email: '', phone: '' })

  const reload = async () => {
    try {
      const c = await api.get<Client>(`/clients/by-slug/${slug}/`)
      setClient(c)
    } catch (err) {
      console.error('Failed to load client:', err)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const businesses: Business[] = client?.businesses ?? client?.projects ?? []

  const addBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) return
    await api.post('/clients/projects/', { client: client.id, ...bizForm })
    setBizForm({ name: '', website_url: '', business_phone: '', business_email: '', business_address: '' })
    setShowAddBusiness(false)
    reload()
  }

  const deleteBusiness = async (id: number, name: string) => {
    if (!confirm(`Delete business "${name}" and all its data?`)) return
    await api.delete(`/clients/projects/${id}/`)
    reload()
  }

  const openEditContact = () => {
    if (!client) return
    setContactForm({
      first_name: client.user_first_name ?? '',
      last_name: client.user_last_name ?? '',
      email: client.user_email ?? '',
      phone: client.user_phone ?? '',
    })
    setShowEditContact(true)
  }

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) return
    // Admin/supervisor edits any client via /auth/users/<id>/; clients can only
    // edit themselves via /auth/me/.
    if (isClient) {
      await api.patch('/auth/me/', contactForm)
    } else {
      await api.patch(`/auth/users/${client.user}/`, contactForm)
    }
    setShowEditContact(false)
    reload()
  }

  if (!client) return <div className="py-20 text-center text-text-muted">Loading…</div>

  return (
    <div className="space-y-8">
      <PageHeader
        title={client.business_name}
        description={
          <span className="text-sm text-text-muted">
            {client.user_name} · {businesses.length} business{businesses.length !== 1 ? 'es' : ''}
          </span>
        }
        action={
          <Link href="/dashboard/clients" className="text-sm text-text-muted hover:text-text-primary">
            ← Back to clients
          </Link>
        }
      />

      {/* Contact info */}
      <section className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Contact</h2>
          {canEditContact && (
            <button onClick={openEditContact} className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-bg-secondary">
              <Pencil size={14} /> Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><span className="text-text-muted">Name:</span> {client.user_name || '—'}</div>
          <div className="flex items-center gap-2"><Mail size={14} className="text-text-muted" /> {client.user_email || '—'}</div>
          <div className="flex items-center gap-2"><Phone size={14} className="text-text-muted" /> {client.user_phone || '—'}</div>
          <div><span className="text-text-muted">Username:</span> {client.user_name?.split(' ')[0] ?? '—'}</div>
        </div>
      </section>

      {/* Businesses */}
      <section className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Businesses ({businesses.length})</h2>
          {isPrivileged && (
            <button
              onClick={() => setShowAddBusiness(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"
            >
              <Plus size={14} /> Add business
            </button>
          )}
        </div>
        {businesses.length === 0 ? (
          <p className="text-sm text-text-muted">No businesses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businesses.map(b => {
              const location = [b.city, b.state].filter(Boolean).join(', ')
              return (
                <Link
                  key={b.id}
                  href={`/dashboard/${b.slug}`}
                  className="block relative border border-border rounded-lg p-4 hover:border-accent/50 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium group-hover:text-accent flex items-center gap-1 truncate">
                        {b.name}
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={b.status} />
                        {b.industry && <span className="text-xs text-text-muted">· {b.industry}</span>}
                      </div>
                    </div>
                    {isPrivileged && (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteBusiness(b.id, b.name) }}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 -m-1"
                        aria-label="Delete business"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-text-muted space-y-1 mt-3">
                    {b.domain && <div className="flex items-center gap-1.5 truncate"><Globe size={11} className="shrink-0" /> {b.domain}</div>}
                    {b.business_phone && <div className="flex items-center gap-1.5"><Phone size={11} className="shrink-0" /> {b.business_phone}</div>}
                    {b.business_email && <div className="flex items-center gap-1.5 truncate"><Mail size={11} className="shrink-0" /> {b.business_email}</div>}
                    {location && <div className="flex items-center gap-1.5"><MapPin size={11} className="shrink-0" /> {location}</div>}
                    {b.business_hours && <div className="flex items-center gap-1.5 truncate"><Briefcase size={11} className="shrink-0" /> {b.business_hours}</div>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <Modal open={showAddBusiness} onClose={() => setShowAddBusiness(false)} title="Add business">
        <form onSubmit={addBusiness} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business name *</label>
            <input value={bizForm.name} onChange={e => setBizForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input type="url" value={bizForm.website_url} onChange={e => setBizForm(f => ({ ...f, website_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="https://example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={bizForm.business_phone} onChange={e => setBizForm(f => ({ ...f, business_phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={bizForm.business_email} onChange={e => setBizForm(f => ({ ...f, business_email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input value={bizForm.business_address} onChange={e => setBizForm(f => ({ ...f, business_address: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddBusiness(false)} className="px-4 py-2 text-sm">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm rounded-lg">Add</button>
          </div>
        </form>
      </Modal>

      <Modal open={showEditContact} onClose={() => setShowEditContact(false)} title="Edit contact">
        <form onSubmit={saveContact} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input value={contactForm.first_name} onChange={e => setContactForm(f => ({ ...f, first_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input value={contactForm.last_name} onChange={e => setContactForm(f => ({ ...f, last_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={contactForm.phone} onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEditContact(false)} className="px-4 py-2 text-sm">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm rounded-lg">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
