import { Space } from 'antd/lib'
import { Breakpoint } from 'antd'
import { ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import useAuthStore from '#stores/authState.js'
import HandleFunctionEmailTemplate from './HandleFunctionEmailTemplate'
import { convertToLocalDate } from '#utils/helper/convertToCurrentTime.js'
import { EmailTemplateResponse } from '#src/types/ResponseModel/ApiResponse.js'

const useEmailTemplateColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  showModal: (emailTemplateId: string, type: 'detail' | 'edit' | 'delete') => void,
): ColumnProps<EmailTemplateResponse>[] => {
  const { t } = useTranslation()
  const { role } = useAuthStore()
  return [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: unknown, __: EmailTemplateResponse, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('EMAILTEMPLATES.TABLE_COLUMN.SUBJECT'),
      dataIndex: 'subject',
      key: 'subject',
      align: 'center',
      width: 150,
      render: (text: string, record: EmailTemplateResponse): ReactNode => (
        <button
          onClick={(): void => showModal(record.id, 'detail')}
          style={{
            cursor: 'pointer',
            color: '#1890ff',
            background: 'none',
            border: 'none',
            padding: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {text}
        </button>
      ),
    },
    {
      title: t('EMAILTEMPLATES.TABLE_COLUMN.CC_EMAILS'),
      dataIndex: 'ccEmails',
      key: 'cc',
      align: 'center',
      width: 150,
      render: (text: string[]): ReactNode => (
        <div>{text?.map((email: string): ReactNode => <div key={email}>{email}</div>)}</div>
      ),
    },
    {
      title: t('EMAILTEMPLATES.TABLE_COLUMN.BCC_EMAILS'),
      dataIndex: 'bccEmails',
      key: 'bcc',
      align: 'center',
      width: 150,
      render: (text: string[]): ReactNode => (
        <div>
          {text?.map((email: string, index: number): ReactNode => <div key={index}>{email}</div>)}
        </div>
      ),
    },
    {
      title: t('EMAILTEMPLATES.TABLE_COLUMN.REPLY_TO_EMAIL'),
      dataIndex: 'replyToEmail',
      key: 'replyToEmail',
      align: 'center',
      width: 150,
      render: (text: string): ReactNode => (
        <div>
          <div>{text}</div>
        </div>
      ),
    },
    {
      title: t('EMAILTEMPLATES.TABLE_COLUMN.CREATED_AT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: Date, record: EmailTemplateResponse): string => {
        return convertToLocalDate(record.createdAt.toString())
      },
    },
    {
      title: t('EMAILTEMPLATES.TABLE_COLUMN.LAST_MODIFIED_AT'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: Date, record: EmailTemplateResponse): string => {
        return convertToLocalDate(record.updatedAt?.toString() ?? record.createdAt.toString())
      },
    },
    {
      title: t('EMAILTEMPLATES.TABLE_COLUMN.ACTION'),
      key: 'action',
      width: 100,
      hidden: role !== 'Manager',
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: EmailTemplateResponse): ReactNode => {
        return (
          <Space size='middle'>
            <HandleFunctionEmailTemplate
              EmailTemplate={record}
              type={'edit'}
              showModal={showModal}
            />
            <HandleFunctionEmailTemplate
              EmailTemplate={record}
              type={'delete'}
              showModal={showModal}
            />
          </Space>
        )
      },
    },
  ]
}

export default useEmailTemplateColumn
