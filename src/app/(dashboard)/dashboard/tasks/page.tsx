'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import Modal from '@/components/dashboard/Modal'

interface Deliverable {
  id: number
  monthly_plan: number
  category: string
  category_display: string
  title: string
  status: string
  link: string
  live_url: string
  due_date: string | null
  completed_date: string | null
}

interface MonthlyPlan {
  id: number
  service_name: string
  project_name: string
  client_name: string
  client_id: number
  month_display: string
  deliverables: Deliverable[]
}

interface TaskLog {
  id: number
  deliverable: number | null
  deliverable_title: string | null
  client_name: string | null
  description: string
  hours: string
  date: string
  document_link: string
  live_link: string
}

const categoryColors: Record<string, string> = {
  gbp_post: 'bg-green-100 text-green-700',
  blog_post: 'bg-blue-100 text-blue-700',
  citation: 'bg-purple-100 text-purple-700',
  backlink: 'bg-indigo-100 text-indigo-700',
  on_page: 'bg-yellow-100 text-yellow-700',
  technical: 'bg-orange-100 text-orange-700',
  review: 'bg-pink-100 text-pink-700',
  reporting: 'bg-cyan-100 text-cyan-700',
  design: 'bg-violet-100 text-violet-700',
  development: 'bg-emerald-100 text-emerald-700',
  other: 'bg-gray-100 text-gray-600',
}

