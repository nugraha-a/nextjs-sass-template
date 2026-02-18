import { fetchApi } from "./http-client"
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
    return fetchApi<ApiClient[]>("/api-clients", { token })
  },

  create(data: CreateClientDto, token: string) {
    return fetchApi<ApiClientWithSecret>("/api-clients", {
      method: "POST",
      body: data,
      token,
    })
  },

  update(id: string, data: UpdateClientDto, token: string) {
    return fetchApi<ApiClient>(`/api-clients/${id}`, {
      method: "PATCH",
      body: data,
      token,
    })
  },

  revoke(id: string, token: string) {
    return fetchApi<void>(`/api-clients/${id}/revoke`, {
      method: "POST",
      token,
    })
  },

  regenerateSecret(id: string, token: string) {
    return fetchApi<ApiClientWithSecret>(`/api-clients/${id}/regenerate`, {
      method: "POST",
      token,
    })
  },

  getUsage(id: string, period: string, token: string) {
    return fetchApi<UsageStats>(`/api-clients/${id}/usage?period=${period}`, {
      token,
    })
  },

  listEndpoints(token: string) {
    return fetchApi<Endpoint[]>("/api-clients/endpoints", { token })
  },
}
