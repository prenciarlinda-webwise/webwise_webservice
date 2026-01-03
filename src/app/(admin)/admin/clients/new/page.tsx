'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { api } from '@/lib/api'
import type { Plan, ClientCreateData } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function NewClientPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<ClientCreateData>({
    email: '',
    password: '',
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
    plan_id: null,
    subscription_start_date: null,
    subscription_end_date: null,
  })

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.getPlans()
        setPlans(data)
      } catch (error) {
        console.error('Failed to fetch plans:', error)
      }
    }
    fetchPlans()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await api.createClient(formData)
      router.push('/admin/clients')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof ClientCreateData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Add New Client</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Account Information */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="email"
              type="email"
              label="Email *"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Password *"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
            <Input
              id="first_name"
              label="First Name *"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              required
            />
            <Input
              id="last_name"
              label="Last Name *"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              required
            />
            <Input
              id="phone"
              label="Phone"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="company_name"
              label="Company Name *"
              value={formData.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              required
            />
            <Input
              id="website_url"
              label="Website URL"
              type="url"
              value={formData.website_url || ''}
              onChange={(e) => handleChange('website_url', e.target.value)}
              placeholder="https://"
            />
            <Input
              id="industry"
              label="Industry"
              value={formData.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
            />
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
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
            <Input
              id="city"
              label="City"
              value={formData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            <Input
              id="state"
              label="State/Province"
              value={formData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
            />
            <Input
              id="country"
              label="Country"
              value={formData.country || ''}
              onChange={(e) => handleChange('country', e.target.value)}
            />
            <Input
              id="postal_code"
              label="Postal Code"
              value={formData.postal_code || ''}
              onChange={(e) => handleChange('postal_code', e.target.value)}
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
              options={[
                { value: '', label: 'No Plan' },
                ...plans.map(p => ({ value: p.id, label: `${p.name} ($${p.price})` })),
              ]}
            />
            <Input
              id="subscription_start_date"
              type="date"
              label="Start Date"
              value={formData.subscription_start_date || ''}
              onChange={(e) => handleChange('subscription_start_date', e.target.value || null)}
            />
            <Input
              id="subscription_end_date"
              type="date"
              label="End Date"
              value={formData.subscription_end_date || ''}
              onChange={(e) => handleChange('subscription_end_date', e.target.value || null)}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Admin Notes</h2>
          <textarea
            id="notes"
            rows={4}
            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Internal notes about this client..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Create Client
          </Button>
        </div>
      </form>
    </div>
  )
}
