import axios, { AxiosError } from 'axios'
import useAuthStore from '#stores/authState.js'
import { RefreshTokenResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { navigate } from 'vike/client/router'
import { LogoutRequest } from '#src/types/RequestModel/AuthenRequest.js'
import { toast } from 'react-toastify'
import { AccountService } from '#src/services/AccountService.js'
import { getCsrfToken } from '#src/services/BaseService.js'
import { LOGIN_PATH } from '#utils/constants/path.js'

export const logout = async (): Promise<void> => {
  const { accessToken, clearTokens } = useAuthStore.getState()
  try {
    const refreshToken: string = await AccountService.getRefreshToken()
    const logoutRequest: LogoutRequest = {
      refreshToken: refreshToken,
      accessToken: accessToken,
    }
    await AccountService.logout(logoutRequest)
    clearTokens()
    await AccountService.removeRefreshToken()
  } catch (error) {
    clearTokens()
  } finally {
    await navigate(LOGIN_PATH)
    toast.success('Đăng xuất thành công')
  }
}

const handleExpireToken = async (): Promise<void> => {
  const { clearTokens } = useAuthStore.getState()
  try {
    clearTokens()
    await AccountService.removeRefreshToken()
  } catch (error) {
    clearTokens()
  } finally {
    await navigate(LOGIN_PATH)
  }
}
const refreshToken = async (error: AxiosError) => {
  const refreshToken: string = await AccountService.getRefreshToken()
  if (!refreshToken) {
    await handleExpireToken()
    return
  }
  try {
    const data: RefreshTokenResponse = await AccountService.refreshToken({
      refreshToken: refreshToken,
      accessToken: useAuthStore.getState().accessToken,
    })

    await AccountService.addRefreshToken({
      refreshToken: refreshToken,
      accessToken: data.accessToken,
    })

    useAuthStore.getState().updateToken(data.accessToken, data.refreshToken)

    let updatedConfig = {
      ...error.config,
      headers: {
        ...error.config?.headers,
        Authorization: 'Bearer ' + data.accessToken,
        skipTimestamp: true,
        'X-CSRF-TOKEN': '',
      },
    }

    // Nếu yêu cầu là GET, xử lý tham số params thay vì data
    if (updatedConfig.method === 'get') {
      updatedConfig = {
        ...updatedConfig,
        params: error.config?.params,
        data: undefined,
      }
    } else {
      // Đối với các phương thức khác (POST, PUT, DELETE), giữ nguyên xử lý data
      let updatedData = error.config?.data
      if (typeof updatedData === 'string') {
        updatedData = JSON.parse(updatedData)
      }
      const csrfToken = await getCsrfToken()
      updatedConfig = {
        ...updatedConfig,
        data: updatedData,
        headers: {
          ...updatedConfig.headers,
          'X-CSRF-TOKEN': csrfToken,
        },
      }
    }

    // Gửi lại yêu cầu với cấu hình mới
    return axios(updatedConfig)
  } catch (error) {
    await handleExpireToken()
    return
  }
}

export default refreshToken
