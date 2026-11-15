import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Modal, ModalFooter } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { useImportTransactions } from '@/entities/transaction'
import type { ImportResult } from '@/shared/types/api'

const DropZone = styled.div<{ $dragging: boolean; $hasFile: boolean }>`
  border: 2px dashed
    ${({ $dragging, $hasFile, theme }) =>
      $dragging ? theme.accent.blue : $hasFile ? theme.accent.green : theme.stroke.default};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease};
  background: ${({ $dragging }) => ($dragging ? 'rgba(79,141,240,0.05)' : 'transparent')};

  &:hover {
    border-color: ${({ theme }) => theme.stroke.strong};
  }
`

const DropIcon = styled.div`
  margin: 0 auto 12px;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surface.s2};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.tertiary};
`

const DropTitle = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 4px;
`

const DropSub = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`

const ResultBox = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ResultRow = styled.div<{ $type: 'success' | 'warning' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  background: ${({ $type, theme }) =>
    $type === 'success'
      ? theme.status.success.dim
      : $type === 'warning'
      ? theme.status.warning.dim
      : theme.status.error.dim};
  color: ${({ $type, theme }) =>
    $type === 'success'
      ? theme.accent.green
      : $type === 'warning'
      ? theme.accent.orange
      : theme.accent.red};
`

const ErrorList = styled.ul`
  list-style: none;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ErrorItem = styled.li`
  font-size: 12px;
  color: ${({ theme }) => theme.accent.red};
  padding: 4px 8px;
  background: ${({ theme }) => theme.status.error.dim};
  border-radius: ${({ theme }) => theme.radius.xs};
`

interface Props {
  onClose: () => void
}

export function ImportModal({ onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate: importTx, isPending } = useImportTransactions()

  function handleFile(f: File) {
    if (f.type !== 'text/csv' && !f.name.endsWith('.csv')) return
    setFile(f)
    setResult(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }

  function handleImport() {
    if (!file) return
    importTx(file, {
      onSuccess: (data) => setResult(data),
    })
  }

  return (
    <Modal open onClose={onClose} title="Import transactions" description="Upload a CSV file with columns: type, description, amount, currency, status, category, occurred_at">
      <DropZone
        $dragging={dragging}
        $hasFile={!!file}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Drop CSV file here"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <DropIcon>
          {file ? <FileText size={20} /> : <Upload size={20} />}
        </DropIcon>
        <DropTitle>{file ? file.name : 'Drop CSV here or click to browse'}</DropTitle>
        <DropSub>
          {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Only .csv files are supported'}
        </DropSub>
      </DropZone>

      {result && (
        <ResultBox>
          <ResultRow $type="success">
            <CheckCircle2 size={14} />
            {result.imported} transaction{result.imported !== 1 ? 's' : ''} imported
          </ResultRow>
          {result.skipped > 0 && (
            <ResultRow $type="warning">
              <AlertCircle size={14} />
              {result.skipped} row{result.skipped !== 1 ? 's' : ''} skipped
            </ResultRow>
          )}
          {result.errors.length > 0 && (
            <ErrorList>
              {result.errors.map((e, i) => <ErrorItem key={i}>{e}</ErrorItem>)}
            </ErrorList>
          )}
        </ResultBox>
      )}

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button
          variant="blue"
          disabled={!file || !!result}
          loading={isPending}
          onClick={handleImport}
        >
          Import
        </Button>
      </ModalFooter>
    </Modal>
  )
}
