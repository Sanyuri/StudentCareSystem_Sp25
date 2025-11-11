import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { SubEmailService } from '#src/services/SubEmailService.js'
import { SubEmailDetailRequest } from '#types/RequestModel/SubEmailRequest.js'

export const useSubEmailTemplateData = (
  subject: string,
  emailType: string | undefined,
  currentPage: number,
  pageSize: number,
) => {
  return useQuery({
    queryKey: ['sub-email-template', subject, emailType, currentPage, pageSize],
    queryFn: () => SubEmailService.list({ subject, emailType, currentPage, pageSize }),
    placeholderData: keepPreviousData,
  })
}

export const useDetailSubEmailTemplateData = (subEmailRequest: SubEmailDetailRequest) => {
  return useQuery({
    queryKey: ['sub-email-detail', subEmailRequest.id],
    queryFn: () => SubEmailService.detail(subEmailRequest),
    placeholderData: keepPreviousData,
    enabled: !!subEmailRequest.id,
  })
}
