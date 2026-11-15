import React, { useState } from 'react'
import styled from 'styled-components'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, Legend,
} from 'recharts'
import {
  useRevenueAnalytics,
  useSpendingAnalytics,
  usePaymentAnalytics,
  useAnalyticsSummary,
  useTrendAnalytics,
} from '@/entities/analytics'
import { useUIStore } from '@/entities/user'
import { Card, CardHeader, CardTitle, Tile } from '@/shared/ui/card'
import { SegmentedControl } from '@/shared/ui/segmented-control'
import { Skeleton } from '@/shared/ui/skeleton'
import { Delta } from '@/shared/ui/badge'
import { SpendingBreakdown } from '@/widgets/spending-breakdown'
import { formatCurrency, formatPercent } from '@/shared/lib/format'
import { CustomBar } from '@/shared/ui/chart/CustomBar'
import type { AnalyticsPeriod } from '@/shared/types/api'

const Grid = styled.div`
  display: grid;
  gap: 20px;
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;

  > :nth-child(n + 4) {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
`

const ChartRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`

const SumTile = styled(Tile)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const SumLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`

const SumValue = styled.div`
  font-size: 22px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`

const TooltipBox = styled.div`
  background: ${({ theme }) => theme.surface.s2};
  border: 1px solid ${({ theme }) => theme.stroke.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px 14px;
  box-shadow: ${({ theme }) => theme.shadow.pop};
  font-size: 13px;

  animation: tooltipFadeIn 150ms ease-out;

  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`

const StatusTile = styled(Tile)`
  text-align: center;
`

const StatusVal = styled.div`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  font-variant-numeric: tabular-nums;
`

const StatusLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 2px;
  text-transform: capitalize;
`

const ProgressRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
`

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`

const Bar2 = styled.div<{ $pct: number; $color: string }>`
  height: 6px;
  background: ${({ theme }) => theme.surface.s2};
  border-radius: ${({ theme }) => theme.radius.pill};
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $pct }) => Math.min($pct, 100)}%;
    background: ${({ $color }) => $color};
    border-radius: inherit;
    transition: width 0.6s cubic-bezier(.2,.8,.2,1);
  }
`

function ChartTooltip({ active, payload, label, currency }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string; currency: string }) {
  if (!active || !payload?.length) return null
  return (
    <TooltipBox>
      <div style={{ color: 'var(--text-tertiary)', marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span>{p.name}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{formatCurrency(p.value, currency)}</span>
        </div>
      ))}
    </TooltipBox>
  )
}

export default function AnalyticsPage() {
  const { currency } = useUIStore()
  const [period, setPeriod] = useState<AnalyticsPeriod>('monthly')

  const { data: revenue, isLoading: revLoading } = useRevenueAnalytics({ period, currency })
  const { data: spending } = useSpendingAnalytics({ period, currency })
  const { data: payments } = usePaymentAnalytics(currency)
  const { data: summary } = useAnalyticsSummary(currency)
  const { data: trends } = useTrendAnalytics({ period, currency })

  const periodOptions = [
    { value: 'weekly' as const, label: 'Weekly' },
    { value: 'monthly' as const, label: 'Monthly' },
    { value: 'yearly' as const, label: 'Yearly' },
  ]

  const trendChartData = trends
    ? trends.revenue.map((r, i) => ({
        label: r.label,
        Revenue: parseFloat(r.value),
        Expenses: parseFloat(trends.expenses[i]?.value ?? '0'),
      }))
    : []

  const revenueChartData = revenue?.series.map((s) => ({
    label: s.label,
    Revenue: parseFloat(s.value),
  })) ?? []

  return (
    <Grid>
      {/* Summary tiles */}
      <SummaryGrid>
        {summary ? (
          <>
            <SumTile>
              <SumLabel>Total Revenue</SumLabel>
              <SumValue>{formatCurrency(summary.total_revenue, currency, true)}</SumValue>
            </SumTile>
            <SumTile>
              <SumLabel>Total Expenses</SumLabel>
              <SumValue>{formatCurrency(summary.total_expenses, currency, true)}</SumValue>
            </SumTile>
            <SumTile>
              <SumLabel>Net Cash Flow</SumLabel>
              <SumValue>{formatCurrency(summary.net_cash_flow, currency, true)}</SumValue>
            </SumTile>
            <SumTile>
              <SumLabel>Transactions</SumLabel>
              <SumValue>{summary.total_transactions}</SumValue>
            </SumTile>
            <SumTile>
              <SumLabel>Total Invoices</SumLabel>
              <SumValue>{summary.total_invoices}</SumValue>
            </SumTile>
            <SumTile>
              <SumLabel>Paid Invoices</SumLabel>
              <SumValue>{summary.paid_invoices}</SumValue>
            </SumTile>
          </>
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="80px" borderRadius="18px" />
          ))
        )}
      </SummaryGrid>

      {/* Revenue bar chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Revenue</CardTitle>
            {revenue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatCurrency(revenue.total, currency)}
                </span>
                <Delta value={revenue.change_percent} />
              </div>
            )}
          </div>
          <SegmentedControl options={periodOptions} value={period} onChange={setPeriod} />
        </CardHeader>
        {revLoading ? (
          <Skeleton height="220px" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#727272', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatCurrency(v, currency, true)}
                tick={{ fill: '#727272', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={64}
              />
              <Tooltip
                content={<ChartTooltip currency={currency} />}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                isAnimationActive={false}
              />
              <Bar
                dataKey="Revenue"
                fill="#4f8df0"
                radius={[10, 10, 10, 10]}
                maxBarSize={44}
                shape={<CustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Trends + Spending */}
      <ChartRow>
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#727272', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatCurrency(v, currency, true)}
                tick={{ fill: '#727272', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={64}
              />
              <Tooltip
                content={<ChartTooltip currency={currency} />}
                cursor={{ stroke: 'rgba(255,255,255,0.08)' }}
                isAnimationActive={false}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-tertiary)' }} />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#4f8df0"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Expenses"
                stroke="#ff8a3d"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <SpendingBreakdown data={spending} currency={currency} />
      </ChartRow>

      {/* Payment stats */}
      {payments && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Statistics</CardTitle>
          </CardHeader>
          <StatusGrid>
            {Object.entries(payments.by_status).map(([status, count]) => (
              <StatusTile key={status}>
                <StatusVal>{count}</StatusVal>
                <StatusLabel>{status}</StatusLabel>
              </StatusTile>
            ))}
          </StatusGrid>
          <ProgressRow>
            <ProgressLabel>
              <span>Collection rate</span>
              <span>{formatPercent(payments.collection_rate)}</span>
            </ProgressLabel>
            <Bar2 $pct={payments.collection_rate} $color="var(--green)" />
          </ProgressRow>
          <ProgressRow>
            <ProgressLabel>
              <span>Overdue rate</span>
              <span>{formatPercent(payments.overdue_rate)}</span>
            </ProgressLabel>
            <Bar2 $pct={payments.overdue_rate} $color="var(--orange)" />
          </ProgressRow>
        </Card>
      )}
    </Grid>
  )
}
