// ─── API Response Wrappers ─────────────────────────────────────────────────

export interface SingleResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export interface Pagination {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface ApiError {
  error: {
    code: string
    message: string
    details: unknown | null
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface UserOut {
  id: string
  email: string
  full_name: string
  is_active?: boolean
  created_at?: string
}

export interface AuthResponse {
  user: UserOut
  access_token: string
  token_type: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface UpdateUserRequest {
  full_name?: string
  email?: string
}

// ─── Workspaces ───────────────────────────────────────────────────────────

export interface WorkspaceOut {
  id: string
  name: string
  default_currency: string
  timezone: string
  created_at: string
}

export interface CreateWorkspaceRequest {
  name: string
  default_currency: string
  timezone: string
}

export type WorkspaceMemberRole = 'owner' | 'admin' | 'analyst' | 'viewer'

export interface MemberOut {
  id: string
  user_id: string
  role: WorkspaceMemberRole
  created_at: string
}

export interface AddMemberRequest {
  email?: string
  user_id?: string
  role: WorkspaceMemberRole
}

// ─── Transactions ─────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense' | 'transfer'
export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type TransactionSource = 'manual' | 'import'

export interface CategoryOut {
  id: string
  name: string
  slug: string
  type: 'income' | 'expense' | 'transfer'
}

export interface TransactionOut {
  id: string
  type: TransactionType
  description: string
  amount: string
  currency: string
  category: CategoryOut | null
  status: TransactionStatus
  occurred_at: string
  source: TransactionSource
}

export interface CreateTransactionRequest {
  type: TransactionType
  description: string
  amount: string
  currency: string
  category_id?: string
  customer_id?: string
  invoice_id?: string
  status?: TransactionStatus
  occurred_at?: string
}

export interface UpdateTransactionRequest {
  type?: TransactionType
  description?: string
  amount?: string
  currency?: string
  category_id?: string
  status?: TransactionStatus
  occurred_at?: string
}

export interface CreateCategoryRequest {
  name: string
  type: 'income' | 'expense' | 'transfer'
}

export interface ImportResult {
  imported: number
  skipped: number
  errors: string[]
}

export interface TransactionFilters {
  search?: string
  from?: string
  to?: string
  status?: TransactionStatus
  type?: TransactionType
  category_id?: string
  currency?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  page_size?: number
}

// ─── Invoices ─────────────────────────────────────────────────────────────

export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled'

export interface InvoiceItemOut {
  id: string
  description: string
  quantity: string
  unit_price: string
  total: string
}

export interface InvoiceOut {
  id: string
  invoice_number: string
  customer_id: string
  status: InvoiceStatus
  currency: string
  subtotal: string
  tax_amount: string
  total_amount: string
  issued_at: string | null
  due_date: string
  paid_at: string | null
  items: InvoiceItemOut[]
}

export interface InvoiceItemRequest {
  description: string
  quantity: string
  unit_price: string
}

export interface CreateInvoiceRequest {
  customer_id: string
  due_date: string
  currency: string
  items: InvoiceItemRequest[]
}

export interface UpdateInvoiceRequest {
  customer_id?: string
  due_date?: string
  currency?: string
  items?: InvoiceItemRequest[]
}

export interface InvoiceFilters {
  status?: InvoiceStatus
  customer_id?: string
  from?: string
  to?: string
  page?: number
  page_size?: number
}

// ─── Customers ────────────────────────────────────────────────────────────

export interface CustomerOut {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  created_at: string
}

export interface CustomerDetailOut extends CustomerOut {
  total_invoiced: string
  total_paid: string
  outstanding_balance: string
}

export interface CreateCustomerRequest {
  name: string
  email?: string
  phone?: string
  company?: string
}

export interface UpdateCustomerRequest {
  name?: string
  email?: string
  phone?: string
  company?: string
}

export interface CustomerFilters {
  search?: string
  page?: number
  page_size?: number
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export interface DashboardPeriod {
  from: string
  to: string
  currency?: string
}

export interface DashboardOverview {
  period: DashboardPeriod
  revenue: {
    total: string
    previous_total: string
    change_percent: number
  }
  expenses: {
    total: string
    previous_total: string
    change_percent: number
  }
  payments: {
    processed: number
    pending: number
    overdue: number
  }
  payment_score: number
  collection_rate: number
  overdue_rate: number
  net_cash_flow: string
}

export interface CalendarDay {
  date: string
  income: string
  expense: string
  transaction_count: number
}

export interface DashboardCalendar {
  period: DashboardPeriod
  days: CalendarDay[]
}

export interface DashboardFilters {
  from?: string
  to?: string
  currency?: string
}

// ─── Analytics ────────────────────────────────────────────────────────────

export type AnalyticsPeriod = 'weekly' | 'monthly' | 'yearly' | 'range'

export interface SeriesPoint {
  label: string
  value: string
}

export interface RevenueAnalytics {
  total: string
  previous_total: string
  change_percent: number
  currency: string
  series: SeriesPoint[]
}

export interface SpendingCategory {
  id: string
  name: string
  amount: string
  percentage: number
}

export interface SpendingAnalytics {
  total: string
  currency: string
  categories: SpendingCategory[]
}

export interface PaymentsByStatus {
  paid: number
  sent: number
  pending: number
  draft: number
  overdue: number
  cancelled: number
}

export interface PaymentAnalytics {
  total_invoiced: string
  total_paid: string
  total_overdue: string
  collection_rate: number
  overdue_rate: number
  by_status: PaymentsByStatus
}

export interface AnalyticsSummary {
  total_revenue: string
  total_expenses: string
  net_cash_flow: string
  total_transactions: number
  total_invoices: number
  paid_invoices: number
}

export interface TrendAnalytics {
  revenue: SeriesPoint[]
  expenses: SeriesPoint[]
}

export interface AnalyticsFilters {
  period?: AnalyticsPeriod
  currency?: string
}
