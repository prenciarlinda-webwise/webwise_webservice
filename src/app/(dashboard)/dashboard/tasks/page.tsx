'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import Modal from '@/components/dashboard/Modal'
import { Clock, ChevronDown, ChevronRight, Pencil } from 'lucide-react'

interface Deliverable {
  id: number
  monthly_plan: number
  category: string
  category_display: string
  title: string
  description: string
  target_keyword: string
  status: string
  estimated_minutes: number | null
  logged_hours: string | null
  link: string
  live_url: string
  due_date: string | null
  completed_date: string | null
  notes: string
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
  keyword_research: 'bg-teal-100 text-teal-700',
  competitor: 'bg-slate-100 text-slate-700',
  design: 'bg-violet-100 text-violet-700',
  development: 'bg-emerald-100 text-emerald-700',
  other: 'bg-gray-100 text-gray-600',
}

// Grouped time benchmarks
const TIME_GUIDE: { group: string; items: { label: string; time: string }[] }[] = [
  { group: 'GMB Tasks', items: [
    { label: 'GMB Post / Update', time: '8 min' },
    { label: 'GMB New Profile Setup', time: '1h' },
    { label: 'GMB Audit', time: '45 min' },
    { label: 'Review Reply (standard)', time: '5 min' },
    { label: 'Review Reply (detailed / negative)', time: '10 min' },
  ]},
  { group: 'Citations', items: [
    { label: 'Simple Listing (NAP only)', time: '8 min' },
    { label: 'Full Profile (images, description, hours)', time: '15 min' },
    { label: 'NAP Audit per client', time: '45 min' },
  ]},
  { group: 'On-Page SEO', items: [
    { label: 'On-Page Optimization (per page)', time: '45 min' },
    { label: 'Schema Implementation', time: '30 min' },
    { label: 'AEO / FAQ Optimization', time: '45 min' },
  ]},
  { group: 'Content', items: [
    { label: 'Blog Post', time: '2h' },
    { label: 'Service / Page Copy', time: '1h' },
    { label: 'Social Media Post', time: '15 min' },
  ]},
  { group: 'Technical SEO', items: [
    { label: 'Technical Fix', time: '1h' },
    { label: 'Full Technical Audit', time: '4h' },
  ]},
  { group: 'Research & Analysis', items: [
    { label: 'Keyword Research (detailed)', time: '2h 30min' },
    { label: 'Backlink Outreach (per prospect)', time: '30 min' },
  ]},
  { group: 'Reporting & Admin', items: [
    { label: 'Monthly Report', time: '30 min' },
    { label: 'Account Management Task', time: '20 min' },
    { label: 'QA Review', time: '30 min' },
  ]},
]

