import React from 'react'
import styled, { css } from 'styled-components'

type IconButtonVariant = 'default' | 'bare'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  label: string
  badge?: boolean
  children: React.ReactNode
}

const sizeMap = {
  sm: '28px',
  md: '36px',
  lg: '40px',
}

const StyledIconButton = styled.button<{
  $variant: IconButtonVariant
  $size: IconButtonSize
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.pill};
  cursor: pointer;
  position: relative;
  transition:
    background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};

  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};

  ${({ $variant }) =>
    $variant === 'default' &&
    css`
      background: ${({ theme }) => theme.surface.s2};
      border: 1px solid ${({ theme }) => theme.stroke.default};
      color: ${({ theme }) => theme.text.secondary};

      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.surface.s3};
        color: ${({ theme }) => theme.text.primary};
      }
    `}

  ${({ $variant }) =>
    $variant === 'bare' &&
    css`
      background: transparent;
      border: 1px solid transparent;
      color: ${({ theme }) => theme.text.tertiary};

      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.surface.s1};
        color: ${({ theme }) => theme.text.secondary};
      }
    `}

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent.blue};
    outline-offset: 2px;
  }
`

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accent.red};
  border: 1.5px solid ${({ theme }) => theme.surface.s0};
`

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'default', size = 'md', label, badge = false, children, ...props }, ref) => {
    return (
      <StyledIconButton
        ref={ref}
        $variant={variant}
        $size={size}
        aria-label={label}
        {...props}
      >
        {children}
        {badge && <Badge aria-hidden="true" />}
      </StyledIconButton>
    )
  }
)

IconButton.displayName = 'IconButton'
