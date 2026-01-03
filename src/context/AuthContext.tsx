'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const userData = await api.getCurrentUser()
      setUser(userData)
    } catch {
      setUser(null)
      api.clearTokens()
    }
  }, [])

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      const token = api.getAccessToken()
      if (token) {
        try {
          await refreshUser()
        } catch {
          // Token invalid, clear it
          api.clearTokens()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)
    setUser(response.user)
  }

  const logout = async () => {
    try {
      await api.logout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