export default function EmployeeTasksPage() {
  const [plans, setPlans] = useState<MonthlyPlan[]>([])
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([])
  const [showLogTime, setShowLogTime] = useState(false)
  const [logForm, setLogForm] = useState({
    deliverable: '', client: '', description: '', logH: '', logM: '',
    date: new Date().toISOString().split('T')[0],
    document_link: '', live_link: '',
  })
  const [logError, setLogError] = useState('')
  const [showGuide, setShowGuide] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('day')
  const [editTask, setEditTask] = useState<(Deliverable & { plan: MonthlyPlan }) | null>(null)
  const [editForm, setEditForm] = useState({ title: '', status: '', description: '', link: '', live_url: '', notes: '' })
  const [editLogH, setEditLogH] = useState('')
  const [editLogM, setEditLogM] = useState('')
  const [editLogDesc, setEditLogDesc] = useState('')
  const [editLogSaving, setEditLogSaving] = useState(false)
  const [editLogMsg, setEditLogMsg] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const monthParam = `${selectedMonth}-01`

  const reload = () => {
    api.get<{ results: MonthlyPlan[] }>(`/clients/plans/?month=${monthParam}`).then(d => setPlans(d.results))
    api.get<{ results: TaskLog[] }>(`/employees/tasks/?month=${monthParam}`).then(d => setTaskLogs(d.results))
  }

  useEffect(() => { reload() }, [selectedMonth])

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

  const openEditTask = (d: Deliverable & { plan: MonthlyPlan }) => {
    setEditTask(d)
    setEditForm({ title: d.title, status: d.status, description: d.description || '', link: d.link || '', live_url: d.live_url || '', notes: d.notes || '' })
    setEditLogH(''); setEditLogM(''); setEditLogDesc(''); setEditLogMsg('')
  }

  const saveEditTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTask) return
    const updates: Record<string, unknown> = { ...editForm }
    if (editForm.status === 'completed' || editForm.status === 'published') {
      updates.completed_date = new Date().toISOString().split('T')[0]
    }
    try {
      await api.patch(`/clients/deliverables/${editTask.id}/`, updates)
      reload(); setEditTask(null)
    } catch { alert('Failed to save.') }
  }

  const logTimeForTask = async () => {
    if (!editTask) return
    const hours = (Number(editLogH) || 0) + (Number(editLogM) || 0) / 60
    if (hours <= 0) return
    setEditLogSaving(true)
    try {
      await api.post('/employees/tasks/', {
        deliverable: editTask.id,
        client: editTask.plan.client_id,
        description: editLogDesc,
        hours: Math.round(hours * 100) / 100,
        date: new Date().toISOString().split('T')[0],
      })
      setEditLogH(''); setEditLogM(''); setEditLogDesc('')
      setEditLogMsg('Logged!')
      reload()
    } catch { setEditLogMsg('Failed to log time') }
    setEditLogSaving(false)
  }

  const openLogTime = (deliverable?: { id: number; plan: MonthlyPlan }) => {
    setLogError('')
    if (deliverable) {
      setLogForm({
        deliverable: String(deliverable.id),
        client: String(deliverable.plan.client_id),
        description: '', logH: '', logM: '',
        date: new Date().toISOString().split('T')[0],
        document_link: '', live_link: '',
      })
    } else {
      setLogForm({
        deliverable: '', client: '', description: '', logH: '', logM: '',
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

    const totalHours = (Number(logForm.logH) || 0) + (Number(logForm.logM) || 0) / 60
    if (totalHours <= 0) { setLogError('Enter hours or minutes.'); return }
    try {
      await api.post('/employees/tasks/', {
        deliverable: logForm.deliverable ? Number(logForm.deliverable) : null,
        client: logForm.client ? Number(logForm.client) : null,
        description: logForm.description,
        hours: Math.round(totalHours * 100) / 100,
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

  // Time period calculations
  const getWeekStart = () => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1) // Monday
    return d.toISOString().split('T')[0]
  }
  const getMonthStart = () => {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  }
  const periodStart = timePeriod === 'day' ? todayStr : timePeriod === 'week' ? getWeekStart() : getMonthStart()
  const periodHours = taskLogs
    .filter(t => t.date >= periodStart)
    .reduce((s, t) => s + Number(t.hours), 0)
  const periodLabel = timePeriod === 'day' ? 'Today' : timePeriod === 'week' ? 'This Week' : 'This Month'

  // Filtered deliverables
  const filteredTodo = statusFilter
    ? (statusFilter === 'completed' ? done : todo.filter(d => d.status === statusFilter))
    : todo

  // Unique clients from plans for the dropdown
  const clients = [...new Map(plans.map(p => [p.client_id, p.client_name])).entries()]
    .map(([id, name]) => ({ id, name }))

  return (
    <div>
      <PageHeader
        title="My Deliverables"
        description="Tasks assigned to you across all clients"
        action={
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm"
            />
            <button onClick={() => openLogTime()} className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
              Log Time
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <button onClick={() => setStatusFilter(statusFilter === 'not_started' ? null : 'not_started')} className={`text-left rounded-xl border-2 transition-colors ${statusFilter === 'not_started' ? 'border-gray-400 bg-gray-50' : 'border-transparent'}`}>
          <StatsCard label="To Do" value={String(todo.filter(d => d.status === 'not_started').length)} color="default" />
        </button>
        <button onClick={() => setStatusFilter(statusFilter === 'in_progress' ? null : 'in_progress')} className={`text-left rounded-xl border-2 transition-colors ${statusFilter === 'in_progress' ? 'border-blue-400 bg-blue-50' : 'border-transparent'}`}>
          <StatsCard label="In Progress" value={String(todo.filter(d => d.status === 'in_progress').length)} color="blue" />
        </button>
        <button onClick={() => setStatusFilter(statusFilter === 'completed' ? null : 'completed')} className={`text-left rounded-xl border-2 transition-colors ${statusFilter === 'completed' ? 'border-green-400 bg-green-50' : 'border-transparent'}`}>
          <StatsCard label="Completed" value={String(done.length)} color="green" />
        </button>
        <div className="relative">
          <StatsCard label={`Time ${periodLabel}`} value={(() => { const hrs = Math.floor(periodHours); const mins = Math.round((periodHours - hrs) * 60); return hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m` })()} color="default" />
          <div className="absolute top-2 right-3 flex gap-1">
            {(['day', 'week', 'month'] as const).map(p => (
              <button key={p} onClick={() => setTimePeriod(p)} className={`text-[10px] px-1.5 py-0.5 rounded ${timePeriod === p ? 'bg-accent text-white' : 'bg-bg-secondary text-text-muted hover:bg-accent/10'}`}>
                {p === 'day' ? 'D' : p === 'week' ? 'W' : 'M'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {statusFilter && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-text-muted">Filtering:</span>
          <span className="text-sm font-medium px-2 py-0.5 bg-bg-secondary rounded-full">{statusFilter === 'not_started' ? 'To Do' : statusFilter === 'in_progress' ? 'In Progress' : 'Completed'}</span>
          <button onClick={() => setStatusFilter(null)} className="text-xs text-accent hover:underline">Clear</button>
        </div>
      )}

      {/* Time Reference Guide */}
      <div className="mb-6 bg-white rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full px-5 py-3 flex items-center justify-between hover:bg-bg-secondary/30 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Clock size={14} className="text-accent" /> Time Reference Guide
          </span>
          <span className="flex items-center gap-2 text-xs text-text-muted">
            {showGuide ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </button>
        {showGuide && (
          <div className="border-t border-border px-5 py-4">
            <p className="text-xs text-text-muted mb-4">Maximum expected time per task. These are upper limits — most tasks should be completed faster.</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TIME_GUIDE.map(g => (
                <div key={g.group}>
                  <h4 className="text-xs font-semibold text-text-primary mb-2">{g.group}</h4>
                  <div className="space-y-1.5">
                    {g.items.map(item => (
                      <div key={item.label} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">{item.label}</span>
                        <span className="font-semibold text-accent ml-2 whitespace-nowrap">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active tasks */}
      {filteredTodo.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{statusFilter === 'completed' ? 'Completed Tasks' : 'Active Tasks'} ({filteredTodo.length})</h2>
          <div className="bg-white rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted border-b border-border">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Deliverable</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Links</th>
                  <th className="px-6 py-3">Est.</th>
                  <th className="px-6 py-3">Logged</th>
                  <th className="px-6 py-3">Due</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTodo.map(d => (
                  <tr
                    key={d.id}
                    onClick={() => openEditTask(d)}
                    className="border-b border-border last:border-0 hover:bg-bg-secondary/30 cursor-pointer"
                  >
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
                        onClick={e => e.stopPropagation()}
                        className={`text-xs font-medium border-0 rounded-full px-2.5 py-1 cursor-pointer ${
                          d.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="published">Published</option>
                      </select>
                    </td>
                    <td className="px-6 py-3" onClick={e => e.stopPropagation()}>
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
                    <td className="px-6 py-3 text-xs text-text-muted">{d.estimated_minutes ? `${d.estimated_minutes}m` : '—'}</td>
                    <td className={`px-6 py-3 text-xs font-medium ${d.logged_hours && d.estimated_minutes && Number(d.logged_hours) * 60 > d.estimated_minutes ? 'text-red-500' : 'text-text-muted'}`}>{d.logged_hours ? (() => { const h = Number(d.logged_hours); const hrs = Math.floor(h); const mins = Math.round((h - hrs) * 60); return hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m` })() : '—'}</td>
                    <td className="px-6 py-3 text-xs text-text-secondary">{d.due_date || '—'}</td>
                    <td className="px-6 py-3">
                      <Pencil size={13} className="text-text-muted" />
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
                    <td className="px-6 py-3 text-sm font-medium">{(() => { const h = Number(t.hours); const hrs = Math.floor(h); const mins = Math.round((h - hrs) * 60); return hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m` })()}</td>
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
      {done.length > 0 && statusFilter !== 'completed' && (
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
                    <td className="px-6 py-3 text-sm line-through opacity-60">
                      <button onClick={() => openEditTask(d)} className="text-left hover:text-accent hover:underline">{d.title}</button>
                    </td>
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

      {/* Edit Task Modal */}
      <Modal open={editTask !== null} onClose={() => setEditTask(null)} title="Update Task" wide>
        {editTask && (
          <form onSubmit={saveEditTask} className="space-y-4">
            <div className="bg-bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-text-muted">
                {editTask.plan.client_name} · {editTask.plan.service_name} · {editTask.category_display}
                {editTask.target_keyword && <> · <span className="italic">{editTask.target_keyword}</span></>}
                {editTask.due_date && <> · Due: {editTask.due_date}</>}
                {editTask.estimated_minutes && <> · <span className="text-accent font-medium">{editTask.estimated_minutes >= 60 ? `${Math.floor(editTask.estimated_minutes / 60)}h ${editTask.estimated_minutes % 60}m` : `${editTask.estimated_minutes}m`} target</span></>}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Title</label>
              <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
              <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Description / Work Notes</label>
              <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-24" placeholder="Add details about your work..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Draft / Folder Link</label>
                <input value={editForm.link} onChange={e => setEditForm(f => ({ ...f, link: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Google Drive, Figma, etc." />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Live URL</label>
                <input value={editForm.live_url} onChange={e => setEditForm(f => ({ ...f, live_url: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Published page URL" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Notes</label>
              <textarea value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm h-16" placeholder="Any additional notes..." />
            </div>
            {/* Inline time log */}
            <div className="border-t border-border pt-4">
              <label className="block text-xs font-semibold text-text-muted mb-2 flex items-center gap-1"><Clock size={12} /> Log Time for This Task</label>
              <div className="flex items-end gap-3">
                <div className="w-20">
                  <label className="block text-[10px] text-text-muted mb-0.5">Hours</label>
                  <input type="number" min="0" value={editLogH} onChange={e => setEditLogH(e.target.value)} className="w-full px-2.5 py-1.5 border border-border rounded-lg text-sm" placeholder="0" />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] text-text-muted mb-0.5">Minutes</label>
                  <input type="number" min="0" max="59" value={editLogM} onChange={e => setEditLogM(e.target.value)} className="w-full px-2.5 py-1.5 border border-border rounded-lg text-sm" placeholder="0" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-text-muted mb-0.5">Description (optional)</label>
                  <input value={editLogDesc} onChange={e => setEditLogDesc(e.target.value)} className="w-full px-2.5 py-1.5 border border-border rounded-lg text-sm" placeholder="What did you do?" />
                </div>
                <button type="button" onClick={logTimeForTask} disabled={editLogSaving || ((Number(editLogH) || 0) === 0 && (Number(editLogM) || 0) === 0)} className="px-4 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 whitespace-nowrap">
                  {editLogSaving ? 'Saving...' : 'Log'}
                </button>
              </div>
              {editLogMsg && <p className={`text-xs mt-1 ${editLogMsg.startsWith('Failed') ? 'text-red-500' : 'text-green-600'}`}>{editLogMsg}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditTask(null)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Save</button>
            </div>
          </form>
        )}
      </Modal>

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
              {(() => { const est = allDeliverables.find(d => d.id === Number(logForm.deliverable))?.estimated_minutes; return est ? <span className="ml-2 text-xs text-text-muted">(target: {est}min)</span> : null })()}
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Hours</label>
              <input type="number" min="0" value={logForm.logH} onChange={e => setLogForm(f => ({ ...f, logH: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Minutes</label>
              <input type="number" min="0" max="59" value={logForm.logM} onChange={e => setLogForm(f => ({ ...f, logM: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="0" />
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
