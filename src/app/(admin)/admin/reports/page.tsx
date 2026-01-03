'use client'

import { useEffect, useState, useRef } from 'react'
import { Upload, FileText, Trash2, Download, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import type { Report, ClientListItem, ReportCreateData } from '@/lib/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DataTable from '@/components/dashboard/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

export default function AdminReportsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadForm, setUploadForm] = useState({
    client: '',
    title: '',
    report_type: 'monthly_seo',
    description: '',
    report_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsData, clientsData] = await Promise.all([
          api.getReports(),
          api.getClients(),
        ])
        setReports(reportsData.results || [])
        setClients(clientsData.results || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.client) return
    setIsUploading(true)

    try {
      // Get signed upload URL
      const { upload_url, file_path } = await api.getReportUploadUrl(
        Number(uploadForm.client),
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
        client: Number(uploadForm.client),
        title: uploadForm.title,
        report_type: uploadForm.report_type,
        description: uploadForm.description,
        file_path: file_path,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        report_date: uploadForm.report_date,
      }

      const newReport = await api.createReport(reportData)
      setReports([newReport, ...reports])
      setShowUploadModal(false)
      setSelectedFile(null)
      setUploadForm({
        client: '',
        title: '',
        report_type: 'monthly_seo',
        description: '',
        report_date: new Date().toISOString().split('T')[0],
      })
    } catch (error) {
      console.error('Failed to upload report:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (report: Report) => {
    try {
      const { download_url } = await api.getReportDownloadUrl(report.id)
      window.open(download_url, '_blank')
    } catch (error) {
      console.error('Failed to get download URL:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    try {
      await api.deleteReport(id)
      setReports(reports.filter(r => r.id !== id))
    } catch (error) {
      console.error('Failed to delete report:', error)
    }
  }

  const reportTypes = [
    { value: 'monthly_seo', label: 'Monthly SEO Report' },
    { value: 'keyword_ranking', label: 'Keyword Ranking Report' },
    { value: 'traffic_analysis', label: 'Traffic Analysis' },
    { value: 'technical_audit', label: 'Technical Audit' },
    { value: 'custom', label: 'Custom Report' },
  ]

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (r: Report) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="font-medium">{r.title}</span>
            <p className="text-sm text-text-muted">{r.file_name}</p>
          </div>
        </div>
      ),
    },
    { key: 'client_name', header: 'Client' },
    {
      key: 'report_type',
      header: 'Type',
      render: (r: Report) => <Badge>{r.report_type.replace('_', ' ')}</Badge>,
    },
    {
      key: 'report_date',
      header: 'Date',
      render: (r: Report) => new Date(r.report_date).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: '',
      render: (r: Report) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload(r)}
            className="p-2 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(r.id)}
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
        <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Report
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reports}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        emptyMessage="No reports uploaded yet"
      />

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Report"
        size="md"
      >
        <div className="space-y-4">
          <Select
            id="client"
            label="Client *"
            value={uploadForm.client}
            onChange={(e) => setUploadForm({ ...uploadForm, client: e.target.value })}
            options={[
              { value: '', label: 'Select a client' },
              ...clients.map(c => ({ value: c.id, label: c.company_name })),
            ]}
          />

          <Input
            id="title"
            label="Report Title *"
            value={uploadForm.title}
            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
            placeholder="e.g., January 2024 SEO Report"
          />

          <Select
            id="report_type"
            label="Report Type"
            value={uploadForm.report_type}
            onChange={(e) => setUploadForm({ ...uploadForm, report_type: e.target.value })}
            options={reportTypes}
          />

          <Input
            id="report_date"
            type="date"
            label="Report Date"
            value={uploadForm.report_date}
            onChange={(e) => setUploadForm({ ...uploadForm, report_date: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              File *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors"
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  <span>{selectedFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <Upload className="w-8 h-8" />
                  <span>Click to select a file</span>
                </div>
              )}
            </button>
          </div>

          <textarea
            rows={3}
            placeholder="Description (optional)"
            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={uploadForm.description}
            onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
          />
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            isLoading={isUploading}
            disabled={!selectedFile || !uploadForm.client || !uploadForm.title}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </Modal>
    </div>
  )
}
