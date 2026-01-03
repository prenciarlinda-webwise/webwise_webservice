'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, TrendingUp, Search } from 'lucide-react'
import { api } from '@/lib/api'
import type { Keyword, ClientListItem, KeywordCreateData } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DataTable from '@/components/dashboard/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

export default function AdminKeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRankingModal, setShowRankingModal] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null)
  const [filterClient, setFilterClient] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [addForm, setAddForm] = useState<KeywordCreateData>({
    client: 0,
    keyword: '',
    target_url: '',
    search_volume: null,
    difficulty: null,
    is_primary: false,
  })

  const [rankingForm, setRankingForm] = useState({
    position: '',
    recorded_date: new Date().toISOString().split('T')[0],
    search_engine: 'google',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [keywordsData, clientsData] = await Promise.all([
          api.getKeywords({ client: filterClient ? Number(filterClient) : undefined }),
          api.getClients(),
        ])
        setKeywords(keywordsData.results || [])
        setClients(clientsData.results || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filterClient])

  const handleAddKeyword = async () => {
    if (!addForm.client || !addForm.keyword) return
    setIsSubmitting(true)

    try {
      const newKeyword = await api.createKeyword(addForm)
      setKeywords([newKeyword, ...keywords])
      setShowAddModal(false)
      setAddForm({
        client: 0,
        keyword: '',
        target_url: '',
        search_volume: null,
        difficulty: null,
        is_primary: false,
      })
    } catch (error) {
      console.error('Failed to add keyword:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddRanking = async () => {
    if (!selectedKeyword || !rankingForm.position) return
    setIsSubmitting(true)

    try {
      await api.addKeywordRanking(selectedKeyword.id, {
        position: Number(rankingForm.position),
        recorded_date: rankingForm.recorded_date,
        search_engine: rankingForm.search_engine,
      })
      // Refresh keywords
      const data = await api.getKeywords({ client: filterClient ? Number(filterClient) : undefined })
      setKeywords(data.results || [])
      setShowRankingModal(false)
      setRankingForm({
        position: '',
        recorded_date: new Date().toISOString().split('T')[0],
        search_engine: 'google',
      })
    } catch (error) {
      console.error('Failed to add ranking:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this keyword?')) return
    try {
      await api.deleteKeyword(id)
      setKeywords(keywords.filter(k => k.id !== id))
    } catch (error) {
      console.error('Failed to delete keyword:', error)
    }
  }

  const columns = [
    {
      key: 'keyword',
      header: 'Keyword',
      render: (k: Keyword) => (
        <div>
          <span className="font-medium">{k.keyword}</span>
          {k.is_primary && <Badge variant="info" className="ml-2">Primary</Badge>}
        </div>
      ),
    },
    { key: 'client_name', header: 'Client' },
    {
      key: 'latest_position',
      header: 'Position',
      render: (k: Keyword) => {
        if (!k.latest_position) return <span className="text-text-muted">-</span>
        const color = k.latest_position <= 3 ? 'text-green-600' : k.latest_position <= 10 ? 'text-blue-600' : ''
        return <span className={`font-semibold ${color}`}>#{k.latest_position}</span>
      },
    },
    {
      key: 'search_volume',
      header: 'Volume',
      render: (k: Keyword) => k.search_volume?.toLocaleString() || '-',
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (k: Keyword) => {
        if (!k.difficulty) return '-'
        const variant = k.difficulty < 30 ? 'success' : k.difficulty < 60 ? 'warning' : 'danger'
        return <Badge variant={variant}>{k.difficulty}</Badge>
      },
    },
    {
      key: 'actions',
      header: '',
      render: (k: Keyword) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedKeyword(k)
              setShowRankingModal(true)
            }}
            className="p-2 text-text-muted hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Add Ranking"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(k.id)}
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
        <h1 className="text-2xl font-bold text-text-primary">Keywords</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Keyword
        </Button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Select
          id="filter_client"
          value={filterClient}
          onChange={(e) => {
            setFilterClient(e.target.value)
            setIsLoading(true)
          }}
          options={[
            { value: '', label: 'All Clients' },
            ...clients.map(c => ({ value: c.id, label: c.company_name })),
          ]}
          className="max-w-xs"
        />
      </div>

      <DataTable
        columns={columns}
        data={keywords}
        keyExtractor={(k) => k.id}
        isLoading={isLoading}
        emptyMessage="No keywords tracked yet"
      />

      {/* Add Keyword Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Keyword"
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
          <Input
            id="keyword"
            label="Keyword *"
            value={addForm.keyword}
            onChange={(e) => setAddForm({ ...addForm, keyword: e.target.value })}
            placeholder="e.g., plumber near me"
          />
          <Input
            id="target_url"
            label="Target URL"
            value={addForm.target_url || ''}
            onChange={(e) => setAddForm({ ...addForm, target_url: e.target.value })}
            placeholder="https://"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="search_volume"
              type="number"
              label="Search Volume"
              value={addForm.search_volume || ''}
              onChange={(e) => setAddForm({ ...addForm, search_volume: e.target.value ? Number(e.target.value) : null })}
            />
            <Input
              id="difficulty"
              type="number"
              label="Difficulty (0-100)"
              value={addForm.difficulty || ''}
              onChange={(e) => setAddForm({ ...addForm, difficulty: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_primary"
              checked={addForm.is_primary}
              onChange={(e) => setAddForm({ ...addForm, is_primary: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_primary" className="text-sm text-text-primary">Primary keyword</label>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddKeyword} isLoading={isSubmitting} disabled={!addForm.client || !addForm.keyword}>
            Add Keyword
          </Button>
        </div>
      </Modal>

      {/* Add Ranking Modal */}
      <Modal
        isOpen={showRankingModal}
        onClose={() => setShowRankingModal(false)}
        title={`Add Ranking for "${selectedKeyword?.keyword}"`}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            id="position"
            type="number"
            label="Position *"
            value={rankingForm.position}
            onChange={(e) => setRankingForm({ ...rankingForm, position: e.target.value })}
            placeholder="1-100"
          />
          <Input
            id="recorded_date"
            type="date"
            label="Date"
            value={rankingForm.recorded_date}
            onChange={(e) => setRankingForm({ ...rankingForm, recorded_date: e.target.value })}
          />
          <Select
            id="search_engine"
            label="Search Engine"
            value={rankingForm.search_engine}
            onChange={(e) => setRankingForm({ ...rankingForm, search_engine: e.target.value })}
            options={[
              { value: 'google', label: 'Google' },
              { value: 'bing', label: 'Bing' },
              { value: 'yahoo', label: 'Yahoo' },
            ]}
          />
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowRankingModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddRanking} isLoading={isSubmitting} disabled={!rankingForm.position}>
            Add Ranking
          </Button>
        </div>
      </Modal>
    </div>
  )
}
