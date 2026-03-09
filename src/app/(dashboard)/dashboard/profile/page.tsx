'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'

interface ClientProfile {
  id: number
  business_name: string
  business_phone: string
  business_email: string
  services: string[]
  products: string[]
  price_per_service: Record<string, number>
  service_locations: string[]
  social_links: Record<string, string>
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  useEffect(() => {
    api.get<ClientProfile>('/clients/me/').then(setProfile)
  }, [])

  const update = (field: string, value: unknown) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setSaveStatus('idle')
    try {
      const updated = await api.patch<ClientProfile>('/clients/me/', {
        business_name: profile.business_name,
        business_phone: profile.business_phone,
        business_email: profile.business_email,
        services: profile.services,
        products: profile.products,
        price_per_service: profile.price_per_service,
        service_locations: profile.service_locations,
        social_links: profile.social_links,
      })
      setProfile(updated)
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  if (!profile) return <div className="animate-pulse h-8 w-48 bg-bg-secondary rounded" />

  return (
    <div>
      <PageHeader
        title="Business Profile"
        description="Edit your business information"
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors ${saveStatus === 'error' ? 'bg-red-500' : saveStatus === 'saved' ? 'bg-green-600' : 'bg-accent hover:bg-accent/90'}`}
          >
            {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Failed to save' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              value={profile.business_name}
              onChange={e => update('business_name', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Email</label>
            <input
              type="email"
              value={profile.business_email}
              onChange={e => update('business_email', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Phone</label>
            <input
              value={profile.business_phone}
              onChange={e => update('business_phone', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-semibold">Services</h3>
          <p className="text-xs text-text-muted">Comma-separated list</p>
          <textarea
            value={profile.services.join(', ')}
            onChange={e => update('services', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20"
          />
          <h3 className="font-semibold">Products</h3>
          <textarea
            value={profile.products.join(', ')}
            onChange={e => update('products', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20"
          />
        </div>

        {/* Locations */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-semibold">Service Locations</h3>
          <p className="text-xs text-text-muted">Comma-separated list</p>
          <textarea
            value={profile.service_locations.join(', ')}
            onChange={e => update('service_locations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm h-20"
          />
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-semibold">Social Links</h3>
          {Object.entries(profile.social_links).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-sm font-medium mb-1 capitalize">{platform.replace(/_/g, ' ')}</label>
              <input
                value={url}
                onChange={e => update('social_links', { ...profile.social_links, [platform]: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
