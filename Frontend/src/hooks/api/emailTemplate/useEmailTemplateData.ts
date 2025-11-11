import { EmailTemplateService } from '#src/services/EmailTemplateService.js'
import { EmailTemplate } from '#src/types/RequestModel/EmailTemplateRequest.js'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useEmailTemplateData = (
  subject: string,
  emailType: string | undefined,
  currentPage: number,
  pageSize: number,
) => {
  return useQuery({
    queryKey: ['email-template', subject, emailType, currentPage, pageSize],
    queryFn: () => EmailTemplateService.list({ subject, emailType, currentPage, pageSize }),
    placeholderData: keepPreviousData,
  })
}

export const useDetailEmailTemplateData = (emailTemplateRequest: EmailTemplate) => {
  return useQuery({
    queryKey: ['email-template-detail', emailTemplateRequest.id],
    queryFn: () => EmailTemplateService.detail(emailTemplateRequest),
    placeholderData: keepPreviousData,
    enabled: !!emailTemplateRequest.id,
  })
}
