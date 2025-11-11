import { ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Breakpoint, Space, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { StudentModel } from '#src/types/Data/StudentModel.js'
import { StudentNoteModel } from '#types/Data/StudentModel.js'
import { DefaultNoteType } from '#utils/constants/Note/index.js'
import NoteComponent from '#components/common/note/NoteComponent.js'
import { StudentDeferModel } from '#src/types/Data/StudentDeferModel.js'
import { StudentDeferStatus } from '#src/types/Enums/StudentDeferStatus.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import { useNoteTypeDefaultData } from '#hooks/api/noteType/useNoteTypeData.js'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'

const useDeferColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
): ColumnProps<StudentDeferModel>[] => {
  const { t } = useTranslation()
  const { data: deferNoteType } = useNoteTypeDefaultData(DefaultNoteType.Defer)

  return [
    {
      title: '#',
      dataIndex: 'id',
      width: 63,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (_: unknown, __: StudentDeferModel, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.STUDENT_NAME'),
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
      title: t('STUDENTS.TABLE_COLUMN.STUDENT_CODE'),
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: 110,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.EMAIL'),
      dataIndex: 'student',
      key: 'email',
      align: 'center',
      width: 140,
      render: (student: StudentModel): ReactNode => {
        return <HideValueSensitive data={student?.email} />
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.PHONE'),
      dataIndex: 'student',
      key: 'phone',
      align: 'center',
      width: 120,
      render: (student: StudentModel): ReactNode => {
        return <HideValueSensitive data={student?.mobilePhone} />
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.PARENT_PHONE'),
      dataIndex: 'student',
      key: 'parentPhone',
      align: 'center',
      width: 120,
      render: (student: StudentModel): ReactNode => {
        return <HideValueSensitive data={student?.parentPhone} />
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.MAJOR'),
      dataIndex: 'student',
      key: 'major',
      align: 'center',
      width: 100,
      render: (student: StudentModel): ReactNode => {
        return <span>{student?.major ?? 'null'}</span>
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.SPECIALIZATION'),
      dataIndex: 'student',
      key: 'specialization',
      align: 'center',
      width: 120,
      render: (student: StudentModel): ReactNode => {
        return <span>{student?.specialization ?? 'null'}</span>
      },
    },
    {
      title: t('DEFERS.TABLE_COLUMN.DEFERMENT_DATE'),
      dataIndex: 'defermentDate',
      key: 'defermentDate',
      align: 'center',
      width: 150,
      render: (text: string): ReactNode => {
        return <span>{convertToLocalDateTime(text) || 'Null'}</span>
      },
    },
    {
      title: t('DEFERS.TABLE_COLUMN.DEFERMENT_PERIOD'),
      dataIndex: 'defermentPeriod',
      key: 'defermentPeriod',
      align: 'center',
      width: 200,
      render: (_: StudentDeferModel, record: StudentDeferModel): ReactNode => {
        const startDateFormatted: string = convertToLocalDateTime(record?.startDate.toString())
        const endDateFormatted: string = convertToLocalDateTime(record?.endDate.toString())

        return (
          <span>
            {startDateFormatted} - {endDateFormatted} - {record?.deferredSemesterName}
          </span>
        )
      },
    },
    {
      title: t('DEFERS.TABLE_COLUMN.DEFERMENT_TYPE'),
      dataIndex: 'studentDeferType',
      key: 'studentDeferType',
      align: 'center',
      width: 130,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    // {
    //   title: t('DEFERS.TABLE_COLUMN.DESCRIPTION'),
    //   key: 'description',
    //   dataIndex: 'description',
    //   align: 'center',
    //   width: 150,
    //   render: (text: string) => {
    //     return <span>{text || 'Null'}</span>
    //   },
    // },
    {
      title: t('DEFERS.TABLE_COLUMN.STATUS'),
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (status: StudentDeferStatus): ReactNode => {
        return <span>{t(`DEFERS.DEFER_STATUS.${status.toUpperCase()}`)}</span>
      },
    },
    {
      title: t('DEFERS.TABLE_COLUMN.ACTION'),
      key: 'action',
      align: 'center',
      width: 100,
      fixed: !screens.xs ? 'right' : false,
      render: (_: unknown, record: StudentDeferModel): ReactNode => {
        const studentData: StudentNoteModel = {
          studentName: record.student.studentName,
          studentCode: record.student.studentCode,
        }
        if (!deferNoteType) {
          return <Spin />
        }
        return (
          <Space size='middle'>
            <NoteComponent
              noteType={deferNoteType}
              studentRecord={studentData}
              entityId={record.id}
            />
          </Space>
        )
      },
    },
  ]
}

export default useDeferColumn
