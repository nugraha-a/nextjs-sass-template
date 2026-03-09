import { fetchApi } from "./http-client"
import { revalidateTag } from "next/cache"
import type {
  ApiClient,
  ApiClientWithSecret,
  CreateClientDto,
  UpdateClientDto,
  UsageStats,
  Endpoint,
} from "./types"

export const apiClientsApi = {
  list(token: string) {
    return fetchApi<ApiClient[]>("/api-clients", {
      token,
      next: { tags: ["api-clients"] },
    })
  },

  async create(data: CreateClientDto, token: string) {
    const result = await fetchApi<ApiClientWithSecret>("/api-clients", {
      method: "POST",
      body: data,
      token,
    })
    revalidateTag("api-clients", "max")
    return result
  },

  async update(id: string, data: UpdateClientDto, token: string) {
    const result = await fetchApi<ApiClient>(`/api-clients/${id}`, {
      method: "PATCH",
      body: data,
      token,
    })
    revalidateTag("api-clients", "max")
    return result
  },

  async revoke(id: string, token: string) {
    const result = await fetchApi<void>(`/api-clients/${id}/revoke`, {
      method: "POST",
      token,
    })
    revalidateTag("api-clients", "max")
    return result
  },

  async regenerateSecret(id: string, token: string) {
    const result = await fetchApi<ApiClientWithSecret>(`/api-clients/${id}/regenerate`, {
      method: "POST",
      token,
    })
    revalidateTag("api-clients", "max")
    return result
  },

  getUsage(id: string, period: string, token: string) {
    return fetchApi<UsageStats>(`/api-clients/${id}/usage?period=${period}`, {
      token,
      next: { tags: ["api-clients"] },
    })
  },

  listEndpoints(token: string) {
    return fetchApi<Endpoint[]>("/api-clients/endpoints", {
      token,
      next: { tags: ["api-clients"] },
    })
  },
}
