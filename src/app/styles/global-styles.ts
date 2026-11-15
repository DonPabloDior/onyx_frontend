import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  /* ── Geist font import ─────────────────────────────────────────────────── */
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap');

  /* ── CSS custom properties from tokens ─────────────────────────────────── */
  :root {
    /* Surfaces */
    --bg: #070707;
    --s0: #0d0d0d;
    --s1: #141414;
    --s2: #1c1c1c;
    --s3: #262626;
    --s4: #303030;

    /* Text */
    --text-primary: #ffffff;
    --text-secondary: #a6a6a6;
    --text-tertiary: #727272;
    --text-ghost: #4d4d4d;
    --ink: #07130d;

    /* Strokes */
    --stroke-subtle: rgba(255,255,255,0.06);
    --stroke: rgba(255,255,255,0.10);
    --stroke-strong: rgba(255,255,255,0.18);

    /* Accents */
    --blue: #4f8df0;
    --blue-bright: #6fa6ff;
    --green: #3fd18a;
    --orange: #ff8a3d;
    --yellow: #ffd02b;
    --purple: #b196ff;
    --red: #ff6b6b;

    /* Gradients */
    --grad-blue: linear-gradient(135deg, #4f8df0 0%, #2563d4 100%);
    --grad-card: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 100%);
    --grad-tile: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
    --grad-ctl: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
    --hatch: repeating-linear-gradient(
      -45deg,
      rgba(255,255,255,0.04) 0px,
      rgba(255,255,255,0.04) 1px,
      transparent 1px,
      transparent 6px
    );

    /* Shadows */
    --shadow-pop: 0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4);
    --shadow-card: 0 1px 0 rgba(255,255,255,0.06) inset;
    --shadow-well: inset 0 1px 3px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06);
    --shadow-glow: 0 0 0 3px rgba(79,141,240,0.3);

    /* Spacing */
    --s-1: 4px;
    --s-2: 8px;
    --s-3: 12px;
    --s-4: 16px;
    --s-5: 20px;
    --s-6: 24px;
    --s-8: 32px;
    --s-10: 40px;
    --s-12: 48px;
    --s-16: 64px;

    /* Radius */
    --r-xs: 6px;
    --r-sm: 10px;
    --r-md: 14px;
    --r-lg: 18px;
    --r-xl: 24px;
    --r-2xl: 32px;
    --r-pill: 999px;

    /* Typography */
    --font-sans: 'Geist', 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;

    /* Motion */
    --fast: 120ms;
    --base: 200ms;
    --slow: 340ms;
    --ease: cubic-bezier(.2,.8,.2,1);

    /* Chart colors */
    --chart-1: #4f8df0;
    --chart-2: #3fd18a;
    --chart-3: #ff8a3d;
    --chart-4: #ffd02b;
    --chart-5: #b196ff;
    --chart-other: #3a3a3a;
  }

  /* ── Reset ──────────────────────────────────────────────────────────────── */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    background-color: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: var(--s-4);
    line-height: 1.55;
    min-height: 100vh;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── Typography defaults ─────────────────────────────────────────────────── */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
  }

  a {
    color: var(--blue);
    text-decoration: none;
    transition: color var(--fast) var(--ease);

    &:hover {
      color: var(--blue-bright);
    }
  }

  button {
    font-family: var(--font-sans);
    cursor: pointer;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: var(--font-sans);
  }

  /* ── Scrollbar ───────────────────────────────────────────────────────────── */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--s3);
    border-radius: var(--r-pill);

    &:hover {
      background: var(--s4);
    }
  }

  /* ── Focus ───────────────────────────────────────────────────────────────── */
  :focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
    border-radius: var(--r-xs);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ── Tabular numerals utility ───────────────────────────────────────────── */
  .tabular {
    font-variant-numeric: tabular-nums;
  }

  /* ── Selection ───────────────────────────────────────────────────────────── */
  ::selection {
    background: rgba(79, 141, 240, 0.3);
    color: var(--text-primary);
  }
`
