import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardTitle } from '@/shared/ui/card'
import { formatCurrency, formatPercent } from '@/shared/lib/format'
import type { SpendingAnalytics } from '@/shared/types/api'

// ─── Design-system chart palette ────────────────────────────────────────────
const CHART_COLORS = ['#ff8a3d', '#3fd18a', '#ffd02b', '#4f8df0', '#b196ff', '#3a3a3a']

// ─── Geometry — derived from design-system.html inspector values ─────────────
//
//  viewBox="0 0 240 240"   cx=120  cy=120  r=95
//  stroke-width=26
//  GAP_PX=28  (gap between segment strokes, in circumference units)
//  HALF_GAP=14 (offset before the first segment)
//
//  Formula (verified against all 5 inspector values):
//    arcLen_i  = (value_i / total) * CIRC
//    dashLen_i = arcLen_i - GAP_PX           ← visible stroke length
//    offset_i  = -(cumulativeArc + HALF_GAP) ← where cumulativeArc = sum of arcLen_j for j < i
//
//  Result: segments start at 3-o'clock and sweep clockwise; a ~64° gap opens at the bottom.

const SVG_SIZE = 240
const CX       = 120
const CY       = 120
const R        = 95
const SW       = 26          // stroke-width
const GAP_PX   = 28
const HALF_GAP = GAP_PX / 2
const CIRC     = 2 * Math.PI * R   // ≈ 596.9 px

// ─── Types ───────────────────────────────────────────────────────────────────

interface Segment {
  name:       string
  color:      string
  percentage: number
  amount:     string
  dashLen:    number
  dashOffset: number
  // Mid-arc angle in radians from SVG's natural start (3-o'clock)
  midAngle:   number
}

// ─── Segment builder ─────────────────────────────────────────────────────────

function buildSegments(
  data: { name: string; value: number; color: string; percentage: number; amount: string }[]
): Segment[] {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return []

  const segs: Segment[] = []
  let cumulativeArc = 0

  data.forEach((d) => {
    const arcLen  = (d.value / total) * CIRC
    const dashLen = arcLen - GAP_PX

    if (dashLen < 1) { cumulativeArc += arcLen; return }  // skip invisible slivers

    const dashOffset = -(cumulativeArc + HALF_GAP)

    // Mid-arc position for tooltip anchor
    // Position along the circle (from 3-o'clock, clockwise) = cumulativeArc + HALF_GAP + dashLen/2
    const midPos   = cumulativeArc + HALF_GAP + dashLen / 2
    const midAngle = (midPos / CIRC) * 2 * Math.PI   // radians from 3-o'clock

    segs.push({ ...d, dashLen, dashOffset, midAngle })
    cumulativeArc += arcLen
  })

  return segs
}

// Tooltip anchor: outer edge of stroke at mid-arc angle
function tipPoint(seg: Segment): { x: number; y: number } {
  const rOuter = R + SW / 2 + 6
  return {
    x: CX + rOuter * Math.cos(seg.midAngle),
    y: CY + rOuter * Math.sin(seg.midAngle),
  }
}

// ─── Styled ──────────────────────────────────────────────────────────────────

const ChartWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const DonutOuter = styled.div`
  position: relative;
  width: ${SVG_SIZE}px;
  height: ${SVG_SIZE}px;
  margin: 0 auto;
`

const DonutSvg = styled.svg`
  overflow: visible;
  display: block;
`

const CenterOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const CenterAmount = styled.div<{ $hover: boolean }>`
  font-size: ${({ $hover }) => ($hover ? '28px' : '24px')};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.025em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  transition: font-size 120ms ease;
`

const CenterLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 5px;
`

// ── Tooltip chip ──────────────────────────────────────────────────────────────

interface TipState {
  x: number
  y: number
  seg: Segment
}

const TooltipChip = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  transform: translate(-50%, calc(-100% - 10px));
  background: ${({ theme }) => theme.surface.s3};
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 7px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: ${({ theme }) => theme.shadow.pop};
  z-index: 20;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    pointer-events: none;
    background: linear-gradient(
      150deg,
      rgba(255,255,255,0.18),
      rgba(255,255,255,0.04) 38%,
      rgba(255,255,255,0.03) 62%,
      rgba(255,255,255,0.09)
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`

const TipDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

const TipText = styled.span`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  font-variant-numeric: tabular-nums;
`

// ── Legend ────────────────────────────────────────────────────────────────────

