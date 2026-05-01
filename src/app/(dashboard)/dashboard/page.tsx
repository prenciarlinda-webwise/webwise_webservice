'use client'

import { useAuth } from '@/context/AuthContext'
import AdminDashboard from './AdminDashboard'
import EmployeeDashboard from './EmployeeDashboard'
import ClientDashboard from './ClientDashboard'
import SupervisorDashboard from './SupervisorDashboard'
import EconomistDashboard from './EconomistDashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null

  if (user.role === 'admin') return <AdminDashboard />
  if (user.role === 'client') return <ClientDashboard />
  // Employee branch — supervisor and economist surface their own landings.
  if (user.employee_category === 'supervisor') return <SupervisorDashboard />
  if (user.employee_category === 'economist') return <EconomistDashboard />
  return <EmployeeDashboard />
}
