import styled from 'styled-components'

export const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`

export const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 1;
`

export const Tbody = styled.tbody``

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};
  transition: background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};

  &:hover {
    background: ${({ theme }) => theme.surface.s1};
  }

  &:last-child {
    border-bottom: none;
  }
`

export const Th = styled.th`
  padding: 10px 12px;
  text-align: left;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.text.tertiary};
  white-space: nowrap;
  background: ${({ theme }) => theme.surface.s0};
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};
  

  &[data-align='right'] {
    text-align: right;
  }
`

export const Td = styled.td`
  padding: 12px;
  color: ${({ theme }) => theme.text.primary};
  vertical-align: middle;
  

  &[data-align='right'] {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  &[data-secondary] {
    color: ${({ theme }) => theme.text.secondary};
  }
`
