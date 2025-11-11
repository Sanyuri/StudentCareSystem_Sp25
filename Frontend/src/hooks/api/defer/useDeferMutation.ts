import { UseMutationResult } from '@tanstack/react-query'
import { useGenericMutation } from '../useGenericMutation'
import { StudentDeferService } from '#src/services/DeferService.js'

export const useDeferScanMutation = (): UseMutationResult<unknown, unknown, string, unknown> =>
  useGenericMutation(
    async (semesterName: string): Promise<unknown> => {
      return await StudentDeferService.scan({ semesterName })
    },
    'DEFERS.TOAST.SUCCESS.SCAN', // Success toast translation key
    'DEFERS.TOAST.ERROR.SCAN', // Error toast translation key
    [], // Query keys to invalidate
  )
