'use client'

import { useEffect, useState } from 'react'
import { FileText, Download, Calendar } from 'lucide-react'
import { api } from '@/lib/api'
import type { Report } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function ClientReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.getClientReports()
        setReports(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch reports:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleDownload = async (report: Report) => {
    try {
      const data = await api.getClientReport(report.id)
      if (data.download_url) {
        window.open(data.download_url, '_blank')
      }
    } catch (error) {
      console.error('Failed to get download URL:', error)
    }
  }

  const reportTypes: Record<string, string> = {
    monthly_seo: 'Monthly SEO',
    keyword_ranking: 'Keyword Ranking',
    traffic_analysis: 'Traffic Analysis',
    technical_audit: 'Technical Audit',
    custom: 'Custom',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-text-muted">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Reports</h1>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No reports yet</h3>
          <p className="text-text-muted">Your reports will appear here once they are uploaded.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-border p-6 flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{report.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge>{reportTypes[report.report_type] || report.report_type}</Badge>
                    <span className="flex items-center gap-1 text-sm text-text-muted">
                      <Calendar className="w-4 h-4" />
                      {new Date(report.report_date).toLocaleDateString()}
                    </span>
                  </div>
                  {report.description && (
                    <p className="text-sm text-text-muted mt-2">{report.description}</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(report)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
