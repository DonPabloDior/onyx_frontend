import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Plus, Upload, Search } from 'lucide-react'
import {
  useTransactions,
  useDeleteTransaction,
  useCategories,
} from '@/entities/transaction'
import { useUIStore } from '@/entities/user'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Pagination } from '@/shared/ui/pagination'
import { EmptyState } from '@/shared/ui/empty-state'
import { ConfirmModal } from '@/shared/ui/modal'
import { Skeleton } from '@/shared/ui/skeleton'
import { TransactionTypeBadge, TransactionStatusBadge } from '@/shared/ui/badge'
import { Table, Thead, Tbody, Tr, Th, Td, TableWrapper } from '@/shared/ui/table'
import { useDebounce } from '@/shared/hooks'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { CreateTransactionModal } from './components/CreateTransactionModal'
import { EditTransactionModal } from './components/EditTransactionModal'
import { ImportModal } from './components/ImportModal'
import type { TransactionOut } from '@/shared/types/api'

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
`

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-wrap: wrap;
`

const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.stroke.subtle};
`

const TotalInfo = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
`

const ActionCell = styled.div`
  display: flex;
  gap: 4px;
`

const RowActionBtn = styled.button`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.xs};
  background: transparent;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.text.tertiary};
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.sans};
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};

  &:hover {
    background: ${({ theme }) => theme.surface.s2};
    color: ${({ theme }) => theme.text.primary};
    border-color: ${({ theme }) => theme.stroke.subtle};
  }

  &.danger:hover {
    background: ${({ theme }) => theme.status.error.dim};
    color: ${({ theme }) => theme.accent.red};
  }
`

export default function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { currency } = useUIStore()

  // Local state
  const [createOpen, setCreateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editTx, setEditTx] = useState<TransactionOut | null>(null)
  const [deleteTx, setDeleteTx] = useState<TransactionOut | null>(null)

  // Filters from URL
  const page = parseInt(searchParams.get('page') ?? '1')
  const searchRaw = searchParams.get('search') ?? ''
  const typeFilter = searchParams.get('type') ?? ''
  const statusFilter = searchParams.get('status') ?? ''
  const categoryId = searchParams.get('category_id') ?? ''

  const search = useDebounce(searchRaw, 300)

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  function setPage(p: number) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  const { data, isLoading } = useTransactions({
    search: search || undefined,
    type: (typeFilter as TransactionOut['type']) || undefined,
    status: (statusFilter as TransactionOut['status']) || undefined,
    category_id: categoryId || undefined,
    page,
    page_size: 20,
  })

  const { data: categories } = useCategories()
  const { mutate: deleteTransaction, isPending: deleting } = useDeleteTransaction()

  const transactions = data?.data ?? []
  const pagination = data?.pagination

  const typeOptions = [
    { value: '', label: 'All types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'transfer', label: 'Transfer' },
  ]

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ]

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...(categories?.map((c) => ({ value: c.id, label: c.name })) ?? []),
  ]

  return (
    <>
      <PageHeader>
        <div />
        <Actions>
          <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => setImportOpen(true)}>
            Import CSV
          </Button>
          <Button variant="blue" size="sm" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
            New transaction
          </Button>
        </Actions>
      </PageHeader>

      <Card>
        {/* Filter bar */}
        <FilterBar>
          <Input
            placeholder="Search transactions..."
            prefix={<Search size={14} />}
            value={searchRaw}
            onChange={(e) => setParam('search', e.target.value)}
            style={{ width: 240 }}
          />
          <FilterGroup>
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(v) => setParam('type', v)}
              fullWidth={false}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(v) => setParam('status', v)}
              fullWidth={false}
            />
            <Select
              options={categoryOptions}
              value={categoryId}
              onChange={(v) => setParam('category_id', v)}
              fullWidth={false}
            />
          </FilterGroup>
        </FilterBar>

        {/* Table */}
        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th>Type</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th data-align="right">Amount</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <Tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <Td key={j}><Skeleton height="14px" /></Td>
                    ))}
                  </Tr>
                ))
              ) : transactions.length === 0 ? (
                <Tr>
                  <Td colSpan={7}>
                    <EmptyState
                      title="No transactions"
                      description="Create your first transaction or import a CSV file."
                      action={{ label: 'New transaction', onClick: () => setCreateOpen(true) }}
                    />
                  </Td>
                </Tr>
              ) : (
                transactions.map((tx) => (
                  <Tr
                    key={tx.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                  >
                    <Td>{tx.description || '—'}</Td>
                    <Td><TransactionTypeBadge type={tx.type} /></Td>
                    <Td data-secondary>{tx.category?.name ?? '—'}</Td>
                    <Td><TransactionStatusBadge status={tx.status} /></Td>
                    <Td data-secondary>{formatDate(tx.occurred_at)}</Td>
                    <Td data-align="right">{formatCurrency(tx.amount, tx.currency || currency)}</Td>
                    <Td onClick={(e) => e.stopPropagation()}>
                      <ActionCell>
                        <RowActionBtn onClick={() => setEditTx(tx)}>Edit</RowActionBtn>
                        <RowActionBtn className="danger" onClick={() => setDeleteTx(tx)}>
                          Delete
                        </RowActionBtn>
                      </ActionCell>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableWrapper>

        {pagination && (
          <TableFooter>
            <TotalInfo>{pagination.total} transaction{pagination.total !== 1 ? 's' : ''}</TotalInfo>
            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={setPage}
            />
          </TableFooter>
        )}
      </Card>

      {/* Modals */}
      <CreateTransactionModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editTx && <EditTransactionModal transaction={editTx} onClose={() => setEditTx(null)} />}
      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
      <ConfirmModal
        open={!!deleteTx}
        onClose={() => setDeleteTx(null)}
        onConfirm={() => {
          if (deleteTx) {
            deleteTransaction(deleteTx.id, { onSuccess: () => setDeleteTx(null) })
          }
        }}
        title="Delete transaction?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  )
}
