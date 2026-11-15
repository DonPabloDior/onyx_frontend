import React from 'react'
import { AppProviders } from './app/providers/app-providers'
import { AppRouter } from './app/providers/router-provider'

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
