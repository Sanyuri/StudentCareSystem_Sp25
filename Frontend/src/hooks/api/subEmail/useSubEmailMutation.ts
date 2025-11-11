import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { UseMutationResult } from '@tanstack/react-query'
import { SubEmailService } from '#src/services/SubEmailService.js'
import {
  AddSubEmailRequest,
  SubEmailDetailRequest,
  UpdateSubEmailRequest,
} from '#types/RequestModel/SubEmailRequest.js'

// Mutation hook for add an sub email template
export const useAddSubEmailMutation = (): UseMutationResult<
  unknown,
  unknown,
  AddSubEmailRequest,
  unknown
> =>
  useGenericMutation(
    SubEmailService.addSubEmailSample,
    'SUB_EMAIL.TOAST.SUCCESS.ADD', // Success toast translation key
    'SUB_EMAIL.TOAST.ERROR.ADD', // Error toast translation key
    ['sub-email-template'], // Query keys to invalidate
  )

// Mutation hook for updating an email template
export const useUpdateSubEmailMutation = (): UseMutationResult<
  unknown,
  unknown,
  {
    subEmailId: SubEmailDetailRequest
    updateSubEmailRequest: UpdateSubEmailRequest
  },
  unknown
> =>
  useGenericMutation(
    async ({
      subEmailId,
      updateSubEmailRequest,
    }: {
      subEmailId: SubEmailDetailRequest
      updateSubEmailRequest: UpdateSubEmailRequest
    }): Promise<unknown> => {
      return await SubEmailService.updateSubEmailTemplate(subEmailId, updateSubEmailRequest)
    },
    'SUB_EMAIL.TOAST.SUCCESS.UPDATE', // Success toast translation key
    'SUB_EMAIL.TOAST.ERROR.UPDATE', // Error toast translation key
    ['sub-email-template', 'sub-email-detail'], // Query keys to invalidate
  )

// Mutation hook for deleting an email template
export const useDeleteSubEmailMutation = (): UseMutationResult<
  void,
  unknown,
  SubEmailDetailRequest,
  unknown
> =>
  useGenericMutation(
    SubEmailService.deleteSubEmailTemplate, // Function to delete the email template
    'SUB_EMAIL.TOAST.SUCCESS.DELETE', // Success toast translation key
    'SUB_EMAIL.TOAST.ERROR.DELETE',
    ['sub-email-template'], // Query keys to invalidate
  )
