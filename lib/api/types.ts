// ─── Shared Types ───

export type OtpChannel = "email" | "sms" | "whatsapp"
export type UserStatus = "active" | "pending" | "suspended" | "deleted"
export type ApiClientStatus = "active" | "expired" | "revoked"

// ─── Auth ───

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  has2FA: boolean
  googleId?: string
  workspaces: WorkspaceMembership[]
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  user: User
  requires2FA?: boolean
  verificationToken?: string
}

export interface ForgotPasswordResult {
  verificationToken: string
  maskedContact: string
  channel: OtpChannel
}

export interface OtpResult {
  resetToken?: string
  accessToken?: string
  refreshToken?: string
  user?: User
}

export interface TokenResult {
  accessToken: string
}

export interface Setup2FAResult {
  verificationToken: string
  qrCodeUrl?: string
  maskedContact: string
}

// ─── Workspace ───

export interface Workspace {
  id: string
  name: string
  slug: string
  logoUrl?: string
  memberCount?: number
  createdAt: string
}

export interface WorkspaceMembership {
  workspaceId: string
  workspace: Workspace
  roleId: string
  role: Role
  joinedAt: string
  status: "active" | "suspended"
}

// ─── RBAC ───

export interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean
  permissions: Permission[]
  userCount: number
}

export interface Permission {
  id: string
  resource: string
  action: "view" | "create" | "edit" | "delete"
}

export interface CreateRoleDto {
  name: string
  description: string
  permissionIds: string[]
}

export interface UpdateRoleDto {
  name?: string
  description?: string
}

// ─── Users ───

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: UserStatus
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface InviteUserDto {
  email: string
  roleId: string
}

export interface UpdateUserDto {
  name?: string
  roleId?: string
}

// ─── API Clients ───

export interface ApiClient {
  id: string
  name: string
  clientId: string
  status: ApiClientStatus
  rateLimit: number
  expiresAt?: string
  lastUsedAt?: string
  endpointCount: number
  totalEndpoints: number
  createdAt: string
}

export interface ApiClientWithSecret extends ApiClient {
  clientSecret: string
}

export interface Endpoint {
  id: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  group: string
  description?: string
}

export interface CreateClientDto {
  name: string
  rateLimit: number
  expiresInDays?: number
  endpointIds: string[]
}

export interface UpdateClientDto {
  name?: string
  rateLimit?: number
  endpointIds?: string[]
}

export interface UsageStats {
  totalRequests: number
  successRate: number
  avgLatency: number
  dailyStats: { date: string; requests: number }[]
}

// ─── Security ───

export interface Session {
  id: string
  device: string
  browser: string
  os: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface ConnectedAccount {
  provider: "google"
  email: string
  connectedAt: string
}

// ─── Permission Groups (for UI) ───

export const permissionGroups = [
  { label: "Platform", resources: ["dashboard", "users", "roles", "api-clients"] },
  { label: "Operations", resources: ["configuration", "workflow", "notifications"] },
  { label: "Business", resources: ["finance", "hcm", "scm", "programs"] },
  { label: "Audit", resources: ["audit-log", "reports"] },
] as const
