import { apiClient } from '@/shared/api/client'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type {
  SingleResponse,
  RevenueAnalytics,
  SpendingAnalytics,
  PaymentAnalytics,
  AnalyticsSummary,
  TrendAnalytics,
  AnalyticsFilters,
  DashboardOverview,
  DashboardCalendar,
  DashboardFilters,
  TransactionOut,
} from '@/shared/types/api'

export const analyticsApi = {
  // Dashboard
  getOverview: async (filters: DashboardFilters = {}) => {
    const res = await apiClient.get<SingleResponse<DashboardOverview>>(
      ENDPOINTS.dashboard.overview,
      { params: filters }
    )
    return res.data.data
  },

  getRecentActivity: async (limit = 10) => {
    const res = await apiClient.get<SingleResponse<TransactionOut[]>>(
      ENDPOINTS.dashboard.recentActivity,
      { params: { limit } }
    )
    return res.data.data
  },

  getCalendar: async (filters: DashboardFilters = {}) => {
    const res = await apiClient.get<SingleResponse<DashboardCalendar>>(
      ENDPOINTS.dashboard.calendar,
      { params: filters }
    )
    return res.data.data
  },

  // Analytics
  getRevenue: async (filters: AnalyticsFilters = {}) => {
    const res = await apiClient.get<SingleResponse<RevenueAnalytics>>(
      ENDPOINTS.analytics.revenue,
      { params: filters }
    )
    return res.data.data
  },

  getSpending: async (filters: AnalyticsFilters = {}) => {
    const res = await apiClient.get<SingleResponse<SpendingAnalytics>>(
      ENDPOINTS.analytics.spending,
      { params: filters }
    )
    return res.data.data
  },

  getPayments: async (currency?: string) => {
    const res = await apiClient.get<SingleResponse<PaymentAnalytics>>(
      ENDPOINTS.analytics.payments,
      { params: currency ? { currency } : {} }
    )
    return res.data.data
  },

  getSummary: async (currency?: string) => {
    const res = await apiClient.get<SingleResponse<AnalyticsSummary>>(
      ENDPOINTS.analytics.summary,
      { params: currency ? { currency } : {} }
    )
    return res.data.data
  },

  getTrends: async (filters: AnalyticsFilters = {}) => {
    const res = await apiClient.get<SingleResponse<TrendAnalytics>>(
      ENDPOINTS.analytics.trends,
      { params: filters }
    )
    return res.data.data
  },
}
