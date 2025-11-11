import { EmailTemplateService } from '#src/services/EmailTemplateService.js'
import {
  EmailTemplate,
  AddEmailTemplateRequest,
  UpdateEmailTemplateRequest,
} from '#src/types/RequestModel/EmailTemplateRequest.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { UseMutationResult } from '@tanstack/react-query'

// Mutation hook for add an email template
export const useAddEmailTemplateMutation = (): UseMutationResult<
  unknown,
  unknown,
  AddEmailTemplateRequest,
  unknown
> =>
  useGenericMutation(
    EmailTemplateService.addEmailSample,
    'EMAILTEMPLATES.TOAST.SUCCESS.ADD', // Success toast translation key
    'EMAILTEMPLATES.TOAST.ERROR.ADD', // Error toast translation key
    ['email-template'], // Query keys to invalidate
  )

// Mutation hook for updating an email template
export const useUpdateEmailTemplateMutation = (): UseMutationResult<
  unknown,
  unknown,
  {
    emailTemplateId: EmailTemplate
    updateEmailTemplateRequest: UpdateEmailTemplateRequest
  },
  unknown
> =>
  useGenericMutation(
    async ({
      emailTemplateId,
      updateEmailTemplateRequest,
    }: {
      emailTemplateId: EmailTemplate
      updateEmailTemplateRequest: UpdateEmailTemplateRequest
    }): Promise<unknown> => {
      return await EmailTemplateService.updateEmailTemplate(
        emailTemplateId,
        updateEmailTemplateRequest,
      )
    },
    'EMAILTEMPLATES.TOAST.SUCCESS.UPDATE', // Success toast translation key
    'EMAILTEMPLATES.TOAST.ERROR.UPDATE', // Error toast translation key
    ['email-template'], // Query keys to invalidate
  )

// Mutation hook for deleting an email template
export const useDeleteEmailTemplateMutation = (): UseMutationResult<
  void,
  unknown,
  EmailTemplate,
  unknown
> =>
  useGenericMutation(
    EmailTemplateService.deleteEmailTemplate, // Function to delete the email template
    'EMAILTEMPLATES.TOAST.SUCCESS.DELETE', // Success toast translation key
    null, // Error toast translation key
    ['email-template'], // Query keys to invalidate
  )
