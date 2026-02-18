import { fetchApi } from "./http-client"
import type {
  OtpChannel,
  Setup2FAResult,
  Session,
  ConnectedAccount,
} from "./types"

export const securityApi = {
  enable2FA(method: OtpChannel, token: string) {
    return fetchApi<Setup2FAResult>("/security/2fa/enable", {
      method: "POST",
      body: { method },
      token,
    })
  },

  verify2FASetup(code: string, token: string) {
    return fetchApi<void>("/security/2fa/verify", {
      method: "POST",
      body: { code },
      token,
    })
  },

  disable2FA(token: string) {
    return fetchApi<void>("/security/2fa/disable", {
      method: "POST",
      token,
    })
  },

  changePassword(currentPassword: string, newPassword: string, token: string) {
    return fetchApi<void>("/security/password", {
      method: "PUT",
      body: { currentPassword, newPassword },
      token,
    })
  },

  listSessions(token: string) {
    return fetchApi<Session[]>("/security/sessions", { token })
  },

  revokeSession(sessionId: string, token: string) {
    return fetchApi<void>(`/security/sessions/${sessionId}`, {
      method: "DELETE",
      token,
    })
  },

  revokeAllSessions(token: string) {
    return fetchApi<void>("/security/sessions", {
      method: "DELETE",
      token,
    })
  },

  getConnectedAccounts(token: string) {
    return fetchApi<ConnectedAccount[]>("/security/connected-accounts", {
      token,
    })
  },

  disconnectAccount(provider: string, token: string) {
    return fetchApi<void>(`/security/connected-accounts/${provider}`, {
      method: "DELETE",
      token,
    })
  },
}
