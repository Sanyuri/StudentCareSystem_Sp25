import { FailReason } from '../Enums/FailReason'
import { PointStatus } from '../Enums/PointStatus'

export type StudentFailedCourseRequest = {
  query: string
  semesters: string | undefined
  pointStatus: PointStatus | undefined
  failReason: FailReason | undefined
  pageNumber: number
  pageSize: number
}
