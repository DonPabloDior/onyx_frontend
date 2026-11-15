import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, Send, Bell, XCircle, Trash2, FileDown } from 'lucide-react'
import {
  useInvoice,
  useDeleteInvoice,
  useSendInvoice,
  useCancelInvoice,
  useRemindInvoice,
  useGenerateInvoicePdf,
} from '@/entities/invoice'
import { useCustomer } from '@/entities/customer'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { ConfirmModal } from '@/shared/ui/modal'
import { InvoiceStatusBadge } from '@/shared/ui/badge'
import { Table, Thead, Tbody, Tr, Th, Td, TableWrapper } from '@/shared/ui/table'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { EditInvoiceModal } from './components/EditInvoiceModal'

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 20px;
  &:hover { color: ${({ theme }) => theme.text.secondary}; }
`

const PageLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  align-items: start;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

const InvoiceHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
`

const InvoiceNumber = styled.div`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.01em;
  margin-bottom: 6px;
`

const ActionBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const TotalsSection = styled.div`
  margin-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.stroke.subtle};
  padding-top: 16px;
`

const TotalRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: ${({ $bold }) => ($bold ? '15px' : '13px')};
  font-weight: ${({ $bold, theme }) => ($bold ? theme.fontWeight.medium : theme.fontWeight.regular)};
  color: ${({ $bold, theme }) => ($bold ? theme.text.primary : theme.text.secondary)};
  font-variant-numeric: tabular-nums;
`

const SideCard = styled(Card)`
  position: sticky;
  top: 80px;
`

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};
  &:last-child { border-bottom: none; }
`

const InfoLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
`

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmSend, setConfirmSend] = useState(false)

  const { data: inv, isLoading } = useInvoice(id!)
  const { data: customer } = useCustomer(inv?.customer_id ?? '')
  const { mutate: deleteInv, isPending: deleting } = useDeleteInvoice()
  const { mutate: sendInv, isPending: sending } = useSendInvoice()
  const { mutate: cancelInv, isPending: cancelling } = useCancelInvoice()
  const { mutate: remindInv, isPending: reminding } = useRemindInvoice()
  const { mutate: getPdf, isPending: generatingPdf } = useGenerateInvoicePdf()

  if (isLoading) {
    return <Card><Skeleton height="400px" /></Card>
  }
  if (!inv) return <div>Invoice not found</div>

  const isDraft = inv.status === 'draft'
  const canSend = inv.status === 'draft' || inv.status === 'pending'
  const canRemind = inv.status === 'sent' || inv.status === 'pending'
  const canCancel = inv.status !== 'paid' && inv.status !== 'cancelled'

  return (
    <>
      <BackLink to="/invoices"><ArrowLeft size={14} /> Invoices</BackLink>

      <PageLayout>
        <div>
          <Card>
            <InvoiceHeader>
              <div>
                <InvoiceNumber>{inv.invoice_number}</InvoiceNumber>
                <InvoiceStatusBadge status={inv.status} />
              </div>
              <ActionBar>
                {isDraft && (
                  <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                )}
                {canSend && (
                  <Button variant="blue" size="sm" icon={<Send size={14} />} loading={sending} onClick={() => setConfirmSend(true)}>
                    Send
                  </Button>
                )}
                {canRemind && (
                  <Button variant="secondary" size="sm" icon={<Bell size={14} />} loading={reminding} onClick={() => remindInv(inv.id)}>
                    Remind
                  </Button>
                )}
                <Button variant="secondary" size="sm" icon={<FileDown size={14} />} loading={generatingPdf} onClick={() => getPdf(inv.id)}>
                  PDF
                </Button>
                {canCancel && (
                  <Button variant="ghost" size="sm" onClick={() => setConfirmCancel(true)}>
                    Cancel
                  </Button>
                )}
                {isDraft && (
                  <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setConfirmDelete(true)}>
                    Delete
                  </Button>
                )}
              </ActionBar>
            </InvoiceHeader>

            {/* Line items */}
            <TableWrapper>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Description</Th>
                    <Th data-align="right">Qty</Th>
                    <Th data-align="right">Unit price</Th>
                    <Th data-align="right">Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inv.items.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.description}</Td>
                      <Td data-align="right">{item.quantity}</Td>
                      <Td data-align="right">{formatCurrency(item.unit_price, inv.currency)}</Td>
                      <Td data-align="right">{formatCurrency(item.total, inv.currency)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrapper>

            <TotalsSection>
              <TotalRow>
                <span>Subtotal</span>
                <span>{formatCurrency(inv.subtotal, inv.currency)}</span>
              </TotalRow>
              <TotalRow>
                <span>Tax</span>
                <span>{formatCurrency(inv.tax_amount, inv.currency)}</span>
              </TotalRow>
              <TotalRow $bold>
                <span>Total</span>
                <span>{formatCurrency(inv.total_amount, inv.currency)}</span>
              </TotalRow>
            </TotalsSection>
          </Card>
        </div>

        <div>
          <SideCard>
            <InfoRow>
              <InfoLabel>Customer</InfoLabel>
              <InfoValue>{customer?.name ?? inv.customer_id.slice(0, 8)}</InfoValue>
              {customer?.email && <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{customer.email}</div>}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Issued</InfoLabel>
              <InfoValue>{inv.issued_at ? formatDate(inv.issued_at) : '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Due date</InfoLabel>
              <InfoValue>{formatDate(inv.due_date)}</InfoValue>
            </InfoRow>
            {inv.paid_at && (
              <InfoRow>
                <InfoLabel>Paid at</InfoLabel>
                <InfoValue>{formatDate(inv.paid_at)}</InfoValue>
              </InfoRow>
            )}
            <InfoRow>
              <InfoLabel>Currency</InfoLabel>
              <InfoValue>{inv.currency}</InfoValue>
            </InfoRow>
          </SideCard>
        </div>
      </PageLayout>

      {editing && <EditInvoiceModal invoice={inv} onClose={() => setEditing(false)} />}

      <ConfirmModal
        open={confirmSend}
        onClose={() => setConfirmSend(false)}
        onConfirm={() => sendInv(inv.id, { onSuccess: () => setConfirmSend(false) })}
        title="Send invoice?"
        description={`${customer?.name ?? 'The customer'} will receive an email about this invoice.`}
        confirmLabel="Send invoice"
        variant="warning"
        loading={sending}
      />
      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => deleteInv(inv.id, { onSuccess: () => navigate('/invoices') })}
        title={`Delete ${inv.invoice_number}?`}
        description="This removes the invoice and its payment history. You can't undo this."
        confirmLabel="Delete invoice"
        loading={deleting}
      />
      <ConfirmModal
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => cancelInv(inv.id, { onSuccess: () => setConfirmCancel(false) })}
        title={`Cancel ${inv.invoice_number}?`}
        description="The invoice will be marked as cancelled and cannot be reactivated."
        confirmLabel="Cancel invoice"
        variant="warning"
        loading={cancelling}
      />
    </>
  )
}
