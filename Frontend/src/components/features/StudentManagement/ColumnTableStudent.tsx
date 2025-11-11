import { ReactNode } from 'react'
import { Breakpoint, Space } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { StudentProgress } from '#types/Enums/StudentProgress.js'
import { StudentModel, StudentNoteModel } from '#types/Data/StudentModel.js'
import NoteStudentComponent from '#components/features/StudentManagement/NoteStudentComponent.js'
import AddStudentPsychology from '../StudentPsychology/AddStudentPsychology'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'

const useStudentColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
): ColumnProps<StudentModel>[] => {
  const { t } = useTranslation()
  return [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: unknown, __: StudentModel, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.STUDENT_CODE'),
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: 120,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.STUDENT_NAME'),
      dataIndex: 'studentName',
      key: 'studentName',
      align: 'center',
      width: 110,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.CLASS'),
      dataIndex: 'class',
      key: 'class',
      align: 'center',
      width: 110,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.MAJOR'),
      key: 'major',
      dataIndex: 'major',
      align: 'center',
      width: 100,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.SPECIALIZATION'),
      key: 'specialization',
      dataIndex: 'specialization',
      align: 'center',
      width: 130,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.EMAIL'),
      key: 'email',
      dataIndex: 'email',
      align: 'center',
      width: 110,
      render: (text: string): ReactNode => {
        return <HideValueSensitive data={text} />
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.GENDER'),
      key: 'gender',
      dataIndex: 'gender',
      align: 'center',
      width: 90,
      render: (text: string): ReactNode => {
        return <span>{text || 'Null'}</span>
      },
    },
    {
      title: t('STUDENTS.TABLE_COLUMN.Status'),
      key: 'statusCode',
      dataIndex: 'statusCode',
      align: 'center',
      width: 110,
      render: (text: string): ReactNode => {
        return (
          <span>
            {t(StudentProgress[text.toUpperCase() as keyof typeof StudentProgress]) || 'Null'}
          </span>
        )
      },
    },

    {
      title: t('STUDENTS.TABLE_COLUMN.SEMESTER'),
      key: 'currentTermNo',
      dataIndex: 'currentTermNo',
      align: 'center',
      width: 110,
      render: (text: string): ReactNode => {
        return <span>{text ?? 'Null'}</span>
      },
    },
    {
      title: t('ATTENDANCES.TABLE_COLUMN.ACTION'),
      key: 'action',
      width: 100,
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: StudentModel): ReactNode => {
        const studentData: StudentNoteModel = {
          studentName: record.studentName,
          studentCode: record.studentCode,
        }
        return (
          <Space size='middle'>
            <AddStudentPsychology studentCode={record.studentCode} />
            <NoteStudentComponent studentRecord={studentData} />
          </Space>
        )
      },
    },
  ]
}

export default useStudentColumn
