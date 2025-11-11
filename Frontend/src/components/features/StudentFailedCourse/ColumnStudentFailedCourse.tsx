import { ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Space, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { StudentModel } from '#src/types/Data/StudentModel.js'
import { StudentNoteModel } from '#types/Data/StudentModel.js'
import { DefaultNoteType } from '#utils/constants/Note/index.js'
import NoteComponent from '#components/common/note/NoteComponent.js'
import { useNoteTypeDefaultData } from '#hooks/api/noteType/useNoteTypeData.js'
import { StudentFailedCourseResponse } from '#src/types/ResponseModel/StudentFailedCourseResponse.js'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'
import { FailReason } from '#src/types/Enums/FailReason.js'
import { PointStatus } from '#src/types/Enums/PointStatus.js'

const useStudentFailedCourseColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  showModal: (Id: string, studentCode: string, type: 'detail') => void,
): ColumnProps<StudentFailedCourseResponse>[] => {
  const { t } = useTranslation()
  const { data: attendanceNoteType } = useNoteTypeDefaultData(DefaultNoteType.FailSubject)
  return [
    {
      title: '#',
      dataIndex: 'id',
      width: 63,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (_: unknown, __: StudentFailedCourseResponse, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.STUDENT_CODE'),
      dataIndex: 'student',
      key: 'studentCode',
      align: 'center',
      width: 160,
      fixed: !screens.xs ? 'left' : false,
      render: (student: StudentModel, record: StudentFailedCourseResponse): ReactNode => (
        <button
          onClick={(): void => showModal(record.id, student.studentCode, 'detail')}
          style={{
            cursor: 'pointer',
            color: '#1890ff',
            background: 'none',
            border: 'none',
            padding: 0,
          }}
        >
          {student.studentCode}
        </button>
      ),
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.STUDENT_NAME'),
      dataIndex: 'student',
      key: 'studentName',
      align: 'center',
      width: 160,
      fixed: !screens.xs ? 'left' : false,
      render: (student: StudentModel): ReactNode => {
        return <span>{student?.studentName ?? 'Null'}</span>
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.EMAIL'),
      dataIndex: 'student',
      key: 'email',
      width: 160,
      align: 'center',
      render: (student: StudentModel): ReactNode => {
        return <HideValueSensitive data={student?.email} />
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.PHONE'),
      dataIndex: 'student',
      key: 'mobilePhone',
      width: 160,
      align: 'center',
      render: (student: StudentModel): ReactNode => {
        return <HideValueSensitive data={student?.mobilePhone} />
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.CLASS'),
      dataIndex: 'className',
      key: 'className',
      width: 160,
      align: 'center',
      render: (record: string): ReactNode => {
        return <span>{record || 'Null'}</span>
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.SPECIALIZATION'),
      dataIndex: 'student',
      key: 'specialization',
      width: 160,
      align: 'center',
      render: (student: StudentModel): ReactNode => {
        return <span>{student?.specialization || 'Null'}</span>
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.MAJOR'),
      dataIndex: 'student',
      key: 'major',
      width: 160,
      align: 'center',
      render: (student: StudentModel): ReactNode => {
        return <span>{student?.major || 'Null'}</span>
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.SEMESTER'),
      dataIndex: 'semesterName',
      key: 'semesterName',
      width: 160,
      align: 'center',
      render: (record: string): ReactNode => {
        return <span>{record || 'Null'}</span>
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.SUBJECT_CODE'),
      dataIndex: 'subjectCode',
      key: 'subjectCode',
      width: 160,
      align: 'center',
      render: (record: string): ReactNode => {
        return <span>{record || 'Null'}</span>
      },
    },
    {
      title: t(`STUDENT_FAILED_COURSE.TABLE_COLUMN.AVERAGE_MARK`),
      dataIndex: 'averageMark',
      key: 'averageMark',
      width: 160,
      align: 'center',
      render: (record: number): ReactNode => {
        return <span>{record}</span>
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.DESCRIPTION'),
      key: 'description',
      width: 160,
      align: 'center',
      render: (record: StudentFailedCourseResponse): string => {
        const failReason = record.failReason
        if (failReason === FailReason.Suspension) {
          return t('STUDENT_FAILED_COURSE.TABLE_COLUMN.SUSPENDED')
        } else if (failReason === FailReason.AttendanceFail) {
          return t('STUDENT_FAILED_COURSE.TABLE_COLUMN.ATTENDANCE_FAIL')
        } else if (
          failReason === FailReason.InsufficientPoints ||
          record.pointStatus === PointStatus.Failed
        ) {
          return t('STUDENT_FAILED_COURSE.TABLE_COLUMN.MARK_FAIL')
        } else {
          return failReason || 'Null'
        }
      },
    },
    {
      title: t('STUDENT_FAILED_COURSE.TABLE_COLUMN.ACTION'),
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (_: unknown, record: StudentFailedCourseResponse): ReactNode => {
        if (!attendanceNoteType) {
          return <Spin />
        }
        const studentData: StudentNoteModel = {
          studentName: record.student.studentName,
          studentCode: record.student.studentCode,
        }
        return (
          <Space size='middle'>
            <NoteComponent
              noteType={attendanceNoteType}
              studentRecord={studentData}
              entityId={record.id}
            />
          </Space>
        )
      },
    },
  ]
}

export default useStudentFailedCourseColumn
