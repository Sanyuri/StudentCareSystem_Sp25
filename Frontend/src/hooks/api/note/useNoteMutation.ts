import { NoteService } from '#src/services/NoteService.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import {
  CreateNoteListRequest,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '#types/RequestModel/ApiRequest.js'
import { UseMutationResult } from '@tanstack/react-query'

export const useAddNoteMutation = (): UseMutationResult<
  void,
  unknown,
  CreateNoteRequest,
  unknown
> =>
  useGenericMutation(NoteService.addNewNote, 'NOTE.TOAST.ADD_SUCCESS', 'NOTE.TOAST.ADD_FAIL', [
    'Note-list',
  ])

export const useUpdateNoteMutation = (): UseMutationResult<
  void,
  unknown,
  UpdateNoteRequest,
  unknown
> =>
  useGenericMutation(NoteService.updateNote, 'NOTE.TOAST.EDIT_SUCCESS', 'NOTE.TOAST.EDIT_FAIL', [
    'Note-list',
  ])

export const useDeleteNoteMutation = (): UseMutationResult<void, unknown, string, unknown> =>
  useGenericMutation(
    NoteService.deleteNote,
    'NOTE.TOAST.DELETE_SUCCESS',
    'NOTE.TOAST.DELETE_FAIL',
    ['Note-list'],
  )

export const useImportFromFileMutation = (): UseMutationResult<
  void,
  unknown,
  CreateNoteListRequest,
  unknown
> =>
  useGenericMutation(NoteService.addNewListNote, 'NOTE.TOAST.ADD_SUCCESS', 'NOTE.TOAST.ADD_FAIL', [
    'Note-list',
  ])
