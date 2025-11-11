// src/services/NotifyService.ts
import { NotifyToStudent } from '#src/types/RequestModel/AttendanceRequest.js'
import { NotifyRequest } from '#src/types/RequestModel/NotifyRequest.js'
import { BaseService } from './BaseService'
import { SEND_NOTIFY_ALL_URL, SEND_NOTIFY_URL } from '#utils/constants/api.js'

export const NotifyService = {
  sendNotifyAll: (value: NotifyRequest): Promise<void> => {
    return BaseService.post<void>(SEND_NOTIFY_ALL_URL, value)
  },

  sendNotify: (value: NotifyToStudent): Promise<void> => {
    return BaseService.post<void>(SEND_NOTIFY_URL, value)
  },
}
