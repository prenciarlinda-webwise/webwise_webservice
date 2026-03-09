'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'

interface Payment {
  id: number
  service_name: string
  project_name: string
  status: string
  description: string
  due_date: string
}

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    api.get<{ results: Payment[] }>('/payments/').then(d => setPayments(d.results))
  }, [])

  const upcoming = payments.filter(p => ['upcoming', 'pending'].includes(p.status))
  const nextPayment = upcoming.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))[0]

  return (
    <div>
      <PageHeader title="Billing" description="Your upcoming payment schedule" />

      {nextPayment && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <p className="text-sm text-text-muted mb-1">Next Payment Due</p>
          <p className="text-2xl font-semibold">{nextPayment.due_date}</p>
          <p className="text-sm text-text-secondary mt-1">{nextPayment.service_name} &mdash; {nextPayment.project_name}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary">Payment Schedule</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-border">
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 text-sm font-medium">{p.project_name}</td>
                <td className="px-6 py-3 text-sm">{p.service_name}</td>
                <td className="px-6 py-3 text-sm text-text-secondary">{p.due_date || '—'}</td>
                <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-text-muted">No payments scheduled yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upgrade CTA */}
      <div className="mt-8 bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">Want to receive better results?</h3>
        <p className="text-sm text-white/80 mb-4">
          Upgrade to a higher package for more monthly deliverables, faster rankings, and increased lead generation.
        </p>
        <Link href="/dashboard/plans" className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
          View Available Packages
        </Link>
      </div>
    </div>
  )
}
