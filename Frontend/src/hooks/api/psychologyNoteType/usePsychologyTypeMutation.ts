import { UseMutationResult } from '@tanstack/react-query'
import { CreateNoteTypeRequest, UpdateNoteTypeRequest } from '#types/RequestModel/ApiRequest.js'
import { PsychologyNoteTypeService } from '#src/services/PsychologyNoteTypeService.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

// Mutation hook for adding an psychology note type
export const useAddPsychologyNoteTypeMutation = (): UseMutationResult<
  void,
  unknown,
  CreateNoteTypeRequest,
  unknown
> =>
  useGenericMutation(
    PsychologyNoteTypeService.addNewPsychologyNoteType,
    'NOTE_TYPE.TOAST.ADD_SUCCESS', // Success toast translation key
    'NOTE_TYPE.TOAST.ADD_FAIL', // Error toast translation key
    ['PsychologyNoteTypeList'], // Query keys to invalidate
  )

// Mutation hook for updating an psychology note type
export const useUpdatePsychologyNoteTypeMutation = (): UseMutationResult<
  void,
  unknown,
  UpdateNoteTypeRequest,
  unknown
> =>
  useGenericMutation(
    PsychologyNoteTypeService.updatePsychologyNoteType,
    'NOTE_TYPE.TOAST.ADD_SUCCESS', // Success toast translation key
    'NOTE_TYPE.TOAST.EDIT_FAIL', // Error toast translation key
    ['PsychologyNoteTypeList'], // Query keys to invalidate
  )

// Mutation hook for deleting an psychology note type
export const useDeletePsychologyNoteTypeMutation = (): UseMutationResult<
  void,
  unknown,
  string,
  unknown
> =>
  useGenericMutation(
    PsychologyNoteTypeService.deletePsychologyNoteType,
    'NOTE_TYPE.TOAST.DELETE_SUCCESS', // Success toast translation key
    'NOTE_TYPE.TOAST.DELETE_FAIL', // Error toast translation key
    ['PsychologyNoteTypeList'], // Query keys to invalidate
  )
