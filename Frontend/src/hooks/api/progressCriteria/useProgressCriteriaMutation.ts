import { UseMutationResult } from '@tanstack/react-query'
import { useGenericMutation } from '../useGenericMutation'
import { ProgressCriteriaService } from '#src/services/ProgressCriteriaService.js'
import {
  CreateProgressCriteriaRequest,
  UpdateParamProgressCriteriaRequest,
} from '#src/types/RequestModel/ProgressCriteriaRequest.js'

// Mutation hook for updating an Progress Criteria
export const useUpdateAllProgressCriteriaMutation = (): UseMutationResult<
  void,
  unknown,
  UpdateParamProgressCriteriaRequest,
  unknown
> =>
  useGenericMutation(
    ProgressCriteriaService.updateAll,
    'PROGRESS_CRITERION.TOAST.SUCCESS.ACTION', // Success toast translation key
    'PROGRESS_CRITERION.TOAST.FAIL.ACTION', // Error toast translation key
    ['progressCriteriaList'], // Query keys to invalidate
  )

// Mutation hook for updating an Progress Criteria
export const useAddProgressCriteriaMutation = (): UseMutationResult<
  void,
  unknown,
  CreateProgressCriteriaRequest,
  unknown
> =>
  useGenericMutation(
    ProgressCriteriaService.add,
    'PROGRESS_CRITERION_TYPE.TOAST.SUCCESS.EDIT', // Success toast translation key
    'PROGRESS_CRITERION_TYPE.TOAST.FAIL.EDIT', // Error toast translation key
    ['progressCriteriaList'], // Query keys to invalidate
  )
