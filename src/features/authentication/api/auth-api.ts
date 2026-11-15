import { apiClient } from '@/shared/api/client'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type {
  SingleResponse,
  AuthResponse,
  TokenResponse,
  UserOut,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
} from '@/shared/types/api'

export const authApi = {
  register: async (data: RegisterRequest) => {
    const res = await apiClient.post<SingleResponse<AuthResponse>>(ENDPOINTS.auth.register, data)
    return res.data.data
  },

  login: async (data: LoginRequest) => {
    const res = await apiClient.post<SingleResponse<AuthResponse>>(ENDPOINTS.auth.login, data)
    return res.data.data
  },

  refresh: async () => {
    const res = await apiClient.post<SingleResponse<TokenResponse>>(ENDPOINTS.auth.refresh)
    return res.data.data
  },

  logout: async () => {
    await apiClient.post(ENDPOINTS.auth.logout)
  },

  me: async () => {
    const res = await apiClient.get<SingleResponse<UserOut>>(ENDPOINTS.auth.me)
    return res.data.data
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    await apiClient.post(ENDPOINTS.auth.forgotPassword, data)
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    await apiClient.post(ENDPOINTS.auth.resetPassword, data)
  },

  updateMe: async (data: UpdateUserRequest) => {
    const res = await apiClient.patch<SingleResponse<UserOut>>(ENDPOINTS.users.me, data)
    return res.data.data
  },
}
