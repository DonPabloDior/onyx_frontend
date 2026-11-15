import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Lazy page imports
const LoginPage = lazy(() => import('@/pages/login/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/register/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/forgot-password/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/reset-password/ResetPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const TransactionsPage = lazy(() => import('@/pages/transactions/TransactionsPage'))
const TransactionDetailPage = lazy(
  () => import('@/pages/transaction-details/TransactionDetailPage')
)
const InvoicesPage = lazy(() => import('@/pages/invoices/InvoicesPage'))
const InvoiceDetailPage = lazy(() => import('@/pages/invoice-details/InvoiceDetailPage'))
const CustomersPage = lazy(() => import('@/pages/customers/CustomersPage'))
const CustomerDetailPage = lazy(() => import('@/pages/customer-details/CustomerDetailPage'))
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage'))

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#a6a6a6', fontSize: 14 }}>
    Loading…
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: '/register', element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
      { path: '/forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense> },
      { path: '/reset-password', element: <Suspense fallback={<PageLoader />}><ResetPasswordPage /></Suspense> },
    ],
  },
  // Protected app routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
          { path: '/transactions', element: <Suspense fallback={<PageLoader />}><TransactionsPage /></Suspense> },
          { path: '/transactions/:id', element: <Suspense fallback={<PageLoader />}><TransactionDetailPage /></Suspense> },
          { path: '/invoices', element: <Suspense fallback={<PageLoader />}><InvoicesPage /></Suspense> },
          { path: '/invoices/:id', element: <Suspense fallback={<PageLoader />}><InvoiceDetailPage /></Suspense> },
          { path: '/customers', element: <Suspense fallback={<PageLoader />}><CustomersPage /></Suspense> },
          { path: '/customers/:id', element: <Suspense fallback={<PageLoader />}><CustomerDetailPage /></Suspense> },
          { path: '/analytics', element: <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense> },
          { path: '/settings', element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
        ],
      },
    ],
  },
  { path: '*', element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense> },
])
