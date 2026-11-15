import styled from 'styled-components'
import { AlertTriangle } from 'lucide-react'
import { Modal, ModalFooter } from './Modal'
import { Button } from '../button/Button'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  loading?: boolean
}

const IconWrap = styled.div<{ $variant: 'danger' | 'warning' }>`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $variant, theme }) =>
    $variant === 'danger' ? theme.status.error.dim : theme.status.warning.dim};
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === 'danger' ? theme.status.error.line : theme.status.warning.line};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $variant, theme }) =>
    $variant === 'danger' ? theme.accent.red : theme.accent.orange};
  margin-bottom: 16px;
`

const ConfirmTitle = styled.h2`
  font-size: 17px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
`

const ConfirmDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.55;
`

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm" hideClose>
      <IconWrap $variant={variant}>
        <AlertTriangle size={22} />
      </IconWrap>
      <ConfirmTitle>{title}</ConfirmTitle>
      <ConfirmDesc>{description}</ConfirmDesc>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
