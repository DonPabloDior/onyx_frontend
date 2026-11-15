// Centralized TanStack Query key factory

import type { TransactionFilters, InvoiceFilters, CustomerFilters, DashboardFilters, AnalyticsFilters } from '../types/api'

export const queryKeys = {
  // Auth
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  // Workspaces
  workspaces: {
    all: () => ['workspaces'] as const,
    members: () => ['workspaces', 'members'] as const,
  },

  // Dashboard
  dashboard: {
    overview: (filters: DashboardFilters) => ['dashboard', 'overview', filters] as const,
    recentActivity: (limit?: number) => ['dashboard', 'recent-activity', limit] as const,
    calendar: (filters: DashboardFilters) => ['dashboard', 'calendar', filters] as const,
  },

  // Analytics
  analytics: {
    revenue: (filters: AnalyticsFilters) => ['analytics', 'revenue', filters] as const,
    spending: (filters: AnalyticsFilters) => ['analytics', 'spending', filters] as const,
    payments: (currency?: string) => ['analytics', 'payments', currency] as const,
    summary: (currency?: string) => ['analytics', 'summary', currency] as const,
    trends: (filters: AnalyticsFilters) => ['analytics', 'trends', filters] as const,
  },

  // Transactions
  transactions: {
    all: (filters: TransactionFilters) => ['transactions', filters] as const,
    byId: (id: string) => ['transactions', id] as const,
    categories: () => ['transactions', 'categories'] as const,
  },

  // Invoices
  invoices: {
    all: (filters: InvoiceFilters) => ['invoices', filters] as const,
    byId: (id: string) => ['invoices', id] as const,
  },

  // Customers
  customers: {
    all: (filters: CustomerFilters) => ['customers', filters] as const,
    byId: (id: string) => ['customers', id] as const,
  },
} as const
