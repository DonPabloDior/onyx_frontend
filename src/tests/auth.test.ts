import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setAccessToken, getAccessToken } from '@/shared/api/client'

describe('Access token management', () => {
  beforeEach(() => {
    setAccessToken(null)
  })

  it('stores and retrieves the access token', () => {
    setAccessToken('test-token-123')
    expect(getAccessToken()).toBe('test-token-123')
  })

  it('clears the token when set to null', () => {
    setAccessToken('some-token')
    setAccessToken(null)
    expect(getAccessToken()).toBeNull()
  })
})

describe('Auth store', () => {
  it('formats initials correctly', async () => {
    const { getInitials } = await import('@/shared/lib/format')
    expect(getInitials('John Smith')).toBe('JS')
    expect(getInitials('Leonard Kim')).toBe('LK')
    expect(getInitials('Anna')).toBe('A')
  })

  it('formats currency correctly', async () => {
    const { formatCurrency } = await import('@/shared/lib/format')
    expect(formatCurrency('1234.56', 'USD')).toBe('$1,234.56')
    expect(formatCurrency(0, 'USD')).toBe('$0.00')
  })

  it('formats percent correctly', async () => {
    const { formatPercent } = await import('@/shared/lib/format')
    expect(formatPercent(8.3)).toBe('8.3%')
    expect(formatPercent(-5.0)).toBe('5.0%')
  })

  it('formats date correctly', async () => {
    const { formatDate } = await import('@/shared/lib/format')
    expect(formatDate('2026-11-01T10:00:00Z')).toBe('Nov 1, 2026')
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
  })
})
