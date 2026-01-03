'use client'

import { useEffect, useState } from 'react'
import { FileText, CreditCard, ListTodo, CheckCircle2, Clock, Circle } from 'lucide-react'
import { api } from '@/lib/api'
import type { ClientProfile, Report, Payment, Task } from '@/lib/types'
import StatsCard from '@/components/dashboard/StatsCard'
import DataTable from '@/components/dashboard/DataTable'
import Badge from '@/components/ui/Badge'

export default function ClientDashboard() {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, reportsData, paymentsData, tasksData] = await Promise.all([
          api.getClientProfile(),
          api.getClientReports(),
          api.getClientPayments(),
          api.getClientTasks(),
        ])
        setProfile(profileData)
        setReports(Array.isArray(reportsData) ? reportsData : [])
        setPayments(Array.isArray(paymentsData) ? paymentsData : [])
        setTasks(Array.isArray(tasksData) ? tasksData : [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const pendingPayments = payments.filter(p => p.status === 'pending').length
  const activeTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Welcome back, {profile?.user.first_name || 'there'}!
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Tasks"
          value={activeTasks}
          icon={ListTodo}
          variant={activeTasks > 0 ? 'info' : 'success'}
        />
        <StatsCard
          title="Total Reports"
          value={reports.length}
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Pending Payments"
          value={pendingPayments}
          icon={CreditCard}
          variant={pendingPayments > 0 ? 'warning' : 'success'}
        />
        <StatsCard
          title="Current Plan"
          value={profile?.plan?.name || 'No Plan'}
          icon={CreditCard}
          variant="default"
        />
      </div>

      {/* Active Tasks */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Active Tasks</h2>
        <DataTable
          columns={[
            { key: 'status_icon', header: '', render: (t: Task) => {
              if (t.status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-600" />
              if (t.status === 'in_progress') return <Clock className="w-5 h-5 text-blue-600" />
              return <Circle className="w-5 h-5 text-gray-400" />
            }},
            { key: 'title', header: 'Task', render: (t: Task) => (
              <span className="font-medium">{t.title}</span>
            )},
            { key: 'category', header: 'Category', render: (t: Task) => (
              <Badge variant="default">{t.category}</Badge>
            )},
            { key: 'status', header: 'Status', render: (t: Task) => {
              if (t.is_overdue) return <Badge variant="danger">Overdue</Badge>
              const variants: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
                completed: 'success',
                in_progress: 'info',
                pending: 'warning',
              }
              const labels: Record<string, string> = {
                completed: 'Completed',
                in_progress: 'In Progress',
                pending: 'Pending',
              }
              return <Badge variant={variants[t.status] || 'default'}>{labels[t.status] || t.status}</Badge>
            }},
            { key: 'due_date', header: 'Due Date', render: (t: Task) => t.due_date
              ? <span className={t.is_overdue ? 'text-red-600' : ''}>{new Date(t.due_date).toLocaleDateString()}</span>
              : '-'
            },
          ]}
          data={tasks.filter(t => t.status !== 'completed').slice(0, 5)}
          keyExtractor={(t) => t.id}
          emptyMessage="No active tasks"
        />
      </div>

      {/* Recent Reports */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Reports</h2>
        <DataTable
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'report_type', header: 'Type', render: (r) => (
              <Badge>{r.report_type.replace('_', ' ')}</Badge>
            )},
            { key: 'report_date', header: 'Date', render: (r) => new Date(r.report_date).toLocaleDateString() },
          ]}
          data={reports.slice(0, 5)}
          keyExtractor={(r) => r.id}
          emptyMessage="No reports yet"
        />
      </div>

      {/* Recent Payments */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Payments</h2>
        <DataTable
          columns={[
            { key: 'invoice_number', header: 'Invoice' },
            { key: 'amount', header: 'Amount', render: (p) => `${p.currency} ${p.amount.toLocaleString()}` },
            { key: 'due_date', header: 'Due Date', render: (p) => new Date(p.due_date).toLocaleDateString() },
            { key: 'status', header: 'Status', render: (p) => {
              const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
                paid: 'success',
                pending: 'warning',
                overdue: 'danger',
              }
              return <Badge variant={variants[p.status] || 'default'}>{p.status}</Badge>
            }},
          ]}
          data={payments.slice(0, 5)}
          keyExtractor={(p) => p.id}
          emptyMessage="No payments yet"
        />
      </div>
    </div>
  )
}
