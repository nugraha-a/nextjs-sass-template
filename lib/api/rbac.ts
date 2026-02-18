import { fetchApi } from "./http-client"
import type { Role, Permission, CreateRoleDto, UpdateRoleDto } from "./types"

export const rbacApi = {
  listRoles(token: string) {
    return fetchApi<Role[]>("/roles", { token })
  },

  getRole(id: string, token: string) {
    return fetchApi<Role>(`/roles/${id}`, { token })
  },

  createRole(data: CreateRoleDto, token: string) {
    return fetchApi<Role>("/roles", {
      method: "POST",
      body: data,
      token,
    })
  },

  updateRole(id: string, data: UpdateRoleDto, token: string) {
    return fetchApi<Role>(`/roles/${id}`, {
      method: "PATCH",
      body: data,
      token,
    })
  },

  deleteRole(id: string, token: string) {
    return fetchApi<void>(`/roles/${id}`, { method: "DELETE", token })
  },

  listPermissions(token: string) {
    return fetchApi<Permission[]>("/permissions", { token })
  },

  setRolePermissions(roleId: string, permissionIds: string[], token: string) {
    return fetchApi<void>(`/roles/${roleId}/permissions`, {
      method: "PUT",
      body: { permissionIds },
      token,
    })
  },
}
