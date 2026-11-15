import React from 'react'
import { OnyxThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'
import { Toaster } from 'sonner'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <OnyxThemeProvider>
      <QueryProvider>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#1c1c1c',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#ffffff',
              borderRadius: '14px',
              fontSize: '14px',
            },
          }}
        />
      </QueryProvider>
    </OnyxThemeProvider>
  )
}
