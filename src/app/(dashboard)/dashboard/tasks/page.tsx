'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, Circle, ListTodo } from 'lucide-react'
import { api } from '@/lib/api'
import type { Task } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/dashboard/DataTable'

export default function ClientTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.getClientTasks()
        setTasks(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'on_hold':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return <Badge variant="danger">Overdue</Badge>
    }
    const variants: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
      completed: 'success',
      in_progress: 'info',
      pending: 'warning',
      on_hold: 'default',
    }
    const labels: Record<string, string> = {
      completed: 'Completed',
      in_progress: 'In Progress',
      pending: 'Pending',
      on_hold: 'On Hold',
    }
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'danger' | 'warning' | 'default'> = {
      high: 'danger',
      medium: 'warning',
      low: 'default',
    }
    return <Badge variant={variants[priority] || 'default'}>{priority}</Badge>
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      seo: 'SEO',
      content: 'Content',
      technical: 'Technical',
      design: 'Design',
      development: 'Development',
      reporting: 'Reporting',
      other: 'Other',
    }
    return labels[category] || category
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const columns = [
    {
      key: 'status_icon',
      header: '',
      render: (t: Task) => getStatusIcon(t.status),
    },
    {
      key: 'title',
      header: 'Task',
      render: (t: Task) => (
        <div>
          <span className="font-medium text-text-primary">{t.title}</span>
          {t.description && (
            <p className="text-sm text-text-muted mt-0.5 line-clamp-1">{t.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (t: Task) => (
        <span className="text-sm text-text-secondary">{getCategoryLabel(t.category)}</span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t: Task) => getPriorityBadge(t.priority),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (t: Task) => t.due_date ? (
        <span className={t.is_overdue ? 'text-red-600 font-medium' : ''}>
          {new Date(t.due_date).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-text-muted">-</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t: Task) => getStatusBadge(t.status, t.is_overdue),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-text-muted">Loading tasks...</p>
        </div>
      </div>
    )
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const overdueTasks = tasks.filter(t => t.is_overdue).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Project Tasks</h1>

      {/* Overdue Alert */}
      {overdueTasks > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Overdue Tasks</h3>
            <p className="text-sm text-red-600">
              {overdueTasks} task{overdueTasks > 1 ? 's are' : ' is'} past the due date.
            </p>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <ListTodo className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No tasks yet</h3>
          <p className="text-text-muted">Your project tasks and milestones will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-border pb-4">
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'pending', label: 'Pending' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === tab.key
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tasks Table */}
          <DataTable
            columns={columns}
            data={filteredTasks}
            keyExtractor={(t) => t.id}
            emptyMessage="No tasks in this category"
          />
        </div>
      )}
    </div>
  )
}
