import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  Users,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react'
import { useAuthStore, useUIStore } from '@/entities/user'
import { useLogout } from '@/features/authentication'
import { Avatar } from '@/shared/ui/avatar'
import React from 'react'

// ─── Onyx tokens the theme doesn't expose (mirrors design-system.html) ─────

/** --grad-ctl: the raised-control fill used by secondary buttons and selects */
const GRAD_CTL = 'linear-gradient(180deg, #171717 0%, #0e0e0e 100%)'

/** .edge: 1px top-lit hairline, the system's replacement for drop shadows */
const EDGE_TOP_LIT = `linear-gradient(
  150deg,
  rgba(255, 255, 255, 0.18),
  rgba(255, 255, 255, 0.04) 38%,
  rgba(255, 255, 255, 0.03) 62%,
  rgba(255, 255, 255, 0.09)
)`


// ─── Styled ────────────────────────────────────────────────────────────────

const SidebarWrap = styled.aside<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${({ $collapsed }) => ($collapsed ? '64px' : '220px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '64px' : '220px')};
  background: ${({ theme }) => theme.surface.s0};
  position: relative;
  transition:
    width ${({ theme }) => theme.motion.slow} ${({ theme }) => theme.motion.ease},
    min-width ${({ theme }) => theme.motion.slow} ${({ theme }) => theme.motion.ease};
  overflow: hidden;

  /* Gradient right-edge border */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.06) 40%,
      rgba(255, 255, 255, 0.02) 100%
    );
  }
`

const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};
  gap: 8px;
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
`

const BrandMark = styled.div`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.gradient.blue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: white;
  letter-spacing: -0.5px;
`

const BrandName = styled.span`
  font-size: 15px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
`

const CollapseBtn = styled.button`
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: ${({ theme }) => theme.radius.xs};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.stroke.subtle};
  color: ${({ theme }) => theme.text.ghost};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};

  &:hover {
    background: ${({ theme }) => theme.surface.s2};
    color: ${({ theme }) => theme.text.secondary};
  }
`

const Nav = styled.nav`
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  overflow-x: hidden;
`

const navItemStyles = css<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
  text-decoration: none;
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};
  white-space: nowrap;
  overflow: hidden;

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      justify-content: center;
      padding: 0;
    `}

  &:hover {
    background: ${({ theme }) => theme.surface.s2};
    color: ${({ theme }) => theme.text.primary};
  }

  &.active {
    background: ${({ theme }) => theme.surface.s2};
    color: ${({ theme }) => theme.text.primary};
    position: relative;

    svg.nav-icon {
      color: white;
    }
  }
`

const NavItem = styled(NavLink)<{ $collapsed: boolean }>`
  ${navItemStyles}
`

const NavLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ActiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accent.blue};
  flex-shrink: 0;
`

const SidebarBottom = styled.div`
  padding: 8px;
  border-top: 1px solid ${({ theme }) => theme.stroke.subtle};
`

const UserChip = styled.button<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};
  overflow: hidden;

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      justify-content: center;
      padding: 8px 0;
    `}

  &:hover {
    background: ${({ theme }) => theme.surface.s2};
  }
`

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  text-align: left;
  overflow: hidden;
`

const UserName = styled.div`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/**
 * Log out: an Onyx secondary pill.
 *
 * Rest:   raised control gradient, top-lit hairline edge, quiet secondary text.
 * Hover:  hairline fades out, a danger wash fades in, the icon chip turns red
 *         and the arrow slides out of the door.
 * Press:  scales to 97% (same as .btn). Focus: blue ring offset by 3px.
 * Collapsed: a 40px circle with just the icon.
 */
const LogoutBtn = styled.button<{ $collapsed: boolean }>`
  position: relative;
  isolation: isolate; /* keeps the ::after wash behind the content */
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 40px;
  margin-top: 6px;
  padding: 0 16px 0 6px;
  border: 0;
  border-radius: 999px;
  background: ${GRAD_CTL};
  color: ${({ theme }) => theme.text.secondary};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      width: 40px;
      margin: 6px auto 0;
      padding: 0;
      justify-content: center;
    `}

  /* Hairline edge */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    pointer-events: none;
    background: ${EDGE_TOP_LIT};
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    transition: opacity ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};
  }
  

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent.blue};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &::before,
    &::after {
      transition: none;
    }

    &:active {
      transform: none;
    }
  }
`

const LogoutIcon = styled.span<{ $collapsed: boolean }>`
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.stroke.subtle},
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  color: ${({ theme }) => theme.text.tertiary};
  transition:
    background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};

  svg {
    transition: transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};
  }
  

  /* Collapsed: the button itself is the circle, so the chip steps aside */
  ${({ $collapsed }) =>
    $collapsed &&
    css`
      width: 100%;
      height: 100%;
      background: transparent;
      box-shadow: none;
      color: inherit;

      ${LogoutBtn}:hover & {
        background: transparent;
        box-shadow: none;
        color: inherit;
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    &,
    svg {
      transition: none;
    }

    ${LogoutBtn}:hover & svg {
      transform: none;
    }
  }
`

const LogoutLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`

// ─── Nav items data ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', Icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { to: '/invoices', label: 'Invoices', Icon: FileText },
  { to: '/customers', label: 'Customers', Icon: Users },
  { to: '/analytics', label: 'Analytics', Icon: BarChart2 },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

// ─── Component ─────────────────────────────────────────────────────────────

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user } = useAuthStore()
  const { mutate: logout } = useLogout()

  return (
    <SidebarWrap $collapsed={sidebarCollapsed}>
      <SidebarTop>
        <Brand>
          <div style={{ width: '30px' }}>
            <svg viewBox="0 0 48 40" aria-hidden="true">
              <path d="M24 4 34 20 24 36 14 20z" fill="#262626"></path>
              <path d="M2 6 22 20 2 34z" fill="#fff"></path>
              <path d="M46 6 26 20l20 14z" fill="#fff"></path>
              <path d="M2 6 22 20 2 20z" fill="#d6d6d6"></path>
              <path d="M46 34 26 20l20 0z" fill="#d6d6d6"></path>
            </svg>
          </div>
          {!sidebarCollapsed && <BrandName>Onyx</BrandName>}
        </Brand>
        <CollapseBtn
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </CollapseBtn>
      </SidebarTop>

      <Nav aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavItem
            key={to}
            to={to}
            $collapsed={sidebarCollapsed}
            title={sidebarCollapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className="nav-icon" />
                {!sidebarCollapsed && <NavLabel>{label}</NavLabel>}
                {!sidebarCollapsed && isActive && <ActiveDot />}
              </>
            )}
          </NavItem>
        ))}
      </Nav>

      <SidebarBottom>
        {user && (
          <UserChip $collapsed={sidebarCollapsed} onClick={() => {}} aria-label="User menu">
            <Avatar name={user.full_name} size="sm" />
            {!sidebarCollapsed && (
              <>
                <UserInfo>
                  <UserName>{user.full_name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
                <ChevronsUpDown size={14} color="var(--text-ghost)" />
              </>
            )}
          </UserChip>
        )}
        <LogoutBtn
          type="button"
          $collapsed={sidebarCollapsed}
          onClick={() => logout()}
          aria-label="Log out"
          title={sidebarCollapsed ? 'Log out' : undefined}
        >
          <LogoutIcon $collapsed={sidebarCollapsed}>
            <LogOut size={sidebarCollapsed ? 16 : 14} />
          </LogoutIcon>
          {!sidebarCollapsed && <LogoutLabel>Log out</LogoutLabel>}
        </LogoutBtn>
      </SidebarBottom>
    </SidebarWrap>
  )
}
