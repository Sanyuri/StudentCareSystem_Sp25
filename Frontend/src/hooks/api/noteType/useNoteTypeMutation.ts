import { UseMutationResult } from '@tanstack/react-query'
import { CreateNoteTypeRequest, UpdateNoteTypeRequest } from '#types/RequestModel/ApiRequest.js'
import { NoteTypeService } from '#src/services/NoteTypeService.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

// Mutation hook for adding an note type
export const useAddNoteTypeMutation = (): UseMutationResult<
  void,
  unknown,
  CreateNoteTypeRequest,
  unknown
> =>
  useGenericMutation(
    NoteTypeService.addNewNoteType, // Function to delete the email template
    'NOTE_TYPE.TOAST.ADD_SUCCESS', // Success toast translation key
    'NOTE_TYPE.TOAST.ADD_FAIL', // Error toast translation key
    ['NoteTypeList'], // Query keys to invalidate
  )

// Mutation hook for updating an note type
export const useUpdateNoteTypeMutation = (): UseMutationResult<
  void,
  unknown,
  UpdateNoteTypeRequest,
  unknown
> =>
  useGenericMutation(
    NoteTypeService.updateNoteType, // Function to delete the email template
    'NOTE_TYPE.TOAST.ADD_SUCCESS', // Success toast translation key
    'NOTE_TYPE.TOAST.EDIT_FAIL', // Error toast translation key
    ['NoteTypeList', 'Note-list'], // Query keys to invalidate
  )

// Mutation hook for deleting an note type
export const useDeleteNoteTypeMutation = (): UseMutationResult<void, unknown, string, unknown> =>
  useGenericMutation(
    NoteTypeService.deleteNoteType, // Function to delete the email template
    'NOTE_TYPE.TOAST.DELETE_SUCCESS', // Success toast translation key
    'NOTE_TYPE.TOAST.DELETE_FAIL', // Error toast translation key
    ['NoteTypeList'], // Query keys to invalidate
  )
