import { Space } from 'antd/lib'
import { Breakpoint } from 'antd'
import { ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { convertToLocalDate } from '#utils/helper/convertToCurrentTime.js'
import HandleFunctionApplicationType from './HandleFunctionApplicationType'
import { ApplicationTypeResponse } from '#src/types/ResponseModel/ApplicationTypeResponse.js'

const useApplicationTypeColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  showModal: (ApplicationTypeId: string, type: 'detail' | 'edit' | 'delete') => void,
): ColumnProps<ApplicationTypeResponse>[] => {
  const { t, i18n } = useTranslation()
  const currentLanguage: string = i18n.language
  return [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: unknown, __: ApplicationTypeResponse, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('APPLICATION_TYPE.TABLE_COLUMN.APPLICATION_TYPE_NAME'),
      dataIndex: currentLanguage === 'vi' ? 'vietnameseName' : 'englishName',
      key: currentLanguage === 'vi' ? 'vietnameseName' : 'englishName',
      align: 'center',
      width: 110,
      render: (text: string, record: ApplicationTypeResponse) => {
        const handleShowModal = (): void => {
          showModal(record.id, 'detail') // Move showModal logic here
        }

        return (
          <button
            onClick={handleShowModal}
            style={{
              cursor: 'pointer',
              color: '#1890ff',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
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
      title: t('APPLICATION_TYPE.TABLE_COLUMN.CREATED_AT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (_: Date, record: ApplicationTypeResponse): string => {
        if (record.createdAt == null) {
          return '-'
        }
        return convertToLocalDate(record.createdAt.toString())
      },
    },
    {
      title: t('APPLICATION_TYPE.TABLE_COLUMN.LAST_MODIFIED_AT'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (_: Date, record: ApplicationTypeResponse): string => {
        if (record.updatedAt == null) {
          return '-'
        }
        return convertToLocalDate(record.updatedAt.toString())
      },
    },
    {
      title: t('APPLICATION_TYPE.TABLE_COLUMN.ACTION'),
      key: 'action',
      width: 110,
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: ApplicationTypeResponse): ReactNode => (
        <Space size='middle'>
          <HandleFunctionApplicationType
            ApplicationType={record}
            type={'Edit'}
            showModal={showModal}
          />
          <HandleFunctionApplicationType
            ApplicationType={record}
            type={'Delete'}
            showModal={showModal}
          />
        </Space>
      ),
    },
  ]
}

export default useApplicationTypeColumn
