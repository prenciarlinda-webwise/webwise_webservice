'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { api } from '@/lib/api'
import type { Plan } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DataTable from '@/components/dashboard/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    plan_type: 'custom',
    description: '',
    price: 0,
    is_recurring: true,
    features: '',
    is_active: true,
  })

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.getPlans()
        setPlans(data)
      } catch (error) {
        console.error('Failed to fetch plans:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const openAddModal = () => {
    setEditingPlan(null)
    setFormData({
      name: '',
      plan_type: 'custom',
      description: '',
      price: 0,
      is_recurring: true,
      features: '',
      is_active: true,
    })
    setShowModal(true)
  }

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      plan_type: plan.plan_type,
      description: plan.description,
      price: plan.price,
      is_recurring: plan.is_recurring,
      features: plan.features.join('\n'),
      is_active: plan.is_active,
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) return
    setIsSubmitting(true)

    const planData = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim()),
    }

    try {
      if (editingPlan) {
        const updated = await api.updatePlan(editingPlan.id, planData)
        setPlans(plans.map(p => p.id === editingPlan.id ? updated : p))
      } else {
        const newPlan = await api.createPlan(planData)
        setPlans([...plans, newPlan])
      }
      setShowModal(false)
    } catch (error) {
      console.error('Failed to save plan:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    try {
      await api.deletePlan(id)
      setPlans(plans.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete plan:', error)
    }
  }

  const planTypeLabels: Record<string, string> = {
    seo_starter: 'Starter SEO',
    seo_medium: 'Medium SEO',
    seo_premium: 'Premium SEO',
    website: 'Website Development',
    custom: 'Custom',
  }

  const columns = [
    {
      key: 'name',
      header: 'Plan',
      render: (p: Plan) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <span className="font-medium">{p.name}</span>
            <p className="text-sm text-text-muted">{planTypeLabels[p.plan_type]}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (p: Plan) => (
        <div>
          <span className="font-semibold">${p.price}</span>
          {p.is_recurring && <span className="text-text-muted">/mo</span>}
        </div>
      ),
    },
    {
      key: 'features',
      header: 'Features',
      render: (p: Plan) => (
        <span className="text-text-muted">{p.features?.length || 0} features</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (p: Plan) => (
        <Badge variant={p.is_active ? 'success' : 'default'}>
          {p.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Plan) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(p)}
            className="p-2 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(p.id)}
            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Plans</h1>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        emptyMessage="No plans created yet"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlan ? 'Edit Plan' : 'Add Plan'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="name"
            label="Plan Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Starter SEO Package"
          />
          <Select
            id="plan_type"
            label="Plan Type"
            value={formData.plan_type}
            onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
            options={Object.entries(planTypeLabels).map(([value, label]) => ({ value, label }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              type="number"
              label="Price *"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
            <div className="flex items-center gap-4 pt-6">
              <input
                type="checkbox"
                id="is_recurring"
                checked={formData.is_recurring}
                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_recurring" className="text-sm text-text-primary">
                Monthly recurring
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the plan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Features (one per line)
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Monthly SEO report&#10;Keyword tracking&#10;Technical audit"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm text-text-primary">Active (visible to clients)</label>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!formData.name || !formData.price}>
            {editingPlan ? 'Update Plan' : 'Create Plan'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
