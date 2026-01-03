// API Client with JWT token handling

import type {
  User,
  LoginResponse,
  ClientProfile,
  ClientDetail,
  ClientListItem,
  ClientCreateData,
  ClientUpdateData,
  Report,
  ReportCreateData,
  Keyword,
  KeywordCreateData,
  KeywordRanking,
  Payment,
  PaymentCreateData,
  AdminPaymentMethod,
  PaymentMethodCreateData,
  MarkPaidData,
  Task,
  TaskCreateData,
  TaskUpdateData,
  TaskStats,
  Plan,
  DashboardStats,
  PaginatedResponse,
  Notification,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

class ApiClient {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private refreshPromise: Promise<string> | null = null

  constructor() {
    // Load tokens from localStorage on init (client-side only)
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token')
      this.refreshToken = localStorage.getItem('refresh_token')
    }
  }

  setTokens(access: string, refresh: string) {
    this.accessToken = access
    this.refreshToken = refresh
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    }
  }

  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  getAccessToken() {
    return this.accessToken
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token')
    }

    // Reuse existing refresh promise if one is in progress
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: this.refreshToken }),
        })

        if (!response.ok) {
          throw new Error('Token refresh failed')
        }

        const data = await response.json()
        this.setTokens(data.access, data.refresh || this.refreshToken!)
        return data.access
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Merge existing headers
    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(url, { ...options, headers })

    // Handle token refresh on 401
    if (response.status === 401 && this.refreshToken) {
      try {
        await this.refreshAccessToken()
        // Retry with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`
        response = await fetch(url, { ...options, headers })
      } catch {
        this.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        throw new Error('Session expired')
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || error.error || 'Request failed')
    }

    // Handle empty responses
    const text = await response.text()
    return text ? JSON.parse(text) : ({} as T)
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setTokens(data.access, data.refresh)
    return data
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: this.refreshToken }),
      })
    } finally {
      this.clearTokens()
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me/')
  }

  async updateCurrentUser(data: Partial<User>): Promise<User> {
    return this.request<User>('/auth/me/', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.request('/auth/password/change/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPassword,
      }),
    })
  }

  // Admin - Clients
  async getClients(params?: { search?: string; is_active?: boolean }): Promise<PaginatedResponse<ClientListItem>> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set('search', params.search)
    if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active))
    const query = searchParams.toString()
    return this.request(`/admin/clients/${query ? `?${query}` : ''}`)
  }

  async getClient(id: number): Promise<ClientDetail> {
    return this.request(`/admin/clients/${id}/`)
  }

  async createClient(data: ClientCreateData): Promise<ClientProfile> {
    return this.request('/admin/clients/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateClient(id: number, data: ClientUpdateData): Promise<ClientProfile> {
    return this.request(`/admin/clients/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteClient(id: number): Promise<void> {
    await this.request(`/admin/clients/${id}/`, { method: 'DELETE' })
  }

  async resetClientPassword(id: number, password: string): Promise<void> {
    await this.request(`/admin/clients/${id}/reset_password/`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/admin/dashboard/stats/')
  }

  // Admin - Plans
  async getPlans(): Promise<Plan[]> {
    const response = await this.request<PaginatedResponse<Plan> | Plan[]>('/admin/plans/')
    return Array.isArray(response) ? response : response.results
  }

  async getPlan(id: number): Promise<Plan> {
    return this.request(`/admin/plans/${id}/`)
  }

  async createPlan(data: Partial<Plan>): Promise<Plan> {
    return this.request('/admin/plans/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePlan(id: number, data: Partial<Plan>): Promise<Plan> {
    return this.request(`/admin/plans/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePlan(id: number): Promise<void> {
    await this.request(`/admin/plans/${id}/`, { method: 'DELETE' })
  }

  // Admin - Reports
  async getReports(params?: { client?: number; type?: string }): Promise<PaginatedResponse<Report>> {
    const searchParams = new URLSearchParams()
    if (params?.client) searchParams.set('client', String(params.client))
    if (params?.type) searchParams.set('type', params.type)
    const query = searchParams.toString()
    return this.request(`/admin/reports/${query ? `?${query}` : ''}`)
  }

  async getReport(id: number): Promise<Report> {
    return this.request(`/admin/reports/${id}/`)
  }

  async getReportUploadUrl(clientId: number, fileName: string): Promise<{ upload_url: string; file_path: string; token: string }> {
    return this.request('/admin/reports/upload_url/', {
      method: 'POST',
      body: JSON.stringify({ client_id: clientId, file_name: fileName }),
    })
  }

  async createReport(data: ReportCreateData): Promise<Report> {
    return this.request('/admin/reports/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteReport(id: number): Promise<void> {
    await this.request(`/admin/reports/${id}/`, { method: 'DELETE' })
  }

  async getReportDownloadUrl(id: number): Promise<{ download_url: string }> {
    return this.request(`/admin/reports/${id}/download_url/`)
  }

  // Admin - Keywords
  async getKeywords(params?: { client?: number; is_primary?: boolean }): Promise<PaginatedResponse<Keyword>> {
    const searchParams = new URLSearchParams()
    if (params?.client) searchParams.set('client', String(params.client))
    if (params?.is_primary !== undefined) searchParams.set('is_primary', String(params.is_primary))
    const query = searchParams.toString()
    return this.request(`/admin/keywords/${query ? `?${query}` : ''}`)
  }

  async getKeyword(id: number): Promise<Keyword> {
    return this.request(`/admin/keywords/${id}/`)
  }

  async createKeyword(data: KeywordCreateData): Promise<Keyword> {
    return this.request('/admin/keywords/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateKeyword(id: number, data: Partial<KeywordCreateData>): Promise<Keyword> {
    return this.request(`/admin/keywords/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteKeyword(id: number): Promise<void> {
    await this.request(`/admin/keywords/${id}/`, { method: 'DELETE' })
  }

  async addKeywordRanking(keywordId: number, data: { position: number; recorded_date: string; search_engine?: string }): Promise<KeywordRanking> {
    return this.request(`/admin/keywords/${keywordId}/add_ranking/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async bulkUpdateRankings(rankings: { keyword_id: number; position: number; recorded_date: string; search_engine?: string }[]): Promise<{ created: unknown[]; errors: unknown[] }> {
    return this.request('/admin/keywords/bulk_rankings/', {
      method: 'POST',
      body: JSON.stringify({ rankings }),
    })
  }

  // Admin - Payments
  async getPayments(params?: { client?: number; status?: string; overdue?: boolean }): Promise<PaginatedResponse<Payment>> {
    const searchParams = new URLSearchParams()
    if (params?.client) searchParams.set('client', String(params.client))
    if (params?.status) searchParams.set('status', params.status)
    if (params?.overdue) searchParams.set('overdue', 'true')
    const query = searchParams.toString()
    return this.request(`/admin/payments/${query ? `?${query}` : ''}`)
  }

  async getPayment(id: number): Promise<Payment> {
    return this.request(`/admin/payments/${id}/`)
  }

  async createPayment(data: PaymentCreateData): Promise<Payment> {
    return this.request('/admin/payments/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePayment(id: number, data: Partial<PaymentCreateData>): Promise<Payment> {
    return this.request(`/admin/payments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deletePayment(id: number): Promise<void> {
    await this.request(`/admin/payments/${id}/`, { method: 'DELETE' })
  }

  async markPaymentPaid(id: number, data?: { paid_date?: string; payment_method?: string }): Promise<Payment> {
    return this.request(`/admin/payments/${id}/mark_paid/`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    })
  }

  async confirmPayment(id: number): Promise<Payment> {
    return this.request(`/admin/payments/${id}/confirm_payment/`, {
      method: 'POST',
    })
  }

  // Admin - Payment Methods
  async getPaymentMethods(): Promise<AdminPaymentMethod[]> {
    return this.request('/admin/payment-methods/')
  }

  async getPaymentMethod(id: number): Promise<AdminPaymentMethod> {
    return this.request(`/admin/payment-methods/${id}/`)
  }

  async createPaymentMethod(data: PaymentMethodCreateData): Promise<AdminPaymentMethod> {
    return this.request('/admin/payment-methods/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePaymentMethod(id: number, data: Partial<PaymentMethodCreateData>): Promise<AdminPaymentMethod> {
    return this.request(`/admin/payment-methods/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await this.request(`/admin/payment-methods/${id}/`, { method: 'DELETE' })
  }

  // Admin - Tasks
  async getTasks(params?: { client?: number; status?: string; category?: string; priority?: string; overdue?: boolean }): Promise<PaginatedResponse<Task>> {
    const searchParams = new URLSearchParams()
    if (params?.client) searchParams.set('client', String(params.client))
    if (params?.status) searchParams.set('status', params.status)
    if (params?.category) searchParams.set('category', params.category)
    if (params?.priority) searchParams.set('priority', params.priority)
    if (params?.overdue) searchParams.set('overdue', 'true')
    const query = searchParams.toString()
    return this.request(`/admin/tasks/${query ? `?${query}` : ''}`)
  }

  async getTask(id: number): Promise<Task> {
    return this.request(`/admin/tasks/${id}/`)
  }

  async createTask(data: TaskCreateData): Promise<Task> {
    return this.request('/admin/tasks/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: number, data: TaskUpdateData): Promise<Task> {
    return this.request(`/admin/tasks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(id: number): Promise<void> {
    await this.request(`/admin/tasks/${id}/`, { method: 'DELETE' })
  }

  async markTaskCompleted(id: number, data?: { completed_date?: string }): Promise<Task> {
    return this.request(`/admin/tasks/${id}/mark_completed/`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    })
  }

  async markTaskInProgress(id: number): Promise<Task> {
    return this.request(`/admin/tasks/${id}/mark_in_progress/`, {
      method: 'POST',
    })
  }

  async getTaskStats(): Promise<TaskStats> {
    return this.request('/admin/tasks/stats/')
  }

  // Client endpoints
  async getClientProfile(): Promise<ClientProfile> {
    return this.request('/client/profile/')
  }

  async updateClientProfile(data: Partial<ClientUpdateData>): Promise<ClientProfile> {
    return this.request('/client/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getClientReports(): Promise<Report[]> {
    return this.request('/client/reports/')
  }

  async getClientReport(id: number): Promise<Report> {
    return this.request(`/client/reports/${id}/`)
  }

  async getClientKeywords(): Promise<Keyword[]> {
    return this.request('/client/keywords/')
  }

  async getClientPayments(): Promise<Payment[]> {
    return this.request('/client/payments/')
  }

  async getClientTasks(): Promise<Task[]> {
    return this.request('/client/tasks/')
  }

  async getClientPaymentMethods(): Promise<AdminPaymentMethod[]> {
    return this.request('/client/payments/payment_methods/')
  }

  async clientMarkPaymentPaid(id: number, data: MarkPaidData): Promise<Payment> {
    return this.request(`/client/payments/${id}/mark_paid/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Client - Notifications
  async getClientNotifications(params?: { type?: string; is_read?: boolean }): Promise<Notification[]> {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set('type', params.type)
    if (params?.is_read !== undefined) searchParams.set('is_read', String(params.is_read))
    const query = searchParams.toString()
    return this.request(`/client/notifications/${query ? `?${query}` : ''}`)
  }

  async getClientUnreadNotificationCount(): Promise<{ count: number }> {
    return this.request('/client/notifications/unread_count/')
  }

  async markClientNotificationRead(id: number): Promise<Notification> {
    return this.request(`/client/notifications/${id}/mark_read/`, { method: 'POST' })
  }

  async markAllClientNotificationsRead(): Promise<void> {
    await this.request('/client/notifications/mark_all_read/', { method: 'POST' })
  }

  async acknowledgeNotification(id: number): Promise<Notification> {
    return this.request(`/client/notifications/${id}/acknowledge/`, { method: 'POST' })
  }

  async respondToOffer(id: number, accepted: boolean): Promise<Notification> {
    return this.request(`/client/notifications/${id}/respond_offer/`, {
      method: 'POST',
      body: JSON.stringify({ accepted }),
    })
  }

  // Admin - Notifications
  async getAdminNotifications(params?: { client?: number; type?: string; is_read?: boolean }): Promise<Notification[]> {
    const searchParams = new URLSearchParams()
    if (params?.client) searchParams.set('client', String(params.client))
    if (params?.type) searchParams.set('type', params.type)
    if (params?.is_read !== undefined) searchParams.set('is_read', String(params.is_read))
    const query = searchParams.toString()
    return this.request(`/admin/notifications/${query ? `?${query}` : ''}`)
  }

  async getAdminUnreadNotificationCount(): Promise<{ count: number }> {
    return this.request('/admin/notifications/unread_count/')
  }

  async markAdminNotificationRead(id: number): Promise<Notification> {
    return this.request(`/admin/notifications/${id}/mark_read/`, { method: 'POST' })
  }

  async markAllAdminNotificationsRead(): Promise<void> {
    await this.request('/admin/notifications/mark_all_read/', { method: 'POST' })
  }

  async sendOffer(data: {
    client_id: number
    title: string
    message: string
    offer_details?: Record<string, unknown>
    expires_in_days?: number
  }): Promise<Notification> {
    return this.request('/admin/notifications/send_offer/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

// Export singleton instance
export const api = new ApiClient()
