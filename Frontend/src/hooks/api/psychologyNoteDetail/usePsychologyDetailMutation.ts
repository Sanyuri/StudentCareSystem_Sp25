import { UseMutationResult } from '@tanstack/react-query'
import {
  CreatePsychologyNoteDetailRequest,
  UpdatePsychologyNoteDetailRequest,
} from '#types/RequestModel/PsychologyNoteDetailRequest.js'
import { PsychologyNoteDetailService } from '#src/services/PsychologyNoteDetailService.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

// Mutation hook for adding an psychology note detail
export const useAddPsychologyNoteDetailMutation = (): UseMutationResult<
  void,
  unknown,
  CreatePsychologyNoteDetailRequest,
  unknown
> =>
  useGenericMutation(
    PsychologyNoteDetailService.addNewPsychologyNoteDetail,
    'NOTE_DETAIL.TOAST.ADD_SUCCESS', // Success toast translation key
    'NOTE_DETAIL.TOAST.ADD_FAIL', // Error toast translation key
    ['PsychologyNote'], // Query keys to invalidate
  )

// Mutation hook for updating an psychology note detail
export const useUpdatePsychologyNoteDetailMutation = (): UseMutationResult<
  void,
  unknown,
  UpdatePsychologyNoteDetailRequest,
  unknown
> =>
  useGenericMutation(
    PsychologyNoteDetailService.updatePsychologyNoteDetail,
    'NOTE_DETAIL.TOAST.ADD_SUCCESS', // Success toast translation key
    'NOTE_DETAIL.TOAST.EDIT_FAIL', // Error toast translation key
    ['PsychologyNote'], // Query keys to invalidate
  )

// Mutation hook for deleting an psychology note detail
export const useDeletePsychologyNoteDetailMutation = (): UseMutationResult<
  void,
  unknown,
  string,
  unknown
> =>
  useGenericMutation(
    PsychologyNoteDetailService.deletePsychologyNoteDetail,
    'NOTE_DETAIL.TOAST.DELETE_SUCCESS', // Success toast translation key
    'NOTE_DETAIL.TOAST.DELETE_FAIL', // Error toast translation key
    ['PsychologyNote'], // Query keys to invalidate
  )
