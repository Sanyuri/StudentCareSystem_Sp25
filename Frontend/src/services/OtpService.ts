import {
  CreateOtpRequest,
  VerifyChangeEmailOtpRequest,
} from '#src/types/RequestModel/OtpRequest.js'
import { BaseService } from './BaseService'

const CREATE_CHANGE_EMAIL_URL = '_proxy/api/otp/change-email'
const VERIFY_CHANGE_EMAIL_OTP_URL = '_proxy/api/otp/change-email/verify'
export const OtpService = {
  sendChangeEmailRequest(email: CreateOtpRequest) {
    return BaseService.post(CREATE_CHANGE_EMAIL_URL, email)
  },
  verifyChangeEmailOtpRequest(otp: VerifyChangeEmailOtpRequest) {
    return BaseService.post(VERIFY_CHANGE_EMAIL_OTP_URL, otp)
  },
}
