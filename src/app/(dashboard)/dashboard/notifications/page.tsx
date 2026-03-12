'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import Modal from '@/components/dashboard/Modal'
import { Bell, Check, CheckCheck, Send, AlertTriangle, Camera, Clock, MessageSquare, ExternalLink } from 'lucide-react'

interface Notification {
  id: number
  sender: number
  sender_name: string
  recipient: number
  recipient_name: string
  project: number | null
  project_name: string | null
  category: string
  priority: string
  title: string
  message: string
  link: string
  is_read: boolean
  created_at: string
}

interface Project {
  id: number
  name: string
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  photo_low: { label: 'Low on Photos', icon: Camera, color: 'text-orange-500 bg-orange-50' },
  review_request: { label: 'Review Request', icon: MessageSquare, color: 'text-blue-500 bg-blue-50' },
  deadline: { label: 'Deadline Alert', icon: Clock, color: 'text-red-500 bg-red-50' },
  client_action: { label: 'Client Action Needed', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
  general: { label: 'General', icon: Bell, color: 'text-gray-500 bg-gray-50' },
}

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [showSend, setShowSend] = useState(false)
  const [admins, setAdmins] = useState<{ id: number; username: string; first_name: string; last_name: string }[]>([])
  const [form, setForm] = useState({
    recipient: '',
    project: '',
    category: 'photo_low',
    priority: 'high',
    title: '',
    message: '',
    link: '',
  })

  const reload = () => {
    api.get<{ results: Notification[] }>('/notifications/').then(d => setNotifications(d.results)).catch(() => {})
  }

  useEffect(() => {
    reload()
    api.get<{ results: Project[] }>('/clients/projects/').then(d => setProjects(d.results)).catch(() => {})
    if (user?.role === 'employee') {
      api.get<{ results: { id: number; username: string; first_name: string; last_name: string }[] }>('/auth/admins/').then(d => setAdmins(d.results)).catch(() => {})
    }
  }, [user?.role])

  const markRead = async (id: number) => {
    await api.post(`/notifications/${id}/read/`, {})
    reload()
  }

  const markAllRead = async () => {
    await api.post('/notifications/mark-all-read/', {})
    reload()
  }

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/notifications/', {
      recipient: Number(form.recipient),
      project: form.project ? Number(form.project) : null,
      category: form.category,
      priority: form.priority,
      title: form.title,
      message: form.message,
      link: form.link || '',
    })
    reload()
    setShowSend(false)
    setForm({ recipient: '', project: '', category: 'photo_low', priority: 'high', title: '', message: '', link: '' })
  }

  const quickAlert = (cat: string, projectId: number, projectName: string) => {
    const templates: Record<string, { title: string; message: string }> = {
      photo_low: {
        title: `Low on photos — ${projectName}`,
        message: `Running low on GMB photos for ${projectName}. Please request more photos from the client so we can continue the posting schedule.`,
      },
      client_action: {
        title: `Client action needed — ${projectName}`,
        message: `Need client input/action for ${projectName}. Please follow up with the client.`,
      },
    }
    const t = templates[cat] || { title: '', message: '' }
    const adminId = admins.length > 0 ? String(admins[0].id) : ''
    setForm({
      recipient: adminId,
      project: String(projectId),
      category: cat,
      priority: 'high',
      title: t.title,
      message: t.message,
      link: '',
    })
    setShowSend(true)
  }

  const unreadCount = notifications.filter(n => !n.is_read).length
  const isEmployee = user?.role === 'employee'

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread`}
        action={
          <div className="flex gap-2">
            {user?.role === 'admin' && unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-bg-secondary">
                <CheckCheck size={14} /> Mark All Read
              </button>
            )}
            {isEmployee && (
              <button onClick={() => setShowSend(true)} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
                <Send size={14} /> Send Alert
              </button>
            )}
          </div>
        }
      />

      {/* Quick Alert Buttons for Employees */}
      {isEmployee && projects.length > 0 && (
        <div className="mb-6 bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold mb-3">Quick Alerts</h3>
          <div className="flex flex-wrap gap-2">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => quickAlert('photo_low', p.id, p.name)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-orange-200 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100"
              >
                <Camera size={14} /> Low Photos: {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.map(n => {
          const cat = categoryConfig[n.category] || categoryConfig.general
          const CatIcon = cat.icon
          return (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-colors ${
                n.is_read ? 'border-border opacity-60' : 'border-accent/30 bg-accent/5'
              }`}
            >
              <div className={`p-2 rounded-lg ${cat.color}`}>
                <CatIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-sm font-semibold ${n.is_read ? 'text-text-secondary' : 'text-text-primary'}`}>{n.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[n.priority]}`}>
                    {n.priority}
                  </span>
                  {n.project_name && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-bg-secondary text-text-muted">{n.project_name}</span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-2">{n.message}</p>
                {n.link && (
                  <a href={n.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline mb-2">
                    <ExternalLink size={11} /> {n.link.length > 60 ? n.link.slice(0, 60) + '…' : n.link}
                  </a>
                )}
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>From: {n.sender_name || 'System'}</span>
                  <span>{new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              {user?.role === 'admin' && !n.is_read && (
                <button onClick={() => markRead(n.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg" title="Mark as read">
                  <Check size={16} />
                </button>
              )}
            </div>
          )
        })}
        {notifications.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-text-muted">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p>No notifications</p>
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      <Modal open={showSend} onClose={() => setShowSend(false)} title="Send Alert to Admin" wide>
        <form onSubmit={sendNotification} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Send To *</label>
              <select value={form.recipient} onChange={e => setForm(f => ({ ...f, recipient: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
                <option value="">Select admin</option>
                {admins.map(a => <option key={a.id} value={a.id}>{a.first_name} {a.last_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <select value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">No specific project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="photo_low">Low on Photos</option>
                <option value="client_action">Client Action Needed</option>
                <option value="deadline">Deadline Alert</option>
                <option value="review_request">Review Request</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority *</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Link (optional)</label>
            <input type="url" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="https://drive.google.com/... or live page URL" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowSend(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-accent text-white text-sm font-medium rounded-lg flex items-center gap-2">
              <Send size={14} /> Send Alert
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
