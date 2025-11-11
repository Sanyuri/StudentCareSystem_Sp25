import { Space } from 'antd/lib'
import { Breakpoint } from 'antd'
import { ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import HandleFunctionSubject from './HandleFunctionSubject'
import { SubjectResponse } from '#src/types/ResponseModel/SubjectResponse.js'

const useSubjectColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  showModal: (SubjectId: string, type: 'detail' | 'edit' | 'delete') => void,
): ColumnProps<SubjectResponse>[] => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  return [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: unknown, __: SubjectResponse, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('SUBJECT.TABLE_COLUMN.SUBJECT_CODE'),
      dataIndex: 'subjectCode',
      key: 'subjectCode',
      align: 'center',
      width: 110,
      render: (text: string, record: SubjectResponse): ReactNode => {
        const handleShowModal = (): void => {
          showModal(record.id, 'detail') // Move showModal logic here
        }

        return (
          <button
            onClick={handleShowModal} // Call the separate function
            style={{
              cursor: 'pointer',
              color: '#1890ff',
              background: 'none',
              border: 'none',
              padding: 0,
            }} // Optional styling for clickable text
            tabIndex={0}
            onKeyUp={(e): void => {
              if (e.key === 'Enter' || e.key === ' ') handleShowModal()
            }} // Add keyboard support
          >
            {text}
          </button>
        )
      },
    },
    {
      title: t('SUBJECT.TABLE_COLUMN.SUBJECT_NAME'),
      dataIndex: currentLanguage === 'vi' ? 'vietnameseName' : 'englishName',
      key: currentLanguage === 'vi' ? 'vietnameseName' : 'englishName',
      align: 'center',
      width: 110,
    },
    {
      title: t('SUBJECT.TABLE_COLUMN.SUBJECT_GROUP'),
      dataIndex: 'subjectGroup',
      key: 'subjectGroup',
      align: 'center',
      width: 110,
    },
    {
      title: t('SUBJECT.TABLE_COLUMN.ACTION'),
      key: 'action',
      width: 110,
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: SubjectResponse): ReactNode => (
        <Space size='middle'>
          <HandleFunctionSubject Subject={record} type={'Delete'} showModal={showModal} />
        </Space>
      ),
    },
  ]
}

export default useSubjectColumn
