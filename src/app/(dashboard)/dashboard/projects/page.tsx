'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'

interface Service { id: number; name: string; status: string }
interface Project {
  id: number; client: number; name: string; website_url: string; status: string
  services: Service[]; created_at: string
}
interface Client { id: number; business_name: string; projects: Project[] }

export default function ProjectsPage() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    api.get<{ results: Client[] }>('/clients/').then(d => setClients(d.results))
  }, [])

  const allProjects = clients.flatMap(c =>
    c.projects.map(p => ({ ...p, client_name: c.business_name, client_id: c.id }))
  )

  return (
    <div>
      <PageHeader title="Projects" description={`${allProjects.length} projects across ${clients.length} clients`} />

      <div className="space-y-3">
        {allProjects.map(project => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="block bg-white rounded-xl border border-border p-5 hover:border-accent/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-text-secondary">{project.client_name}</p>
                {project.website_url && <p className="text-xs text-text-muted">{project.website_url}</p>}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{project.services.length} service{project.services.length !== 1 ? 's' : ''}</p>
                  <div className="flex gap-1 mt-1">
                    {project.services.map(s => (
                      <span key={s.id} className="text-xs bg-bg-secondary px-2 py-0.5 rounded">{s.name}</span>
                    ))}
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>
            </div>
          </Link>
        ))}
        {allProjects.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-8 text-center text-text-muted">
            No projects yet
          </div>
        )}
      </div>
    </div>
  )
}
