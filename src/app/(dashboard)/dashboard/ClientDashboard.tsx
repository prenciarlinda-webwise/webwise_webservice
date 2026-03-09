'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import StatusBadge from '@/components/dashboard/StatusBadge'

interface Service { id: number; name: string; status: string }
interface Project {
  id: number
  name: string
  website_url: string
  status: string
  services: Service[]
}

interface Payment {
  id: number
  service_name: string
  status: string
  due_date: string
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    api.get<{ results: Project[] }>('/clients/projects/').then(d => setProjects(d.results))
    api.get<{ results: Payment[] }>('/payments/').then(d => setPayments(d.results))
  }, [])

  const activeProjects = projects.filter(p => p.status === 'active').length
  const nextPayment = payments
    .filter(p => p.status === 'upcoming' || p.status === 'pending')
    .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))[0]

  // Determine if client is on a starter/basic package
  const totalServices = projects.reduce((s, p) => s + p.services.length, 0)
  const isStarterPackage = totalServices <= 1

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.first_name}`} description="Your project overview" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatsCard label="Active Projects" value={String(activeProjects)} color="blue" />
        <StatsCard
          label="Next Payment"
          value={nextPayment ? nextPayment.due_date : 'None scheduled'}
          color={nextPayment ? 'yellow' : 'default'}
        />
        <StatsCard label="Services Active" value={String(totalServices)} color="green" />
      </div>

      {isStarterPackage && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-amber-800 mb-1">Starter Package</p>
          <p className="text-sm text-amber-700">
            You&apos;re on a starter plan. Results build gradually over 3-6 months as we establish your online presence.
            For faster results with more deliverables each month, consider upgrading.
          </p>
          <Link href="/dashboard/plans" className="inline-block mt-3 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
            View Available Packages
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-text-primary">{project.name}</h3>
                {project.website_url && <p className="text-sm text-text-muted">{project.website_url}</p>}
              </div>
              <StatusBadge status={project.status} />
            </div>
            {project.services.length > 0 && (
              <div className="space-y-2">
                {project.services.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 px-3 bg-bg-secondary rounded-lg">
                    <span className="text-sm">{s.name}</span>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upgrade CTA */}
      <div className="mt-8 bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">Want to see better results?</h3>
        <p className="text-sm text-white/80 mb-4">
          Upgrading your package means more deliverables, faster keyword rankings, and increased lead generation every month.
        </p>
        <Link href="/dashboard/plans" className="inline-block px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90">
          Explore Upgrade Options
        </Link>
      </div>
    </div>
  )
}
