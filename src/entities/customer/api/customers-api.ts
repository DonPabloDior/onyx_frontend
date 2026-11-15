import { apiClient } from '@/shared/api/client'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type {
  SingleResponse,
  PaginatedResponse,
  CustomerOut,
  CustomerDetailOut,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerFilters,
} from '@/shared/types/api'

export const customersApi = {
  list: async (filters: CustomerFilters = {}) => {
    const res = await apiClient.get<PaginatedResponse<CustomerOut>>(ENDPOINTS.customers.list, {
      params: filters,
    })
    return res.data
  },

  getById: async (id: string) => {
    const res = await apiClient.get<SingleResponse<CustomerDetailOut>>(
      ENDPOINTS.customers.byId(id)
    )
    return res.data.data
  },

  create: async (data: CreateCustomerRequest) => {
    const res = await apiClient.post<SingleResponse<CustomerOut>>(ENDPOINTS.customers.create, data)
    return res.data.data
  },

  update: async (id: string, data: UpdateCustomerRequest) => {
    const res = await apiClient.patch<SingleResponse<CustomerOut>>(
      ENDPOINTS.customers.byId(id),
      data
    )
    return res.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(ENDPOINTS.customers.byId(id))
  },
}
