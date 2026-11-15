import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  currency: string

  // Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setCurrency: (currency: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      currency: 'USD',

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'onyx-ui',
    }
  )
)
