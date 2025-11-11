import { AttendanceRateBoundaryService } from '#src/services/AbsenceRateBoundaryService.js'
import {
  AttendanceRateBoundaryRequest,
  UpdateAttendanceRateBoundaryRequest,
} from '#types/RequestModel/AttendanceRateBoundaryRequest.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

export const useAddAttendanceRateBoundariesMutation = () => {
  return useGenericMutation<AttendanceRateBoundaryRequest, unknown>(
    async (createEmailTemplateRequest: AttendanceRateBoundaryRequest): Promise<unknown> => {
      return await AttendanceRateBoundaryService.add(createEmailTemplateRequest)
    },
    'ATTENDANCES.RATE_BOUNDARY.TOAST.ADD_SUCCESS', // Success toast translation key
    'ATTENDANCES.RATE_BOUNDARY.TOAST.ADD_FAIL', // Error toast translation key
    ['AbsenceRateBoundaries'], // Query keys to invalidate
  )
}

export const useUpdateAttendanceRateBoundariesMutation = () => {
  return useGenericMutation<UpdateAttendanceRateBoundaryRequest, unknown>(
    async (
      updateAttendanceRateBoundaryRequest: UpdateAttendanceRateBoundaryRequest,
    ): Promise<unknown> => {
      return await AttendanceRateBoundaryService.update(updateAttendanceRateBoundaryRequest)
    },
    'ATTENDANCES.RATE_BOUNDARY.TOAST.EDIT_SUCCESS', // Success toast translation key
    'ATTENDANCES.RATE_BOUNDARY.TOAST.EDIT_FAIL', // Error toast translation key
    ['AbsenceRateBoundaries'], // Query keys to invalidate
  )
}

export const useDeleteAttendanceRateBoundariesMutation = () => {
  return useGenericMutation<string, unknown>(
    async (id: string): Promise<unknown> => {
      return await AttendanceRateBoundaryService.delete(id)
    },
    'ATTENDANCES.RATE_BOUNDARY.TOAST.DELETE_SUCCESS', // Success toast translation key
    'ATTENDANCES.RATE_BOUNDARY.TOAST.DELETE_FAIL', // Error toast translation key
    ['AbsenceRateBoundaries'], // Query keys to invalidate
  )
}
