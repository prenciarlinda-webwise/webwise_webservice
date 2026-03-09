'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import Modal from '@/components/dashboard/Modal'
import { Plus, Trash2, Phone, Mail, MapPin, Globe, ExternalLink, ArrowRight } from 'lucide-react'

interface Service { id: number; name: string; description: string; status: string; monthly_price: string | null }
interface Project {
  id: number; name: string; website_url: string; status: string; services: Service[]
  business_phone: string; business_email: string; business_address: string
}
interface Client {
  id: number; user_email: string; user_name: string; business_name: string; business_phone: string; business_email: string;
  services: string[]; products: string[]; price_per_service: Record<string, number>; service_locations: string[];
  social_links: Record<string, string>; notes: string; projects: Project[]
}
interface Payment { id: number; service_name: string; project_name: string; amount: string; status: string; due_date: string; description: string }
interface ServiceTemplate { id: number; name: string }

export default function ClientDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isEmployee = user?.role === 'employee'
  const [client, setClient] = useState<Client | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [templates, setTemplates] = useState<ServiceTemplate[]>([])
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddService, setShowAddService] = useState<number | null>(null)
  const [projectForm, setProjectForm] = useState({ name: '', website_url: '', business_phone: '', business_email: '', business_address: '', notes: '' })
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', monthly_price: '', template_id: '' })

  const reload = () => {
    api.get<Client>(`/clients/${id}/`).then(setClient)
    if (!isEmployee) {
      api.get<{ results: Payment[] }>(`/payments/?client=${id}`).then(d => setPayments(d.results))
    }
  }

  useEffect(() => {
    reload()
    if (isAdmin) {
      api.get<{ results: ServiceTemplate[] }>('/clients/templates/').then(d => setTemplates(d.results))
    }
  }, [id, isAdmin])

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/clients/projects/', { client: Number(id), ...projectForm })
    reload()
    setShowAddProject(false)
    setProjectForm({ name: '', website_url: '', business_phone: '', business_email: '', business_address: '', notes: '' })
  }

  const deleteProject = async (pid: number, name: string) => {
    if (!confirm(`Delete project "${name}"?`)) return
    await api.delete(`/clients/projects/${pid}/`)
    reload()
  }

  const addService = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/clients/services/', {
      project: showAddService,
      name: serviceForm.name,
      description: serviceForm.description,
      monthly_price: serviceForm.monthly_price || null,
      template_id: serviceForm.template_id ? Number(serviceForm.template_id) : undefined,
    })
    reload()
    setShowAddService(null)
    setServiceForm({ name: '', description: '', monthly_price: '', template_id: '' })
  }

  const deleteService = async (sid: number) => {
    if (!confirm('Delete this service?')) return
    await api.delete(`/clients/services/${sid}/`)
    reload()
  }

  if (!client) return <div className="animate-pulse h-8 w-48 bg-bg-secondary rounded" />

  const monthlyTotal = client.projects.reduce((sum, p) =>
    sum + p.services.reduce((s, svc) => s + (svc.monthly_price ? Number(svc.monthly_price) : 0), 0), 0
  )
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue')

  return (
    <div>
      <PageHeader
        title={client.business_name}
        action={<Link href="/dashboard/clients" className="text-sm text-accent hover:underline">&larr; Back to clients</Link>}
      />

      {/* Client overview bar */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          {!isEmployee && (
            <div>
              <span className="text-text-muted">Contact</span>
              <p className="font-medium">{client.user_name}</p>
            </div>
          )}
          {!isEmployee && (client.business_email || client.user_email) && (
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Mail size={14} className="text-text-muted" />
              {client.business_email || client.user_email}
            </div>
          )}
          {client.business_phone && (
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Phone size={14} className="text-text-muted" />
              {client.business_phone}
            </div>
          )}
          {client.service_locations?.length > 0 && (
            <div className="flex items-center gap-1.5 text-text-secondary">
              <MapPin size={14} className="text-text-muted" />
              {client.service_locations.join(', ')}
            </div>
          )}
          <div className="ml-auto flex items-center gap-6">
            {!isEmployee && (
              <div className="text-right">
                <span className="text-text-muted text-xs">Monthly Revenue</span>
                <p className="font-semibold">&euro;{monthlyTotal.toLocaleString()}/mo</p>
              </div>
            )}
            <div className="text-right">
              <span className="text-text-muted text-xs">Projects</span>
              <p className="font-semibold">{client.projects.length}</p>
            </div>
            {!isEmployee && pendingPayments.length > 0 && (
              <div className="text-right">
                <span className="text-text-muted text-xs">Pending</span>
                <p className="font-semibold text-amber-600">&euro;{pendingPayments.reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Services offered & social - collapsible row */}
        {(client.services.length > 0 || Object.keys(client.social_links).length > 0) && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            {client.services.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-text-muted">Services:</span>
                <div className="flex flex-wrap gap-1">
                  {client.services.map(s => <span key={s} className="bg-bg-secondary px-2 py-0.5 rounded">{s}</span>)}
                </div>
              </div>
            )}
            {Object.keys(client.social_links).length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                {Object.entries(client.social_links).map(([platform, url]) => (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline capitalize">
                    {platform.replace(/_/g, ' ')}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Projects heading */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Projects ({client.projects.length})</h2>
        {isAdmin && (
          <button onClick={() => setShowAddProject(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={14} /> Add Project
          </button>
        )}
      </div>

      {/* Project cards */}
      <div className="space-y-4 mb-8">
        {client.projects.map(project => {
          const projectPayments = payments.filter(p => p.project_name === project.name)
          const projectMonthly = project.services.reduce((s, svc) => s + (svc.monthly_price ? Number(svc.monthly_price) : 0), 0)

          return (
            <div key={project.id} className="bg-white rounded-xl border border-border overflow-hidden">
              {/* Project header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{project.name}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                      {project.business_phone && (
                        <span className="flex items-center gap-1"><Phone size={11} /> {project.business_phone}</span>
                      )}
                      {project.business_email && (
                        <span className="flex items-center gap-1"><Mail size={11} /> {project.business_email}</span>
                      )}
                      {project.business_address && (
                        <span className="flex items-center gap-1"><MapPin size={11} /> {project.business_address}</span>
                      )}
                      {project.website_url && (
                        <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent hover:underline">
                          <Globe size={11} /> {project.website_url.replace(/^https?:\/\//, '')}
                          <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isEmployee && projectMonthly > 0 && (
                    <span className="text-sm font-medium">&euro;{projectMonthly.toLocaleString()}/mo</span>
                  )}
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-accent border border-accent rounded-lg hover:bg-accent/5"
                  >
                    Manage <ArrowRight size={14} />
                  </Link>
                  {isAdmin && (
                    <button onClick={() => deleteProject(project.id, project.name)} className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Services table */}
              <div className="px-6 py-3">
                {project.services.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-text-muted">
                        <th className="text-left py-1.5 font-normal">Service</th>
                        {!isEmployee && <th className="text-left py-1.5 font-normal">Price</th>}
                        <th className="text-left py-1.5 font-normal">Status</th>
                        {isAdmin && <th className="w-8"></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {project.services.map(s => (
                        <tr key={s.id} className="border-t border-border/50">
                          <td className="py-2">
                            <span className="font-medium">{s.name}</span>
                            {s.description && <p className="text-xs text-text-muted mt-0.5">{s.description}</p>}
                          </td>
                          {!isEmployee && (
                            <td className="py-2 text-text-secondary">
                              {s.monthly_price ? `€${s.monthly_price}/mo` : 'One-time'}
                            </td>
                          )}
                          <td className="py-2"><StatusBadge status={s.status} /></td>
                          {isAdmin && (
                            <td className="py-2 text-right">
                              <button onClick={() => deleteService(s.id)} className="p-1 text-text-muted hover:text-red-500 rounded hover:bg-red-50">
                                <Trash2 size={12} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-text-muted py-2">No services yet</p>
                )}

                {isAdmin && (
                  <button
                    onClick={() => setShowAddService(project.id)}
                    className="flex items-center gap-1 text-xs text-accent hover:underline mt-2 mb-1"
                  >
                    <Plus size={12} /> Add Service
                  </button>
                )}
              </div>

              {/* Payments summary for this project */}
              {!isEmployee && projectPayments.length > 0 && (
                <div className="px-6 py-3 border-t border-border bg-bg-secondary/30">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-text-muted font-medium">Payments:</span>
                    {(() => {
                      const paid = projectPayments.filter(p => p.status === 'paid')
                      const pending = projectPayments.filter(p => p.status === 'pending')
                      const overdue = projectPayments.filter(p => p.status === 'overdue')
                      const upcoming = projectPayments.filter(p => p.status === 'upcoming')
                      return (
                        <>
                          {paid.length > 0 && <span className="text-green-700">{paid.length} paid (&euro;{paid.reduce((s, p) => s + Number(p.amount), 0).toLocaleString()})</span>}
                          {pending.length > 0 && <span className="text-amber-600">{pending.length} pending (&euro;{pending.reduce((s, p) => s + Number(p.amount), 0).toLocaleString()})</span>}
                          {overdue.length > 0 && <span className="text-red-600">{overdue.length} overdue (&euro;{overdue.reduce((s, p) => s + Number(p.amount), 0).toLocaleString()})</span>}
                          {upcoming.length > 0 && <span className="text-text-secondary">{upcoming.length} upcoming (&euro;{upcoming.reduce((s, p) => s + Number(p.amount), 0).toLocaleString()})</span>}
                        </>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {client.projects.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-8 text-center text-text-muted">
            No projects yet. Add one to get started.
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <Modal open={showAddProject} onClose={() => setShowAddProject(false)} title="Add Project" wide>
        <form onSubmit={addProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project / Business Name *</label>
            <input value={projectForm.name} onChange={e => setProjectForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder='e.g. "904 Dumpster", "Prenga Construction"' required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Phone</label>
              <input value={projectForm.business_phone} onChange={e => setProjectForm(f => ({ ...f, business_phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="+1 555 0123" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Email</label>
              <input type="email" value={projectForm.business_email} onChange={e => setProjectForm(f => ({ ...f, business_email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="info@business.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Address</label>
            <input value={projectForm.business_address} onChange={e => setProjectForm(f => ({ ...f, business_address: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="123 Main St, City, State" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input value={projectForm.website_url} onChange={e => setProjectForm(f => ({ ...f, website_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="https://" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={projectForm.notes} onChange={e => setProjectForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddProject(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      {/* Add Service Modal */}
      <Modal open={showAddService !== null} onClose={() => setShowAddService(null)} title="Add Service / Package" wide>
        <form onSubmit={addService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Service Name *</label>
            <input value={serviceForm.name} onChange={e => setServiceForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder='e.g. "Premium Local SEO", "Website Development"' required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Price (&euro;)</label>
              <input type="number" step="0.01" value={serviceForm.monthly_price} onChange={e => setServiceForm(f => ({ ...f, monthly_price: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Leave empty for one-time" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Template (auto-generate deliverables)</label>
              <select value={serviceForm.template_id} onChange={e => setServiceForm(f => ({ ...f, template_id: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">No template</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          {serviceForm.template_id && (
            <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              All deliverables from this template will be automatically created when you add this service.
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddService(null)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create Service</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
