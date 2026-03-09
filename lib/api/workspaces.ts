import { fetchApi } from "./http-client"
import { revalidateTag } from "next/cache"
import type { Workspace } from "./types"

export const workspacesApi = {
  list(token: string) {
    return fetchApi<Workspace[]>("/workspaces", {
      token,
      next: { tags: ["workspaces"] },
    })
  },

  async switchWorkspace(workspaceId: string, token: string) {
    const result = await fetchApi<void>(`/workspaces/${workspaceId}/switch`, {
      method: "POST",
      token,
    })
    revalidateTag("workspaces", "max")
    return result
  },

  getCurrent(token: string) {
    return fetchApi<Workspace>("/workspaces/current", {
      token,
      next: { tags: ["workspaces"] },
    })
  },
}
