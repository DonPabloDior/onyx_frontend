import { tokens } from './tokens'

export const theme = {
  ...tokens,
} as const

export type Theme = typeof theme

// Extend styled-components DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
