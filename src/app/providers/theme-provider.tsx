import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme'
import { GlobalStyles } from '../styles/global-styles'

interface OnyxThemeProviderProps {
  children: React.ReactNode
}

export function OnyxThemeProvider({ children }: OnyxThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}