export default function EmployeeTasksPage() {
  const [plans, setPlans] = useState<MonthlyPlan[]>([])
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([])
  const [showLogTime, setShowLogTime] = useState(false)
  const [logForm, setLogForm] = useState({
    deliverable: '', client: '', description: '', hours: '',
    date: new Date().toISOString().split('T')[0],
    document_link: '', live_link: '',
  })
  const [logError, setLogError] = useState('')

  const reload = () => {
    api.get<{ results: MonthlyPlan[] }>('/clients/plans/').then(d => setPlans(d.results))
    api.get<{ results: TaskLog[] }>('/employees/tasks/').then(d => setTaskLogs(d.results))
  }

  useEffect(() => { reload() }, [])

  const allDeliverables = plans.flatMap(p => p.deliverables.map(d => ({ ...d, plan: p })))
  const todo = allDeliverables.filter(d => d.status !== 'completed' && d.status !== 'published')
  const done = allDeliverables.filter(d => d.status === 'completed' || d.status === 'published')

  const updateStatus = async (deliverableId: number, status: string) => {
    const updates: Record<string, unknown> = { status }
    if (status === 'completed') updates.completed_date = new Date().toISOString().split('T')[0]
    try {
      await api.patch(`/clients/deliverables/${deliverableId}/`, updates)
      reload()
    } catch {
      alert('Failed to update status. Please try again.')
    }
  }

  const addLink = async (deliverableId: number, field: 'link' | 'live_url') => {
    const label = field === 'link' ? 'document/draft link' : 'live URL'
    const url = prompt(`Enter ${label}:`)
    if (!url) return
    try {
      await api.patch(`/clients/deliverables/${deliverableId}/`, { [field]: url })
      reload()
    } catch {
      alert('Failed to save link. Please try again.')
    }
  }

  const openLogTime = (deliverable?: { id: number; plan: MonthlyPlan }) => {
    setLogError('')
    if (deliverable) {
      setLogForm({
        deliverable: String(deliverable.id),
        client: String(deliverable.plan.client_id),
        description: '', hours: '',
        date: new Date().toISOString().split('T')[0],
        document_link: '', live_link: '',
      })
    } else {
      setLogForm({
        deliverable: '', client: '', description: '', hours: '',
        date: new Date().toISOString().split('T')[0],
        document_link: '', live_link: '',
      })
    }
    setShowLogTime(true)
  }

  const submitLog = async (e: React.FormEvent) => {
    e.preventDefault()
    setLogError('')

    const isExtra = !logForm.deliverable
    if (isExtra) {
      if (!logForm.description.trim()) {
        setLogError('Description is required for extra work.')
        return
      }
      if (!logForm.document_link.trim() && !logForm.live_link.trim()) {
        setLogError('Extra work requires a document link or live link as proof.')
        return
      }
    }

    try {
      await api.post('/employees/tasks/', {
        deliverable: logForm.deliverable ? Number(logForm.deliverable) : null,
        client: logForm.client ? Number(logForm.client) : null,
        description: logForm.description,
        hours: Number(logForm.hours),
        date: logForm.date,
        document_link: logForm.document_link,
        live_link: logForm.live_link,
      })
      setShowLogTime(false)
      reload()
    } catch {
      setLogError('Failed to log time. Check all fields.')
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const todayHours = taskLogs
    .filter(t => t.date === todayStr)
    .reduce((s, t) => s + Number(t.hours), 0)

  // Unique clients from plans for the dropdown
  const clients = [...new Map(plans.map(p => [p.client_id, p.client_name])).entries()]
    .map(([id, name]) => ({ id, name }))

  return (
    <div>
      <PageHeader
        title="My Deliverables"
        description="Tasks assigned to you across all clients"
        action={
          <button onClick={() => openLogTime()} className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
            Log Time
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatsCard label="To Do" value={String(todo.filter(d => d.status === 'not_started').length)} color="default" />
        <StatsCard label="In Progress" value={String(todo.filter(d => d.status === 'in_progress').length)} color="blue" />
        <StatsCard label="Completed" value={String(done.length)} color="green" />
        <StatsCard label="Hours Today" value={todayHours.toFixed(1)} color="default" />
      </div>

      {/* Active tasks */}
      {todo.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Active Tasks</h2>
          <div className="bg-white rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted border-b border-border">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Deliverable</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Links</th>
                  <th className="px-6 py-3">Due</th>
                  <th className="px-6 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {todo.map(d => (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/30">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium">{d.plan.client_name}</p>
                      <p className="text-xs text-text-muted">{d.plan.service_name}</p>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[d.category] || categoryColors.other}`}>
                        {d.category_display}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{d.title}</td>
                    <td className="px-6 py-3">
                      <select
                        value={d.status}
                        onChange={e => updateStatus(d.id, e.target.value)}
                        className={`text-xs font-medium border-0 rounded-full px-2.5 py-1 cursor-pointer ${
                          d.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {d.link ? (
                          <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Draft</a>
                        ) : (
                          <button onClick={() => addLink(d.id, 'link')} className="text-xs text-text-muted hover:text-accent">+ Draft</button>
                        )}
                        {d.live_url ? (
                          <a href={d.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">Live</a>
                        ) : (
                          <button onClick={() => addLink(d.id, 'live_url')} className="text-xs text-text-muted hover:text-accent">+ Live</button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs text-text-secondary">{d.due_date || '—'}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => openLogTime(d)} className="text-xs text-accent hover:underline">Log</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent time logs */}
      {taskLogs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Recent Time Logs</h2>
          <div className="bg-white rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted border-b border-border">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Hours</th>
                  <th className="px-6 py-3">Links</th>
                </tr>
              </thead>
              <tbody>
                {taskLogs.slice(0, 20).map(t => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-3 text-sm">{t.date}</td>
                    <td className="px-6 py-3 text-sm font-medium">{t.deliverable_title || <span className="text-text-muted italic">Extra work</span>}</td>
                    <td className="px-6 py-3 text-sm text-text-secondary">{t.description || '—'}</td>
                    <td className="px-6 py-3 text-sm font-medium">{Number(t.hours).toFixed(1)}h</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {t.document_link && <a href={t.document_link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Doc</a>}
                        {t.live_link && <a href={t.live_link} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">Live</a>}
                        {!t.document_link && !t.live_link && <span className="text-xs text-text-muted">—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Completed deliverables */}
      {done.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Completed ({done.length})</h2>
          <div className="bg-white rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted border-b border-border">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Deliverable</th>
                  <th className="px-6 py-3">Links</th>
                  <th className="px-6 py-3">Completed</th>
                </tr>
              </thead>
              <tbody>
                {done.map(d => (
                  <tr key={d.id} className="border-b border-border last:border-0 text-text-secondary">
                    <td className="px-6 py-3 text-sm">{d.plan.client_name}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[d.category] || categoryColors.other}`}>
                        {d.category_display}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm line-through opacity-60">{d.title}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {d.link && <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Draft</a>}
                        {d.live_url && <a href={d.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">Live</a>}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs">{d.completed_date || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Time Modal */}
      <Modal open={showLogTime} onClose={() => setShowLogTime(false)} title="Log Working Time">
        <form onSubmit={submitLog} className="space-y-4">
          {!logForm.deliverable && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              Logging time for work not linked to a deliverable. A description and at least one link (document or live) are required.
            </div>
          )}

          {logForm.deliverable ? (
            <div className="bg-bg-secondary rounded-lg p-3 text-sm">
              Logging time for: <strong>{allDeliverables.find(d => d.id === Number(logForm.deliverable))?.title}</strong>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Client (optional)</label>
              <select value={logForm.client} onChange={e => setLogForm(f => ({ ...f, client: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Hours *</label>
              <input type="number" step="0.25" min="0.25" value={logForm.hours} onChange={e => setLogForm(f => ({ ...f, hours: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. 1.5" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Date *</label>
              <input type="date" value={logForm.date} onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">
              Description {!logForm.deliverable && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={logForm.description}
              onChange={e => setLogForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20"
              placeholder="What did you work on?"
              required={!logForm.deliverable}
            />
          </div>

          {!logForm.deliverable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Document Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={logForm.document_link}
                  onChange={e => setLogForm(f => ({ ...f, document_link: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  placeholder="Google Drive, draft link..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Live Link
                </label>
                <input
                  type="url"
                  value={logForm.live_link}
                  onChange={e => setLogForm(f => ({ ...f, live_link: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  placeholder="Published URL..."
                />
              </div>
            </div>
          )}

          {logError && <p className="text-sm text-red-600">{logError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowLogTime(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Log Time</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
