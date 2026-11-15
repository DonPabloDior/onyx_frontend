import React from 'react'
import styled, { css } from 'styled-components'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
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

const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  padding: 12px 14px;
  background: ${({ theme }) => theme.surface.s1};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.well};
  border: 1px solid transparent;
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  font-family: ${({ theme }) => theme.font.sans};
  resize: vertical;
  min-height: 100px;
  transition:
    border-color ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease};

  &::placeholder {
    color: ${({ theme }) => theme.text.ghost};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent.blue};
    box-shadow: ${({ theme }) => theme.shadow.well}, 0 0 0 3px rgba(79, 141, 240, 0.15);
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: ${({ theme }) => theme.accent.red} !important;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const HintText = styled.span<{ $isError: boolean }>`
  font-size: 12px;
  color: ${({ $isError, theme }) => ($isError ? theme.accent.red : theme.text.tertiary)};
`

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, fullWidth = false, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <Wrapper $fullWidth={fullWidth}>
        {label && <Label htmlFor={textareaId}>{label}</Label>}
        <StyledTextarea
          ref={ref}
          id={textareaId}
          $hasError={!!error}
          aria-invalid={!!error}
          {...props}
        />
        {(error || hint) && (
          <HintText $isError={!!error} role={error ? 'alert' : undefined}>
            {error ?? hint}
          </HintText>
        )}
      </Wrapper>
    )
  }
)

Textarea.displayName = 'Textarea'
