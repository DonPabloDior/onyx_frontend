import styled from 'styled-components'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const PageButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 13px;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.accent.blue : 'transparent')};
  background: ${({ $active, theme }) => ($active ? 'rgba(79,141,240,0.15)' : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.accent.blue : theme.text.secondary)};
  transition:
    background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease},
    color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};

  &:hover:not(:disabled):not([data-active]) {
    background: ${({ theme }) => theme.surface.s2};
    color: ${({ theme }) => theme.text.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent.blue};
    outline-offset: 2px;
  }
`

const Ellipsis = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${({ theme }) => theme.text.ghost};
`

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  function getPages(): (number | '...')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }
    if (page >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }

  return (
    <Wrapper role="navigation" aria-label="Pagination">
      <PageButton
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </PageButton>

      {getPages().map((p, i) =>
        p === '...' ? (
          <Ellipsis key={`ellipsis-${i}`} aria-hidden>…</Ellipsis>
        ) : (
          <PageButton
            key={p}
            $active={p === page}
            onClick={() => onPageChange(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </PageButton>
        )
      )}

      <PageButton
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </PageButton>
    </Wrapper>
  )
}
