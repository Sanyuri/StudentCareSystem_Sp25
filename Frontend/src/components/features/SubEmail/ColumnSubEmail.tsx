import _ from 'lodash'
import { Space } from 'antd/lib'
import { Breakpoint, Button } from 'antd'
import { ReactNode } from 'react'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import HandleFunctionSubEmail from './HandleFunctionSubEmail.js'
import { SubEmailResponse } from '#types/ResponseModel/ApiResponse.js'
import { convertToHtml } from '#components/common/react-quill/React-Quill.js'
import { useEmailTemplateTypeOptions } from '#utils/constants/EmailTemplate/index.js'

const useSubEmailColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  showModal: (subEmailId: string, type: 'detail' | 'edit' | 'delete') => void,
): ColumnProps<SubEmailResponse>[] => {
  const { t, i18n } = useTranslation()
  const { emailTemplateTypeOptions } = useEmailTemplateTypeOptions()
  const currentLanguage: string = i18n.language
  return [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center',
      fixed: !screens.xs ? 'left' : false, // Remove fixed on mobile screens
      render: (_: unknown, __: SubEmailResponse, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('SUB_EMAIL.COLUMN.NAME'),
      dataIndex: 'name',
      key: 'name',
      width: 70,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (text: string, record: SubEmailResponse) => {
        const handleShowModal = (): void => {
          showModal(record.id, 'detail') // Move showModal logic here
        }

        return (
          <Button
            onClick={handleShowModal}
            style={{
              cursor: 'pointer',
              color: '#1890ff',
              background: 'none',
              border: 'none',
              padding: 0,
              overflow: 'hidden',
            }}
            tabIndex={0}
            onKeyUp={(e): void => {
              if (e.key === 'Enter' || e.key === ' ') handleShowModal()
            }}
          >
            {text}
          </Button>
        )
      },
    },
    {
      title: t('SUB_EMAIL.COLUMN.EMAIL_TYPE'),
      dataIndex: 'emailType',
      key: 'emailType',
      align: 'center',
      width: 110,
      render: (text: string) => (
        <span>{_.get(_.find(emailTemplateTypeOptions, { value: text }), 'label')}</span>
      ),
    },
    {
      title: t('SUB_EMAIL.COLUMN.CONTENT'),
      dataIndex: 'content',
      key: 'content',
      width: 120,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (content: string) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: convertToHtml(content, true),
            }}
          />
        )
      },
    },
    {
      title: t('SUB_EMAIL.COLUMN.DESCRIPTION'),
      dataIndex: currentLanguage === 'vi' ? 'vietnameseDescription' : 'englishDescription',
      key: currentLanguage === 'vi' ? 'vietnameseDescription' : 'englishDescription',
      align: 'center',
      width: 110,
    },
    {
      title: t('SUB_EMAIL.COLUMN.ACTION'),
      key: 'action',
      width: 110,
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: SubEmailResponse): ReactNode => (
        <Space size='middle'>
          <HandleFunctionSubEmail subEmail={record} type={'Edit'} showModal={showModal} />
          <HandleFunctionSubEmail subEmail={record} type={'Delete'} showModal={showModal} />
        </Space>
      ),
    },
  ]
}

export default useSubEmailColumn
