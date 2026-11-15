import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Plus } from 'lucide-react'
import {
  useInvoices,
  useDeleteInvoice,
  useSendInvoice,
  useCancelInvoice,
  useRemindInvoice,
} from '@/entities/invoice'
import { useCustomers } from '@/entities/customer'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Select } from '@/shared/ui/select'
import { Pagination } from '@/shared/ui/pagination'
import { EmptyState } from '@/shared/ui/empty-state'
import { ConfirmModal } from '@/shared/ui/modal'
import { Skeleton } from '@/shared/ui/skeleton'
import { InvoiceStatusBadge } from '@/shared/ui/badge'
import { Avatar } from '@/shared/ui/avatar'
import { Table, Thead, Tbody, Tr, Th, Td, TableWrapper } from '@/shared/ui/table'
import { formatCurrency, formatDate, formatDueDate } from '@/shared/lib/format'
import { CreateInvoiceModal } from './components/CreateInvoiceModal'
import type { InvoiceOut, InvoiceStatus } from '@/shared/types/api'

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
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

const RowBtn = styled.button`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.xs};
  background: transparent;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.text.tertiary};
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.sans};
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};
  white-space: nowrap;

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

const CustomerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export default function InvoicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteInvoice, setDeleteInvoice] = useState<InvoiceOut | null>(null)
  const [cancelInvoice, setCancelInvoice] = useState<InvoiceOut | null>(null)

  const page = parseInt(searchParams.get('page') ?? '1')
  const statusFilter = (searchParams.get('status') ?? '') as InvoiceStatus | ''
  const customerId = searchParams.get('customer_id') ?? ''

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const { data, isLoading } = useInvoices({
    status: statusFilter || undefined,
    customer_id: customerId || undefined,
    page,
    page_size: 20,
  })

  const { data: customersData } = useCustomers({ page_size: 100 })
  const { mutate: deleteInv, isPending: deleting } = useDeleteInvoice()
  const { mutate: sendInv } = useSendInvoice()
  const { mutate: cancelInv, isPending: cancelling } = useCancelInvoice()
  const { mutate: remindInv } = useRemindInvoice()

  const invoices = data?.data ?? []
  const pagination = data?.pagination
  const customers = customersData?.data ?? []

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const customerOptions = [
    { value: '', label: 'All customers' },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
  ]

  function getCustomerName(customerId: string): string {
    return customers.find((c) => c.id === customerId)?.name ?? customerId.slice(0, 8)
  }

  return (
    <>
      <PageHeader>
        <div />
        <Button variant="blue" size="sm" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
          New invoice
        </Button>
      </PageHeader>

      <Card>
        <FilterBar>
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(v) => setParam('status', v)}
          />
          <Select
            options={customerOptions}
            value={customerId}
            onChange={(v) => setParam('customer_id', v)}
          />
        </FilterBar>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>Customer</Th>
                <Th>Invoice</Th>
                <Th>Due</Th>
                <Th>Status</Th>
                <Th data-align="right">Amount</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <Td key={j}><Skeleton height="14px" /></Td>
                    ))}
                  </Tr>
                ))
              ) : invoices.length === 0 ? (
                <Tr>
                  <Td colSpan={6}>
                    <EmptyState
                      title="No invoices yet"
                      description="Create your first invoice to start tracking payments."
                      action={{ label: 'Create invoice', onClick: () => setCreateOpen(true) }}
                    />
                  </Td>
                </Tr>
              ) : (
                invoices.map((inv) => (
                  <Tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/invoices/${inv.id}`)}>
                    <Td>
                      <CustomerCell>
                        <Avatar name={getCustomerName(inv.customer_id)} size="sm" />
                        {getCustomerName(inv.customer_id)}
                      </CustomerCell>
                    </Td>
                    <Td data-secondary>{inv.invoice_number}</Td>
                    <Td data-secondary>
                      <div>{formatDate(inv.due_date, 'MMM d')}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-ghost)' }}>
                        {formatDueDate(inv.due_date)}
                      </div>
                    </Td>
                    <Td><InvoiceStatusBadge status={inv.status} /></Td>
                    <Td data-align="right">{formatCurrency(inv.total_amount, inv.currency)}</Td>
                    <Td onClick={(e) => e.stopPropagation()}>
                      <ActionCell>
                        {inv.status === 'draft' && (
                          <RowBtn onClick={() => sendInv(inv.id)}>Send</RowBtn>
                        )}
                        {(inv.status === 'sent' || inv.status === 'pending') && (
                          <RowBtn onClick={() => remindInv(inv.id)}>Remind</RowBtn>
                        )}
                        {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                          <RowBtn className="danger" onClick={() => setCancelInvoice(inv)}>
                            Cancel
                          </RowBtn>
                        )}
                        {inv.status === 'draft' && (
                          <RowBtn className="danger" onClick={() => setDeleteInvoice(inv)}>
                            Delete
                          </RowBtn>
                        )}
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
            <TotalInfo>{pagination.total} invoice{pagination.total !== 1 ? 's' : ''}</TotalInfo>
            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={(p) => {
                const next = new URLSearchParams(searchParams)
                next.set('page', String(p))
                setSearchParams(next)
              }}
            />
          </TableFooter>
        )}
      </Card>

      <CreateInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <ConfirmModal
        open={!!deleteInvoice}
        onClose={() => setDeleteInvoice(null)}
        onConfirm={() => deleteInvoice && deleteInv(deleteInvoice.id, { onSuccess: () => setDeleteInvoice(null) })}
        title={`Delete ${deleteInvoice?.invoice_number}?`}
        description="This removes the invoice and its payment history. You can't undo this."
        confirmLabel="Delete invoice"
        loading={deleting}
      />

      <ConfirmModal
        open={!!cancelInvoice}
        onClose={() => setCancelInvoice(null)}
        onConfirm={() => cancelInvoice && cancelInv(cancelInvoice.id, { onSuccess: () => setCancelInvoice(null) })}
        title={`Cancel ${cancelInvoice?.invoice_number}?`}
        description="The invoice will be marked as cancelled and cannot be reactivated."
        confirmLabel="Cancel invoice"
        variant="warning"
        loading={cancelling}
      />
    </>
  )
}
