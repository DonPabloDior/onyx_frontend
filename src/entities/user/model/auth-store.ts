import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserOut, WorkspaceOut } from '@/shared/types/api'
import { setAccessToken } from '@/shared/api/client'

interface AuthState {
  user: UserOut | null
  accessToken: string | null
  currentWorkspace: WorkspaceOut | null
  isAuthenticated: boolean

  // Actions
  setAuth: (user: UserOut, token: string) => void
  setUser: (user: UserOut) => void
  setCurrentWorkspace: (workspace: WorkspaceOut) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      currentWorkspace: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        setAccessToken(token)
        set({ user, accessToken: token, isAuthenticated: true })
      },

      setUser: (user) => set({ user }),

      setCurrentWorkspace: (workspace) => {
        localStorage.setItem('onyx_workspace_id', workspace.id)
        set({ currentWorkspace: workspace })
      },

      logout: () => {
        setAccessToken(null)
        localStorage.removeItem('onyx_workspace_id')
        set({ user: null, accessToken: null, currentWorkspace: null, isAuthenticated: false })
      },
    }),
    {
      name: 'onyx-auth',
      // Only persist the token and workspace, not the user (fetch fresh on reload)
      partialize: (state) => ({
        accessToken: state.accessToken,
        currentWorkspace: state.currentWorkspace,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore access token to Axios on page reload
        if (state?.accessToken) {
          setAccessToken(state.accessToken)
        }
      },
    }
  )
)
