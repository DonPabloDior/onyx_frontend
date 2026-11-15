import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useTransaction, useDeleteTransaction } from '@/entities/transaction'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { ConfirmModal } from '@/shared/ui/modal'
import { TransactionTypeBadge, TransactionStatusBadge } from '@/shared/ui/badge'
import { formatCurrency, formatDateTime } from '@/shared/lib/format'
import { EditTransactionModal } from '../transactions/components/EditTransactionModal'

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 20px;

  &:hover { color: ${({ theme }) => theme.text.secondary}; }
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
`

const TitleGroup = styled.div``

const Amount = styled.div`
  font-size: 36px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 6px;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: ${({ theme }) => theme.stroke.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`

const Field = styled.div`
  background: ${({ theme }) => theme.surface.s0};
  padding: 16px;
`

const FieldLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 4px;
`

const FieldValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: tx, isLoading } = useTransaction(id!)
  const { mutate: deleteTx, isPending: deleting } = useDeleteTransaction()

  if (isLoading) {
    return (
      <Card>
        <Skeleton height="40px" width="200px" style={{ marginBottom: 24 }} />
        <Skeleton height="200px" />
      </Card>
    )
  }

  if (!tx) return <div>Transaction not found</div>

  return (
    <>
      <BackLink to="/transactions"><ArrowLeft size={14} /> Transactions</BackLink>

      <Card>
        <Header>
          <TitleGroup>
            <Amount>{formatCurrency(tx.amount, tx.currency)}</Amount>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <TransactionTypeBadge type={tx.type} />
              <TransactionStatusBadge status={tx.status} />
            </div>
          </TitleGroup>
          <Actions>
            <Button variant="secondary" size="sm" icon={<Pencil size={14} />} onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          </Actions>
        </Header>

        <Grid>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldValue>{tx.description || '—'}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <FieldValue>{tx.category?.name ?? '—'}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <FieldValue>{tx.currency}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Source</FieldLabel>
            <FieldValue style={{ textTransform: 'capitalize' }}>{tx.source}</FieldValue>
          </Field>
          <Field style={{ gridColumn: '1 / -1' }}>
            <FieldLabel>Date</FieldLabel>
            <FieldValue>{formatDateTime(tx.occurred_at)}</FieldValue>
          </Field>
        </Grid>
      </Card>

      {editing && (
        <EditTransactionModal transaction={tx} onClose={() => setEditing(false)} />
      )}
      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() =>
          deleteTx(tx.id, {
            onSuccess: () => navigate('/transactions'),
          })
        }
        title="Delete transaction?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  )
}
