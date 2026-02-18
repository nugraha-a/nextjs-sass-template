/**
 * Centralized HTTP client for all API calls.
 * Points to NEXT_PUBLIC_API_URL from .env.local
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`API Error ${status}: ${statusText}`)
    this.name = "ApiError"
  }
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  token?: string
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, token, headers: customHeaders, ...rest } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let errorBody: unknown
    try {
      errorBody = await response.json()
    } catch {
      errorBody = await response.text()
    }
    throw new ApiError(response.status, response.statusText, errorBody)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

/**
 * Server-side fetch — reads cookies from request
 * Used in BFF proxy routes
 */
export async function fetchApiServer<T>(
  endpoint: string,
  options: FetchOptions & { cookies?: Record<string, string> } = {}
): Promise<T> {
  const { cookies: cookieMap, ...rest } = options

  const cookieHeader = cookieMap
    ? Object.entries(cookieMap)
        .map(([k, v]) => `${k}=${v}`)
        .join("; ")
    : undefined

  if (cookieHeader && !rest.headers) {
    rest.headers = {} as Record<string, string>
  }
  if (cookieHeader) {
    ;(rest.headers as Record<string, string>)["Cookie"] = cookieHeader
  }

  return fetchApi<T>(endpoint, rest)
}