const LegendList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const LegendItem = styled.li<{ $dim: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: default;
  transition: opacity 180ms cubic-bezier(.2,.8,.2,1);
  opacity: ${({ $dim }) => ($dim ? 0.3 : 1)};
`

const LegendDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

const LegendName = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  flex: 1;
`

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.ghost};
`

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  data?: SpendingAnalytics
  currency: string
}

export function SpendingBreakdown({ data, currency }: Props) {
  const [tip, setTip]           = useState<TipState | null>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const categories = data?.categories ?? []
  const chartData  = categories.map((c, i) => ({
    name:       c.name,
    value:      parseFloat(c.amount),
    color:      CHART_COLORS[i % CHART_COLORS.length],
    percentage: c.percentage,
    amount:     c.amount,
  }))

  const segments = buildSegments(chartData)

  function onEnter(e: React.MouseEvent<SVGCircleElement>, seg: Segment, idx: number) {
    const outer     = e.currentTarget.closest('[data-donut]') as HTMLElement
    const svgEl     = e.currentTarget.closest('svg') as SVGSVGElement
    const outerRect = outer.getBoundingClientRect()
    const svgRect   = svgEl.getBoundingClientRect()

    const pt        = tipPoint(seg)
    const scaleX    = svgRect.width  / SVG_SIZE
    const scaleY    = svgRect.height / SVG_SIZE

    setTip({
      x: pt.x * scaleX + (svgRect.left - outerRect.left),
      y: pt.y * scaleY + (svgRect.top  - outerRect.top),
      seg,
    })
    setHoverIdx(idx)
  }

  function onLeave() {
    setTip(null)
    setHoverIdx(null)
  }

  return (
    <Card style={{minHeight: '550px'}}>
      <CardHeader>
        <CardTitle>Spending</CardTitle>
      </CardHeader>

      {chartData.length === 0 ? (
        <EmptyState>No spending data</EmptyState>
      ) : (
        <ChartWrap>
          <DonutOuter data-donut="">
            <DonutSvg
              width={SVG_SIZE}
              height={SVG_SIZE}
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
              aria-hidden="true"
            >
              {/* Segments */}
              <g id="arcs">
                {segments.map((seg, i) => {
                  const isHovered = hoverIdx === i
                  const isAnyHovered = hoverIdx !== null

                  return (
                    <circle
                      key={seg.name}
                      className="arc"
                      cx={CX}
                      cy={CY}
                      r={R}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={SW}
                      strokeLinecap="round"
                      strokeDasharray={`${seg.dashLen} ${CIRC}`}
                      strokeDashoffset={seg.dashOffset}
                      style={{
                        cursor: 'pointer',
                        opacity: isAnyHovered && !isHovered ? 0.18 : 1,
                        strokeWidth: isHovered ? 28 : 22,
                        transition:
                          'opacity 180ms cubic-bezier(.2,.8,.2,1), filter 180ms cubic-bezier(.2,.8,.2,1)',
                        filter: isHovered ? `drop-shadow(0 0 10px ${seg.color}cc)` : 'none',
                      }}
                      onMouseEnter={(e) => onEnter(e, seg, i)}
                      onMouseLeave={onLeave}
                    />
                  )
                })}
              </g>
            </DonutSvg>

            <CenterOverlay>
              <CenterAmount $hover={hoverIdx !== null}>
                {tip
                  ? formatCurrency(tip.seg.amount, currency, true)
                  : formatCurrency(data?.total ?? '0', currency, true)}
              </CenterAmount>
              <CenterLabel>{tip ? formatPercent(tip.seg.percentage) : 'Total'}</CenterLabel>
            </CenterOverlay>

            {tip && (
              <TooltipChip $x={tip.x} $y={tip.y}>
                <TipDot $color={tip.seg.color} />
                <TipText>
                  {formatCurrency(tip.seg.amount, currency)}&nbsp;(
                  {formatPercent(tip.seg.percentage)})
                </TipText>
              </TooltipChip>
            )}
          </DonutOuter>

          <LegendList>
            {chartData.map((c, i) => (
              <LegendItem
                key={c.name}
                $dim={hoverIdx !== null && hoverIdx !== i}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <LegendDot $color={c.color} />
                <LegendName>{c.name}</LegendName>
              </LegendItem>
            ))}
          </LegendList>
        </ChartWrap>
      )}
    </Card>
  )
}
