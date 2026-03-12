'use client'

import { useEffect, useState, useRef } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'

interface Report { id: number; client: number; client_name: string; title: string; pdf: string; uploaded_by_name: string; created_at: string }
interface Client { id: number; business_name: string }
interface Project { id: number; name: string; client: number }

export default function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [filterProject, setFilterProject] = useState('')

  const [showUpload, setShowUpload] = useState(false)
  const [uploadClient, setUploadClient] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const reload = () => {
    api.get<{ results: Report[] }>('/reports/').then(d => setReports(d.results)).catch(() => {})
  }

  useEffect(() => {
    reload()
    if (user?.role === 'admin') {
      api.get<{ results: Client[] }>('/clients/').then(d => setClients(d.results)).catch(() => {})
      api.get<{ results: Project[] }>('/clients/projects/').then(d => setProjects(d.results)).catch(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const filteredReports = filterProject
    ? reports.filter(r => {
        const project = projects.find(p => String(p.id) === filterProject)
        return project ? r.client === project.client : true
      })
    : reports

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file || !uploadClient || !uploadTitle) return
    const form = new FormData()
    form.append('client', uploadClient)
    form.append('title', uploadTitle)
    form.append('pdf', file)
    await api.post('/reports/', form)
    reload()
    setShowUpload(false)
    setUploadTitle('')
    setUploadClient('')
  }

  return (
    <div>
      <PageHeader
        title="PDF Reports"
        description="Upload and manage PDF reports for clients"
        action={
          user?.role === 'admin' && (
            <div className="flex gap-2">
              <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm">
                <option value="">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button onClick={() => setShowUpload(!showUpload)} className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">Upload PDF</button>
            </div>
          )
        }
      />

      {showUpload && (
        <form onSubmit={handleUpload} className="bg-white rounded-xl border border-border p-6 mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Client</label>
            <select value={uploadClient} onChange={e => setUploadClient(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" required>
              <option value="">Select client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" placeholder="e.g. March 2026 SEO Report" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">PDF</label>
            <input ref={fileRef} type="file" accept=".pdf" className="text-sm" required />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg">Upload</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-border">
        <table className="w-full">
          <thead><tr className="text-left text-xs text-text-muted border-b border-border"><th className="px-6 py-3">Title</th><th className="px-6 py-3">Client</th><th className="px-6 py-3">Uploaded By</th><th className="px-6 py-3">Date</th><th className="px-6 py-3"></th></tr></thead>
          <tbody>
            {filteredReports.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/50">
                <td className="px-6 py-3 text-sm font-medium">{r.title}</td>
                <td className="px-6 py-3 text-sm text-text-secondary">{r.client_name}</td>
                <td className="px-6 py-3 text-sm text-text-secondary">{r.uploaded_by_name}</td>
                <td className="px-6 py-3 text-sm text-text-secondary">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-3"><a href={r.pdf} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">Download</a></td>
              </tr>
            ))}
            {filteredReports.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No reports yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
