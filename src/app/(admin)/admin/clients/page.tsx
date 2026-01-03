'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Trash2, Eye, Edit } from 'lucide-react'
import { api } from '@/lib/api'
import type { ClientListItem } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/dashboard/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

export default function AdminClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchClients = async () => {
    try {
      const data = await api.getClients({ search: search || undefined })
      setClients(data.results || [])
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true)
      fetchClients()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await api.deleteClient(deleteId)
      setClients(clients.filter(c => c.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Failed to delete client:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = [
    {
      key: 'company_name',
      header: 'Company',
      render: (c: ClientListItem) => (
        <div>
          <span className="font-medium text-text-primary">{c.company_name}</span>
          <p className="text-sm text-text-muted">{c.user_name}</p>
        </div>
      ),
    },
    { key: 'user_email', header: 'Email' },
    {
      key: 'plan_name',
      header: 'Plan',
      render: (c: ClientListItem) => c.plan_name || <span className="text-text-muted">No plan</span>,
    },
    {
      key: 'subscription_status',
      header: 'Status',
      render: (c: ClientListItem) => {
        const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
          active: 'success',
          expired: 'danger',
          no_plan: 'default',
        }
        return <Badge variant={variants[c.subscription_status] || 'default'}>{c.subscription_status.replace('_', ' ')}</Badge>
      },
    },
    {
      key: 'is_active',
      header: 'Active',
      render: (c: ClientListItem) => (
        <Badge variant={c.is_active ? 'success' : 'danger'}>
          {c.is_active ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (c: ClientListItem) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/admin/clients/${c.id}`)
            }}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/admin/clients/${c.id}?edit=true`)
            }}
            className="p-2 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeleteId(c.id)
            }}
            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
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
        <h1 className="text-2xl font-bold text-text-primary">Clients</h1>
        <Button onClick={() => router.push('/admin/clients/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input
            placeholder="Search by company, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={clients}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        onRowClick={(c) => router.push(`/admin/clients/${c.id}`)}
        emptyMessage="No clients found"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Client"
        size="sm"
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete this client? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
