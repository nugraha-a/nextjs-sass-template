import { fetchApi } from "./http-client"
import type { Workspace } from "./types"

export const workspacesApi = {
  list(token: string) {
    return fetchApi<Workspace[]>("/workspaces", { token })
  },

  switchWorkspace(workspaceId: string, token: string) {
    return fetchApi<void>(`/workspaces/${workspaceId}/switch`, {
      method: "POST",
      token,
    })
  },

  getCurrent(token: string) {
    return fetchApi<Workspace>("/workspaces/current", { token })
  },
}
