import { ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Space, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { StudentModel, StudentNoteModel } from '#types/Data/StudentModel.js'
import { DefaultNoteType } from '#utils/constants/Note/index.js'
import NoteComponent from '#components/common/note/NoteComponent.js'
import { StudentAttendance } from '#src/types/ResponseModel/ApiResponse.js'
import { convertToLocalDate } from '#utils/helper/convertToCurrentTime.js'
import { useNoteTypeDefaultData } from '#hooks/api/noteType/useNoteTypeData.js'
import AbsenceChart from './AttendanceChart'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'

const useAttendanceColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
): ColumnProps<StudentAttendance>[] => {
  const { t } = useTranslation()
  const { data: attendanceNoteType, isLoading: isLoadingNoteType } = useNoteTypeDefaultData(
    DefaultNoteType.Attendance,
  )
  return [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: unknown, __: StudentAttendance, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.STUDENT_NAME'),
      dataIndex: 'student',
      key: 'studentName',
      width: 120,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (student: StudentModel): ReactNode => {
        return <span>{student?.studentName ?? 'Null'}</span>
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.STUDENT_ID'),
      dataIndex: 'student',
      key: 'studentCode',
      align: 'center',
      width: 110,
      render: (student: StudentModel): ReactNode => {
        return <span>{student?.studentCode ?? 'Null'}</span>
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.LAST_EMAIL_SENT'),
      key: 'latestEmailSentDate',
      hidden: true,
      dataIndex: 'latestEmailSentDate',
      align: 'center',
      width: 110,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.CLASS'),
      key: 'className',
      dataIndex: 'className',
      align: 'center',
      width: 100,
      render: (text: string): ReactNode => {
        return <span>{text ?? 'Null'}</span>
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.PHONE'),
      key: 'phone',
      dataIndex: 'student',
      align: 'center',
      width: 110,
      render: (student: StudentModel): ReactNode => {
        return <HideValueSensitive data={student?.mobilePhone} />
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.MAJOR'),
      key: 'major',
      dataIndex: 'student',
      align: 'center',
      width: 90,
      render: (student: StudentModel): ReactNode => {
        return <span>{student?.major ?? 'Null'}</span>
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.SEMESTER'),
      key: 'semesterName',
      dataIndex: 'semesterName',
      align: 'center',
      width: 80,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.CURRENT_TERM'),
      key: 'currentTermNo',
      dataIndex: 'currentTermNo',
      align: 'center',
      width: 80,
      render: (text: number): ReactNode => {
        return <span>{text ?? 'Null'}</span>
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.UPDATE_PERIOD'),
      key: 'updatedPeriod',
      dataIndex: 'updatedPeriod',
      align: 'center',
      width: 110,
      render: (text: string): ReactNode => {
        if (!text) {
          return <span>Null</span>
        }
        return <span>{convertToLocalDate(text)}</span>
      },
    },
    {
      title: (
        <div>
          {t('ATTENDANCES.TABLE_COLUMN.EXPIRED_COURSE')}
          <div className='text-gray-500 text-xs'>(Absent/Total)</div>
        </div>
      ),
      key: 'subjectCode',
      dataIndex: 'subjectCode',
      align: 'center',
      width: 110,
      render: (
        text: string,
        record: {
          totalAbsences: number
          totalSlots: number
          absenceRate: number
          isIncreased: boolean
        },
      ): ReactNode => {
        const percentage: number =
          record.totalSlots > 0 ? Math.round((record.totalAbsences / record.totalSlots) * 100) : 0

        return (
          <div>
            <div>
              {text}{' '}
              {record.isIncreased ? (
                <ArrowUpOutlined style={{ color: 'red' }} />
              ) : (
                <ArrowDownOutlined style={{ color: 'green' }} />
              )}
            </div>
            <div className='mt-1'>
              ({record.totalAbsences}/{record.totalSlots} - {percentage}% )
            </div>
          </div>
        )
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.ACTION'),
      key: 'action',
      width: 100,
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: StudentAttendance): ReactNode => {
        if (isLoadingNoteType) {
          return <Spin />
        }
        const studentData: StudentNoteModel = {
          studentName: record.student.studentName,
          studentCode: record.student.studentCode,
        }
        return (
          <Space size='middle'>
            <AbsenceChart id={record.id} />
            {/*<SendNotifyAttendance studentData={record} type={'Email'} />*/}
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

export default useAttendanceColumn
