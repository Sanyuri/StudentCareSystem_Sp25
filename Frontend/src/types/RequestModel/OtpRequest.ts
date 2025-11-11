export type CreateOtpRequest = {
  email: string
}

export type VerifyChangeEmailOtpRequest = {
  email: string
  newEmail: string
  otp: string
}
