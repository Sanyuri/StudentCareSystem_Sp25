import axiosRetry from 'axios-retry'
import { redirect } from 'vike/abort'
import useAuthStore from '#stores/authState.js'
import refreshToken from '#utils/helper/authenHelper.js'
import { TokenManagerService } from './TokenManagerService'
import { getTimezone } from '#utils/helper/timeZoneHelper.js'
import { API_RETRY, API_RETRY_DELAY } from '#src/configs/WebConfig.js'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { GET_CSRF_TOKEN_URL, LOGIN_URL } from '#utils/constants/api.js'
import { ApiResponse, CsrfResponse } from '#src/types/ResponseModel/ApiResponse.js'

const ECONNABORTED = 'ECONNABORTED'

const JSON_CONTENT_TYPE = {
  'Content-Type': 'application/json',
}

const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
})

axiosRetry(axiosInstance, {
  retries: API_RETRY,
  retryDelay: (retryCount: number) => retryCount * API_RETRY_DELAY,
  retryCondition: (error) => shouldRetry(error),
})

axiosInstance.interceptors.request.use((config) => handleRequest(config))
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => handleResponseError(error),
)

function shouldRetry(error: AxiosError) {
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    return false
  }
  return (error.response && error.response.status >= 500) || error.code === ECONNABORTED
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleRequest(config: any) {
  const token = useAuthStore.getState().accessToken
  const campusCode = useAuthStore.getState().campusCode

  if (TokenManagerService.shouldCheckToken(config.url)) {
    if (TokenManagerService.checkTokenValid()) {
      config.headers['StudentPsychology'] = TokenManagerService.getToken()
    }
  }

  config.headers = config.headers || {}
  config.headers['CampusCode'] = campusCode

  config.headers.Authorization = `Bearer ${token}`

  config.headers['X-Timezone'] = getTimezone()

  if (['post', 'put', 'delete'].includes(config.method || '')) {
    const originalData = config.data || {}

    // Kiểm tra nếu `config.data` là FormData (gửi file)
    if (!(originalData instanceof FormData)) {
      // Thêm timestamp cho các trường hợp khác
      config.data = {
        data: originalData,
        timestamp: Date.now(),
      }
    }
  }

  return config
}

async function handleResponseError(error: AxiosError) {
  const { data, status } = error.response as AxiosResponse
  switch (status) {
    case 400:
    case 409:
      if (data.errors) {
        const modelStateErrors: string[] = []
        for (const key in data.errors) {
          if (data.errors[key]) {
            modelStateErrors.push(data.errors[key])
          }
        }
        throw modelStateErrors.flat()
      }

      break
    case 401:
      if (data.message === 'Access token has expired.') {
        return refreshToken(error)
      }
      break
    case 403:
      break
    case 500:
      throw redirect(LOGIN_URL)
    default:
      break
  }
  return Promise.reject(error)
}

export async function getCsrfToken(): Promise<string> {
  const response = await axiosInstance.get<ApiResponse<CsrfResponse>>(GET_CSRF_TOKEN_URL)

  return response.data.data.token
}

// Common request methods
async function get<T>(url: string, params?: URLSearchParams): Promise<T> {
  return await axiosInstance
    .get<ApiResponse<T>>(url, { params, headers: { ...JSON_CONTENT_TYPE } })
    .then((response) => response.data.data)
}

async function post<T>(url: string, body?: object): Promise<T> {
  const csrfToken: string = await getCsrfToken()

  const response = await axiosInstance.post<ApiResponse<T>>(url, body, {
    headers: {
      ...JSON_CONTENT_TYPE,
      'X-CSRF-TOKEN': csrfToken,
    },
  })

  return response.data.data
}

async function put<T>(url: string, body?: object): Promise<T> {
  const csrfToken: string = await getCsrfToken()
  return await axiosInstance
    .put<ApiResponse<T>>(url, body, {
      headers: {
        ...JSON_CONTENT_TYPE,
        'X-CSRF-TOKEN': csrfToken,
      },
    })
    .then((response) => response.data.data)
}

async function del<T>(url: string, params?: URLSearchParams): Promise<T> {
  const csrfToken: string = await getCsrfToken()
  return await axiosInstance
    .delete<ApiResponse<T>>(url, {
      params,
      headers: {
        ...JSON_CONTENT_TYPE,
        'X-CSRF-TOKEN': csrfToken,
      },
    })
    .then((response) => response.data.data)
}

async function postFile<T>(url: string, body?: object): Promise<T> {
  const response = await axiosInstance.post<ApiResponse<T>>(url, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data
}

export const BaseService = {
  get,
  post,
  put,
  delete: del,
  postFile,
}
