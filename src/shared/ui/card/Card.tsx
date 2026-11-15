import React from 'react'
import styled from 'styled-components'
import { edgeBorder } from '@/app/styles/mixins'

// ─── Card ─────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode
  padding?: string
  className?: string
  style?: React.CSSProperties
}

export const Card = styled.div<{ $padding?: string }>`
  background: linear-gradient(180deg, #121212 0%, #080808 100%);
  background-image: ${({ theme }) => theme.gradient.card};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ $padding }) => $padding ?? '24px'};
  ${edgeBorder}
`

export function CardComponent({ children, padding, className, style }: CardProps) {
  return (
    <Card $padding={padding} className={className} style={style}>
      {children}
    </Card>
  )
}

// ─── Card Header ──────────────────────────────────────────────────────────

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

export const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.01em;
`

// ─── Tile ─────────────────────────────────────────────────────────────────

export const Tile = styled.div`
  background: linear-gradient(180deg, #121212 0%, #080808 100%);
  background-image: ${({ theme }) => theme.gradient.tile};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  ${edgeBorder}
`

// ─── Metric tile ──────────────────────────────────────────────────────────

interface MetricTileProps {
  label: string
  value: React.ReactNode
  delta?: React.ReactNode
  comparison?: string
  icon?: React.ReactNode
  className?: string
}

const MetricTileWrap = styled(Tile)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MetricLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
`

const MetricValue = styled.span`
  font-size: 28px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
`

const MetricRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`

const MetricComparison = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
`

export function MetricTile({ label, value, delta, comparison, icon, className }: MetricTileProps) {
  return (
    <MetricTileWrap className={className}>
      <MetricLabel>{label}</MetricLabel>
      <MetricValue>{value}</MetricValue>
      {(delta || comparison) && (
        <MetricRow>
          {delta}
          {comparison && <MetricComparison>{comparison}</MetricComparison>}
        </MetricRow>
      )}
      {icon}
    </MetricTileWrap>
  )
}
