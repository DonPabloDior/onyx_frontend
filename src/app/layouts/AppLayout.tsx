import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Sidebar } from '@/widgets/sidebar'
import { Header } from '@/widgets/header'

const Shell = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.surface.bg};
`

const MobileOverlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 20;
    backdrop-filter: blur(2px);
  }
`

const SidebarWrapper = styled.div<{ $open: boolean }>`
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 30;
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    transition: transform ${({ theme }) => theme.motion.slow} ${({ theme }) => theme.motion.ease};
  }
`

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  @media (max-width: 1024px) {
    padding: 16px;
  }
`

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Shell>
      <MobileOverlay $open={mobileOpen} onClick={() => setMobileOpen(false)} />
      <SidebarWrapper $open={mobileOpen}>
        <Sidebar />
      </SidebarWrapper>

      <Main>
        <Header onMobileMenuToggle={() => setMobileOpen(true)} />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  )
}
