/* eslint-disable @typescript-eslint/no-explicit-any */
import { from, lastValueFrom, map, mergeMap, Observable, toArray } from 'rxjs'
import {
  AttendanceListResponse,
  GetAllSemesterResponse,
  StudentAttendance,
} from '#types/ResponseModel/ApiResponse.js'
import { EXPORT_API_CALL_STREAM_NUMBER, PAGE_SIZE_EXPORT_DIVIDED } from '#src/configs/WebConfig.js'
import { AttendanceService } from '#src/services/AttendanceService.js'
import { DateValue } from '#utils/constants/date.js'
import { DateTime } from 'luxon'
import _ from 'lodash'
import { AttendanceDateFilter } from '#src/types/RequestModel/AttendanceRequest.js'
import {
  AttendanceRequest,
  AttendanceSemesterFilter,
} from '#types/RequestModel/AttendanceRequest.js'

type ApiMapping = ReturnType<typeof handleApiMapping>
type ApiMappingKey = keyof ApiMapping

// Ánh xạ option tới API và tham số tương ứng
const handleApiMapping = (semesterName: string, prevSemester: string) => {
  return {
    yesterday: {
      apiFunction: (params: AttendanceDateFilter) => AttendanceService.getListByDate(params),
      params: {
        date: DateTime.now().minus({ days: 1 }).toISO(),
        dateType: DateValue.Date,
      },
    },
    today: {
      apiFunction: (params: AttendanceDateFilter) => AttendanceService.getListByDate(params),
      params: { date: DateTime.now().toISO(), dateType: DateValue.Date },
    },
    exceedAbsenceRate: {
      apiFunction: (params: AttendanceRequest) => AttendanceService.list(params),
      params: { query: '', filter: { minAbsenceRate: 20 } },
    },
    semester: {
      apiFunction: (params: AttendanceSemesterFilter) =>
        AttendanceService.getListBySemester(params),
      params: { semesterName: semesterName },
    },

    year: {
      apiFunction: (params: AttendanceDateFilter) => AttendanceService.getListByDate(params),
      params: { date: DateTime.now().toISO(), dateType: DateValue.Year },
    },
    engGroup: {
      apiFunction: (params: AttendanceSemesterFilter) =>
        AttendanceService.getListBySemester(params),
      params: { semesterName: semesterName, isEnglish: false },
    },
    cnGroup: {
      apiFunction: (params: AttendanceSemesterFilter) =>
        AttendanceService.getListBySemester(params),
      params: { semesterName: semesterName, isEnglish: false },
    },
    prevCourse: {
      apiFunction: (params: AttendanceSemesterFilter) =>
        AttendanceService.getListBySemester(params),
      params: { semesterName: prevSemester },
    },
    updatedToday: {
      apiFunction: (params: AttendanceDateFilter) => AttendanceService.getListByLastUpdated(params),
      params: { date: DateTime.now().toISO(), dateType: DateValue.Date },
    },
  } as const
}
// Hàm chung để gọi API và xử lý phân trang
const fetchPaginatedData = async (
  apiFunction: (params: any) => Promise<AttendanceListResponse>,
  apiParams: any,
): Promise<StudentAttendance[]> => {
  const initialResponse = await apiFunction({ ...apiParams, pageNumber: 1, pageSize: 1 })
  const totalItems: number = initialResponse?.totalItems || 0
  const totalPages: number = Math.ceil(totalItems / PAGE_SIZE_EXPORT_DIVIDED)

  if (totalPages === 0) {
    return []
  }

  return await lastValueFrom(
    from(Array.from({ length: totalPages }, (_, i: number) => i + 1)).pipe(
      mergeMap(
        (pageNumber: number) =>
          apiFunction({ ...apiParams, pageNumber, pageSize: PAGE_SIZE_EXPORT_DIVIDED }).then(
            (response: AttendanceListResponse) => response.items,
          ),
        EXPORT_API_CALL_STREAM_NUMBER,
      ),
      toArray(),
      map((pages: StudentAttendance[][]) => pages.flat()),
    ),
  )
}
export const fetchDataForItem = (
  selectedItem: string,
  semesterName: string,
  prevSemester: string,
): Observable<StudentAttendance[]> => {
  return from(
    (async () => {
      const apiMapping = handleApiMapping(semesterName, prevSemester)
      const mapping = apiMapping[selectedItem as ApiMappingKey]
      if (!mapping || !(selectedItem in apiMapping)) {
        return []
      }

      const { apiFunction, params } = mapping
      const allData: StudentAttendance[] = await fetchPaginatedData(apiFunction, params)
      // Group by id and fill the sum of email send
      const groupedData = _(allData)
        .groupBy('id')
        .map((items) => ({
          ...items[0],
          numberOfEmails: items.length, // Count the number of items
        }))
        .value()

      if (!groupedData || groupedData.length === 0) {
        return []
      }

      return groupedData
    })(),
  )
}

export function getPrevSemester(
  currentIndex: number,
  allSemesters: GetAllSemesterResponse,
): string {
  if (currentIndex >= 0 && allSemesters?.[currentIndex + 1]) {
    return allSemesters[currentIndex + 1]?.semesterName || ''
  } else if (currentIndex === 0 && allSemesters?.[1]) {
    return allSemesters[1]?.semesterName || ''
  }
  return ''
}
