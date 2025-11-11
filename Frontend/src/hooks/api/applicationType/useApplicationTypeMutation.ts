import { ApplicationTypeService } from '#src/services/ApplicationTypeService.js'
import {
  ApplicationType,
  AddApplicationTypeRequest,
  UpdateApplicationTypeRequest,
} from '#src/types/RequestModel/ApplicationTypeRequest.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

export const useAddApplicationTypeMutation = () => {
  return useGenericMutation<AddApplicationTypeRequest, unknown>(
    async (createApplicationTypeRequest: AddApplicationTypeRequest): Promise<unknown> => {
      return await ApplicationTypeService.addEmailSample(createApplicationTypeRequest)
    },
    'APPLICATION_TYPE.TOAST.SUCCESS.ADD', // Success toast translation key
    'APPLICATION_TYPE.TOAST.ERROR.ADD', // Error toast translation key
    ['application-type'], // Query keys to invalidate
  )
}

export const useUpdateApplicationTypeMutation = () => {
  return useGenericMutation<
    {
      ApplicationTypeId: ApplicationType
      updateApplicationTypeRequest: UpdateApplicationTypeRequest
    },
    unknown
  >(
    async ({
      ApplicationTypeId,
      updateApplicationTypeRequest,
    }: {
      ApplicationTypeId: ApplicationType
      updateApplicationTypeRequest: UpdateApplicationTypeRequest
    }): Promise<unknown> => {
      return await ApplicationTypeService.updateApplicationType(
        ApplicationTypeId,
        updateApplicationTypeRequest,
      )
    },
    'APPLICATION_TYPE.TOAST.SUCCESS.UPDATE', // Success toast translation key
    'APPLICATION_TYPE.TOAST.ERROR.UPDATE', // Error toast translation key
    ['application-type-detail', 'application-type'], // Query keys to invalidate
  )
}

export const useDeleteApplicationTypeMutation = () => {
  return useGenericMutation<{ applicationTypeId: ApplicationType }, unknown>(
    async ({ applicationTypeId }: { applicationTypeId: ApplicationType }): Promise<unknown> => {
      return await ApplicationTypeService.deleteApplicationType(applicationTypeId)
    },
    'APPLICATION_TYPE.TOAST.SUCCESS.DELETE', // Success toast translation key
    'APPLICATION_TYPE.TOAST.ERROR.DELETE', // Error toast translation key
    ['application-type'], // Query keys to invalidate
  )
}
