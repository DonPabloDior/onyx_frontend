import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { X } from 'lucide-react'
import { IconButton } from '../button/IconButton'
import { edgeBorder } from '@/app/styles/mixins'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  hideClose?: boolean
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} ${({ theme }) => theme.motion.slow} ${({ theme }) => theme.motion.ease};
`

const sizeMap = {
  sm: '400px',
  md: '540px',
  lg: '680px',
}

const Dialog = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  background: ${({ theme }) => theme.surface.s1};
  border-radius: ${({ theme }) => theme.radius['2xl']};
  box-shadow: ${({ theme }) => theme.shadow.pop};
  width: 100%;
  max-width: ${({ $size }) => sizeMap[$size]};
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} ${({ theme }) => theme.motion.slow} ${({ theme }) => theme.motion.ease};
  ${edgeBorder}
`

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 0;
`

const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ModalTitleText = styled.h2`
  font-size: 18px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.01em;
`

const ModalDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;
`

const ModalBody = styled.div`
  padding: 20px 24px 24px;
`

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  hideClose = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Keyboard: close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Trap focus & lock body scroll
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <Backdrop onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      <Dialog $size={size} ref={dialogRef} tabIndex={-1}>
        {(title || !hideClose) && (
          <ModalHeader>
            <ModalTitleGroup>
              {title && <ModalTitleText id="modal-title">{title}</ModalTitleText>}
              {description && <ModalDescription>{description}</ModalDescription>}
            </ModalTitleGroup>
            {!hideClose && (
              <IconButton label="Close" size="sm" onClick={onClose}>
                <X size={16} />
              </IconButton>
            )}
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
      </Dialog>
    </Backdrop>,
    document.body
  )
}

// ─── Modal footer helper ──────────────────────────────────────────────────

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.stroke.subtle};
  margin-top: 20px;
`
