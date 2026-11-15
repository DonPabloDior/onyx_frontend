import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { invoicesApi } from '../api/invoices-api'
import { queryKeys } from '@/shared/lib/query-keys'
import type { InvoiceFilters, CreateInvoiceRequest, UpdateInvoiceRequest } from '@/shared/types/api'

export function useInvoices(filters: InvoiceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.invoices.all(filters),
    queryFn: () => invoicesApi.list(filters),
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoices.byId(id),
    queryFn: () => invoicesApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) => invoicesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
      toast.success('Invoice created')
    },
    onError: () => toast.error('Failed to create invoice'),
  })
}

export function useUpdateInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceRequest }) =>
      invoicesApi.update(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.setQueryData(queryKeys.invoices.byId(updated.id), updated)
      toast.success('Invoice updated')
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message ?? 'Failed to update invoice'
      toast.error(msg)
    },
  })
}

export function useDeleteInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => invoicesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
      toast.success('Invoice deleted')
    },
    onError: () => toast.error('Only draft invoices can be deleted'),
  })
}

export function useSendInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => invoicesApi.send(id),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.setQueryData(queryKeys.invoices.byId(updated.id), updated)
      toast.success('Invoice sent')
    },
    onError: () => toast.error('Failed to send invoice'),
  })
}

export function useRemindInvoice() {
  return useMutation({
    mutationFn: (id: string) => invoicesApi.remind(id),
    onSuccess: (data) => toast.success(data.message),
    onError: () => toast.error('Failed to send reminder'),
  })
}

export function useCancelInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => invoicesApi.cancel(id),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.setQueryData(queryKeys.invoices.byId(updated.id), updated)
      toast.success('Invoice cancelled')
    },
    onError: () => toast.error('Failed to cancel invoice'),
  })
}

export function useGenerateInvoicePdf() {
  return useMutation({
    mutationFn: (id: string) => invoicesApi.getPdf(id),
    onSuccess: (data) => toast.success(data.message),
    onError: () => toast.error('Failed to generate PDF'),
  })
}
