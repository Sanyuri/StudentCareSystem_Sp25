import { Table } from 'antd'
import { FC, ReactNode } from 'react'
import { ColumnType } from 'antd/lib/table'
import { useTranslation } from 'react-i18next'
import { StudentFailedCourseResponse } from '#src/types/ResponseModel/StudentFailedCourseResponse.js'
import { FailReason } from '#src/types/Enums/FailReason.js'
import { PointStatus } from '#src/types/Enums/PointStatus.js'

interface TableDetailStudentFailedCourseProps {
  dataSource: StudentFailedCourseResponse[] | undefined
  scroll?: { y: number }
  loading?: boolean
}

const TableDetailStudentFailedCourse: FC<TableDetailStudentFailedCourseProps> = ({
  dataSource,
  scroll,
  loading,
}: TableDetailStudentFailedCourseProps): ReactNode => {
  const { t } = useTranslation()
  const columns: ColumnType<StudentFailedCourseResponse>[] = [
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.SUBJECT_CODE'),
      dataIndex: 'subjectCode',
      key: 'subjectCode',
      align: 'center',
      render: (text: string): ReactNode => <span>{text}</span>,
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.AVERAGE_MARK'),
      dataIndex: 'averageMark',
      key: 'averageMark',
      align: 'center',
      render: (text: number): ReactNode => <span>{text}</span>,
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.CLASS'),
      dataIndex: 'className',
      key: 'className',
      align: 'center',
      render: (text: string): ReactNode => <span>{text}</span>,
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.SEMESTER'),
      dataIndex: 'semesterName',
      key: 'semesterName',
      align: 'center',
      render: (text: string): ReactNode => <span>{text}</span>,
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.DESCRIPTION'),
      key: 'description',
      width: 160,
      align: 'center',
      render: (record: StudentFailedCourseResponse): string => {
        if (record.failReason === FailReason.Suspension) {
          return t('STUDENT_FAILED_COURSE.TABLE_COLUMN.SUSPENDED')
        } else if (record.failReason === FailReason.AttendanceFail) {
          return t('STUDENT_FAILED_COURSE.TABLE_COLUMN.ATTENDANCE_FAIL')
        } else if (
          record.failReason === FailReason.InsufficientPoints ||
          record.pointStatus === PointStatus.Failed
        ) {
          return t('STUDENT_FAILED_COURSE.TABLE_COLUMN.MARK_FAIL')
        } else {
          return record.failReason || 'Null'
        }
      },
    },
  ]

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          scroll={scroll}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey='id'
        />
      )}
    </>
  )
}
export default TableDetailStudentFailedCourse
