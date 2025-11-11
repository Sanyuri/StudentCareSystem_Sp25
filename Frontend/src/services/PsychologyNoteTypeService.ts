import { PsychologyNoteTypeListResponse } from '#types/ResponseModel/ApiResponse.js'
import { BaseService } from '#src/services/BaseService.js'
import {
  CreatePsychologyNoteTypeRequest,
  UpdatePsychologyNoteTypeRequest,
} from '#types/RequestModel/ApiRequest.js'
import { PSYCHOLOGY_NOTE_TYPE_URL } from '#utils/constants/api.js'

export const PsychologyNoteTypeService = {
  getAllPsychologyNoteType: (param?: string): Promise<PsychologyNoteTypeListResponse> => {
    return BaseService.get<PsychologyNoteTypeListResponse>(PSYCHOLOGY_NOTE_TYPE_URL + '/' + param)
  },

  addNewPsychologyNoteType(body: CreatePsychologyNoteTypeRequest): Promise<void> {
    return BaseService.post<void>(PSYCHOLOGY_NOTE_TYPE_URL, body)
  },

  updatePsychologyNoteType(body: UpdatePsychologyNoteTypeRequest): Promise<void> {
    return BaseService.put<void>(`${PSYCHOLOGY_NOTE_TYPE_URL}/${body.id}`, body)
  },
  deletePsychologyNoteType(param: string): Promise<void> {
    return BaseService.delete<void>(`${PSYCHOLOGY_NOTE_TYPE_URL}/${param}`)
  },
}
