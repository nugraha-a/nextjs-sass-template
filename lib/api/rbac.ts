import { fetchApi } from "./http-client"
import { revalidateTag } from "next/cache"
import type { Role, Permission, CreateRoleDto, UpdateRoleDto } from "./types"

export const rbacApi = {
  listRoles(token: string) {
    return fetchApi<Role[]>("/roles", {
      token,
      next: { tags: ["roles"] },
    })
  },

  getRole(id: string, token: string) {
    return fetchApi<Role>(`/roles/${id}`, {
      token,
      next: { tags: ["roles"] },
    })
  },

  async createRole(data: CreateRoleDto, token: string) {
    const result = await fetchApi<Role>("/roles", {
      method: "POST",
      body: data,
      token,
    })
    revalidateTag("roles", "max")
    return result
  },

  async updateRole(id: string, data: UpdateRoleDto, token: string) {
    const result = await fetchApi<Role>(`/roles/${id}`, {
      method: "PATCH",
      body: data,
      token,
    })
    revalidateTag("roles", "max")
    return result
  },

  async deleteRole(id: string, token: string) {
    const result = await fetchApi<void>(`/roles/${id}`, { method: "DELETE", token })
    revalidateTag("roles", "max")
    return result
  },

  listPermissions(token: string) {
    return fetchApi<Permission[]>("/permissions", {
      token,
      next: { tags: ["permissions"] },
    })
  },

  async setRolePermissions(roleId: string, permissionIds: string[], token: string) {
    const result = await fetchApi<void>(`/roles/${roleId}/permissions`, {
      method: "PUT",
      body: { permissionIds },
      token,
    })
    revalidateTag("roles", "max")
    return result
  },
}
