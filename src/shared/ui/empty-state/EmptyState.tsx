import React from 'react'
import styled from 'styled-components'
import { Button } from '../button/Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
`

const HatchBox = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.gradient.hatch};
  border: 1px solid ${({ theme }) => theme.stroke.subtle};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.ghost};
  margin-bottom: 4px;
`

const Title = styled.h3`
  font-size: 15px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
`

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
  max-width: 280px;
  line-height: 1.5;
`

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Wrapper>
      {icon && <HatchBox>{icon}</HatchBox>}
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick} style={{ marginTop: 4 }}>
          {action.label}
        </Button>
      )}
    </Wrapper>
  )
}
