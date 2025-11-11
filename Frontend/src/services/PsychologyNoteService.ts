import { BaseService } from '#src/services/BaseService.js'
import { SemesterNote, StudentPsychologyResponse } from '#src/types/Data/PsychologyNote.js'
import {
  CreatePsychologyNoteRequest,
  UpdateDriveFilePsychologyNoteRequest,
} from '#types/RequestModel/ApiRequest.js'
import {
  PSYCHOLOGY_NOTE_BASE_URL,
  PSYCHOLOGY_NOTE_URL,
  STUDENT_PSYCHOLOGY_URL,
} from '#utils/constants/api.js'

export const PsychologyNoteService = {
  detail(param: string): Promise<SemesterNote[]> {
    return BaseService.get<SemesterNote[]>(PSYCHOLOGY_NOTE_URL + '/' + param)
  },
  studentInfo(param: string): Promise<StudentPsychologyResponse> {
    return BaseService.get<StudentPsychologyResponse>(STUDENT_PSYCHOLOGY_URL + '/' + param)
  },
  addNewPsychologyNoteType(body: CreatePsychologyNoteRequest): Promise<void> {
    return BaseService.post<void>(PSYCHOLOGY_NOTE_BASE_URL, body)
  },
  updateDriveFile(body: UpdateDriveFilePsychologyNoteRequest): Promise<void> {
    return BaseService.put<void>(`${PSYCHOLOGY_NOTE_BASE_URL}/${body.id}/drive-url`, body)
  },
}
