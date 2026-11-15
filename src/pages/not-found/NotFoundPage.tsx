import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  text-align: center;
`

const Code = styled.div`
  font-size: 80px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.ghost};
  line-height: 1;
  letter-spacing: -0.04em;
`

const Title = styled.h2`
  font-size: 20px;
  color: ${({ theme }) => theme.text.primary};
`

const Sub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
`

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.surface.s2};
  border: 1px solid ${({ theme }) => theme.stroke.default};
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  margin-top: 8px;

  &:hover {
    background: ${({ theme }) => theme.surface.s3};
    color: ${({ theme }) => theme.text.primary};
  }
`

export default function NotFoundPage() {
  return (
    <Wrap>
      <Code>404</Code>
      <Title>Page not found</Title>
      <Sub>The page you're looking for doesn't exist or has been moved.</Sub>
      <HomeLink to="/dashboard">Back to dashboard</HomeLink>
    </Wrap>
  )
}
