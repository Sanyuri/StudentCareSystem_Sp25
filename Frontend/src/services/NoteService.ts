import { BaseService } from '#src/services/BaseService.js'
import { NoteListResponse, StudentNoteListResponse } from '#types/ResponseModel/ApiResponse.js'
import {
  CreateNoteListRequest,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '#types/RequestModel/ApiRequest.js'
import { NoteRequest } from '#src/types/RequestModel/StudentNoteRequest.js'
import { StudentNoteResponse } from '#src/types/ResponseModel/StudentNoteResponse.js'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import {
  GET_ALL_NOTE_SCREEN_URL,
  NOTE_IMPORT_URL,
  NOTE_STUDENT_URL,
  NOTE_URL,
} from '#utils/constants/api.js'

export const NoteService = {
  getNotesInScreen: (param: string): Promise<NoteListResponse> => {
    return BaseService.get<NoteListResponse>(GET_ALL_NOTE_SCREEN_URL + '/' + param)
  },

  getNoteStudent: (param: string): Promise<NoteListResponse> => {
    return BaseService.get<NoteListResponse>(NOTE_STUDENT_URL + '/' + param)
  },

  addNewNote(body: CreateNoteRequest): Promise<void> {
    return BaseService.post<void>(NOTE_URL, body)
  },

  addNewListNote(body: CreateNoteListRequest): Promise<void> {
    return BaseService.post<void>(NOTE_IMPORT_URL, body)
  },
  updateNote(body: UpdateNoteRequest): Promise<void> {
    return BaseService.put<void>(`${NOTE_URL}/${body.id}`, body)
  },

  deleteNote(param: string): Promise<void> {
    return BaseService.delete<void>(`${NOTE_URL}/${param}`)
  },

  list: (params?: NoteRequest): Promise<StudentNoteListResponse> => {
    return BaseService.get<StudentNoteListResponse>(NOTE_URL, convertParamsGeneric(params))
  },
  detail(param: string): Promise<StudentNoteResponse> {
    return BaseService.get<StudentNoteResponse>(`${NOTE_URL}/${param}`)
  },
}
