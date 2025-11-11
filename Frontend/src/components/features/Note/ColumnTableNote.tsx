import { ReactNode } from 'react'
import i18n from '#src/plugins/i18n.js'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { Breakpoint, Button, Space } from 'antd'
import HandleFunctionNote from './HandleFunctionNote'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'
import { NoteModel } from '#types/Data/NoteModel.js'

const useNoteColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  searchValue: string, // Check the search value
  onStudentCodeClick: (studentCode: string) => void, // New callback
  showModal: (userId: string, type: 'detail' | 'edit' | 'delete') => void,
): ColumnProps<NoteModel>[] => {
  const { t } = useTranslation()
  const currentLanguage: string = i18n.language

  // Columns for expanded view (with search)
  return [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (_: unknown, __: NoteModel, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('NOTES.TABLE_COLUMN.STUDENT_CODE'),
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: 120,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (text: string): ReactNode => (
        <Button type='link' onClick={(): void => onStudentCodeClick(text)}>
          {text || 'N/A'}
        </Button>
      ),
    },
    {
      title: t('NOTES.TABLE_COLUMN.STUDENT_NAME'),
      dataIndex: ['student', 'studentName'],
      key: 'studentName',
      width: 150,
      align: 'center',
      render: (text: string): ReactNode => <span>{text || 'N/A'}</span>,
    },
    {
      title: t('NOTES.TABLE_COLUMN.PHONE_NUMBER'),
      dataIndex: ['student', 'mobilePhone'],
      key: 'mobilePhone',
      width: 120,
      align: 'center',
      render: (text: string): ReactNode => <HideValueSensitive data={text} />,
    },
    {
      title: t('NOTES.TABLE_COLUMN.PARENT_PHONE'),
      dataIndex: ['student', 'parentPhone'],
      key: 'parentPhone',
      width: 120,
      align: 'center',
      render: (text: string): ReactNode => <HideValueSensitive data={text} />,
    },
    {
      title: t('NOTES.TABLE_COLUMN.NOTE_TYPE'),
      dataIndex:
        currentLanguage === 'vi' ? ['noteType', 'vietnameseName'] : ['noteType', 'englishName'],
      key: 'noteType',
      align: 'center',
      width: 150,
      render: (text: string): ReactNode => <span>{text || 'N/A'}</span>,
    },
    {
      title: t('NOTES.TABLE_COLUMN.NOTE_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      width: 250,
      render: (text: string): ReactNode => <span>{text || 'N/A'}</span>,
    },
    {
      title: t('NOTES.TABLE_COLUMN.SEMESTER'),
      dataIndex: 'semesterName',
      key: 'semesterName',
      align: 'center',
      width: 100,
      render: (text: string): ReactNode => <span>{text || 'N/A'}</span>,
    },
    {
      title: t('NOTES.TABLE_COLUMN.DATE'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 100,
      render: (text: string): ReactNode => (
        <span>{new Date(text).toLocaleDateString('vi-VN') || 'N/A'}</span>
      ),
    },
    {
      title: t('NOTES.TABLE_COLUMN.CARE_OFFICER'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      align: 'center',
      width: 150,
      render: (text: string): ReactNode => <span>{text || 'N/A'}</span>,
    },
    {
      title: t('APPLICATION_TYPE.TABLE_COLUMN.ACTION'),
      key: 'action',
      width: 110,
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: NoteModel) => (
        <Space size='middle'>
          <HandleFunctionNote Note={record} type={'Edit'} showModal={showModal} />
          <HandleFunctionNote Note={record} type={'Delete'} showModal={showModal} />
        </Space>
      ),
    },
  ]
}

export default useNoteColumn
