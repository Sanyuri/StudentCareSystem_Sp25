// Mutation hook for update missing attendance in past
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { AttendanceService } from '#src/services/AttendanceService.js'
import { UseMutationResult } from '@tanstack/react-query'

export const useAttendanceScanMutation = (): UseMutationResult<unknown, unknown, string, unknown> =>
  useGenericMutation(
    async (semesterName: string): Promise<unknown> => {
      return await AttendanceService.scan({ semesterName })
    },
    'ATTENDANCES.TOAST.SUCCESS.SCAN', // Success toast translation key
    'ATTENDANCES.TOAST.ERROR.SCAN', // Error toast translation key
    [], // Query keys to invalidate
  )
