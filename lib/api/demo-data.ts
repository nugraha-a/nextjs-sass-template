/**
 * Demo mode mock data.
 * When DEMO_MODE=true (server-side env), demo login is enabled.
 *
 * SECURITY PRINCIPLES:
 * 1. Uses server-side only env var (not NEXT_PUBLIC_) — never leaks to client bundle
 * 2. Demo login requires specific email (demo@company.com)
 * 3. All security headers and CSRF protection remain active
 * 4. File uploads are blocked in demo sessions (read-only)
 * 5. Demo sessions have 1-hour TTL (vs 7-day for normal sessions)
 */

import type {
  User,
  Workspace,
  WorkspaceMembership,
  Role,
  Permission,
  Session,
  ConnectedAccount,
  ApiClient,
  Endpoint,
} from "./types"

// ─── Server-side only demo flag ───
// DEMO_MODE (not NEXT_PUBLIC_) — safe for production
export const IS_DEMO = process.env.DEMO_MODE === "true"

// ─── Demo Credentials ───
export const DEMO_EMAIL = "demo@company.com"

// ─── Demo User ───

export const DEMO_USER: User = {
  id: "demo-user-001",
  email: DEMO_EMAIL,
  name: "Demo User",
  avatarUrl: undefined,
  has2FA: false,
  workspaces: [],
}

// ─── Demo Workspaces ───

export const DEMO_WORKSPACES: Workspace[] = [
  {
    id: "ws-acme",
    name: "Acme Corporation",
    slug: "acme",
    memberCount: 24,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "ws-yayasan",
    name: "Yayasan Al Ma'soem",
    slug: "yayasan",
    memberCount: 48,
    createdAt: "2024-03-01T00:00:00Z",
  },
]

export const DEMO_ACTIVE_WORKSPACE = DEMO_WORKSPACES[0]

// ─── Demo Roles ───

export const DEMO_ROLES: Role[] = [
  {
    id: "role-superadmin",
    name: "Super Admin",
    description: "Full system access",
    isSystem: true,
    userCount: 2,
    permissions: [],
  },
  {
    id: "role-admin",
    name: "Admin",
    description: "Manage workspace settings and users",
    isSystem: true,
    userCount: 5,
    permissions: [],
  },
  {
    id: "role-editor",
    name: "Editor",
    description: "Create and edit content",
    isSystem: false,
    userCount: 12,
    permissions: [],
  },
  {
    id: "role-viewer",
    name: "Viewer",
    description: "View-only access",
    isSystem: false,
    userCount: 20,
    permissions: [],
  },
]

// ─── Demo Permissions ───

const resources = [
  "dashboard", "users", "roles", "api-clients",
  "configuration", "workflow", "notifications",
  "finance", "hcm", "scm", "programs",
  "audit-log", "reports",
]
const actions = ["view", "create", "edit", "delete"] as const

export const DEMO_PERMISSIONS: Permission[] = resources.flatMap((resource) =>
  actions.map((action) => ({
    id: `perm-${resource}-${action}`,
    resource,
    action,
  }))
)

// ─── Demo Users (workspace members) ───

export const DEMO_MEMBERS = [
  { id: "u1", name: "John Doe", email: "john@acme.com", role: "Super Admin", status: "active" as const, initials: "JD", avatarUrl: undefined, has2FA: true, workspaces: [] as WorkspaceMembership[] },
  { id: "u2", name: "Ana Smith", email: "ana@acme.com", role: "Admin", status: "active" as const, initials: "AS", avatarUrl: undefined, has2FA: false, workspaces: [] as WorkspaceMembership[] },
  { id: "u3", name: "Bob Wilson", email: "bob@acme.com", role: "Editor", status: "active" as const, initials: "BW", avatarUrl: undefined, has2FA: false, workspaces: [] as WorkspaceMembership[] },
  { id: "u4", name: "Carol Lee", email: "carol@acme.com", role: "Editor", status: "pending" as const, initials: "CL", avatarUrl: undefined, has2FA: false, workspaces: [] as WorkspaceMembership[] },
  { id: "u5", name: "David Kim", email: "david@acme.com", role: "Viewer", status: "active" as const, initials: "DK", avatarUrl: undefined, has2FA: false, workspaces: [] as WorkspaceMembership[] },
  { id: "u6", name: "Eka Putri", email: "eka@acme.com", role: "Viewer", status: "suspended" as const, initials: "EP", avatarUrl: undefined, has2FA: false, workspaces: [] as WorkspaceMembership[] },
]

// ─── Demo Sessions ───

export const DEMO_SESSIONS: Session[] = [
  { id: "s1", device: "Chrome", browser: "Chrome 122", os: "Windows 11", location: "Bandung, ID", lastActive: "Now", isCurrent: true },
  { id: "s2", device: "Safari", browser: "Safari 17", os: "macOS 14", location: "Jakarta, ID", lastActive: "1 hour ago", isCurrent: false },
  { id: "s3", device: "Firefox", browser: "Firefox 123", os: "Ubuntu 22", location: "Surabaya, ID", lastActive: "3 days ago", isCurrent: false },
]

// ─── Demo Connected Accounts ───

export const DEMO_CONNECTED_ACCOUNTS: ConnectedAccount[] = []

// ─── Demo API Clients ───

export const DEMO_API_CLIENTS: ApiClient[] = [
  {
    id: "ac1",
    name: "Production App",
    clientId: "ck_prod_a1b2c3d4e5f6",
    status: "active",
    rateLimit: 1000,
    expiresAt: "2026-01-15T00:00:00Z",
    lastUsedAt: "2 hours ago",
    endpointCount: 12,
    totalEndpoints: 15,
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "ac2",
    name: "Mobile App",
    clientId: "ck_mob_g7h8i9j0k1l2",
    status: "active",
    rateLimit: 500,
    lastUsedAt: "5 min ago",
    endpointCount: 8,
    totalEndpoints: 15,
    createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "ac3",
    name: "Legacy Integration",
    clientId: "ck_leg_m3n4o5p6q7r8",
    status: "expired",
    rateLimit: 100,
    lastUsedAt: "3 months ago",
    endpointCount: 4,
    totalEndpoints: 15,
    createdAt: "2024-10-05T00:00:00Z",
  },
]

export const DEMO_ENDPOINTS: Endpoint[] = [
  { id: "ep1", method: "GET", path: "/users", group: "Users", description: "List users" },
  { id: "ep2", method: "POST", path: "/users", group: "Users", description: "Create user" },
  { id: "ep3", method: "GET", path: "/finance/reports", group: "Finance", description: "List reports" },
  { id: "ep4", method: "GET", path: "/workflow/tasks", group: "Workflow", description: "List tasks" },
  { id: "ep5", method: "POST", path: "/workflow/tasks", group: "Workflow", description: "Create task" },
]

// ─── Demo Token (fake JWT-like string) ───

export const DEMO_ACCESS_TOKEN = "demo.access.token"
export const DEMO_REFRESH_TOKEN = "demo.refresh.token"
