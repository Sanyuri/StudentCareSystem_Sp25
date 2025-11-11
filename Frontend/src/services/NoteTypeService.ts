import { CreateNoteTypeRequest, UpdateNoteTypeRequest } from '#types/RequestModel/ApiRequest.js'
import { NoteTypeListResponse } from '#types/ResponseModel/ApiResponse.js'
import { BaseService } from '#src/services/BaseService.js'
import { NoteType } from '#types/Data/NoteType.js'
import { NOTE_TYPE_URL } from '#utils/constants/api.js'

export const NoteTypeService = {
  getAllNoteType: (param?: string): Promise<NoteTypeListResponse> => {
    return BaseService.get<NoteTypeListResponse>(NOTE_TYPE_URL + '/' + param)
  },

  getAllDefaultNoteType: (param: string): Promise<NoteType> => {
    return BaseService.get<NoteType>(NOTE_TYPE_URL + '/default/' + param)
  },
  addNewNoteType(body: CreateNoteTypeRequest): Promise<void> {
    return BaseService.post<void>(NOTE_TYPE_URL, body)
  },

  updateNoteType(body: UpdateNoteTypeRequest): Promise<void> {
    return BaseService.put<void>(`${NOTE_TYPE_URL}/${body.id}`, body)
  },
  deleteNoteType(param: string): Promise<void> {
    return BaseService.delete<void>(`${NOTE_TYPE_URL}/${param}`)
  },
}
