import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/shared/ui/card'
import { EmptyState } from '@/shared/ui/empty-state'
import { formatCurrency, formatDateShort } from '@/shared/lib/format'
import type { TransactionOut, TransactionType } from '@/shared/types/api'

interface Props {
  transactions?: TransactionOut[]
  currency: string
}

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
`

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};

  &:last-child { border-bottom: none; }
`

const TypeIcon = styled.div<{ $type: TransactionType }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $type, theme }) =>
    $type === 'income'
      ? theme.status.success.dim
      : $type === 'expense'
      ? theme.status.error.dim
      : theme.status.info.dim};
  color: ${({ $type, theme }) =>
    $type === 'income'
      ? theme.accent.green
      : $type === 'expense'
      ? theme.accent.red
      : theme.accent.blue};
`

const Info = styled.div`
  flex: 1;
  min-width: 0;
`

const Desc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Date = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 2px;
`

const Amount = styled.div<{ $type: TransactionType }>`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-variant-numeric: tabular-nums;
  color: ${({ $type, theme }) =>
    $type === 'income' ? theme.accent.green : theme.text.primary};
  flex-shrink: 0;
`

function TypeIconComp({ type }: { type: TransactionType }) {
  const iconProps = { size: 14 }
  const icon =
    type === 'income' ? (
      <ArrowDownLeft {...iconProps} />
    ) : type === 'expense' ? (
      <ArrowUpRight {...iconProps} />
    ) : (
      <ArrowLeftRight {...iconProps} />
    )
  return <TypeIcon $type={type}>{icon}</TypeIcon>
}

export function RecentActivity({ transactions, currency }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <Link to="/transactions" style={{ fontSize: 13, color: 'var(--blue)', textDecoration: 'none' }}>
          View all
        </Link>
      </CardHeader>

      {!transactions || transactions.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="Transactions will appear here as they're added."
        />
      ) : (
        <List>
          {transactions.map((tx) => (
            <Item key={tx.id}>
              <TypeIconComp type={tx.type} />
              <Info>
                <Desc>{tx.description || tx.type}</Desc>
                <Date>{formatDateShort(tx.occurred_at)}</Date>
              </Info>
              <Amount $type={tx.type}>
                {tx.type === 'income' ? '+' : '-'}
                {formatCurrency(tx.amount, tx.currency || currency)}
              </Amount>
            </Item>
          ))}
        </List>
      )}
    </Card>
  )
}
