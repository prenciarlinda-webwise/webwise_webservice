'use client'

import { useEffect, useState } from 'react'
import { Plus, Check, CreditCard, Edit2, Trash2, Wallet } from 'lucide-react'
import { api } from '@/lib/api'
import type { Payment, ClientListItem, Plan, PaymentCreateData, AdminPaymentMethod, PaymentMethodCreateData } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DataTable from '@/components/dashboard/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'payments' | 'methods'>('payments')
  const [payments, setPayments] = useState<Payment[]>([])
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [paymentMethods, setPaymentMethods] = useState<AdminPaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddMethodModal, setShowAddMethodModal] = useState(false)
  const [showEditMethodModal, setShowEditMethodModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<AdminPaymentMethod | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [addForm, setAddForm] = useState<PaymentCreateData>({
    client: 0,
    plan: null,
    amount: 0,
    currency: 'USD',
    status: 'pending',
    payment_method: '',
    due_date: new Date().toISOString().split('T')[0],
    paid_date: null,
    description: '',
    notes: '',
  })

  const [methodForm, setMethodForm] = useState<PaymentMethodCreateData>({
    method_type: 'bank_transfer',
    name: '',
    details: '',
    is_active: true,
    display_order: 0,
  })

  const fetchPayments = async () => {
    try {
      const data = await api.getPayments({
        status: filterStatus || undefined,
      })
      setPayments(data.results || [])
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const data = await api.getPaymentMethods()
      setPaymentMethods(data || [])
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, clientsData, plansData, methodsData] = await Promise.all([
          api.getPayments(),
          api.getClients(),
          api.getPlans(),
          api.getPaymentMethods(),
        ])
        setPayments(paymentsData.results || [])
        setClients(clientsData.results || [])
        setPlans(plansData)
        setPaymentMethods(methodsData || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    fetchPayments()
  }, [filterStatus])

  const handleAddPayment = async () => {
    if (!addForm.client || !addForm.amount) return
    setIsSubmitting(true)

    try {
      const newPayment = await api.createPayment(addForm)
      setPayments([newPayment, ...payments])
      setShowAddModal(false)
      setAddForm({
        client: 0,
        plan: null,
        amount: 0,
        currency: 'USD',
        status: 'pending',
        payment_method: '',
        due_date: new Date().toISOString().split('T')[0],
        paid_date: null,
        description: '',
        notes: '',
      })
    } catch (error) {
      console.error('Failed to add payment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkPaid = async (id: number) => {
    try {
      const updatedPayment = await api.markPaymentPaid(id)
      setPayments(payments.map(p => p.id === id ? updatedPayment : p))
    } catch (error) {
      console.error('Failed to mark as paid:', error)
    }
  }

  const handleAddMethod = async () => {
    if (!methodForm.name || !methodForm.details) return
    setIsSubmitting(true)

    try {
      const newMethod = await api.createPaymentMethod(methodForm)
      setPaymentMethods([...paymentMethods, newMethod])
      setShowAddMethodModal(false)
      setMethodForm({
        method_type: 'bank_transfer',
        name: '',
        details: '',
        is_active: true,
        display_order: 0,
      })
    } catch (error) {
      console.error('Failed to add payment method:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditMethod = async () => {
    if (!selectedMethod || !methodForm.name || !methodForm.details) return
    setIsSubmitting(true)

    try {
      const updatedMethod = await api.updatePaymentMethod(selectedMethod.id, methodForm)
      setPaymentMethods(paymentMethods.map(m => m.id === selectedMethod.id ? updatedMethod : m))
      setShowEditMethodModal(false)
      setSelectedMethod(null)
    } catch (error) {
      console.error('Failed to update payment method:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMethod = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return

    try {
      await api.deletePaymentMethod(id)
      setPaymentMethods(paymentMethods.filter(m => m.id !== id))
    } catch (error) {
      console.error('Failed to delete payment method:', error)
    }
  }

  const openEditMethodModal = (method: AdminPaymentMethod) => {
    setSelectedMethod(method)
    setMethodForm({
      method_type: method.method_type,
      name: method.name,
      details: method.details,
      is_active: method.is_active,
      display_order: method.display_order,
    })
    setShowEditMethodModal(true)
  }

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue) return <Badge variant="danger">Overdue</Badge>
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      paid: 'success',
      pending: 'warning',
      cancelled: 'default',
      refunded: 'default',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const columns = [
    {
      key: 'invoice_number',
      header: 'Invoice',
      render: (p: Payment) => <span className="font-medium">{p.invoice_number}</span>,
    },
    { key: 'client_name', header: 'Client' },
    {
      key: 'amount',
      header: 'Amount',
      render: (p: Payment) => <span className="font-semibold">{p.currency} {p.amount.toLocaleString()}</span>,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (p: Payment) => new Date(p.due_date).toLocaleDateString(),
    },
    {
      key: 'payment_method_name',
      header: 'Method',
      render: (p: Payment) => p.payment_method_name || '-',
    },
    {
      key: 'reference_number',
      header: 'Reference',
      render: (p: Payment) => p.reference_number || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Payment) => getStatusBadge(p.status, p.is_overdue),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Payment) => (
        <div className="flex items-center gap-2">
          {p.status === 'pending' && (
            <button
              onClick={() => handleMarkPaid(p.id)}
              className="p-2 text-text-muted hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark as Paid"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  const methodColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (m: AdminPaymentMethod) => <span className="font-medium">{m.name}</span>,
    },
    {
      key: 'method_type_display',
      header: 'Type',
      render: (m: AdminPaymentMethod) => <Badge>{m.method_type_display}</Badge>,
    },
    {
      key: 'details',
      header: 'Details',
      render: (m: AdminPaymentMethod) => (
        <span className="text-sm text-text-muted truncate max-w-xs block">{m.details.substring(0, 50)}...</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (m: AdminPaymentMethod) => (
        <Badge variant={m.is_active ? 'success' : 'default'}>{m.is_active ? 'Active' : 'Inactive'}</Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (m: AdminPaymentMethod) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditMethodModal(m)}
            className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteMethod(m.id)}
            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const methodTypeOptions = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'ria', label: 'Ria Money Transfer' },
    { value: 'moneygram', label: 'MoneyGram' },
    { value: 'western_union', label: 'Western Union' },
    { value: 'zelle', label: 'Zelle' },
    { value: 'venmo', label: 'Venmo' },
    { value: 'other', label: 'Other' },
  ]

  const tabs = [
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'methods', label: 'Payment Methods', icon: Wallet },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Payments</h1>
        {activeTab === 'payments' ? (
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payment
          </Button>
        ) : (
          <Button onClick={() => setShowAddMethodModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        )}
      </div>

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

      {activeTab === 'payments' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Total Received</p>
              <p className="text-2xl font-bold text-green-600">
                ${payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${payments.filter(p => p.status === 'pending' && !p.is_overdue).reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                ${payments.filter(p => p.is_overdue).reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Total Invoices</p>
              <p className="text-2xl font-bold text-text-primary">{payments.length}</p>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <Select
              id="filter_status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={statusOptions}
              className="max-w-xs"
            />
          </div>

          <DataTable
            columns={columns}
            data={payments}
            keyExtractor={(p) => p.id}
            isLoading={isLoading}
            emptyMessage="No payments found"
          />
        </>
      )}

      {activeTab === 'methods' && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Payment Methods:</strong> Add your payment information here (bank accounts, PayPal, Ria, MoneyGram, etc.).
              Clients will see these options when marking their invoices as paid and will provide a reference number for tracking.
            </p>
          </div>

          <DataTable
            columns={methodColumns}
            data={paymentMethods}
            keyExtractor={(m) => m.id}
            isLoading={isLoading}
            emptyMessage="No payment methods configured. Add one to let clients submit payments."
          />
        </>
      )}

      {/* Add Payment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Payment"
        size="md"
      >
        <div className="space-y-4">
          <Select
            id="client"
            label="Client *"
            value={addForm.client || ''}
            onChange={(e) => setAddForm({ ...addForm, client: Number(e.target.value) })}
            options={[
              { value: '', label: 'Select a client' },
              ...clients.map(c => ({ value: c.id, label: c.company_name })),
            ]}
          />
          <Select
            id="plan"
            label="Plan"
            value={addForm.plan || ''}
            onChange={(e) => setAddForm({ ...addForm, plan: e.target.value ? Number(e.target.value) : null })}
            options={[
              { value: '', label: 'No plan' },
              ...plans.map(p => ({ value: p.id, label: p.name })),
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="amount"
              type="number"
              label="Amount *"
              value={addForm.amount || ''}
              onChange={(e) => setAddForm({ ...addForm, amount: Number(e.target.value) })}
            />
            <Select
              id="currency"
              label="Currency"
              value={addForm.currency}
              onChange={(e) => setAddForm({ ...addForm, currency: e.target.value })}
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
              ]}
            />
          </div>
          <Input
            id="due_date"
            type="date"
            label="Due Date *"
            value={addForm.due_date}
            onChange={(e) => setAddForm({ ...addForm, due_date: e.target.value })}
          />
          <Select
            id="payment_method"
            label="Payment Method"
            value={addForm.payment_method}
            onChange={(e) => setAddForm({ ...addForm, payment_method: e.target.value })}
            options={[
              { value: '', label: 'Not specified' },
              { value: 'credit_card', label: 'Credit Card' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'paypal', label: 'PayPal' },
              { value: 'stripe', label: 'Stripe' },
            ]}
          />
          <Input
            id="description"
            label="Description"
            value={addForm.description || ''}
            onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
            placeholder="e.g., January 2024 SEO Services"
          />
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddPayment} isLoading={isSubmitting} disabled={!addForm.client || !addForm.amount}>
            Add Payment
          </Button>
        </div>
      </Modal>

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={showAddMethodModal}
        onClose={() => setShowAddMethodModal(false)}
        title="Add Payment Method"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="method_name"
            label="Name *"
            value={methodForm.name}
            onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
            placeholder="e.g., My Bank Account, PayPal Business"
          />
          <Select
            id="method_type"
            label="Type *"
            value={methodForm.method_type}
            onChange={(e) => setMethodForm({ ...methodForm, method_type: e.target.value })}
            options={methodTypeOptions}
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Details *
            </label>
            <textarea
              rows={6}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={methodForm.details}
              onChange={(e) => setMethodForm({ ...methodForm, details: e.target.value })}
              placeholder="Enter payment details that clients will see, e.g.:&#10;&#10;Bank Name: XYZ Bank&#10;Account Number: 1234567890&#10;Routing Number: 987654321&#10;Account Holder: Your Name"
            />
            <p className="text-xs text-text-muted mt-1">
              This information will be shown to clients when they need to make a payment.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-text-primary">Active</label>
            <input
              type="checkbox"
              checked={methodForm.is_active}
              onChange={(e) => setMethodForm({ ...methodForm, is_active: e.target.checked })}
              className="w-5 h-5"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowAddMethodModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddMethod} isLoading={isSubmitting} disabled={!methodForm.name || !methodForm.details}>
            Add Payment Method
          </Button>
        </div>
      </Modal>

      {/* Edit Payment Method Modal */}
      <Modal
        isOpen={showEditMethodModal}
        onClose={() => { setShowEditMethodModal(false); setSelectedMethod(null); }}
        title="Edit Payment Method"
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="edit_method_name"
            label="Name *"
            value={methodForm.name}
            onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
          />
          <Select
            id="edit_method_type"
            label="Type *"
            value={methodForm.method_type}
            onChange={(e) => setMethodForm({ ...methodForm, method_type: e.target.value })}
            options={methodTypeOptions}
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Details *
            </label>
            <textarea
              rows={6}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={methodForm.details}
              onChange={(e) => setMethodForm({ ...methodForm, details: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-text-primary">Active</label>
            <input
              type="checkbox"
              checked={methodForm.is_active}
              onChange={(e) => setMethodForm({ ...methodForm, is_active: e.target.checked })}
              className="w-5 h-5"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => { setShowEditMethodModal(false); setSelectedMethod(null); }}>
            Cancel
          </Button>
          <Button onClick={handleEditMethod} isLoading={isSubmitting} disabled={!methodForm.name || !methodForm.details}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  )
}
