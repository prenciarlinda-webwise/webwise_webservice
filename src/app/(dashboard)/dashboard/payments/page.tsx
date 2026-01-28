'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Calendar, AlertCircle, Check, DollarSign, Wallet, Copy, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import type { Payment, AdminPaymentMethod } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DataTable from '@/components/dashboard/DataTable'

export default function ClientPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<AdminPaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPayModal, setShowPayModal] = useState(false)
  const [showPaymentInfoModal, setShowPaymentInfoModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [paymentForm, setPaymentForm] = useState({
    payment_method_id: 0,
    reference_number: '',
    paid_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, methodsData] = await Promise.all([
          api.getClientPayments(),
          api.getClientPaymentMethods(),
        ])
        setPayments(Array.isArray(paymentsData) ? paymentsData : [])
        setPaymentMethods(Array.isArray(methodsData) ? methodsData : [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return <Badge variant="danger">Overdue</Badge>
    }
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      paid: 'success',
      pending: 'warning',
      cancelled: 'default',
      refunded: 'default',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const openPayModal = (payment: Payment) => {
    setSelectedPayment(payment)
    setPaymentForm({
      payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : 0,
      reference_number: '',
      paid_date: new Date().toISOString().split('T')[0],
    })
    setShowPayModal(true)
    setError('')
  }

  const handleMarkPaid = async () => {
    if (!selectedPayment) return
    if (!paymentForm.payment_method_id) {
      setError('Please select a payment method')
      return
    }
    if (!paymentForm.reference_number.trim()) {
      setError('Please enter a reference/transaction number')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      const updatedPayment = await api.clientMarkPaymentPaid(selectedPayment.id, {
        payment_method_id: paymentForm.payment_method_id,
        reference_number: paymentForm.reference_number.trim(),
        paid_date: paymentForm.paid_date,
      })
      setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment : p))
      setShowPayModal(false)
      setSelectedPayment(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark payment as paid')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSelectedMethodDetails = () => {
    return paymentMethods.find(m => m.id === paymentForm.payment_method_id)
  }

  const columns = [
    {
      key: 'invoice_number',
      header: 'Invoice',
      render: (p: Payment) => (
        <span className="font-medium text-text-primary">{p.invoice_number}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (p: Payment) => p.description || p.plan_name || '-',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (p: Payment) => (
        <span className="font-semibold">{p.currency} {p.amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (p: Payment) => (
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-text-muted" />
          {new Date(p.due_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'payment_info',
      header: 'Payment Info',
      render: (p: Payment) => {
        if (p.status === 'paid' && p.payment_method_name) {
          return (
            <div className="text-sm">
              <span className="font-medium">{p.payment_method_name}</span>
              {p.reference_number && (
                <p className="text-text-muted text-xs">Ref: {p.reference_number}</p>
              )}
            </div>
          )
        }
        return '-'
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Payment) => getStatusBadge(p.status, p.is_overdue),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Payment) => {
        if (p.status === 'pending') {
          return (
            <Button
              size="sm"
              onClick={() => openPayModal(p)}
              className="text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark Paid
            </Button>
          )
        }
        return null
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-text-muted">Loading payments...</p>
        </div>
      </div>
    )
  }

  const overduePayments = payments.filter(p => p.is_overdue)
  const pendingPayments = payments.filter(p => p.status === 'pending' && !p.is_overdue)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Payments</h1>
        {paymentMethods.length > 0 && (
          <Button variant="outline" onClick={() => setShowPaymentInfoModal(true)}>
            <Wallet className="w-4 h-4 mr-2" />
            View Payment Methods
          </Button>
        )}
      </div>

      {/* Overdue Alert */}
      {overduePayments.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">You have overdue payments</h3>
            <p className="text-sm text-red-600">
              Please settle {overduePayments.length} overdue payment{overduePayments.length > 1 ? 's' : ''} to avoid service interruption.
            </p>
          </div>
        </div>
      )}

      {/* Payment Methods Info Banner */}
      {paymentMethods.length > 0 && pendingPayments.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <Wallet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800">Ready to make a payment?</h3>
            <p className="text-sm text-blue-600">
              Click &ldquo;View Payment Methods&rdquo; to see available payment options, then mark your payment as paid with your transaction reference number.
            </p>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <CreditCard className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No payment history</h3>
          <p className="text-text-muted">Your payment records will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Total Paid</p>
              <p className="text-2xl font-bold text-text-primary">
                ${payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${pendingPayments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="text-sm text-text-muted">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                ${overduePayments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payments Table */}
          <DataTable
            columns={columns}
            data={payments}
            keyExtractor={(p) => p.id}
          />
        </div>
      )}

      {/* Mark as Paid Modal */}
      <Modal
        isOpen={showPayModal}
        onClose={() => { setShowPayModal(false); setSelectedPayment(null); }}
        title="Mark Payment as Paid"
        size="md"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-bg-secondary rounded-lg p-4 mb-4">
              <p className="text-sm text-text-muted">Invoice</p>
              <p className="font-medium text-text-primary">{selectedPayment.invoice_number}</p>
              <p className="text-2xl font-bold text-text-primary mt-2">
                {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {paymentMethods.length > 0 ? (
              <>
                <Select
                  id="payment_method_id"
                  label="Payment Method Used *"
                  value={paymentForm.payment_method_id || ''}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method_id: Number(e.target.value) })}
                  options={paymentMethods.map(m => ({ value: m.id, label: m.name }))}
                />

                {/* Show selected method details */}
                {getSelectedMethodDetails() && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-800 mb-2">{getSelectedMethodDetails()?.name} Details:</p>
                    <pre className="text-xs text-blue-700 whitespace-pre-wrap font-sans">
                      {getSelectedMethodDetails()?.details}
                    </pre>
                  </div>
                )}

                <Input
                  id="reference_number"
                  label="Reference/Transaction Number *"
                  value={paymentForm.reference_number}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference_number: e.target.value })}
                  placeholder="Enter the reference number from your payment"
                />

                <Input
                  id="paid_date"
                  type="date"
                  label="Payment Date"
                  value={paymentForm.paid_date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paid_date: e.target.value })}
                />
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-sm text-yellow-800">
                  No payment methods have been configured. Please contact support for payment options.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => { setShowPayModal(false); setSelectedPayment(null); }}>
                Cancel
              </Button>
              <Button
                onClick={handleMarkPaid}
                isLoading={isSubmitting}
                disabled={paymentMethods.length === 0}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Methods Info Modal */}
      <Modal
        isOpen={showPaymentInfoModal}
        onClose={() => setShowPaymentInfoModal(false)}
        title="Available Payment Methods"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted mb-4">
            Use any of the following methods to send your payment. After completing the payment, use the &ldquo;Mark Paid&rdquo; button on your invoice and enter your transaction reference number.
          </p>

          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-bg-secondary rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-text-primary">{method.name}</span>
                </div>
                <Badge>{method.method_type_display}</Badge>
              </div>
              <pre className="text-sm text-text-secondary whitespace-pre-wrap font-sans bg-white rounded p-3 border border-border">
                {method.details}
              </pre>
              <button
                onClick={() => copyToClipboard(method.details, method.name)}
                className="mt-2 text-xs text-accent hover:underline flex items-center gap-1"
              >
                {copiedField === method.name ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy details
                  </>
                )}
              </button>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => setShowPaymentInfoModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
