import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  StudentNeedCareFilterRequest,
  StudentNeedCareRequest,
} from '#types/RequestModel/StudentNeedCareRequest.js'
import { StudentNeedCateService } from '#src/services/StudentNeedCateService.js'

export const useStudentNeedCareData = (
  studentNeedCareRequest: StudentNeedCareFilterRequest,
  pageNumber: number,
  pageSize: number,
  enabled: boolean = true,
) => {
  const requestParams: StudentNeedCareRequest = {
    ...studentNeedCareRequest,
    pageNumber,
    pageSize,
  }
  return useQuery({
    queryKey: ['student-need-care', requestParams],
    queryFn: () => StudentNeedCateService.list(requestParams),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export const useStudentNeedCareDetailData = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['student-need-care', id],
    queryFn: () => StudentNeedCateService.detail(id),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export const useStudentNeedCareStatusCount = (semesterName: string | undefined) => {
  return useQuery({
    queryKey: ['student-need-care-status-count', semesterName],
    queryFn: () => StudentNeedCateService.careStatusCount({ semesterName }),
    placeholderData: keepPreviousData,
    enabled: !!semesterName,
  })
}

export const useScanListStudentNeedCareData = (
  studentNeedCareRequest: StudentNeedCareFilterRequest,
  pageNumber: number,
  pageSize: number,
  enabled: boolean = true,
) => {
  const requestParams: StudentNeedCareRequest = {
    ...studentNeedCareRequest,
    pageNumber,
    pageSize,
  }
  return useQuery({
    queryKey: ['student-need-care-scan-list', requestParams],
    queryFn: () => StudentNeedCateService.scanList(requestParams),
    placeholderData: keepPreviousData,
    enabled,
  })
}
