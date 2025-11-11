import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useStudentPointData } from '#hooks/api/studentPoint/useStudentPointData.js'
import { useAttendanceDetailData } from '#hooks/api/attendance/useAttendanceData.js'
import { StudentCareComparisonData } from '#types/Data/StudentNeedCare.js'

export const useMergeStudentCareCompare = (
  studentCode: string | undefined,
  semesters: string[],
) => {
  const { data: studentAttendanceData } = useAttendanceDetailData(studentCode, {
    semesterName: semesters,
  })
  const { data: studentPointData } = useStudentPointData(studentCode, {
    semesterName: semesters,
  })

  const [mergedData, setMergedData] = useState<StudentCareComparisonData[]>([])

  useEffect(() => {
    if (!studentAttendanceData || !studentPointData) return

    // Nhóm dữ liệu điểm danh theo studentCode & semesterName
    const groupedAttendance = _.groupBy(
      studentAttendanceData,
      (item) => `${item.studentCode}-${item.semesterName}`,
    )

    // Nhóm dữ liệu điểm số theo studentCode & semesterName
    const groupedPoints = _.groupBy(
      studentPointData,
      (item) => `${item.studentCode}-${item.semesterName}`,
    )

    const mergedResult: StudentCareComparisonData[] = []

    // Lấy danh sách khóa chung từ cả hai nhóm
    const allKeys = _.union(_.keys(groupedAttendance), _.keys(groupedPoints))

    allKeys.forEach((key) => {
      const [studentCode, semesterName] = key.split('-')
      const attendanceList = groupedAttendance[key] || []
      const pointList = groupedPoints[key] || []

      // Nhóm dữ liệu theo môn học (subjectCode)
      const subjectMap = new Map<
        string,
        {
          subjectCode: string
          className: string
          totalAbsences?: number
          totalSlots?: number
          absenceRate?: number
          isIncreased?: boolean
          averageMark?: number
          isAttendanceFail?: boolean
        }
      >()

      attendanceList.forEach((att) => {
        subjectMap.set(att.subjectCode, {
          subjectCode: att.subjectCode,
          className: att.className,
          totalAbsences: att.totalAbsences,
          totalSlots: att.totalSlots,
          absenceRate: att.absenceRate,
          isIncreased: att.isIncreased,
        })
      })

      pointList.forEach((point) => {
        if (!subjectMap.has(point.subjectCode)) {
          subjectMap.set(point.subjectCode, {
            subjectCode: point.subjectCode,
            className: point.className,
          })
        }
        const subject = subjectMap.get(point.subjectCode)
        if (subject) {
          Object.assign(subject, {
            averageMark: point.averageMark,
            isAttendanceFail: point.isAttendanceFail,
          })
        }
      })

      mergedResult.push({
        studentCode,
        semesterName,
        subjects: Array.from(subjectMap.values()),
      })
    })

    setMergedData(mergedResult)
  }, [studentAttendanceData, studentPointData, studentCode])

  return mergedData
}
