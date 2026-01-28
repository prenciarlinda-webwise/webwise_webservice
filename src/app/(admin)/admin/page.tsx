'use client'

import { useEffect, useState } from 'react'
import { Users, DollarSign, AlertTriangle, TrendingUp, FileText, Calendar, ArrowUpRight, ArrowDownRight, ListTodo, Clock, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import type { DashboardStats, ClientListItem, Task, TaskStats } from '@/lib/types'
import StatsCard from '@/components/dashboard/StatsCard'
import DataTable from '@/components/dashboard/DataTable'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, clientsData, taskStatsData, overdueTasksData] = await Promise.all([
          api.getDashboardStats(),
          api.getClients(),
          api.getTaskStats(),
          api.getTasks({ overdue: true }),
        ])
        setStats(statsData)
        setClients(clientsData.results || [])
        setTaskStats(taskStatsData)
        setOverdueTasks(overdueTasksData.results || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRevenueChange = () => {
    if (!stats || !stats.last_month_revenue) return null
    const change = ((stats.this_month_revenue - stats.last_month_revenue) / stats.last_month_revenue) * 100
    return change
  }

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

  const revenueChange = getRevenueChange()

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Admin Dashboard</h1>

      {/* Payment Status Boxes - Primary Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-700">Paid</h3>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-3xl font-bold text-green-600">
            {formatCurrency(stats?.total_revenue || 0)}
          </span>
          <p className="text-sm text-green-600 mt-1">Total collected</p>
        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <span className="text-3xl font-bold text-yellow-600">
            {formatCurrency(stats?.pending_amount || 0)}
          </span>
          <p className="text-sm text-yellow-600 mt-1">{stats?.pending_payments || 0} invoices</p>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-red-700">Overdue</h3>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-3xl font-bold text-red-600">
            {formatCurrency(stats?.overdue_amount || 0)}
          </span>
          <p className="text-sm text-red-600 mt-1">{stats?.overdue_payments || 0} invoices</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-700">This Month</h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-blue-600">
              {formatCurrency(stats?.this_month_revenue || 0)}
            </span>
            {revenueChange !== null && (
              <div className={`flex items-center text-sm mb-1 ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {revenueChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{Math.abs(revenueChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-text-muted mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-text-primary">{taskStats?.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-text-muted mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{taskStats?.pending || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-text-muted mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{taskStats?.in_progress || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-text-muted mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{taskStats?.completed || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-text-muted mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{taskStats?.overdue || 0}</p>
        </div>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="font-semibold text-red-800">Overdue Tasks ({overdueTasks.length})</h2>
            </div>
            <Link href="/admin/tasks?filter=overdue" className="text-red-600 hover:text-red-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-red-200">
            {overdueTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">{task.title}</p>
                  <p className="text-sm text-red-600">{task.client_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-600">
                    Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                  </p>
                  <Badge variant="danger">{task.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Clients"
          value={stats?.total_clients || 0}
          icon={Users}
          variant="default"
          subtitle={`${stats?.new_clients_this_month || 0} new this month`}
        />
        <StatsCard
          title="Active Clients"
          value={stats?.active_clients || 0}
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Total Reports"
          value={stats?.total_reports || 0}
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Active Tasks"
          value={(taskStats?.pending || 0) + (taskStats?.in_progress || 0)}
          icon={ListTodo}
          variant="default"
        />
      </div>

      {/* Two Column Layout for Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Payments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Recent Payments</h2>
            <Link href="/admin/payments" className="text-accent hover:text-accent-dark text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="bg-bg-secondary rounded-lg border border-border-primary overflow-hidden">
            {stats?.recent_payments && stats.recent_payments.length > 0 ? (
              <div className="divide-y divide-border-primary">
                {stats.recent_payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">{payment.client_name}</p>
                      <p className="text-sm text-text-muted">{payment.invoice_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </p>
                      <Badge variant={
                        payment.status === 'paid' ? 'success' :
                        payment.is_overdue ? 'danger' : 'warning'
                      }>
                        {payment.status === 'paid' ? 'Paid' : payment.is_overdue ? 'Overdue' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted">
                No recent payments
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Due */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Due This Week</h2>
            <Link href="/admin/payments?filter=upcoming" className="text-accent hover:text-accent-dark text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="bg-bg-secondary rounded-lg border border-border-primary overflow-hidden">
            {stats?.upcoming_due && stats.upcoming_due.length > 0 ? (
              <div className="divide-y divide-border-primary">
                {stats.upcoming_due.map((item) => (
                  <Link
                    key={item.client_id}
                    href={`/admin/clients/${item.client_id}`}
                    className="p-4 flex items-center justify-between hover:bg-bg-tertiary transition-colors block"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{item.client_name}</p>
                      <p className="text-sm text-text-muted">
                        Due: {new Date(item.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-500">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted">
                No payments due this week
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Clients</h2>
          <Link href="/admin/clients" className="text-accent hover:text-accent-dark text-sm font-medium">
            View All
          </Link>
        </div>
        <DataTable
          columns={[
            { key: 'company_name', header: 'Company', render: (c) => (
              <Link href={`/admin/clients/${c.id}`} className="font-medium text-accent hover:text-accent-dark">
                {c.company_name}
              </Link>
            )},
            { key: 'user_email', header: 'Email' },
            { key: 'plan_name', header: 'Plan', render: (c) => c.plan_name || '-' },
            { key: 'created_at', header: 'Started', render: (c) => new Date(c.created_at).toLocaleDateString() },
            { key: 'subscription_status', header: 'Status', render: (c) => {
              const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
                active: 'success',
                expired: 'danger',
                no_plan: 'default',
              }
              return <Badge variant={variants[c.subscription_status] || 'default'}>{c.subscription_status}</Badge>
            }},
          ]}
          data={clients.slice(0, 5)}
          keyExtractor={(c) => c.id}
          emptyMessage="No clients yet"
        />
      </div>
    </div>
  )
}
