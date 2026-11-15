import React from 'react'
import styled, { css } from 'styled-components'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  hint?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  fullWidth?: boolean
}

const Wrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`

const Label = styled.label`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.secondary};
`

const InputWrap = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  background: ${({ theme }) => theme.surface.s1};
  border-radius: ${({ theme }) => theme.radius.pill};
  box-shadow: ${({ theme }) => theme.shadow.well};
  border: 1px solid transparent;
  transition:
    border-color ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease};

  &:focus-within {
    border-color: ${({ theme }) => theme.accent.blue};
    box-shadow: ${({ theme }) => theme.shadow.well}, 0 0 0 3px rgba(79, 141, 240, 0.15);
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: ${({ theme }) => theme.accent.red} !important;
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      background: ${({ theme }) => theme.surface.s0};
    `}
`

const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  font-family: ${({ theme }) => theme.font.sans};
  min-width: 0;

  &::placeholder {
    color: ${({ theme }) => theme.text.ghost};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const AdornmentWrapper = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 13px;
  flex-shrink: 0;
`

const HintText = styled.span<{ $isError: boolean }>`
  font-size: 12px;
  color: ${({ $isError, theme }) => ($isError ? theme.accent.red : theme.text.tertiary)};
`

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, prefix, suffix, fullWidth = false, disabled, id, ...props },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <Wrapper $fullWidth={fullWidth}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <InputWrap $hasError={!!error} $disabled={!!disabled}>
          {prefix && <AdornmentWrapper>{prefix}</AdornmentWrapper>}
          <StyledInput
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error || hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {suffix && <AdornmentWrapper>{suffix}</AdornmentWrapper>}
        </InputWrap>
        {(error || hint) && (
          <HintText $isError={!!error} id={`${inputId}-hint`} role={error ? 'alert' : undefined}>
            {error ?? hint}
          </HintText>
        )}
      </Wrapper>
    )
  }
)

Input.displayName = 'Input'
