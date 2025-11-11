import { LoginRequest } from '#src/types/RequestModel/AuthenRequest.js'
import useAuthStore from '#stores/authState.js'
import { AccountService } from '#src/services/AccountService.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { LoginResponse } from '#types/ResponseModel/ApiResponse.js'

export const useLoginMutation = () => {
  const { setAuthData } = useAuthStore()

  return useGenericMutation<LoginRequest, LoginResponse>(
    async (loginRequest: LoginRequest): Promise<LoginResponse> => {
      const loginResponse: LoginResponse = await AccountService.login(loginRequest)

      // Set authentication data
      setAuthData(
        loginResponse.jwtToken,
        loginResponse.refreshToken,
        loginResponse.role,
        loginResponse.name,
        loginResponse.email,
        loginResponse.image,
      )

      // Add refresh token to the backend
      await AccountService.addRefreshToken({
        refreshToken: loginResponse.refreshToken,
        accessToken: loginResponse.jwtToken,
      })

      return loginResponse
    },
    'LOGIN.LOGIN_SUCCESS', // Success toast translation key
    'LOGIN.LOGIN_FAIL', // Error toast translation key
    [], // No specific queries to invalidate here
  )
}
