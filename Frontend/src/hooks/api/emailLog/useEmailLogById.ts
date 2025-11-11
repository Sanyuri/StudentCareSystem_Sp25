import { EmailLogService } from '#src/services/EmailLogService.js'
import { EmailLogResponse } from '#src/types/ResponseModel/EmailLogResponse.js'
import { useQuery } from '@tanstack/react-query'

export const useEmailLogById = (id: string, enabled: boolean = true) => {
  return useQuery<EmailLogResponse, Error>({
    queryKey: ['emailLog', id], // Key để react-query quản lý cache
    queryFn: () => EmailLogService.getById(id), // Gọi API
    enabled: !!id && enabled, // Chỉ fetch khi ID hợp lệ và enabled = true
    staleTime: 5 * 60 * 1000, // Cache sẽ "fresh" trong 5 phút
    retry: 1, // Thử lại 1 lần nếu fetch thất bại
  })
}
