import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { transactionsApi } from '../api/transactions-api'
import { queryKeys } from '@/shared/lib/query-keys'
import type {
  TransactionFilters,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '@/shared/types/api'

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.transactions.all(filters),
    queryFn: () => transactionsApi.list(filters),
  })
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transactions.byId(id),
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.transactions.categories(),
    queryFn: transactionsApi.getCategories,
    staleTime: 1000 * 60 * 10,
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
      toast.success('Transaction created')
    },
    onError: () => toast.error('Failed to create transaction'),
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionRequest }) =>
      transactionsApi.update(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.setQueryData(queryKeys.transactions.byId(updated.id), updated)
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
      toast.success('Transaction updated')
    },
    onError: () => toast.error('Failed to update transaction'),
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
      toast.success('Transaction deleted')
    },
    onError: () => toast.error('Failed to delete transaction'),
  })
}

export function useImportTransactions() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => transactionsApi.import(file),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`Imported ${result.imported} transactions${result.skipped > 0 ? `, ${result.skipped} skipped` : ''}`)
    },
    onError: () => toast.error('Import failed'),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: transactionsApi.createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.categories() })
      toast.success('Category created')
    },
    onError: () => toast.error('Failed to create category'),
  })
}
