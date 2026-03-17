'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import { Trash2, Plus } from 'lucide-react'

interface Client {
  id: number
  slug: string
  user: number
  user_name: string
  business_name: string
  user_email: string
  business_email: string
  business_phone: string
  projects: { id: number; slug: string; name: string; status: string }[]
  created_at: string
}

export default function ClientsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', phone: '', business_name: '', business_phone: '', business_email: '' })

  useEffect(() => {
    api.get<{ results: Client[] }>('/clients/').then(d => setClients(d.results)).catch(e => console.error('Failed to load clients:', e))
  }, [])

  const [error, setError] = useState('')

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      // 1. Create user account
      const newUser = await api.post<{ id: number }>('/auth/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      })
      // 2. Create client profile
      await api.post('/clients/', {
        user: newUser.id,
        business_name: form.business_name,
        business_phone: form.business_phone,
        business_email: form.business_email,
      })
      // Refresh
      const data = await api.get<{ results: Client[] }>('/clients/')
      setClients(data.results)
      setShowAdd(false)
      setForm({ username: '', email: '', password: '', first_name: '', last_name: '', phone: '', business_name: '', business_phone: '', business_email: '' })
    } catch (err: any) {
      const detail = err?.username?.[0] || err?.email?.[0] || err?.detail || err?.message || JSON.stringify(err)
      setError(typeof detail === 'string' ? detail : 'Failed to create client. Check the form and try again.')
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete client "${name}" and all their data?`)) return
    await api.delete(`/clients/${id}/`)
    setClients(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${clients.length} total clients`}
        action={
          user?.role === 'admin' && (
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
              <Plus size={16} /> Add Client
            </button>
          )
        }
      />

      <div className="bg-white rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-border">
              <th className="px-6 py-3">Client</th>
              {user?.role !== 'employee' && <th className="px-6 py-3">Email</th>}
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Projects</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} onClick={() => router.push(`/dashboard/clients/${c.slug}`)} className="border-b border-border last:border-0 hover:bg-bg-secondary/50 cursor-pointer">
                <td className="px-6 py-4">
                  <p className="font-medium">{c.user_name || c.business_name}</p>
                  {c.user_name && <p className="text-xs text-text-muted">{c.business_name}</p>}
                </td>
                {user?.role !== 'employee' && <td className="px-6 py-4 text-sm text-text-secondary">{c.business_email || c.user_email}</td>}
                <td className="px-6 py-4 text-sm text-text-secondary">{c.business_phone}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {c.projects.map(p => <StatusBadge key={p.id} status={p.status} />)}
                    {c.projects.length === 0 && <span className="text-xs text-text-muted">No projects</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  {user?.role === 'admin' && (
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id, c.business_name) }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setError('') }} title="Add New Client" wide>
        <form onSubmit={handleAddClient} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username *</label>
              <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <hr className="border-border" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Business Name *</label>
              <input value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Email</label>
              <input type="email" value={form.business_email} onChange={e => setForm(f => ({ ...f, business_email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Phone</label>
              <input value={form.business_phone} onChange={e => setForm(f => ({ ...f, business_phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create Client</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
