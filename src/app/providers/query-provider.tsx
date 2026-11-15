import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 min
      gcTime: 1000 * 60 * 10, // 10 min
      retry: (failureCount, error: unknown) => {
        // Don't retry on 401/403/404
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status === 401 || status === 403 || status === 404) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
