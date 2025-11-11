export type LoginRequest = {
  code: string | undefined
  campusCode: string | null
  reCaptcha: string | undefined
}

export type LogoutRequest = {
  refreshToken: string | null
  accessToken: string | null
}
