import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '../api/auth-api'
import { useAuthStore } from '@/entities/user'
import { queryKeys } from '@/shared/lib/query-keys'
import { setAccessToken } from '@/shared/api/client'
import type { LoginRequest, RegisterRequest } from '@/shared/types/api'

export function useCurrentUser() {
  const { isAuthenticated, setUser } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const user = await authApi.me()
      setUser(user)
      return user
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
      navigate('/dashboard')
      toast.success('Welcome back!')
    },
    onError: () => {
      toast.error('Invalid email or password')
    },
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      navigate('/dashboard')
      toast.success('Account created!')
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message ?? 'Registration failed'
      toast.error(msg)
    },
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout()
      queryClient.clear()
      setAccessToken(null)
      navigate('/login')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword({ email }),
    onSuccess: () => {
      toast.success('Reset link sent — check your email')
    },
    onError: () => {
      toast.error('Failed to send reset link')
    },
  })
}

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password updated — please log in')
      navigate('/login')
    },
    onError: () => {
      toast.error('Reset link is invalid or expired')
    },
  })
}

export function useUpdateProfile() {
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (user) => {
      setUser(user)
      queryClient.setQueryData(queryKeys.auth.me(), user)
      toast.success('Profile updated')
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })
}
