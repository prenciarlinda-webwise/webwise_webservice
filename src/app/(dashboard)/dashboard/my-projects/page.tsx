'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PageHeader from '@/components/dashboard/PageHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'

interface Service {
  id: number
  name: string
  description: string
  status: string
}

interface Project {
  id: number
  name: string
  website_url: string
  status: string
  services: Service[]
}

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    api.get<{ results: Project[] }>('/clients/projects/').then(d => setProjects(d.results))
  }, [])

  return (
    <div>
      <PageHeader title="My Projects" description={`${projects.length} projects`} />

      <div className="grid gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{project.name}</h3>
                {project.website_url && (
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
                    {project.website_url}
                  </a>
                )}
              </div>
              <StatusBadge status={project.status} />
            </div>
            {project.services.length > 0 && (
              <div className="space-y-2">
                {project.services.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-3 px-4 bg-bg-secondary rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      {s.description && <p className="text-xs text-text-muted mt-0.5">{s.description}</p>}
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-8 text-center text-text-muted">No projects yet</div>
        )}
      </div>
    </div>
  )
}
