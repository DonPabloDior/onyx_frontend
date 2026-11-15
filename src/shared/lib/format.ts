import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

// ─── Currency formatting ───────────────────────────────────────────────────

export function formatCurrency(
  value: string | number,
  currency = 'USD',
  compact = false
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '$0.00'

  if (compact && Math.abs(num) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatAmount(value: string | number, currency = 'USD'): string {
  return formatCurrency(value, currency)
}

// ─── Percentage formatting ────────────────────────────────────────────────

export function formatPercent(value: number, decimals = 1): string {
  return `${Math.abs(value).toFixed(decimals)}%`
}

export function formatPercentWithSign(value: number, decimals = 1): string {
  const sign = value >= 0 ? '+' : '-'
  return `${sign}${Math.abs(value).toFixed(decimals)}%`
}

// ─── Number formatting ────────────────────────────────────────────────────

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

// ─── Date formatting ──────────────────────────────────────────────────────

export function formatDate(dateStr: string | null | undefined, fmt = 'MMM d, yyyy'): string {
  if (!dateStr) return '—'
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return '—'
    return format(date, fmt)
  } catch {
    return '—'
  }
}

export function formatDateShort(dateStr: string | null | undefined): string {
  return formatDate(dateStr, 'MMM d')
}

export function formatDateTime(dateStr: string | null | undefined): string {
  return formatDate(dateStr, 'MMM d, yyyy HH:mm')
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return '—'
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return '—'
  }
}

export function formatDueDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return '—'
    const dist = formatDistanceToNow(date)
    const isPast = date < new Date()
    return isPast ? `${dist} ago` : `in ${dist}`
  } catch {
    return '—'
  }
}

// ─── Initials from name ───────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
