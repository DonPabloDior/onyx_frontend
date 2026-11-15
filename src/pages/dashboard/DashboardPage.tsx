import React, { useState } from 'react'
import styled from 'styled-components'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import {
  useDashboardOverview,
  useRecentActivity,
  useRevenueAnalytics,
  useSpendingAnalytics,
  useTrendAnalytics,
} from '@/entities/analytics'
import { useUIStore } from '@/entities/user'
import { Card, CardHeader, CardTitle, MetricTile } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { Delta } from '@/shared/ui/badge'
import { SegmentedControl } from '@/shared/ui/segmented-control'
import { RevenueChart } from '@/widgets/revenue-chart'
import { SpendingBreakdown } from '@/widgets/spending-breakdown'
import { RecentActivity } from '@/widgets/recent-activity'
import { formatCurrency, formatPercent } from '@/shared/lib/format'
import type { AnalyticsPeriod } from '@/shared/types/api'

const Grid = styled.div`
  display: grid;
  gap: 20px;
`

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

const ChartRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

const ScoreMeter = styled.div<{ $score: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 0 0;
`

const ScoreValue = styled.div<{ $score: number }>`
  font-size: 32px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-variant-numeric: tabular-nums;
  color: ${({ $score, theme }) =>
    $score >= 80 ? theme.accent.green : $score >= 50 ? theme.accent.yellow : theme.accent.orange};
`

const ScoreLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`

const ProgressBar = styled.div<{ $pct: number; $color: string }>`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.surface.s2};
  border-radius: ${({ theme }) => theme.radius.pill};
  overflow: hidden;
  margin-top: 4px;

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

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};

  &:last-child { border-bottom: none; }
`

const StatLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`

const StatValue = styled.span`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  font-variant-numeric: tabular-nums;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
`

export default function DashboardPage() {
  const { currency } = useUIStore()
  const [period, setPeriod] = useState<AnalyticsPeriod>('monthly')

  const now = new Date()
  const from = format(startOfMonth(now), 'yyyy-MM-dd')
  const to = format(endOfMonth(now), 'yyyy-MM-dd')

  const { data: overview, isLoading: overviewLoading } = useDashboardOverview({ from, to, currency })
  const { data: revenue, isLoading: revenueLoading } = useRevenueAnalytics({ period, currency })
  const { data: spending } = useSpendingAnalytics({ period, currency })
  const { data: trends } = useTrendAnalytics({ period, currency })
  const { data: recentActivity } = useRecentActivity(8)

  const periodOptions = [
    { value: 'weekly' as const, label: 'Weekly' },
    { value: 'monthly' as const, label: 'Monthly' },
    { value: 'yearly' as const, label: 'Yearly' },
  ]

  return (
    <Grid>
      {/* KPI tiles */}
      <KpiGrid>
        {overviewLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="100px" borderRadius="18px" />
          ))
        ) : overview ? (
          <>
            <MetricTile
              label="Total Revenue"
              value={formatCurrency(overview.revenue.total, currency)}
              delta={<Delta value={overview.revenue.change_percent} />}
              comparison={`vs ${formatCurrency(overview.revenue.previous_total, currency)}`}
            />
            <MetricTile
              label="Total Expenses"
              value={formatCurrency(overview.expenses.total, currency)}
              delta={<Delta value={-overview.expenses.change_percent} />}
              comparison={`vs ${formatCurrency(overview.expenses.previous_total, currency)}`}
            />
            <MetricTile
              label="Net Cash Flow"
              value={formatCurrency(overview.net_cash_flow, currency)}
            />
            <MetricTile
              label="Processed"
              value={overview.payments.processed}
            />
            <MetricTile
              label="Pending"
              value={overview.payments.pending}
            />
            <MetricTile
              label="Overdue"
              value={overview.payments.overdue}
            />
          </>
        ) : null}
      </KpiGrid>

      {/* Charts row */}
      <ChartRow>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <SegmentedControl options={periodOptions} value={period} onChange={setPeriod} />
          </CardHeader>
          <RevenueChart
            data={revenue?.series ?? []}
            trends={trends}
            loading={revenueLoading}
            currency={currency}
            total={revenue?.total ?? '0'}
            changePercent={revenue?.change_percent ?? 0}
            previousTotal={revenue?.previous_total ?? '0'}
          />
        </Card>

        <SpendingBreakdown data={spending} currency={currency} />
      </ChartRow>

      {/* Bottom row */}
      <BottomGrid>
        <RecentActivity transactions={recentActivity} currency={currency} />

        {/* Payment stats card */}
        {overview && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Stats</CardTitle>
            </CardHeader>

            <ScoreMeter $score={overview.payment_score}>
              <ScoreValue $score={overview.payment_score}>{overview.payment_score}</ScoreValue>
              <ScoreLabel>Payment Score</ScoreLabel>
            </ScoreMeter>

            <div style={{ marginTop: 20 }}>
              <StatRow>
                <StatLabel>Collection rate</StatLabel>
                <StatValue>{formatPercent(overview.collection_rate)}</StatValue>
              </StatRow>
              <div style={{ padding: '0 0 12px' }}>
                <ProgressBar $pct={overview.collection_rate} $color="var(--green)" />
              </div>

              <StatRow>
                <StatLabel>Overdue rate</StatLabel>
                <StatValue>{formatPercent(overview.overdue_rate)}</StatValue>
              </StatRow>
              <div style={{ padding: '0 0 12px' }}>
                <ProgressBar $pct={overview.overdue_rate} $color="var(--orange)" />
              </div>

              <StatRow>
                <StatLabel>Processed invoices</StatLabel>
                <StatValue>{overview.payments.processed}</StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Pending</StatLabel>
                <StatValue>{overview.payments.pending}</StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Overdue</StatLabel>
                <StatValue>{overview.payments.overdue}</StatValue>
              </StatRow>
            </div>
          </Card>
        )}
      </BottomGrid>
    </Grid>
  )
}
