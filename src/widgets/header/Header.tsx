import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Bell, Menu } from 'lucide-react'
import { IconButton } from '@/shared/ui/button'

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/transactions': 'Transactions',
  '/invoices': 'Invoices',
  '/customers': 'Customers',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

const HeaderWrap = styled.header`
  height: 56px;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};
  background: ${({ theme }) => theme.surface.bg};
  position: sticky;
  top: 0;
  z-index: 10;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.01em;
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const MobileMenuBtn = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`

interface HeaderProps {
  onMobileMenuToggle?: () => void
  children?: React.ReactNode
}

export function Header({ onMobileMenuToggle, children }: HeaderProps) {
  const location = useLocation()
  const pathSegment = '/' + location.pathname.split('/')[1]
  const title = ROUTE_TITLES[pathSegment] ?? 'Onyx'

  return (
    <HeaderWrap>
      <Left>
        <MobileMenuBtn onClick={onMobileMenuToggle} aria-label="Open menu">
          <Menu size={18} />
        </MobileMenuBtn>
        <PageTitle>{title}</PageTitle>
      </Left>
      <Right>
        {children}
        <IconButton label="Notifications" variant="bare" size="sm">
          <Bell size={16} />
        </IconButton>
      </Right>
    </HeaderWrap>
  )
}
