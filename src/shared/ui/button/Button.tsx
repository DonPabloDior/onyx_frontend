import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Loader2 } from 'lucide-react'
import { edgeBorder } from '@/app/styles/mixins'

// ─── Types ────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'blue' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
  children?: React.ReactNode
}

// ─── Animations ───────────────────────────────────────────────────────────

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

// ─── Size styles ──────────────────────────────────────────────────────────

const sizeStyles = {
  sm: css`
    height: 32px;
    padding: 0 12px;
    font-size: 13px;
    gap: 6px;
  `,
  md: css`
    height: 40px;
    padding: 0 16px;
    font-size: 14px;
    gap: 8px;
  `,
  lg: css`
    height: 48px;
    padding: 0 20px;
    font-size: 15px;
    gap: 8px;
  `,
}

// ─── Variant styles ───────────────────────────────────────────────────────

const variantStyles = {
  primary: css`
    background: #ffffff;
    color: #07130d;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover:not(:disabled) {
      background: #f0f0f0;
    }

    &:active:not(:disabled) {
      transform: scale(0.97);
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.surface.s2};
    color: ${({ theme }) => theme.text.primary};
    ${edgeBorder}

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.surface.s3};
    }

    &:active:not(:disabled) {
      transform: scale(0.97);
    }
  `,
  blue: css`
    background: ${({ theme }) => theme.gradient.blue};
    color: #ffffff;
    ${edgeBorder}

    &::before {
      background: linear-gradient(
        150deg,
        rgba(255, 255, 255, 0.28),
        rgba(255, 255, 255, 0.06) 38%,
        rgba(255, 255, 255, 0.04) 62%,
        rgba(79, 141, 240, 0.4)
      );
    }

    &:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    &:active:not(:disabled) {
      transform: scale(0.97);
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.text.secondary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.surface.s1};
      color: ${({ theme }) => theme.text.primary};
    }

    &:active:not(:disabled) {
      transform: scale(0.97);
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.status.error.dim};
    color: ${({ theme }) => theme.accent.red};
    ${edgeBorder}

    &::before {
      background: linear-gradient(
        150deg,
        rgba(255, 107, 107, 0.4),
        rgba(255, 107, 107, 0.08) 38%,
        rgba(255, 107, 107, 0.06) 62%,
        rgba(255, 107, 107, 0.2)
      );
    }

    &:hover:not(:disabled) {
      background: rgba(255, 107, 107, 0.2);
    }

    &:active:not(:disabled) {
      transform: scale(0.97);
    }
  `,
}

// ─── Styled component ─────────────────────────────────────────────────────

const StyledButton = styled.button<{
  $variant: ButtonVariant
  $size: ButtonSize
  $loading: boolean
  $fullWidth: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    border-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    filter ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};
  white-space: nowrap;
  user-select: none;
  position: relative;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent.blue};
    outline-offset: 3px;
  }

  ${({ $loading }) =>
    $loading &&
    css`
      cursor: wait;
      pointer-events: none;
    `}
`

const SpinningIcon = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`

// ─── Component ────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16

    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $loading={loading}
        $fullWidth={fullWidth}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <SpinningIcon size={iconSize} />
        ) : (
          icon &&
          React.isValidElement(icon) &&
          React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: iconSize })
        )}
        {children}
        {!loading &&
          iconRight &&
          React.isValidElement(iconRight) &&
          React.cloneElement(iconRight as React.ReactElement<{ size?: number }>, {
            size: iconSize,
          })}
      </StyledButton>
    )
  }
)

Button.displayName = 'Button'
