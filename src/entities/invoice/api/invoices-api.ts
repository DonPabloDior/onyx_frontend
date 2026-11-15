import { apiClient } from '@/shared/api/client'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type {
  SingleResponse,
  PaginatedResponse,
  InvoiceOut,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceFilters,
} from '@/shared/types/api'

export const invoicesApi = {
  list: async (filters: InvoiceFilters = {}) => {
    const res = await apiClient.get<PaginatedResponse<InvoiceOut>>(ENDPOINTS.invoices.list, {
      params: filters,
    })
    return res.data
  },

  getById: async (id: string) => {
    const res = await apiClient.get<SingleResponse<InvoiceOut>>(ENDPOINTS.invoices.byId(id))
    return res.data.data
  },

  create: async (data: CreateInvoiceRequest) => {
    const res = await apiClient.post<SingleResponse<InvoiceOut>>(ENDPOINTS.invoices.create, data)
    return res.data.data
  },

  update: async (id: string, data: UpdateInvoiceRequest) => {
    const res = await apiClient.patch<SingleResponse<InvoiceOut>>(
      ENDPOINTS.invoices.byId(id),
      data
    )
    return res.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(ENDPOINTS.invoices.byId(id))
  },

  send: async (id: string) => {
    const res = await apiClient.post<SingleResponse<InvoiceOut>>(ENDPOINTS.invoices.send(id))
    return res.data.data
  },

  remind: async (id: string) => {
    const res = await apiClient.post<SingleResponse<{ message: string }>>(
      ENDPOINTS.invoices.remind(id)
    )
    return res.data.data
  },

  cancel: async (id: string) => {
    const res = await apiClient.post<SingleResponse<InvoiceOut>>(ENDPOINTS.invoices.cancel(id))
    return res.data.data
  },

  getPdf: async (id: string) => {
    const res = await apiClient.get<SingleResponse<{ message: string; invoice_id: string }>>(
      ENDPOINTS.invoices.pdf(id)
    )
    return res.data.data
  },
}
