// API Types for Dashboard

export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  full_name: string
  phone: string
  role: 'admin' | 'client'
  created_at: string
  updated_at: string
}

export interface Plan {
  id: number
  name: string
  plan_type: string
  description: string
  price: number
  is_recurring: boolean
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClientProfile {
  id: number
  user: User
  company_name: string
  website_url: string
  industry: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  notes: string
  plan: Plan | null
  subscription_start_date: string | null
  subscription_end_date: string | null
  subscription_status: 'active' | 'expired' | 'no_plan'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClientListItem {
  id: number
  company_name: string
  user_email: string
  user_name: string
  plan_name: string | null
  subscription_status: string
  is_active: boolean
  created_at: string
}

export interface Report {
  id: number
  client: number
  client_name?: string
  title: string
  report_type: string
  description: string
  file_url: string
  file_path: string
  file_name: string
  file_size: number
  report_date: string
  uploaded_by?: number
  uploaded_by_name?: string
  created_at: string
  updated_at: string
  download_url?: string
}

export interface Keyword {
  id: number
  client: number
  client_name?: string
  keyword: string
  target_url: string
  search_volume: number | null
  difficulty: number | null
  is_primary: boolean
  latest_position: number | null
  position_change?: number | null
  recent_rankings?: { date: string; position: number }[]
  rankings?: KeywordRanking[]
  created_at: string
  updated_at: string
}

export interface KeywordRanking {
  id: number
  position: number
  recorded_date: string
  search_engine: string
  created_at: string
}

export interface AdminPaymentMethod {
  id: number
  method_type: string
  method_type_display: string
  name: string
  details: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Payment {
  id: number
  client: number
  client_name?: string
  plan: number | null
  plan_name?: string | null
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
  payment_method: string
  payment_method_used?: number | null
  payment_method_name?: string | null
  reference_number?: string
  due_date: string
  paid_date: string | null
  invoice_number: string
  description: string
  notes: string
  is_overdue: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  client: number
  client_name?: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high'
  category: 'seo' | 'content' | 'technical' | 'design' | 'development' | 'reporting' | 'other'
  due_date: string | null
  completed_date: string | null
  order: number
  is_overdue: boolean
  created_at: string
  updated_at: string
}

export interface TaskStats {
  total: number
  pending: number
  in_progress: number
  completed: number
  overdue: number
}

export interface DashboardStats {
  // Client stats
  total_clients: number
  active_clients: number
  new_clients_this_month: number

  // Revenue stats
  total_revenue: number
  this_month_revenue: number
  last_month_revenue: number
  pending_amount: number

  // Payment stats
  pending_payments: number
  overdue_payments: number
  overdue_amount: number

  // Activity data
  recent_payments: RecentPayment[]
  monthly_revenue: { month: string; total: number }[]
  upcoming_due: UpcomingDue[]

  // Other stats
  total_keywords: number
  total_reports: number
  reports_this_month: number
}

export interface RecentPayment {
  id: number
  client_name: string
  amount: number
  currency: string
  status: string
  due_date: string
  paid_date: string | null
  invoice_number: string
  is_overdue: boolean
}

export interface UpcomingDue {
  client_id: number
  client_name: string
  amount: number
  due_date: string
}

export interface KeywordSummary {
  total: number
  primary: number
  in_top_10: number
  in_top_50: number
  not_ranking: number
}

export interface PaymentSummary {
  total_paid: number
  total_pending: number
  overdue_count: number
  overdue_amount: number
}

export interface ClientKeyword {
  id: number
  keyword: string
  target_url: string
  search_volume: number | null
  difficulty: number | null
  is_primary: boolean
  latest_position: number | null
  position_change: number | null
  ranking_history: { date: string; position: number }[]
}

export interface ClientPayment {
  id: number
  amount: number
  currency: string
  status: string
  payment_method: string
  payment_method_used?: number | null
  payment_method_name?: string | null
  reference_number?: string
  due_date: string
  paid_date: string | null
  invoice_number: string
  description: string
  plan_name: string | null
  is_overdue: boolean
}

export interface ClientDetail extends ClientProfile {
  keywords: ClientKeyword[]
  payments: ClientPayment[]
  keyword_summary: KeywordSummary
  payment_summary: PaymentSummary
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Form types
export interface ClientCreateData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  company_name: string
  website_url?: string
  industry?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  notes?: string
  plan_id?: number | null
  subscription_start_date?: string | null
  subscription_end_date?: string | null
}

export interface ClientUpdateData {
  first_name: string
  last_name: string
  phone?: string
  company_name: string
  website_url?: string
  industry?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  notes?: string
  plan_id?: number | null
  subscription_start_date?: string | null
  subscription_end_date?: string | null
  is_active?: boolean
}

export interface ReportCreateData {
  client: number
  title: string
  report_type: string
  description?: string
  file_path: string
  file_name: string
  file_size: number
  report_date: string
}

export interface KeywordCreateData {
  client: number
  keyword: string
  target_url?: string
  search_volume?: number | null
  difficulty?: number | null
  is_primary?: boolean
}

export interface PaymentCreateData {
  client: number
  plan?: number | null
  amount: number
  currency?: string
  status?: string
  payment_method?: string
  due_date: string
  paid_date?: string | null
  description?: string
  notes?: string
}

export interface PaymentMethodCreateData {
  method_type: string
  name: string
  details: string
  is_active?: boolean
  display_order?: number
}

export interface MarkPaidData {
  payment_method_id: number
  reference_number: string
  paid_date?: string
}

export interface TaskCreateData {
  client: number
  title: string
  description?: string
  status?: string
  priority?: string
  category?: string
  due_date?: string | null
  order?: number
}

export interface TaskUpdateData {
  title?: string
  description?: string
  status?: string
  priority?: string
  category?: string
  due_date?: string | null
  completed_date?: string | null
  order?: number
}

export interface Notification {
  id: number
  client: number
  client_name?: string
  notification_type: 'profile_change' | 'business_change' | 'offer' | 'payment' | 'task' | 'report'
  target_audience: 'client' | 'admin'
  title: string
  message: string
  changed_fields?: string[]
  old_values?: Record<string, string>
  new_values?: Record<string, string>
  changed_by?: number
  changed_by_name?: string
  is_read: boolean
  is_acknowledged: boolean
  acknowledged_at?: string | null
  offer_details?: Record<string, unknown>
  offer_expires_at?: string | null
  offer_accepted?: boolean | null
  offer_responded_at?: string | null
  created_at: string
  updated_at: string
}
