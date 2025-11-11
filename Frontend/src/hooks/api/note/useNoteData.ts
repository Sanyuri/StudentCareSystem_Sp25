import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { NoteService } from '#src/services/NoteService.js'
import { NoteListResponse, StudentNoteListResponse } from '#types/ResponseModel/ApiResponse.js'
import { StudentNoteResponse } from '#types/ResponseModel/StudentNoteResponse.js'

export const useNoteData = (
  param: string,
  enabled: boolean = false,
): UseQueryResult<NoteListResponse, Error> => {
  return useQuery({
    queryKey: ['NoteScreenList', param],
    queryFn: (): Promise<NoteListResponse> => NoteService.getNotesInScreen(param),
    placeholderData: keepPreviousData,
    enabled: enabled,
  })
}

export const useNoteStudentData = (param: string): UseQueryResult<NoteListResponse, Error> => {
  return useQuery({
    queryKey: ['NoteStudentList', param],
    queryFn: (): Promise<NoteListResponse> => NoteService.getNoteStudent(param),
    placeholderData: keepPreviousData,
    enabled: false,
  })
}

export const useDetailStudentNoteData = (
  param: string,
): UseQueryResult<StudentNoteResponse, Error> => {
  return useQuery({
    queryKey: ['note-management', param],
    queryFn: (): Promise<StudentNoteResponse> => NoteService.detail(param),
    placeholderData: keepPreviousData,
    enabled: !!param,
  })
}

export const useNoteManagementData = (
  query: string,
  noteTypeId: string | undefined,
  pageNumber: number,
  pageSize: number,
): UseQueryResult<StudentNoteListResponse, Error> => {
  return useQuery({
    queryKey: ['Note-list', query, noteTypeId, pageNumber, pageSize],
    queryFn: (): Promise<StudentNoteListResponse> =>
      NoteService.list({ query, noteTypeId, pageNumber, pageSize }),
    placeholderData: keepPreviousData,
  })
}
