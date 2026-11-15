import { css } from 'styled-components'

/**
 * edge — gradient border via ::before mask-composite technique.
 *
 * Renders a 1px border whose colour is a 150° linear gradient that mimics a
 * light source hitting the top-left corner.  Uses the CSS mask + xor trick so
 * the fill of the pseudo-element is invisible and only the 1px "padding" ring
 * shows through.
 *
 * Requirements on the host element:
 *   - position: relative  (or absolute/fixed/sticky)
 *   - border-radius set (the pseudo inherits it)
 *   - no flat `border` needed — set it to none / 0
 *
 * Usage:
 *   const MyCard = styled.div`
 *     ${edgeBorder}
 *   `
 */
export const edgeBorder = css`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    pointer-events: none;
    background: linear-gradient(
      150deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.04) 38%,
      rgba(255, 255, 255, 0.03) 62%,
      rgba(255, 255, 255, 0.09)
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`
