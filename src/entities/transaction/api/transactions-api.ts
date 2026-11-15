import { apiClient } from '@/shared/api/client'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type {
  SingleResponse,
  PaginatedResponse,
  TransactionOut,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
  CategoryOut,
  CreateCategoryRequest,
  ImportResult,
} from '@/shared/types/api'

export const transactionsApi = {
  list: async (filters: TransactionFilters = {}) => {
    const res = await apiClient.get<PaginatedResponse<TransactionOut>>(ENDPOINTS.transactions.list, {
      params: filters,
    })
    return res.data
  },

  getById: async (id: string) => {
    const res = await apiClient.get<SingleResponse<TransactionOut>>(
      ENDPOINTS.transactions.byId(id)
    )
    return res.data.data
  },

  create: async (data: CreateTransactionRequest) => {
    const res = await apiClient.post<SingleResponse<TransactionOut>>(
      ENDPOINTS.transactions.create,
      data
    )
    return res.data.data
  },

  update: async (id: string, data: UpdateTransactionRequest) => {
    const res = await apiClient.patch<SingleResponse<TransactionOut>>(
      ENDPOINTS.transactions.byId(id),
      data
    )
    return res.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(ENDPOINTS.transactions.byId(id))
  },

  import: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.post<SingleResponse<ImportResult>>(
      ENDPOINTS.transactions.import,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data.data
  },

  getCategories: async () => {
    const res = await apiClient.get<SingleResponse<CategoryOut[]>>(
      ENDPOINTS.transactions.categoriesAll
    )
    return res.data.data
  },

  createCategory: async (data: CreateCategoryRequest) => {
    const res = await apiClient.post<SingleResponse<CategoryOut>>(
      ENDPOINTS.transactions.createCategory,
      data
    )
    return res.data.data
  },
}
