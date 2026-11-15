import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, Mail, Phone, Building2 } from 'lucide-react'
import { useCustomer, useDeleteCustomer } from '@/entities/customer'
import { useInvoices } from '@/entities/invoice'
import { Card, Tile } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Avatar } from '@/shared/ui/avatar'
import { Skeleton } from '@/shared/ui/skeleton'
import { ConfirmModal } from '@/shared/ui/modal'
import { InvoiceStatusBadge } from '@/shared/ui/badge'
import { Table, Thead, Tbody, Tr, Th, Td, TableWrapper } from '@/shared/ui/table'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { EditCustomerModal } from '../customers/components/EditCustomerModal'

const BackLink = styled(Link)`
  display: inline-flex; align-items: center; gap: 6px; font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary}; margin-bottom: 20px;
  &:hover { color: ${({ theme }) => theme.text.secondary}; }
`

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

const ProfileCard = styled(Card)`
  position: sticky;
  top: 80px;
`

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  margin-bottom: 24px;
`

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
`

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  padding: 6px 0;
`

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 20px;
`

const StatTile = styled(Tile)`
  text-align: center;
`

const StatValue = styled.div`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.01em;
`

const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 2px;
`

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: customer, isLoading } = useCustomer(id!)
  const { data: invoicesData } = useInvoices({ customer_id: id, page_size: 10 })
  const { mutate: deleteCustomer, isPending: deleting } = useDeleteCustomer()

  const invoices = invoicesData?.data ?? []

  if (isLoading) return <Card><Skeleton height="400px" /></Card>
  if (!customer) return <div>Customer not found</div>

  return (
    <>
      <BackLink to="/customers"><ArrowLeft size={14} /> Customers</BackLink>
      <PageLayout>
        <div>
          <ProfileCard>
            <ProfileHeader>
              <Avatar name={customer.name} size="lg" />
              <div>
                <ProfileName>{customer.name}</ProfileName>
                {customer.company && <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{customer.company}</div>}
              </div>
            </ProfileHeader>

            {customer.email && <ContactRow><Mail size={14} />{customer.email}</ContactRow>}
            {customer.phone && <ContactRow><Phone size={14} />{customer.phone}</ContactRow>}
            {customer.company && <ContactRow><Building2 size={14} />{customer.company}</ContactRow>}

            <StatGrid>
              <StatTile>
                <StatValue>{formatCurrency(customer.total_invoiced, 'USD', true)}</StatValue>
                <StatLabel>Invoiced</StatLabel>
              </StatTile>
              <StatTile>
                <StatValue>{formatCurrency(customer.total_paid, 'USD', true)}</StatValue>
                <StatLabel>Paid</StatLabel>
              </StatTile>
              <StatTile style={{ gridColumn: '1 / -1' }}>
                <StatValue style={{ color: parseFloat(customer.outstanding_balance) > 0 ? 'var(--orange)' : 'inherit' }}>
                  {formatCurrency(customer.outstanding_balance, 'USD', true)}
                </StatValue>
                <StatLabel>Outstanding</StatLabel>
              </StatTile>
            </StatGrid>

            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <Button variant="secondary" size="sm" fullWidth onClick={() => setEditing(true)}>Edit</Button>
              <Button variant="danger" size="sm" fullWidth onClick={() => setConfirmDelete(true)}>Delete</Button>
            </div>
          </ProfileCard>
        </div>

        <div>
          <Card>
            <div style={{ marginBottom: 16, fontSize: 15, fontWeight: 500 }}>Invoices</div>
            {invoices.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 14, color: 'var(--text-tertiary)' }}>
                No invoices yet
              </div>
            ) : (
              <TableWrapper>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Invoice</Th>
                      <Th>Due</Th>
                      <Th>Status</Th>
                      <Th data-align="right">Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {invoices.map((inv) => (
                      <Tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/invoices/${inv.id}`)}>
                        <Td>{inv.invoice_number}</Td>
                        <Td data-secondary>{formatDate(inv.due_date, 'MMM d, yyyy')}</Td>
                        <Td><InvoiceStatusBadge status={inv.status} /></Td>
                        <Td data-align="right">{formatCurrency(inv.total_amount, inv.currency)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableWrapper>
            )}
          </Card>
        </div>
      </PageLayout>

      {editing && <EditCustomerModal customer={customer} onClose={() => setEditing(false)} />}
      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => deleteCustomer(customer.id, { onSuccess: () => navigate('/customers') })}
        title={`Delete ${customer.name}?`}
        description="This will permanently remove the customer and all associated data."
        confirmLabel="Delete customer"
        loading={deleting}
      />
    </>
  )
}
