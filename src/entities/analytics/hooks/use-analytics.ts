import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../api/analytics-api'
import { queryKeys } from '@/shared/lib/query-keys'
import type { DashboardFilters, AnalyticsFilters } from '@/shared/types/api'

export function useDashboardOverview(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(filters),
    queryFn: () => analyticsApi.getOverview(filters),
  })
}

export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivity(limit),
    queryFn: () => analyticsApi.getRecentActivity(limit),
  })
}

export function useDashboardCalendar(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.calendar(filters),
    queryFn: () => analyticsApi.getCalendar(filters),
  })
}

export function useRevenueAnalytics(filters: AnalyticsFilters = {}) {
  return useQuery({
    queryKey: queryKeys.analytics.revenue(filters),
    queryFn: () => analyticsApi.getRevenue(filters),
  })
}

export function useSpendingAnalytics(filters: AnalyticsFilters = {}) {
  return useQuery({
    queryKey: queryKeys.analytics.spending(filters),
    queryFn: () => analyticsApi.getSpending(filters),
  })
}

export function usePaymentAnalytics(currency?: string) {
  return useQuery({
    queryKey: queryKeys.analytics.payments(currency),
    queryFn: () => analyticsApi.getPayments(currency),
  })
}

export function useAnalyticsSummary(currency?: string) {
  return useQuery({
    queryKey: queryKeys.analytics.summary(currency),
    queryFn: () => analyticsApi.getSummary(currency),
  })
}

export function useTrendAnalytics(filters: AnalyticsFilters = {}) {
  return useQuery({
    queryKey: queryKeys.analytics.trends(filters),
    queryFn: () => analyticsApi.getTrends(filters),
  })
}
