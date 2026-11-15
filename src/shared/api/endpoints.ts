// Centralized API endpoint definitions

export const ENDPOINTS = {
  // Auth
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // Users
  users: {
    me: '/users/me',
  },

  // Workspaces
  workspaces: {
    list: '/workspaces',
    create: '/workspaces',
    currentMembers: '/workspaces/current/members',
    addMember: '/workspaces/current/members',
  },

  // Dashboard
  dashboard: {
    overview: '/dashboard/overview',
    recentActivity: '/dashboard/recent-activity',
    calendar: '/dashboard/calendar',
  },

  // Analytics
  analytics: {
    revenue: '/analytics/revenue',
    spending: '/analytics/spending',
    payments: '/analytics/payments',
    summary: '/analytics/summary',
    trends: '/analytics/trends',
  },

  // Transactions
  transactions: {
    list: '/transactions',
    create: '/transactions',
    byId: (id: string) => `/transactions/${id}`,
    import: '/transactions/import',
    categoriesAll: '/transactions/categories/all',
    createCategory: '/transactions/categories',
  },

  // Invoices
  invoices: {
    list: '/invoices',
    create: '/invoices',
    byId: (id: string) => `/invoices/${id}`,
    send: (id: string) => `/invoices/${id}/send`,
    remind: (id: string) => `/invoices/${id}/remind`,
    cancel: (id: string) => `/invoices/${id}/cancel`,
    pdf: (id: string) => `/invoices/${id}/pdf`,
  },

  // Customers
  customers: {
    list: '/customers',
    create: '/customers',
    byId: (id: string) => `/customers/${id}`,
  },
} as const
