'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import Modal from '@/components/dashboard/Modal'
import { Plus, Trash2 } from 'lucide-react'

interface Employee {
  id: number
  user: number
  user_name: string
  user_email: string
  hourly_rate: string
}

interface TaskLog {
  id: number
  employee: number
  employee_name: string
  client: number | null
  client_name: string | null
  deliverable: number | null
  deliverable_title: string | null
  description: string
  hours: string
  cost: string
  date: string
  document_link: string
  live_link: string
}

interface Client { id: number; business_name: string }

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [tasks, setTasks] = useState<TaskLog[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [empForm, setEmpForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', hourly_rate: '' })
  const [taskForm, setTaskForm] = useState({ employee: '', client: '', description: '', hours: '', date: new Date().toISOString().split('T')[0], document_link: '', live_link: '' })

  const reload = () => {
    api.get<{ results: Employee[] }>('/employees/').then(d => setEmployees(d.results))
    api.get<{ results: TaskLog[] }>('/employees/tasks/').then(d => setTasks(d.results))
  }

  useEffect(() => {
    reload()
    api.get<{ results: Client[] }>('/clients/').then(d => setClients(d.results))
  }, [])

  const [empError, setEmpError] = useState('')

  const addEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmpError('')
    try {
      const newUser = await api.post<{ id: number }>('/auth/register/', {
        username: empForm.username,
        email: empForm.email,
        password: empForm.password,
        first_name: empForm.first_name,
        last_name: empForm.last_name,
        role: 'employee',
      })
      await api.post('/employees/', { user: newUser.id, hourly_rate: empForm.hourly_rate || '0' })
      reload()
      setShowAddEmployee(false)
      setEmpForm({ username: '', email: '', password: '', first_name: '', last_name: '', hourly_rate: '' })
    } catch (err: unknown) {
      const error = err as Record<string, string[]>
      if (error.username) setEmpError(`Username: ${error.username[0]}`)
      else if (error.email) setEmpError(`Email: ${error.email[0]}`)
      else if (error.password) setEmpError(`Password: ${error.password[0]}`)
      else setEmpError('Failed to create employee. Please try again.')
    }
  }

  const deleteEmployee = async (id: number, name: string) => {
    if (!confirm(`Delete employee "${name}"?`)) return
    await api.delete(`/employees/${id}/`)
    reload()
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/employees/tasks/', {
      employee: Number(taskForm.employee),
      client: taskForm.client ? Number(taskForm.client) : null,
      description: taskForm.description,
      hours: taskForm.hours,
      date: taskForm.date,
      document_link: taskForm.document_link || '',
      live_link: taskForm.live_link || '',
    })
    reload()
    setShowAddTask(false)
    setTaskForm({ employee: '', client: '', description: '', hours: '', date: new Date().toISOString().split('T')[0], document_link: '', live_link: '' })
  }

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task log?')) return
    await api.delete(`/employees/tasks/${id}/`)
    reload()
  }

  const totalHours = tasks.reduce((s, t) => s + Number(t.hours), 0)
  const totalCost = tasks.reduce((s, t) => s + Number(t.cost), 0)

  return (
    <div>
      <PageHeader
        title="Employees"
        description={`${employees.length} employees · ${totalHours.toFixed(1)}h logged · L${totalCost.toLocaleString()} total`}
        action={
          <div className="flex gap-2">
            <button onClick={() => setShowAddTask(true)} className="flex items-center gap-1 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-bg-secondary"><Plus size={14} /> Log Task</button>
            <button onClick={() => setShowAddEmployee(true)} className="flex items-center gap-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90"><Plus size={14} /> Add Employee</button>
          </div>
        }
      />

      {/* Employee Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {employees.map(emp => {
          const empTasks = tasks.filter(t => t.employee_name === emp.user_name)
          const empHours = empTasks.reduce((s, t) => s + Number(t.hours), 0)
          const empCost = empTasks.reduce((s, t) => s + Number(t.cost), 0)
          return (
            <div key={emp.id} className="bg-white rounded-xl border border-border p-6 relative group">
              <button onClick={() => deleteEmployee(emp.id, emp.user_name)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
              <h3 className="font-semibold">{emp.user_name}</h3>
              <p className="text-sm text-text-muted mb-3">{emp.user_email}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-bg-secondary rounded-lg py-2">
                  <p className="text-lg font-bold">L{emp.hourly_rate}</p>
                  <p className="text-xs text-text-muted">/hour</p>
                </div>
                <div className="bg-blue-50 rounded-lg py-2">
                  <p className="text-lg font-bold">{empHours.toFixed(1)}</p>
                  <p className="text-xs text-text-muted">hours</p>
                </div>
                <div className="bg-green-50 rounded-lg py-2">
                  <p className="text-lg font-bold">L{empCost.toFixed(0)}</p>
                  <p className="text-xs text-text-muted">earned</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* All Task Logs */}
      <h2 className="text-lg font-semibold mb-4">All Task Logs</h2>
      <div className="bg-white rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-border">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Task / Description</th>
              <th className="px-6 py-3">Hours</th>
              <th className="px-6 py-3">Cost</th>
              <th className="px-6 py-3">Links</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/50">
                <td className="px-6 py-3 text-sm text-text-secondary">{t.date}</td>
                <td className="px-6 py-3 text-sm font-medium">{t.employee_name}</td>
                <td className="px-6 py-3 text-sm">{t.client_name || '—'}</td>
                <td className="px-6 py-3 text-sm text-text-secondary max-w-sm">
                  {t.deliverable_title && <p className="font-medium text-text-primary">{t.deliverable_title}</p>}
                  <p className="truncate">{t.description || (t.deliverable_title ? '' : '—')}</p>
                </td>
                <td className="px-6 py-3 text-sm">{t.hours}h</td>
                <td className="px-6 py-3 text-sm font-medium">L{Number(t.cost).toFixed(2)}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    {t.document_link && <a href={t.document_link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Doc</a>}
                    {t.live_link && <a href={t.live_link} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">Live</a>}
                    {!t.document_link && !t.live_link && <span className="text-xs text-text-muted">—</span>}
                  </div>
                </td>
                <td className="px-6 py-3"><button onClick={() => deleteTask(t.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button></td>
              </tr>
            ))}
            {tasks.length === 0 && <tr><td colSpan={8} className="px-6 py-8 text-center text-text-muted">No task logs</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <Modal open={showAddEmployee} onClose={() => { setShowAddEmployee(false); setEmpError('') }} title="Add Employee" wide>
        <form onSubmit={addEmployee} className="space-y-4">
          {empError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{empError}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input value={empForm.first_name} onChange={e => setEmpForm(f => ({ ...f, first_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input value={empForm.last_name} onChange={e => setEmpForm(f => ({ ...f, last_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username *</label>
              <input value={empForm.username} onChange={e => setEmpForm(f => ({ ...f, username: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input type="password" minLength={8} value={empForm.password} onChange={e => setEmpForm(f => ({ ...f, password: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" value={empForm.email} onChange={e => setEmpForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hourly Rate (LEK)</label>
              <input type="number" step="0.01" value={empForm.hourly_rate} onChange={e => setEmpForm(f => ({ ...f, hourly_rate: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="0.00" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddEmployee(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Create</button>
          </div>
        </form>
      </Modal>

      {/* Log Task Modal */}
      <Modal open={showAddTask} onClose={() => setShowAddTask(false)} title="Log Task">
        <form onSubmit={addTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee *</label>
            <select value={taskForm.employee} onChange={e => setTaskForm(f => ({ ...f, employee: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
              <option value="">Select employee</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.user_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client</label>
            <select value={taskForm.client} onChange={e => setTaskForm(f => ({ ...f, client: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
              <option value="">No client (internal)</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <input value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hours *</label>
              <input type="number" step="0.25" value={taskForm.hours} onChange={e => setTaskForm(f => ({ ...f, hours: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input type="date" value={taskForm.date} onChange={e => setTaskForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Document Link</label>
              <input type="url" value={taskForm.document_link} onChange={e => setTaskForm(f => ({ ...f, document_link: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Google Drive, draft..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Live Link</label>
              <input type="url" value={taskForm.live_link} onChange={e => setTaskForm(f => ({ ...f, live_link: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="Published URL..." />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddTask(false)} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg">Log Task</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
