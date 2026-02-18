import { fetchApi } from "./http-client"
import type {
  User,
  UserListParams,
  PaginatedResult,
  InviteUserDto,
  UpdateUserDto,
} from "./types"

export const usersApi = {
  list(params: UserListParams, token: string) {
    const query = new URLSearchParams()
    if (params.page) query.set("page", String(params.page))
    if (params.limit) query.set("limit", String(params.limit))
    if (params.search) query.set("search", params.search)
    if (params.role) query.set("role", params.role)
    if (params.status) query.set("status", params.status)
    return fetchApi<PaginatedResult<User>>(`/users?${query}`, { token })
  },

  getById(id: string, token: string) {
    return fetchApi<User>(`/users/${id}`, { token })
  },

  invite(data: InviteUserDto, token: string) {
    return fetchApi<void>("/users/invite", {
      method: "POST",
      body: data,
      token,
    })
  },

  update(id: string, data: UpdateUserDto, token: string) {
    return fetchApi<User>(`/users/${id}`, {
      method: "PATCH",
      body: data,
      token,
    })
  },

  suspend(id: string, token: string) {
    return fetchApi<void>(`/users/${id}/suspend`, { method: "POST", token })
  },

  reactivate(id: string, token: string) {
    return fetchApi<void>(`/users/${id}/reactivate`, { method: "POST", token })
  },

  delete(id: string, token: string) {
    return fetchApi<void>(`/users/${id}`, { method: "DELETE", token })
  },

  resendInvite(id: string, token: string) {
    return fetchApi<void>(`/users/${id}/resend-invite`, { method: "POST", token })
  },
}
