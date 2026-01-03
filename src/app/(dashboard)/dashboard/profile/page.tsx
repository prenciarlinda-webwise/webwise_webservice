'use client'

import { useEffect, useState, FormEvent } from 'react'
import { User, Building, Globe, MapPin, Save } from 'lucide-react'
import { api } from '@/lib/api'
import type { ClientProfile } from '@/lib/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
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
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getClientProfile()
        setProfile(data)
        setFormData({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          phone: data.user.phone,
          company_name: data.company_name,
          website_url: data.website_url,
          industry: data.industry,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postal_code,
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      await api.updateClientProfile(formData)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-text-muted">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Profile Settings</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              required
            />
            <Input
              id="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              value={profile?.user.email || ''}
              disabled
              className="bg-bg-secondary"
            />
            <Input
              id="phone"
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Business Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="company_name"
              label="Company Name"
              value={formData.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              required
            />
            <Input
              id="industry"
              label="Industry"
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                id="website_url"
                label="Website URL"
                type="url"
                value={formData.website_url}
                onChange={(e) => handleChange('website_url', e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                id="address"
                label="Street Address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
            <Input
              id="city"
              label="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            <Input
              id="state"
              label="State/Province"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
            <Input
              id="country"
              label="Country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
            <Input
              id="postal_code"
              label="Postal Code"
              value={formData.postal_code}
              onChange={(e) => handleChange('postal_code', e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
