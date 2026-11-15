import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.surface.bg};
  padding: 24px;
`

const Box = styled.div`
  width: 100%;
  max-width: 400px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
`

const Mark = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.gradient.blue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: white;
`

const Name = styled.span`
  font-size: 18px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
`

export function AuthLayout() {
  return (
    <Wrap>
      <Box>
        <Logo>
          <div style={{ width: '30px' }}>
            <svg viewBox="0 0 48 40" aria-hidden="true">
              <path d="M24 4 34 20 24 36 14 20z" fill="#262626"></path>
              <path d="M2 6 22 20 2 34z" fill="#fff"></path>
              <path d="M46 6 26 20l20 14z" fill="#fff"></path>
              <path d="M2 6 22 20 2 20z" fill="#d6d6d6"></path>
              <path d="M46 34 26 20l20 0z" fill="#d6d6d6"></path>
            </svg>
          </div>
          <Name>Onyx</Name>
        </Logo>
        <Outlet />
      </Box>
    </Wrap>
  )
}
