import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Plus, Search } from 'lucide-react'
import { useCustomers, useDeleteCustomer } from '@/entities/customer'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Pagination } from '@/shared/ui/pagination'
import { EmptyState } from '@/shared/ui/empty-state'
import { ConfirmModal } from '@/shared/ui/modal'
import { Skeleton } from '@/shared/ui/skeleton'
import { Avatar } from '@/shared/ui/avatar'
import { Table, Thead, Tbody, Tr, Th, Td, TableWrapper } from '@/shared/ui/table'
import { useDebounce } from '@/shared/hooks'
import { formatDate } from '@/shared/lib/format'
import { CreateCustomerModal } from './components/CreateCustomerModal'
import { EditCustomerModal } from './components/EditCustomerModal'
import type { CustomerOut } from '@/shared/types/api'

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`

const FilterBar = styled.div`
  margin-bottom: 16px;
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

  &:hover { background: ${({ theme }) => theme.surface.s2}; color: ${({ theme }) => theme.text.primary}; }
  &.danger:hover { background: ${({ theme }) => theme.status.error.dim}; color: ${({ theme }) => theme.accent.red}; }
`

const CustomerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const CustomerName = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
`

const CustomerCompany = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`

export default function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState<CustomerOut | null>(null)
  const [deleteCustomer, setDeleteCustomer] = useState<CustomerOut | null>(null)

  const page = parseInt(searchParams.get('page') ?? '1')
  const searchRaw = searchParams.get('search') ?? ''
  const search = useDebounce(searchRaw, 300)

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const { data, isLoading } = useCustomers({ search: search || undefined, page, page_size: 20 })
  const { mutate: deleteCustomerMutate, isPending: deleting } = useDeleteCustomer()

  const customers = data?.data ?? []
  const pagination = data?.pagination

  return (
    <>
      <PageHeader>
        <div />
        <Button variant="blue" size="sm" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
          New customer
        </Button>
      </PageHeader>

      <Card>
        <FilterBar>
          <Input
            placeholder="Search customers…"
            prefix={<Search size={14} />}
            value={searchRaw}
            onChange={(e) => setParam('search', e.target.value)}
            style={{ maxWidth: 300 }}
          />
        </FilterBar>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>Customer</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Joined</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Tr key={i}>{Array.from({ length: 5 }).map((_, j) => <Td key={j}><Skeleton height="14px" /></Td>)}</Tr>
                ))
              ) : customers.length === 0 ? (
                <Tr>
                  <Td colSpan={5}>
                    <EmptyState
                      title="No customers yet"
                      description="Add your first customer to start sending invoices."
                      action={{ label: 'Add customer', onClick: () => setCreateOpen(true) }}
                    />
                  </Td>
                </Tr>
              ) : (
                customers.map((c) => (
                  <Tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/customers/${c.id}`)}>
                    <Td>
                      <CustomerCell>
                        <Avatar name={c.name} size="sm" />
                        <div>
                          <CustomerName>{c.name}</CustomerName>
                          {c.company && <CustomerCompany>{c.company}</CustomerCompany>}
                        </div>
                      </CustomerCell>
                    </Td>
                    <Td data-secondary>{c.email ?? '—'}</Td>
                    <Td data-secondary>{c.phone ?? '—'}</Td>
                    <Td data-secondary>{formatDate(c.created_at)}</Td>
                    <Td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <RowBtn onClick={() => setEditCustomer(c)}>Edit</RowBtn>
                        <RowBtn className="danger" onClick={() => setDeleteCustomer(c)}>Delete</RowBtn>
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableWrapper>

        {pagination && (
          <TableFooter>
            <TotalInfo>{pagination.total} customer{pagination.total !== 1 ? 's' : ''}</TotalInfo>
            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={(p) => { const n = new URLSearchParams(searchParams); n.set('page', String(p)); setSearchParams(n) }}
            />
          </TableFooter>
        )}
      </Card>

      <CreateCustomerModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editCustomer && <EditCustomerModal customer={editCustomer} onClose={() => setEditCustomer(null)} />}
      <ConfirmModal
        open={!!deleteCustomer}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={() => deleteCustomer && deleteCustomerMutate(deleteCustomer.id, { onSuccess: () => setDeleteCustomer(null) })}
        title={`Delete ${deleteCustomer?.name}?`}
        description="This will permanently remove the customer and cannot be undone."
        confirmLabel="Delete customer"
        loading={deleting}
      />
    </>
  )
}
