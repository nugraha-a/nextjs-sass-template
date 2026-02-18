import { fetchApi } from "./http-client"
import type {
  LoginResult,
  ForgotPasswordResult,
  OtpResult,
  OtpChannel,
  TokenResult,
  User,
} from "./types"

export const authApi = {
  login(email: string, password: string) {
    return fetchApi<LoginResult>("/auth/login", {
      method: "POST",
      body: { email, password },
    })
  },

  loginWithGoogle(idToken: string) {
    return fetchApi<LoginResult>("/auth/google", {
      method: "POST",
      body: { idToken },
    })
  },

  logout(refreshToken: string) {
    return fetchApi<void>("/auth/logout", {
      method: "POST",
      body: { refreshToken },
    })
  },

  forgotPassword(identifier: string, channel: OtpChannel) {
    return fetchApi<ForgotPasswordResult>("/auth/forgot-password", {
      method: "POST",
      body: { identifier, channel },
    })
  },

  verifyOtp(code: string, verificationToken: string) {
    return fetchApi<OtpResult>("/auth/verify-otp", {
      method: "POST",
      body: { code, verificationToken },
    })
  },

  resetPassword(resetToken: string, newPassword: string) {
    return fetchApi<void>("/auth/reset-password", {
      method: "POST",
      body: { resetToken, newPassword },
    })
  },

  refreshToken(refreshToken: string) {
    return fetchApi<LoginResult>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    })
  },

  getMe(token: string) {
    return fetchApi<User>("/auth/me", { token })
  },
}
