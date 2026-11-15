import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/entities/user'
import { useCurrentUser } from '@/features/authentication'
import { setAccessToken, getAccessToken } from '@/shared/api/client'

// Track whether we've restored the session token on first load
let sessionRestored = false

export function ProtectedRoute() {
  const { isAuthenticated, accessToken } = useAuthStore()

  // Restore persisted token into Axios on hard reload
  useEffect(() => {
    if (sessionRestored) return
    sessionRestored = true
    if (accessToken && !getAccessToken()) {
      setAccessToken(accessToken)
    }
  }, [accessToken])

  // Keep the user object fresh
  useCurrentUser()

  if (!isAuthenticated && !accessToken) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
