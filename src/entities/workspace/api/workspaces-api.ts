import { apiClient } from '@/shared/api/client'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type {
  SingleResponse,
  PaginatedResponse,
  WorkspaceOut,
  CreateWorkspaceRequest,
  MemberOut,
  AddMemberRequest,
} from '@/shared/types/api'

export const workspacesApi = {
  list: async () => {
    const res = await apiClient.get<SingleResponse<WorkspaceOut[]>>(ENDPOINTS.workspaces.list)
    return res.data.data
  },

  create: async (data: CreateWorkspaceRequest) => {
    const res = await apiClient.post<SingleResponse<WorkspaceOut>>(
      ENDPOINTS.workspaces.create,
      data
    )
    return res.data.data
  },

  getMembers: async () => {
    const res = await apiClient.get<PaginatedResponse<MemberOut>>(
      ENDPOINTS.workspaces.currentMembers
    )
    return res.data
  },

  addMember: async (data: AddMemberRequest) => {
    const res = await apiClient.post<SingleResponse<MemberOut>>(
      ENDPOINTS.workspaces.addMember,
      data
    )
    return res.data.data
  },
}
