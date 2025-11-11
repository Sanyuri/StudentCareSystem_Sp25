import {
  AddSubjectRequest,
  DeleteSubjectStudent,
  Subject,
  SubjectRequest,
  UpdateSubjectRequest,
} from '#src/types/RequestModel/SubjectRequest.js'
import {
  SubjectListResponse,
  SubjectResp,
  SubjectResponse,
} from '#src/types/ResponseModel/SubjectResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import {
  GET_SUBJECT_LIST_URL,
  SUBJECT_ADD_LIST_URL,
  SUBJECT_LIST_ADD_URL,
  SUBJECT_LIST_URL,
} from '#utils/constants/api.js'

export const SubjectService = {
  getSubjects(): Promise<SubjectResp[]> {
    return BaseService.get<SubjectResp[]>(GET_SUBJECT_LIST_URL)
  },
  list(params?: SubjectRequest): Promise<SubjectListResponse> {
    return BaseService.get<SubjectListResponse>(GET_SUBJECT_LIST_URL, convertParamsGeneric(params))
  },
  addlist(params?: SubjectRequest): Promise<SubjectListResponse> {
    return BaseService.get<SubjectListResponse>(SUBJECT_LIST_ADD_URL, convertParamsGeneric(params))
  },
  add(params?: SubjectRequest): Promise<SubjectListResponse> {
    return BaseService.get<SubjectListResponse>(SUBJECT_LIST_URL, convertParamsGeneric(params))
  },
  detail(param: Subject): Promise<SubjectResponse> {
    return BaseService.get<SubjectResponse>(`${SUBJECT_LIST_URL}/${param.id}`)
  },
  addSubject(param: AddSubjectRequest): Promise<SubjectResponse> {
    return BaseService.put<SubjectResponse>(SUBJECT_ADD_LIST_URL, param)
  },
  updateSubject(param: Subject, body: UpdateSubjectRequest): Promise<void> {
    return BaseService.put<void>(`${SUBJECT_LIST_URL}/${param.id}`, body)
  },
  deleteSubjectStudent(param: Subject, body: DeleteSubjectStudent): Promise<void> {
    return BaseService.put<void>(`${SUBJECT_LIST_URL}/${param.id}`, body)
  },
  deleteSubject(param: Subject): Promise<void> {
    return BaseService.delete<void>(`${SUBJECT_LIST_URL}/${param.id}`)
  },
}
