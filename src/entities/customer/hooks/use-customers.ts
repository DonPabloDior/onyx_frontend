import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { customersApi } from '../api/customers-api'
import { queryKeys } from '@/shared/lib/query-keys'
import type { CustomerFilters, CreateCustomerRequest, UpdateCustomerRequest } from '@/shared/types/api'

export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: queryKeys.customers.all(filters),
    queryFn: () => customersApi.list(filters),
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.byId(id),
    queryFn: () => customersApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => customersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer created')
    },
    onError: () => toast.error('Failed to create customer'),
  })
}

export function useUpdateCustomer() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      customersApi.update(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      qc.setQueryData(queryKeys.customers.byId(updated.id), updated)
      toast.success('Customer updated')
    },
    onError: () => toast.error('Failed to update customer'),
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => customersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer deleted')
    },
    onError: () => toast.error('Failed to delete customer'),
  })
}
