import { BaseService } from '#src/services/BaseService.js'
import {
  CreatePsychologyNoteDetailRequest,
  UpdatePsychologyNoteDetailRequest,
} from '#types/RequestModel/PsychologyNoteDetailRequest.js'
import { PSYCHOLOGY_NOTE_DETAIL_URL } from '#utils/constants/api.js'

export const PsychologyNoteDetailService = {
  addNewPsychologyNoteDetail(body: CreatePsychologyNoteDetailRequest): Promise<void> {
    return BaseService.post<void>(PSYCHOLOGY_NOTE_DETAIL_URL, body)
  },

  updatePsychologyNoteDetail(body: UpdatePsychologyNoteDetailRequest): Promise<void> {
    return BaseService.put<void>(`${PSYCHOLOGY_NOTE_DETAIL_URL}/${body.id}`, body)
  },
  deletePsychologyNoteDetail(param: string): Promise<void> {
    return BaseService.delete<void>(`${PSYCHOLOGY_NOTE_DETAIL_URL}/${param}`)
  },
}
