import React from 'react'
import styled, { css } from 'styled-components'
import type { InvoiceStatus, TransactionStatus, TransactionType } from '@/shared/types/api'

export type BadgeVariant =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'yellow'
  | 'purple'
  | 'neutral'

export type BadgeStyle = 'solid' | 'soft'

interface BadgeProps {
  variant?: BadgeVariant
  style?: BadgeStyle
  children: React.ReactNode
  dot?: boolean
}

const variantMap: Record<BadgeVariant, { c: string; dim: string; line: string }> = {
  success: { c: '#3fd18a', dim: 'rgba(63,209,138,0.12)', line: 'rgba(63,209,138,0.3)' },
  info: { c: '#4f8df0', dim: 'rgba(79,141,240,0.12)', line: 'rgba(79,141,240,0.3)' },
  warning: { c: '#ff8a3d', dim: 'rgba(255,138,61,0.12)', line: 'rgba(255,138,61,0.3)' },
  error: { c: '#ff6b6b', dim: 'rgba(255,107,107,0.12)', line: 'rgba(255,107,107,0.3)' },
  yellow: { c: '#ffd02b', dim: 'rgba(255,208,43,0.12)', line: 'rgba(255,208,43,0.3)' },
  purple: { c: '#b196ff', dim: 'rgba(177,150,255,0.12)', line: 'rgba(177,150,255,0.3)' },
  neutral: { c: '#a6a6a6', dim: 'rgba(166,166,166,0.10)', line: 'rgba(166,166,166,0.2)' },
}

const StyledBadge = styled.span<{ $variant: BadgeVariant; $badgeStyle: BadgeStyle }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  white-space: nowrap;

  ${({ $variant, $badgeStyle }) => {
    const v = variantMap[$variant]
    if ($badgeStyle === 'solid') {
      return css`
        background: ${v.c};
        color: #07130d;
        border: 1px solid transparent;
      `
    }
    return css`
      background: ${v.dim};
      color: ${v.c};
      border: 1px solid ${v.line};
    `
  }}
`

const Dot = styled.span<{ $variant: BadgeVariant }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $variant }) => variantMap[$variant].c};
  flex-shrink: 0;
`

export function Badge({ variant = 'neutral', style: badgeStyle = 'soft', children, dot }: BadgeProps) {
  return (
    <StyledBadge $variant={variant} $badgeStyle={badgeStyle}>
      {dot && <Dot $variant={variant} />}
      {children}
    </StyledBadge>
  )
}

// ─── Status-specific helpers ───────────────────────────────────────────────

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { variant: BadgeVariant; label: string }> = {
    draft: { variant: 'neutral', label: 'Draft' },
    sent: { variant: 'info', label: 'Sent' },
    pending: { variant: 'yellow', label: 'Pending' },
    paid: { variant: 'success', label: 'Paid' },
    overdue: { variant: 'error', label: 'Overdue' },
    cancelled: { variant: 'neutral', label: 'Cancelled' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  const map: Record<TransactionStatus, { variant: BadgeVariant; label: string }> = {
    completed: { variant: 'success', label: 'Completed' },
    pending: { variant: 'yellow', label: 'Pending' },
    failed: { variant: 'error', label: 'Failed' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  const map: Record<TransactionType, { variant: BadgeVariant; label: string }> = {
    income: { variant: 'success', label: 'Income' },
    expense: { variant: 'error', label: 'Expense' },
    transfer: { variant: 'info', label: 'Transfer' },
  }
  const { variant, label } = map[type]
  return <Badge variant={variant}>{label}</Badge>
}

// ─── Delta badge ──────────────────────────────────────────────────────────

interface DeltaProps {
  value: number
  showSign?: boolean
}

const DeltaWrap = styled.span<{ $positive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  height: 24px;
  padding-inline: 9px;
  background-color: ${({ $positive, theme }) => ($positive ? theme.accent.green : theme.accent.red)};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: #07130d;
  border-radius: 8px;
  font-variant-numeric: tabular-nums;
`

export function Delta({ value, showSign = true }: DeltaProps) {
  const positive = value >= 0
  const arrow = positive ? '▲' : '▼'
  const formatted = `${Math.abs(value).toFixed(1)}%`
  return (
    <DeltaWrap $positive={positive}>
      {arrow} {showSign ? formatted : formatted}
    </DeltaWrap>
  )
}
