import { UseMutationResult } from '@tanstack/react-query'
import { PsychologyNoteService } from '#src/services/PsychologyNoteService.js'
import {
  CreatePsychologyNoteRequest,
  UpdateDriveFilePsychologyNoteRequest,
} from '#types/RequestModel/ApiRequest.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

// Mutation hook for adding an PsychologyNote
export const useAddPsychologyNoteMutation = (): UseMutationResult<
  void,
  unknown,
  CreatePsychologyNoteRequest,
  unknown
> =>
  useGenericMutation(
    PsychologyNoteService.addNewPsychologyNoteType, // Function to delete the email template
    'NOTE_TYPE.TOAST.ADD_SUCCESS', // Success toast translation key
    'NOTE_TYPE.TOAST.ADD_FAIL', // Error toast translation key
    ['PsychologyNote'], // Query keys to invalidate
  )

export const useUpdateDriveFileMutation = (): UseMutationResult<
  void,
  unknown,
  UpdateDriveFilePsychologyNoteRequest,
  unknown
> =>
  useGenericMutation(
    PsychologyNoteService.updateDriveFile, // Function to delete the email template
    'COMMON.SAVE_SUCCESS',
    'COMMON.ERROR',
    ['PsychologyNote'], // Error toast translation key // Query keys to invalidate
  )
