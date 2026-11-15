// Onyx Design System — Design Tokens
// Source of truth: design-system.html

export const tokens = {
  // ─── Surfaces ─────────────────────────────────────────────────────────────
  surface: {
    bg: '#070707',
    s0: '#0d0d0d',
    s1: '#141414',
    s2: '#1c1c1c',
    s3: '#262626',
    s4: '#303030',
  },

  // ─── Text ─────────────────────────────────────────────────────────────────
  text: {
    primary: '#ffffff',
    secondary: '#a6a6a6',
    tertiary: '#727272',
    ghost: '#4d4d4d',
    ink: '#07130d',
  },

  // ─── Strokes ──────────────────────────────────────────────────────────────
  stroke: {
    subtle: 'rgba(255,255,255,0.06)',
    default: 'rgba(255,255,255,0.10)',
    strong: 'rgba(255,255,255,0.18)',
  },

  // ─── Accents ──────────────────────────────────────────────────────────────
  accent: {
    blue: '#4f8df0',
    blueBright: '#6fa6ff',
    green: '#3fd18a',
    orange: '#ff8a3d',
    yellow: '#ffd02b',
    purple: '#b196ff',
    red: '#ff6b6b',
  },

  // ─── Status variants ──────────────────────────────────────────────────────
  status: {
    success: { c: '#3fd18a', dim: 'rgba(63,209,138,0.12)', line: 'rgba(63,209,138,0.3)' },
    info: { c: '#4f8df0', dim: 'rgba(79,141,240,0.12)', line: 'rgba(79,141,240,0.3)' },
    warning: { c: '#ff8a3d', dim: 'rgba(255,138,61,0.12)', line: 'rgba(255,138,61,0.3)' },
    error: { c: '#ff6b6b', dim: 'rgba(255,107,107,0.12)', line: 'rgba(255,107,107,0.3)' },
    yellow: { c: '#ffd02b', dim: 'rgba(255,208,43,0.12)', line: 'rgba(255,208,43,0.3)' },
    purple: { c: '#b196ff', dim: 'rgba(177,150,255,0.12)', line: 'rgba(177,150,255,0.3)' },
    neutral: { c: '#a6a6a6', dim: 'rgba(166,166,166,0.10)', line: 'rgba(166,166,166,0.2)' },
  },

  // ─── Gradients ────────────────────────────────────────────────────────────
  gradient: {
    blue: 'linear-gradient(135deg, #4f8df0 0%, #2563d4 100%)',
    card: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 100%)',
    tile: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    ctl: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
    hatch: `repeating-linear-gradient(
      -45deg,
      rgba(255,255,255,0.04) 0px,
      rgba(255,255,255,0.04) 1px,
      transparent 1px,
      transparent 6px
    )`,
  },

  // ─── Shadows ──────────────────────────────────────────────────────────────
  shadow: {
    pop: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
    card: '0 1px 0 rgba(255,255,255,0.06) inset',
    well: 'inset 0 1px 3px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)',
    glow: '0 0 0 3px rgba(79,141,240,0.3)',
  },

  // ─── Spacing (4px grid) ───────────────────────────────────────────────────
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  // ─── Radius ───────────────────────────────────────────────────────────────
  radius: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '24px',
    '2xl': '32px',
    pill: '999px',
  },

  // ─── Typography ───────────────────────────────────────────────────────────
  font: {
    sans: "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
    mono: "'Geist Mono', 'JetBrains Mono', monospace",
  },

  fontSize: {
    display: '48px',
    title: '32px',
    heading: '24px',
    subheading: '18px',
    body: '15px',
    small: '14px',
    caption: '13px',
    micro: '12px',
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
  },

  lineHeight: {
    display: '1.05',
    title: '1.15',
    heading: '1.25',
    subheading: '1.35',
    body: '1.55',
    small: '1.5',
    caption: '1.4',
    micro: '1.3',
  },

  letterSpacing: {
    display: '-0.025em',
    title: '-0.015em',
    heading: '-0.01em',
    tight: '-0.01em',
    normal: '0em',
  },

  // ─── Motion ───────────────────────────────────────────────────────────────
  motion: {
    fast: '120ms',
    base: '200ms',
    slow: '340ms',
    chart: '600ms',
    ease: 'cubic-bezier(.2,.8,.2,1)',
  },

  // ─── Chart categories ─────────────────────────────────────────────────────
  chart: {
    c1: '#4f8df0',
    c2: '#3fd18a',
    c3: '#ff8a3d',
    c4: '#ffd02b',
    c5: '#b196ff',
    other: '#3a3a3a',
  },
} as const

export type Tokens = typeof tokens
