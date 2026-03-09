'use client'

import { useAuth } from '@/context/AuthContext'
import AdminDashboard from './AdminDashboard'
import EmployeeDashboard from './EmployeeDashboard'
import ClientDashboard from './ClientDashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null

  if (user.role === 'admin') return <AdminDashboard />
  if (user.role === 'employee') return <EmployeeDashboard />
  return <ClientDashboard />
}
