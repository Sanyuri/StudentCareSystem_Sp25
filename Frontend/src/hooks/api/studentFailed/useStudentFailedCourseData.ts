import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { StudentFailedCourseService } from '#src/services/StudentFailedCourseService.js'
import { StudentsService } from '#src/services/StudentsService.js'
import { FailReason } from '#src/types/Enums/FailReason.js'
import { PointStatus } from '#src/types/Enums/PointStatus.js'

export const useStudentFailedCourseData = (
  query: string,
  semesters: string | undefined,
  pointStatus: PointStatus | undefined,
  failReason: FailReason | undefined,
  pageNumber: number,
  pageSize: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      'student-failed-course',
      query,
      semesters,
      pageNumber,
      pageSize,
      pointStatus,
      failReason,
    ],
    queryFn: () =>
      StudentFailedCourseService.list({
        query,
        semesters,
        pointStatus,
        failReason,
        pageNumber,
        pageSize,
      }),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export const useStudentFailedCourseDetail = (studentCode: string) => {
  return useQuery({
    queryKey: ['student-failed-course', studentCode],
    queryFn: () => StudentFailedCourseService.detail(studentCode),
    placeholderData: keepPreviousData,
  })
}

export const useStudentInfo = (studentCode: string) => {
  return useQuery({
    queryKey: ['student-info', studentCode],
    queryFn: () => StudentsService.getStudentById(studentCode),
    placeholderData: keepPreviousData,
    enabled: !!studentCode,
  })
}

export const useLastUpdatedData = () => {
  return useQuery({
    queryKey: ['last-updated-failed-course'],
    queryFn: () => StudentFailedCourseService.getLastUpdated(),
    placeholderData: keepPreviousData,
  })
}
