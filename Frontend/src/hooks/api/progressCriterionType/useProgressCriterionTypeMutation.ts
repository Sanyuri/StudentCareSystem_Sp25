// Mutation hook for adding an Progress Criterion type
import { UseMutationResult } from '@tanstack/react-query'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import {
  CreateProgressCriterionTypeRequest,
  UpdateProgressCriterionTypeRequest,
} from '#types/RequestModel/ProgressCriterionTypeRequest.js'
import { ProgressCriterionTypeService } from '#src/services/ProgressCriterionTypeService.js'

export const useAddProgressCriterionTypeDataMutation = (): UseMutationResult<
  void,
  unknown,
  CreateProgressCriterionTypeRequest,
  unknown
> =>
  useGenericMutation(
    ProgressCriterionTypeService.add,
    'PROGRESS_CRITERION_TYPE.TOAST.SUCCESS.ADD', // Success toast translation key
    'PROGRESS_CRITERION_TYPE.TOAST.FAIL.ADD', // Error toast translation key
    ['ProgressCriterionTypeList'], // Query keys to invalidate
  )

// Mutation hook for updating an Progress Criterion type
export const useUpdateProgressCriterionTypeMutation = (): UseMutationResult<
  void,
  unknown,
  UpdateProgressCriterionTypeRequest,
  unknown
> =>
  useGenericMutation(
    ProgressCriterionTypeService.update,
    'PROGRESS_CRITERION_TYPE.TOAST.SUCCESS.EDIT', // Success toast translation key
    'PROGRESS_CRITERION_TYPE.TOAST.FAIL.EDIT', // Error toast translation key
    ['ProgressCriterionTypeList'], // Query keys to invalidate
  )

// Mutation hook for deleting an Progress Criterion type
export const useDeleteProgressCriterionTypeMutation = (): UseMutationResult<
  void,
  unknown,
  string,
  unknown
> =>
  useGenericMutation(
    ProgressCriterionTypeService.delete,
    'PROGRESS_CRITERION_TYPE.TOAST.SUCCESS.DELETE', // Success toast translation key
    'PROGRESS_CRITERION_TYPE.TOAST.FAIL.DELETE', // Error toast translation key
    ['ProgressCriterionTypeList'], // Query keys to invalidate
  )
