import axios, { AxiosError, AxiosInstance } from 'axios'
import { ApiResponse } from '#src/types/ResponseModel/ApiResponse.js'
import useAuthStore from '#stores/authState.js'

const AI_CONTENT_TYPE = {
  'Content-Type': 'application/json',
}

const aiAxiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
  timeout: 10000, // 10s
})

aiAxiosInstance.interceptors.request.use((config) => handleRequest(config))
aiAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => handleResponseError(error),
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleRequest(config: any) {
  const campusCode = useAuthStore.getState().campusCode

  config.headers = config.headers || {}
  config.headers['tenant-name'] = campusCode

  if (['post', 'put', 'delete'].includes(config.method || '')) {
    const originalData = config.data || {}

    if (!(originalData instanceof FormData)) {
      config.data = {
        data: originalData,
        timestamp: Date.now(),
      }
    }
  }

  return config
}

async function handleResponseError(error: AxiosError) {
  return Promise.reject(error)
}

// Common request methods
async function get<T>(url: string, params?: URLSearchParams): Promise<T> {
  return await aiAxiosInstance
    .get<ApiResponse<T>>(url, { params, headers: { ...AI_CONTENT_TYPE } })
    .then((response) => response.data.data)
}

async function post<T>(url: string, body?: object): Promise<T> {
  const response = await aiAxiosInstance.post<ApiResponse<T>>(url, body, {
    headers: {
      ...AI_CONTENT_TYPE,
    },
  })

  return response.data.data
}

export const BaseAIService = {
  get,
  post,
}
