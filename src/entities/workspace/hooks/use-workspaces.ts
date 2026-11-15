import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workspacesApi } from '../api/workspaces-api'
import { queryKeys } from '@/shared/lib/query-keys'
import { useAuthStore } from '@/entities/user'
import type { CreateWorkspaceRequest, AddMemberRequest } from '@/shared/types/api'

export function useWorkspaces() {
  return useQuery({
    queryKey: queryKeys.workspaces.all(),
    queryFn: workspacesApi.list,
  })
}

export function useWorkspaceMembers() {
  return useQuery({
    queryKey: queryKeys.workspaces.members(),
    queryFn: workspacesApi.getMembers,
  })
}

export function useCreateWorkspace() {
  const qc = useQueryClient()
  const { setCurrentWorkspace } = useAuthStore()

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => workspacesApi.create(data),
    onSuccess: (workspace) => {
      qc.invalidateQueries({ queryKey: queryKeys.workspaces.all() })
      setCurrentWorkspace(workspace)
      toast.success(`Workspace "${workspace.name}" created`)
    },
    onError: () => toast.error('Failed to create workspace'),
  })
}

export function useAddMember() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: AddMemberRequest) => workspacesApi.addMember(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workspaces.members() })
      toast.success('Member added')
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message ?? 'Failed to add member'
      toast.error(msg)
    },
  })
}
