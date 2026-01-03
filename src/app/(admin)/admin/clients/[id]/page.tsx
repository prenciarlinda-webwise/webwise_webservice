'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save, Edit, Key, FileText, CreditCard, DollarSign, AlertTriangle, Target, ListTodo, Plus, Check, Play, Trash2, Edit2, Gift, Upload, Download } from 'lucide-react'
import { api } from '@/lib/api'
import type { ClientDetail, Plan, Report, Task, TaskCreateData, ReportCreateData } from '@/lib/types'
import { useRef } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import DataTable from '@/components/dashboard/DataTable'

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const clientId = Number(params.id)
  const isEditMode = searchParams.get('edit') === 'true'

  const [client, setClient] = useState<ClientDetail | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'payments' | 'tasks' | 'reports'>('overview')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  // Offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [isOfferSubmitting, setIsOfferSubmitting] = useState(false)
  const [offerForm, setOfferForm] = useState({
    title: '',
    message: '',
    discount_percent: '',
    expires_in_days: '7',
  })

  // Task management state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskSubmitting, setIsTaskSubmitting] = useState(false)
  const [taskForm, setTaskForm] = useState<TaskCreateData>({
    client: 0,
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: 'other',
    due_date: null,
  })
  const [editTaskForm, setEditTaskForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    category: '',
    due_date: '',
  })

  // Report management state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showAddReportModal, setShowAddReportModal] = useState(false)
  const [isReportSubmitting, setIsReportSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [reportForm, setReportForm] = useState({
    title: '',
    report_type: 'monthly_seo',
    description: '',
    report_date: new Date().toISOString().split('T')[0],
  })

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    website_url: '',
    industry: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    notes: '',
    plan_id: null as number | null,
    subscription_start_date: '',
    subscription_end_date: '',
    is_active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientData, plansData, reportsData, tasksData] = await Promise.all([
          api.getClient(clientId),
          api.getPlans(),
          api.getReports({ client: clientId }),
          api.getTasks({ client: clientId }),
        ])
        setClient(clientData)
        setPlans(plansData)
        setReports(reportsData.results || [])
        setTasks(tasksData.results || [])
        setFormData({
          first_name: clientData.user.first_name,
          last_name: clientData.user.last_name,
          phone: clientData.user.phone,
          company_name: clientData.company_name,
          website_url: clientData.website_url,
          industry: clientData.industry,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state,
          country: clientData.country,
          postal_code: clientData.postal_code,
          notes: clientData.notes,
          plan_id: clientData.plan?.id || null,
          subscription_start_date: clientData.subscription_start_date || '',
          subscription_end_date: clientData.subscription_end_date || '',
          is_active: clientData.is_active,
        })
      } catch (error) {
        console.error('Failed to fetch client:', error)
        setError('Failed to load client data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [clientId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      await api.updateClient(clientId, formData)
      router.push(`/admin/clients/${clientId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client')
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword) return
    try {
      await api.resetClientPassword(clientId, newPassword)
      setShowPasswordModal(false)
      setNewPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    }
  }

  const handleSendOffer = async () => {
    if (!offerForm.title || !offerForm.message) return
    setIsOfferSubmitting(true)
    try {
      await api.sendOffer({
        client_id: clientId,
        title: offerForm.title,
        message: offerForm.message,
        offer_details: {
          discount_percent: offerForm.discount_percent ? Number(offerForm.discount_percent) : undefined,
        },
        expires_in_days: Number(offerForm.expires_in_days) || 7,
      })
      setShowOfferModal(false)
      setOfferForm({
        title: '',
        message: '',
        discount_percent: '',
        expires_in_days: '7',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send offer')
    } finally {
      setIsOfferSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Task handlers
  const handleAddTask = async () => {
    if (!taskForm.title) return
    setIsTaskSubmitting(true)
    try {
      const newTask = await api.createTask({ ...taskForm, client: clientId })
      setTasks([newTask, ...tasks])
      setShowAddTaskModal(false)
      setTaskForm({
        client: clientId,
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        category: 'other',
        due_date: null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task')
    } finally {
      setIsTaskSubmitting(false)
    }
  }

  const handleEditTask = async () => {
    if (!selectedTask || !editTaskForm.title) return
    setIsTaskSubmitting(true)
    try {
      const updatedTask = await api.updateTask(selectedTask.id, {
        title: editTaskForm.title,
        description: editTaskForm.description,
        status: editTaskForm.status,
        priority: editTaskForm.priority,
        category: editTaskForm.category,
        due_date: editTaskForm.due_date || null,
      })
      setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t))
      setShowEditTaskModal(false)
      setSelectedTask(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setIsTaskSubmitting(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return
    setIsTaskSubmitting(true)
    try {
      await api.deleteTask(selectedTask.id)
      setTasks(tasks.filter(t => t.id !== selectedTask.id))
      setShowDeleteTaskModal(false)
      setSelectedTask(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    } finally {
      setIsTaskSubmitting(false)
    }
  }

  const handleMarkTaskCompleted = async (id: number) => {
    try {
      const updatedTask = await api.markTaskCompleted(id)
      setTasks(tasks.map(t => t.id === id ? updatedTask : t))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as completed')
    }
  }

  const handleMarkTaskInProgress = async (id: number) => {
    try {
      const updatedTask = await api.markTaskInProgress(id)
      setTasks(tasks.map(t => t.id === id ? updatedTask : t))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as in progress')
    }
  }

  const openEditTaskModal = (task: Task) => {
    setSelectedTask(task)
    setEditTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      due_date: task.due_date || '',
    })
    setShowEditTaskModal(true)
  }

  const getTaskStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue) return <Badge variant="danger">Overdue</Badge>
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

  // Report handlers
  const handleAddReport = async () => {
    if (!selectedFile || !reportForm.title) return
    setIsReportSubmitting(true)

    try {
      // Get signed upload URL
      const { upload_url, file_path } = await api.getReportUploadUrl(
        clientId,
        selectedFile.name
      )

      // Upload file to Supabase
      await fetch(upload_url, {
        method: 'PUT',
        body: selectedFile,
        headers: { 'Content-Type': selectedFile.type },
      })

      // Create report record
      const reportData: ReportCreateData = {
        client: clientId,
        title: reportForm.title,
        report_type: reportForm.report_type,
        description: reportForm.description,
        file_path: file_path,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        report_date: reportForm.report_date,
      }

      const newReport = await api.createReport(reportData)
      setReports([newReport, ...reports])
      setShowAddReportModal(false)
      setSelectedFile(null)
      setReportForm({
        title: '',
        report_type: 'monthly_seo',
        description: '',
        report_date: new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload report')
    } finally {
      setIsReportSubmitting(false)
    }
  }

  const handleDownloadReport = async (report: Report) => {
    try {
      const { download_url } = await api.getReportDownloadUrl(report.id)
      window.open(download_url, '_blank')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get download URL')
    }
  }

  const handleDeleteReport = async (id: number) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    try {
      await api.deleteReport(id)
      setReports(reports.filter(r => r.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete report')
    }
  }

  const reportTypes = [
    { value: 'monthly_seo', label: 'Monthly SEO Report' },
    { value: 'keyword_ranking', label: 'Keyword Ranking Report' },
    { value: 'traffic_analysis', label: 'Traffic Analysis' },
    { value: 'technical_audit', label: 'Technical Audit' },
    { value: 'custom', label: 'Custom Report' },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!client) {
    return <div className="text-center text-text-muted">Client not found</div>
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'details', label: 'Details', icon: Edit },
    { id: 'tasks', label: `Tasks (${tasks.length})`, icon: ListTodo },
    { id: 'reports', label: `Reports (${reports.length})`, icon: FileText },
    { id: 'payments', label: `Payments (${client.payments?.length || 0})`, icon: CreditCard },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/clients')}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">{client.company_name}</h1>
              <Badge variant={client.is_active ? 'success' : 'danger'}>
                {client.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-text-muted">{client.user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowOfferModal(true)}>
            <Gift className="w-4 h-4 mr-2" />
            Send Offer
          </Button>
          <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
            <Key className="w-4 h-4 mr-2" />
            Reset Password
          </Button>
          {!isEditMode && (
            <Button onClick={() => router.push(`/admin/clients/${clientId}?edit=true`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Overview Tab - Summary Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Client Info Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-bg-secondary rounded-lg border border-border-primary p-4">
              <p className="text-sm text-text-muted mb-1">Started</p>
              <p className="text-lg font-semibold text-text-primary">
                {client.subscription_start_date
                  ? new Date(client.subscription_start_date).toLocaleDateString()
                  : new Date(client.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-bg-secondary rounded-lg border border-border-primary p-4">
              <p className="text-sm text-text-muted mb-1">Plan</p>
              <p className="text-lg font-semibold text-text-primary">
                {client.plan?.name || 'No Plan'}
              </p>
            </div>
            <div className="bg-bg-secondary rounded-lg border border-border-primary p-4">
              <p className="text-sm text-text-muted mb-1">Industry</p>
              <p className="text-lg font-semibold text-text-primary">
                {client.industry || '-'}
              </p>
            </div>
            <div className="bg-bg-secondary rounded-lg border border-border-primary p-4">
              <p className="text-sm text-text-muted mb-1">Website</p>
              {client.website_url ? (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-accent hover:underline"
                >
                  Visit Site
                </a>
              ) : (
                <p className="text-lg font-semibold text-text-primary">-</p>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-bg-secondary rounded-lg border border-border-primary p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">
                  {formatCurrency(client.payment_summary?.total_paid || 0)}
                </p>
                <p className="text-sm text-text-muted">Total Paid</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">
                  {formatCurrency(client.payment_summary?.total_pending || 0)}
                </p>
                <p className="text-sm text-text-muted">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">
                  {client.payment_summary?.overdue_count || 0}
                </p>
                <p className="text-sm text-text-muted">Overdue Invoices</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">
                  {formatCurrency(client.payment_summary?.overdue_amount || 0)}
                </p>
                <p className="text-sm text-text-muted">Overdue Amount</p>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          {client.payments && client.payments.length > 0 && (
            <div className="bg-bg-secondary rounded-lg border border-border-primary p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Recent Payments</h3>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-sm text-accent hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {client.payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-2 border-b border-border-primary last:border-0">
                    <div>
                      <p className="font-medium text-text-primary">{payment.invoice_number}</p>
                      <p className="text-sm text-text-muted">
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                        {payment.paid_date && ` | Paid: ${new Date(payment.paid_date).toLocaleDateString()}`}
                      </p>
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
            </div>
          )}
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                disabled={!isEditMode}
              />
              <Input
                id="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                disabled={!isEditMode}
              />
              <Input
                id="email"
                label="Email"
                value={client.user.email}
                disabled
                className="bg-bg-secondary"
              />
              <Input
                id="phone"
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="company_name"
                label="Company Name"
                value={formData.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                disabled={!isEditMode}
              />
              <Input
                id="website_url"
                label="Website URL"
                value={formData.website_url}
                onChange={(e) => handleChange('website_url', e.target.value)}
                disabled={!isEditMode}
              />
              <Input
                id="industry"
                label="Industry"
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                disabled={!isEditMode}
              />
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-text-primary">Active</label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  disabled={!isEditMode}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  id="address"
                  label="Street Address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
              <Input
                id="city"
                label="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                disabled={!isEditMode}
              />
              <Input
                id="state"
                label="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                disabled={!isEditMode}
              />
              <Input
                id="country"
                label="Country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                disabled={!isEditMode}
              />
              <Input
                id="postal_code"
                label="Postal Code"
                value={formData.postal_code}
                onChange={(e) => handleChange('postal_code', e.target.value)}
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                id="plan_id"
                label="Plan"
                value={formData.plan_id || ''}
                onChange={(e) => handleChange('plan_id', e.target.value ? Number(e.target.value) : null)}
                disabled={!isEditMode}
                options={[
                  { value: '', label: 'No Plan' },
                  ...plans.map(p => ({ value: p.id, label: `${p.name} ($${p.price})` })),
                ]}
              />
              <Input
                id="subscription_start_date"
                type="date"
                label="Start Date"
                value={formData.subscription_start_date}
                onChange={(e) => handleChange('subscription_start_date', e.target.value)}
                disabled={!isEditMode}
              />
              <Input
                id="subscription_end_date"
                type="date"
                label="End Date"
                value={formData.subscription_end_date}
                onChange={(e) => handleChange('subscription_end_date', e.target.value)}
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Admin Notes</h2>
            <textarea
              rows={4}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-secondary"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              disabled={!isEditMode}
            />
          </div>

          {isEditMode && (
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push(`/admin/clients/${clientId}`)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Payments Summary Bar */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(client.payment_summary?.total_paid || 0)}
              </p>
              <p className="text-xs text-text-muted">Total Paid</p>
            </div>
            <div className="bg-bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {formatCurrency(client.payment_summary?.total_pending || 0)}
              </p>
              <p className="text-xs text-text-muted">Pending</p>
            </div>
            <div className="bg-bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{client.payment_summary?.overdue_count || 0}</p>
              <p className="text-xs text-text-muted">Overdue</p>
            </div>
            <div className="bg-bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-500">
                {formatCurrency(client.payment_summary?.overdue_amount || 0)}
              </p>
              <p className="text-xs text-text-muted">Overdue Amount</p>
            </div>
          </div>

          <DataTable
            columns={[
              { key: 'invoice_number', header: 'Invoice' },
              { key: 'amount', header: 'Amount', render: (p) => `${p.currency} ${p.amount.toLocaleString()}` },
              { key: 'plan_name', header: 'Plan', render: (p) => p.plan_name || '-' },
              { key: 'due_date', header: 'Due Date', render: (p) => new Date(p.due_date).toLocaleDateString() },
              { key: 'paid_date', header: 'Paid Date', render: (p) => p.paid_date ? new Date(p.paid_date).toLocaleDateString() : '-' },
              { key: 'status', header: 'Status', render: (p) => (
                <Badge variant={
                  p.status === 'paid' ? 'success' :
                  p.is_overdue ? 'danger' : 'warning'
                }>
                  {p.status === 'paid' ? 'Paid' : p.is_overdue ? 'Overdue' : p.status}
                </Badge>
              )},
            ]}
            data={client.payments || []}
            keyExtractor={(p) => p.id}
            emptyMessage="No payments for this client"
          />
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Tasks Header */}
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-4 gap-4 flex-1 mr-4">
              <div className="bg-bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</p>
                <p className="text-xs text-text-muted">Pending</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'in_progress').length}</p>
                <p className="text-xs text-text-muted">In Progress</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
                <p className="text-xs text-text-muted">Completed</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{tasks.filter(t => t.is_overdue).length}</p>
                <p className="text-xs text-text-muted">Overdue</p>
              </div>
            </div>
            <Button onClick={() => setShowAddTaskModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          <DataTable
            columns={[
              { key: 'title', header: 'Task', render: (t: Task) => (
                <div>
                  <span className="font-medium">{t.title}</span>
                  {t.description && <p className="text-sm text-text-muted truncate max-w-xs">{t.description}</p>}
                </div>
              )},
              { key: 'category', header: 'Category', render: (t: Task) => <Badge variant="default">{t.category}</Badge> },
              { key: 'priority', header: 'Priority', render: (t: Task) => getPriorityBadge(t.priority) },
              { key: 'due_date', header: 'Due Date', render: (t: Task) => t.due_date ? (
                <span className={t.is_overdue ? 'text-red-600 font-medium' : ''}>{new Date(t.due_date).toLocaleDateString()}</span>
              ) : '-' },
              { key: 'status', header: 'Status', render: (t: Task) => getTaskStatusBadge(t.status, t.is_overdue) },
              { key: 'actions', header: '', render: (t: Task) => (
                <div className="flex items-center gap-1">
                  {t.status === 'pending' && (
                    <button onClick={() => handleMarkTaskInProgress(t.id)} className="p-2 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Start">
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  {(t.status === 'pending' || t.status === 'in_progress') && (
                    <button onClick={() => handleMarkTaskCompleted(t.id)} className="p-2 text-text-muted hover:text-green-600 hover:bg-green-50 rounded-lg" title="Complete">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => openEditTaskModal(t)} className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setSelectedTask(t); setShowDeleteTaskModal(true); }} className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )},
            ]}
            data={tasks}
            keyExtractor={(t) => t.id}
            emptyMessage="No tasks for this client"
          />
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Reports Header */}
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-4 gap-4 flex-1 mr-4">
              <div className="bg-bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-text-primary">{reports.length}</p>
                <p className="text-xs text-text-muted">Total Reports</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{reports.filter(r => r.report_type === 'monthly_seo').length}</p>
                <p className="text-xs text-text-muted">Monthly SEO</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.report_type === 'keyword_ranking').length}</p>
                <p className="text-xs text-text-muted">Keyword Ranking</p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{reports.filter(r => r.report_type === 'technical_audit').length}</p>
                <p className="text-xs text-text-muted">Technical Audit</p>
              </div>
            </div>
            <Button onClick={() => setShowAddReportModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Report
            </Button>
          </div>

          <DataTable
            columns={[
              { key: 'title', header: 'Title', render: (r: Report) => <span className="font-medium">{r.title}</span> },
              { key: 'report_type', header: 'Type', render: (r: Report) => <Badge>{r.report_type.replace(/_/g, ' ')}</Badge> },
              { key: 'file_name', header: 'File', render: (r: Report) => r.file_name || '-' },
              { key: 'report_date', header: 'Date', render: (r: Report) => new Date(r.report_date).toLocaleDateString() },
              { key: 'actions', header: '', render: (r: Report) => (
                <div className="flex items-center gap-1">
                  {r.file_path && (
                    <button
                      onClick={() => handleDownloadReport(r)}
                      className="p-2 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReport(r.id)}
                    className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )},
            ]}
            data={reports}
            keyExtractor={(r) => r.id}
            emptyMessage="No reports for this client"
          />

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
        </div>
      )}

      {/* Reset Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Reset Password"
        size="sm"
      >
        <Input
          id="new_password"
          type="password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleResetPassword}>
            Reset Password
          </Button>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        title="Add Task"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="task_title"
            label="Title *"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            placeholder="e.g., Monthly SEO Report"
          />
          <Input
            id="task_description"
            label="Description"
            value={taskForm.description || ''}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            placeholder="Task details..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="task_priority"
              label="Priority"
              value={taskForm.priority || 'medium'}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
            <Select
              id="task_category"
              label="Category"
              value={taskForm.category || 'other'}
              onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
              options={[
                { value: 'seo', label: 'SEO' },
                { value: 'content', label: 'Content' },
                { value: 'technical', label: 'Technical' },
                { value: 'design', label: 'Design' },
                { value: 'development', label: 'Development' },
                { value: 'reporting', label: 'Reporting' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </div>
          <Input
            id="task_due_date"
            type="date"
            label="Due Date"
            value={taskForm.due_date || ''}
            onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value || null })}
          />
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowAddTaskModal(false)}>Cancel</Button>
          <Button onClick={handleAddTask} isLoading={isTaskSubmitting} disabled={!taskForm.title}>Add Task</Button>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditTaskModal}
        onClose={() => { setShowEditTaskModal(false); setSelectedTask(null); }}
        title="Edit Task"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="edit_task_title"
            label="Title *"
            value={editTaskForm.title}
            onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
          />
          <Input
            id="edit_task_description"
            label="Description"
            value={editTaskForm.description}
            onChange={(e) => setEditTaskForm({ ...editTaskForm, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="edit_task_status"
              label="Status"
              value={editTaskForm.status}
              onChange={(e) => setEditTaskForm({ ...editTaskForm, status: e.target.value })}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'on_hold', label: 'On Hold' },
              ]}
            />
            <Select
              id="edit_task_priority"
              label="Priority"
              value={editTaskForm.priority}
              onChange={(e) => setEditTaskForm({ ...editTaskForm, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
          </div>
          <Select
            id="edit_task_category"
            label="Category"
            value={editTaskForm.category}
            onChange={(e) => setEditTaskForm({ ...editTaskForm, category: e.target.value })}
            options={[
              { value: 'seo', label: 'SEO' },
              { value: 'content', label: 'Content' },
              { value: 'technical', label: 'Technical' },
              { value: 'design', label: 'Design' },
              { value: 'development', label: 'Development' },
              { value: 'reporting', label: 'Reporting' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Input
            id="edit_task_due_date"
            type="date"
            label="Due Date"
            value={editTaskForm.due_date}
            onChange={(e) => setEditTaskForm({ ...editTaskForm, due_date: e.target.value })}
          />
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => { setShowEditTaskModal(false); setSelectedTask(null); }}>Cancel</Button>
          <Button onClick={handleEditTask} isLoading={isTaskSubmitting} disabled={!editTaskForm.title}>Save Changes</Button>
        </div>
      </Modal>

      {/* Delete Task Modal */}
      <Modal
        isOpen={showDeleteTaskModal}
        onClose={() => { setShowDeleteTaskModal(false); setSelectedTask(null); }}
        title="Delete Task"
        size="sm"
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete &quot;{selectedTask?.title}&quot;? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => { setShowDeleteTaskModal(false); setSelectedTask(null); }}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteTask} isLoading={isTaskSubmitting}>Delete</Button>
        </div>
      </Modal>

      {/* Send Offer Modal */}
      <Modal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        title="Send Special Offer"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="offer_title"
            label="Offer Title *"
            value={offerForm.title}
            onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
            placeholder="e.g., 20% Off Annual Plan"
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Message *
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={offerForm.message}
              onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
              placeholder="Describe the offer and any terms..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="offer_discount"
              type="number"
              label="Discount %"
              value={offerForm.discount_percent}
              onChange={(e) => setOfferForm({ ...offerForm, discount_percent: e.target.value })}
              placeholder="e.g., 20"
            />
            <Input
              id="offer_expires"
              type="number"
              label="Expires in (days)"
              value={offerForm.expires_in_days}
              onChange={(e) => setOfferForm({ ...offerForm, expires_in_days: e.target.value })}
              placeholder="7"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowOfferModal(false)}>Cancel</Button>
          <Button onClick={handleSendOffer} isLoading={isOfferSubmitting} disabled={!offerForm.title || !offerForm.message}>
            <Gift className="w-4 h-4 mr-2" />
            Send Offer
          </Button>
        </div>
      </Modal>

      {/* Add Report Modal */}
      <Modal
        isOpen={showAddReportModal}
        onClose={() => { setShowAddReportModal(false); setSelectedFile(null); }}
        title="Add Report"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="report_title"
            label="Title *"
            value={reportForm.title}
            onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
            placeholder="e.g., January 2025 SEO Report"
          />
          <Select
            id="report_type"
            label="Report Type"
            value={reportForm.report_type}
            onChange={(e) => setReportForm({ ...reportForm, report_type: e.target.value })}
            options={reportTypes}
          />
          <Input
            id="report_date"
            type="date"
            label="Report Date"
            value={reportForm.report_date}
            onChange={(e) => setReportForm({ ...reportForm, report_date: e.target.value })}
          />
          <Input
            id="report_description"
            label="Description"
            value={reportForm.description}
            onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
            placeholder="Brief description of the report..."
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              File *
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              {selectedFile && (
                <span className="text-sm text-text-muted">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Allowed: PDF, Word, Excel, PNG, JPEG (max 10MB)
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => { setShowAddReportModal(false); setSelectedFile(null); }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddReport}
            isLoading={isReportSubmitting}
            disabled={!reportForm.title || !selectedFile}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Report
          </Button>
        </div>
      </Modal>
    </div>
  )
}
