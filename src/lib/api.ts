const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface Tokens {
  access: string
  refresh: string
}

class ApiClient {
  private getTokens(): Tokens | null {
    if (typeof window === 'undefined') return null
    const access = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    if (access && refresh) return { access, refresh }
    return null
  }

  private setTokens(tokens: Tokens) {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
  }

  clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  private async refreshToken(): Promise<string | null> {
    const tokens = this.getTokens()
    if (!tokens) return null
    try {
      const res = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }),
      })
      if (!res.ok) return null
      const data = await res.json()
      this.setTokens({ access: data.access, refresh: data.refresh || tokens.refresh })
      return data.access
    } catch {
      return null
    }
  }

  async request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const tokens = this.getTokens()
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    }
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    if (tokens?.access) {
      headers['Authorization'] = `Bearer ${tokens.access}`
    }

    let res = await fetch(`${API_URL}${path}`, { ...options, headers })

    if (res.status === 401 && tokens) {
      const newToken = await this.refreshToken()
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        res = await fetch(`${API_URL}${path}`, { ...options, headers })
      } else {
        this.clearTokens()
        window.location.href = '/login'
        throw new Error('Session expired')
      }
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw { status: res.status, ...error }
    }

    if (res.status === 204) return {} as T
    return res.json()
  }

  async login(username: string, password: string) {
    const data = await this.request<Tokens>('/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    this.setTokens(data)
    return data
  }

  get<T = unknown>(path: string) {
    return this.request<T>(path)
  }

  post<T = unknown>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    })
  }

  put<T = unknown>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    })
  }

  patch<T = unknown>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    })
  }

  delete(path: string) {
    return this.request(path, { method: 'DELETE' })
  }
}

export const api = new ApiClient()
