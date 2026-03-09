'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'

interface Report {
  id: number
  title: string
  pdf: string
  uploaded_by_name: string
  created_at: string
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    api.get<{ results: Report[] }>('/reports/').then(d => setReports(d.results))
  }, [])

  return (
    <div>
      <PageHeader title="My Reports" description="Reports uploaded by the Web Wise team" />

      <div className="bg-white rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-border">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Uploaded By</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-bg-secondary/50">
                <td className="px-6 py-3 text-sm font-medium">{r.title}</td>
                <td className="px-6 py-3 text-sm text-text-secondary">{r.uploaded_by_name}</td>
                <td className="px-6 py-3 text-sm text-text-secondary">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-3">
                  <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">Download PDF</a>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-text-muted">No reports yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
