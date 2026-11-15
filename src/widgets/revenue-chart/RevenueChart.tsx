/**
 * RevenueChart — mirrors the Onyx "Revenue bar chart" section of design-system.html.
 *
 * Metric header   .metric / .metric .big / .sub-l
 *   row           align-items center, gap 14px, wraps; 20px below the row
 *   .big          500 48px/1, letter-spacing -0.025em (38px ≤640px), tabular-nums
 *   .sub-l        14.5px, --text-2 ("vs … last period")
 * Chart           .chart — 44px y-axis column + 10px gap, 300px tall (260px ≤640px),
 *                 8px above the bars area
 *   axes          no tick/axis lines; tick labels 14px --text-2 (11px ≤640px);
 *                 y labels are plain grouped numbers ("6,000"), no symbol;
 *                 12px between the bars and the x labels (.bar-col gap)
 *   bars          .bar is painted by CustomBar; column max-width 96px, 10px gaps (.bars)
 *   selection     the design preselects a bar (.bar-col.on); wired via Tooltip
 *                 defaultIndex so the blue bar shows before the first hover
 * Tooltip         .chip-tip — 7px color dot + "value (label)", 7px 11px padding,
 *                 radius 12px, #181818, --shadow-pop, 13px, no border
 */

import styled from 'styled-components'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts'
import { Skeleton } from '@/shared/ui/skeleton'
import { Delta } from '@/shared/ui/badge'
import { formatCurrency } from '@/shared/lib/format'
import { CustomBar } from '@/shared/ui/chart/CustomBar'
import type { SeriesPoint, TrendAnalytics } from '@/shared/types/api'

interface RevenueChartProps {
  data: SeriesPoint[]
  trends?: TrendAnalytics
  loading?: boolean
  currency: string
  total: string
  changePercent: number
  previousTotal: string
}

const Wrap = styled.div`
  @media (max-width: 640px) {
    /* .bar-col label: 14px → 11px on small screens (CSS wins over the tick attribute) */
    .recharts-cartesian-axis-tick-value {
      font-size: 11px;
    }
  }
`

/* .metric — big value, delta badge and comparison, centred with 14px gaps */
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
`

/* .metric .big — 500 48px/1, -0.025em */
const BigValue = styled.span`
  font-size: 48px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums;
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 38px;
  }
`

/* .metric .sub-l — 14.5px, --text-2 */
const CompareText = styled.span`
  font-size: 14.5px;
  color: ${({ theme }) => theme.text.secondary};
`

/* .chart — the 44px y-axis column is YAxis width, the 10px gap is margin.left */
const ChartBox = styled.div`
  height: 300px;
  margin-top: 8px;

  @media (max-width: 640px) {
    height: 260px;
  }
`

/* .chip-tip — dot + value, 7px 11px, radius 12px, #181818, pop shadow */
const CustomTooltipWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #181818;
  border-radius: 12px;
  padding: 7px 11px;
  box-shadow: ${({ theme }) => theme.shadow.pop};
  white-space: nowrap;
`

/* .chip-tip i — 7px dot in the series color (--blue / --chart-1) */
const TooltipDot = styled.i`
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4f8df0;
`

const TooltipValue = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.primary};
  font-variant-numeric: tabular-nums;
`

function CustomTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
  currency: string
}) {
  if (!active || !payload?.length) return null
  // .chip-tip format is "value (percent)" → here "value (label)"
  return (
    <CustomTooltipWrap>
      <TooltipDot />
      <TooltipValue>
        {formatCurrency(payload[0].value, currency)} ({label})
      </TooltipValue>
    </CustomTooltipWrap>
  )
}

export function RevenueChart({
  data,
  trends,
  loading,
  currency,
  total,
  changePercent,
  previousTotal,
}: RevenueChartProps) {
  if (loading) {
    return (
      <Wrap>
        {/* .big is 48px tall; 28px = .metric 20px offset + .chart 8px offset */}
        <Skeleton height="48px" width="200px" style={{ marginBottom: 28 }} />
        <Skeleton height="300px" />
      </Wrap>
    )
  }

  // If we have trend data, show composed revenue vs expenses chart
  const chartData = trends
    ? trends.revenue.map((r, i) => ({
        label: r.label,
        revenue: parseFloat(r.value),
        expenses: parseFloat(trends.expenses[i]?.value ?? '0'),
      }))
    : data.map((d) => ({ label: d.label, revenue: parseFloat(d.value) }))

  return (
    <Wrap>
      <MetaRow>
        <BigValue>{formatCurrency(total, currency)}</BigValue>
        <Delta value={changePercent} />
        <CompareText>vs {formatCurrency(previousTotal, currency)} last period</CompareText>
      </MetaRow>

      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: '#a6a6a6', fontSize: 14 }} // --text-2 (.bar-col label)
              tickMargin={12} // .bar-col gap between the bar and its label
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => Math.round(v).toLocaleString('en-US')} // .y-axis: plain grouped numbers, no symbol
              tick={{ fill: '#a6a6a6', fontSize: 14 }} // --text-2 (.y-axis)
              tickLine={false}
              axisLine={false}
              width={44} // .chart y-axis column
              allowDecimals={false}
            />
            {/*<Tooltip*/}
            {/*  content={<CustomTooltip currency={currency} />}*/}
            {/*  cursor={false} // the design has no hover band*/}
            {/*  defaultIndex={Math.min(2, chartData.length - 1)} // .bar-col.on — preselected bar*/}
            {/*/>*/}
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#4f8df0" // --blue, fallback only — CustomBar paints the real fills
              maxBarSize={96} // .bar-col max-width
              minPointSize={90}
              barCategoryGap={10} // .bars gap
              shape={<CustomBar />}
              activeBar={<CustomBar active />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartBox>
    </Wrap>
  )
}
