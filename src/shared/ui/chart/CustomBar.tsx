/**
 * CustomBar — Recharts bar shape that mirrors the Onyx `.bar` component
 * (design-system.html → "Data visualization") value for value.
 *
 * Inactive  .bar
 *   background  var(--hatch), #0f0f0f
 *               repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 1.5px, transparent 1.5px 6px)
 *   box-shadow  inset 0 0 0 1px rgba(255,255,255,.08)
 *   ::before    cap: top 9px, centred, 46% wide, 3px tall, pill, #c9c9c9
 *
 * Active    .bar-col.on .bar
 *   background  var(--grad-blue)  linear-gradient(180deg, #7db0ff, #4f8df0)
 *   box-shadow  var(--glow-blue)  0 8px 22px -8px rgba(79,141,240,.75)
 *               (replaces the inset ring, so the active bar has no ring)
 *   ::before    hidden
 *
 * Corner radius is --r-md (14px), clamped like CSS border-radius is.
 */

import React, { useId } from 'react'
import { useUIStore } from '@/entities/user'
import styled from 'styled-components'

interface CustomBarProps {
  x?: number
  y?: number
  width?: number
  height?: number
  /** True for the highlighted bar. Wire it with <Bar activeBar={<CustomBar active />} />. */
  active?: boolean
  value?: number
}

// ── Onyx tokens used by .bar ────────────────────────────────────────────────
const RADIUS = 14 // --r-md
const SURFACE = '#0f0f0f'

const RING_ALPHA = 0.08 // inset 0 0 0 1px rgba(255,255,255,.08)

const HATCH_ALPHA = 0.05 // --hatch: rgba(255,255,255,.05) 0 1.5px, transparent 1.5px 6px
const HATCH_LINE = 1.5
const HATCH_PERIOD = 6
// 135deg in CSS points down-right, so one period is 6px along the (1,1)/√2 diagonal.
const HATCH_STEP = HATCH_PERIOD * Math.SQRT1_2

const CAP_COLOR = '#c9c9c9' // .bar::before
const CAP_TOP = 9
const CAP_HEIGHT = 3
const CAP_WIDTH_RATIO = 0.46

const GRAD_TOP = '#7db0ff' // --grad-blue
const GRAD_BOTTOM = '#4f8df0'

const GLOW_COLOR = '#4f8df0' // --glow-blue: 0 8px 22px -8px rgba(79,141,240,.75)
const GLOW_ALPHA = 0.75
const GLOW_OFFSET_Y = 8
const GLOW_BLUR = 22
const GLOW_SPREAD = -8

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: rgba(18, 60, 140, 0.5);
  border-radius: 14px 14px 18px 18px;
  height: 34px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
`

const Amount = styled.div`
  position: absolute;
  bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 34px;
`

export function CustomBar({ x = 0, y = 0, width = 0, height = 0, active = false, value }: CustomBarProps) {
  // Unique per bar instance, so several charts on one page never share defs.
  const uid = useId().replace(/:/g, '')

  if (width <= 0 || height <= 0) return null

  // CSS clamps border-radius so it never exceeds half of either side.
  const r = Math.min(RADIUS, width / 2, height / 2)

  if (active) {
    const gradId = `onyx-grad-${uid}`
    const glowId = `onyx-glow-${uid}`

    // CSS box-shadow: shrink the box by the spread, shift it down, blur it (σ = blur / 2).
    const shrink = -GLOW_SPREAD
    const gx = x + shrink
    const gy = y + shrink + GLOW_OFFSET_Y
    const gw = width - shrink * 2
    const gh = height - shrink * 2
    const sigma = GLOW_BLUR / 2
    const pad = sigma * 3
    const hasGlow = gw > 0 && gh > 0

    return (
      <>
        <g>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={GRAD_TOP} />
              <stop offset="1" stopColor={GRAD_BOTTOM} />
            </linearGradient>
            {hasGlow && (
              <filter
                id={glowId}
                filterUnits="userSpaceOnUse"
                x={gx - pad}
                y={gy - pad}
                width={gw + pad * 2}
                height={gh + pad * 2}
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur stdDeviation={sigma} />
              </filter>
            )}
          </defs>
          {hasGlow && (
            <rect
              x={gx}
              y={gy}
              width={gw}
              height={gh}
              rx={Math.max(r - shrink, 0)}
              fill={GLOW_COLOR}
              fillOpacity={GLOW_ALPHA}
              filter={`url(#${glowId})`}
            />
          )}
          <rect x={x} y={y} width={width} height={height} rx={r} fill={`url(#${gradId})`} />
          <foreignObject
            width={width}
            height={height}
            x={gx - 8}
            y={gy - 16}
            rx={Math.max(r - shrink, 0)}
          >
            <Badge>{value}</Badge>
          </foreignObject>
          <foreignObject
            width={width}
            height={height}
            style={{ position: 'relative' }}
            x={gx - 8}
            y={gy - 16}
            rx={Math.max(r - shrink, 0)}
          >
          </foreignObject>
        </g>
      </>
    )
  }

  const hatchId = `onyx-hatch-${uid}`

  // Ring is `inset 0 0 0 1px`, so it sits inside the edge: inset the stroke path by half its width.
  const ringW = Math.max(width - 1, 0)
  const ringH = Math.max(height - 1, 0)

  const capW = width * CAP_WIDTH_RATIO
  // Skip the cap on bars too short to contain it.
  const showCap = height >= CAP_TOP + CAP_HEIGHT

  return (
    <g>
      <defs>
        {/* Same as the CSS repeating-linear-gradient, anchored to this bar's top-left corner. */}
        <linearGradient
          id={hatchId}
          gradientUnits="userSpaceOnUse"
          x1={x}
          y1={y}
          x2={x + HATCH_STEP}
          y2={y + HATCH_STEP}
          spreadMethod="repeat"
        >
          <stop offset="0" stopColor="#fff" stopOpacity={HATCH_ALPHA} />
          <stop offset={HATCH_LINE / HATCH_PERIOD} stopColor="#fff" stopOpacity={HATCH_ALPHA} />
          <stop offset={HATCH_LINE / HATCH_PERIOD} stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* background: var(--hatch), #0f0f0f */}
      <rect x={x} y={y} width={width} height={height} rx={r} fill={SURFACE} />
      <rect x={x} y={y} width={width} height={height} rx={r} fill={`url(#${hatchId})`} />

      {/* box-shadow: inset 0 0 0 1px rgba(255,255,255,.08) */}
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={ringW}
        height={ringH}
        rx={Math.max(r - 0.5, 0)}
        fill="none"
        stroke="#fff"
        strokeOpacity={RING_ALPHA}
        strokeWidth={1}
      />

      {/* .bar::before */}
      {showCap && (
        <rect
          x={x + (width - capW) / 2}
          y={y + CAP_TOP}
          width={capW}
          height={CAP_HEIGHT}
          rx={CAP_HEIGHT / 2}
          fill={CAP_COLOR}
        />
      )}
    </g>
  )
}
