import { ApplicationService } from '#src/services/ApplicationService.js'
import { ApplicationDeleteRequest } from '#src/types/RequestModel/ApplicationRequest.js'
import { CreateApplicationRequest } from '#src/types/RequestModel/CreateApplicationRequest.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

export const useAddApplicationMutation = () => {
  return useGenericMutation<CreateApplicationRequest, unknown>(
    async (applicationRequest: CreateApplicationRequest): Promise<unknown> => {
      return await ApplicationService.addApplication(applicationRequest)
    },
    'APPLICATION.CREATE_FORM.SUCCESS', // Success toast translation key
    'APPLICATION.CREATE_FORM.FAIL', // Error toast translation key
    ['ApplicationData'], // Query keys to invalidate
  )
}

export const useDeleteApplicationMutation = () => {
  return useGenericMutation<ApplicationDeleteRequest, unknown>(
    async (applicationId: ApplicationDeleteRequest): Promise<unknown> => {
      return await ApplicationService.deleteApplication(applicationId)
    },
    'TOAST.SUCCESS.ACCOUNT.DELETE', // Success toast translation key
    'TOAST.ERROR.ACCOUNT.DELETE', // Error toast translation key
    ['ApplicationData'], // Query keys to invalidate
  )
}
