import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

// ─── Create Axios instance ─────────────────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send HttpOnly refresh_token cookie
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Token management ─────────────────────────────────────────────────────
let accessToken: string | null = null
let refreshPromise: Promise<string | null> | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

// ─── Request interceptor — attach bearer token ────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  // Attach workspace header if stored
  const workspaceId = localStorage.getItem('onyx_workspace_id')
  if (workspaceId) {
    config.headers['X-Workspace-Id'] = workspaceId
  }

  return config
})

// ─── Response interceptor — handle 401 / token refresh ───────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Prevent multiple concurrent refreshes
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newToken = await refreshPromise

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

// ─── Token refresh logic ───────────────────────────────────────────────────
async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post<{ data: { access_token: string } }>(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
    const newToken = response.data.data.access_token
    setAccessToken(newToken)
    return newToken
  } catch {
    // Refresh failed — clear auth state
    setAccessToken(null)
    localStorage.removeItem('onyx_workspace_id')

    // Redirect to login (avoid circular import by using window.location)
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login'
    }

    return null
  }
}
