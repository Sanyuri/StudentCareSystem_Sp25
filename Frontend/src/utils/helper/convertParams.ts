import { AttendanceRequest } from '#types/RequestModel/AttendanceRequest.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertParamsGeneric = (params?: Record<string, any>): URLSearchParams => {
  const queryParams = new URLSearchParams()

  const appendParam = (key: string, value: unknown) => {
    if (value !== undefined && value !== null) {
      if (value instanceof Date) {
        queryParams.append(key, value.toISOString())
      } else {
        queryParams.append(key, value.toString())
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processObject = (obj: Record<string, any>, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        // Đệ quy nếu giá trị là object
        processObject(value, fullKey)
      } else {
        appendParam(fullKey, value)
      }
    })
  }

  if (params) {
    processObject(params)
  }

  return queryParams
}

export const flattenAttendanceRequest = (
  attendanceRequest?: AttendanceRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  if (!attendanceRequest) {
    throw new Error('AttendanceRequest is undefined')
  }

  const { query, filter, pageNumber, pageSize } = attendanceRequest
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenedParams: Record<string, any> = {
    query,
    pageNumber,
    pageSize,
  }

  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      flattenedParams[key] = value
    })
  }

  return flattenedParams
}
