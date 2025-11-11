import { useEmailLogsData } from '#hooks/api/emailLog/useEmailLogData.js'
import { EmailLogRequest } from '#src/types/RequestModel/EmailLogRequest.js'
import { Button, Table, Tooltip } from 'antd'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EmailLogModal from './EmailLogModal'
import StudentEmailLogModal from './StudentEmailLogModal'
import { convertToLocalDate } from '#utils/helper/convertToCurrentTime.js'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'

interface EmailLogTableProps {
  filter: EmailLogRequest
  onFilterChange: (newFilter: EmailLogRequest) => void
}

const EmailLogTable: FC<EmailLogTableProps> = ({ filter, onFilterChange }) => {
  const { t } = useTranslation()

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [studentModalVisible, setStudentModalVisible] = useState(false)
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(null)

  const { data, isLoading } = useEmailLogsData(filter)

  const handlePageChange = (page: number, pageSize?: number) => {
    onFilterChange({ ...filter, pageNumber: page, pageSize: pageSize || 10 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRowClick = (record: any) => {
    setSelectedId(record.id)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedId(null)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRecipientClick = (record: any) => {
    setSelectedStudentEmail(record)
    setStudentModalVisible(true)
  }

  const handleStudentModalClose = () => {
    setStudentModalVisible(false)
    setSelectedStudentEmail(null)
  }

  const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const getEmailStateLabel = (type: string, t: (key: string) => string): string => {
    type = capitalizeFirstLetter(type)
    return t(`EMAIL_LOG.EMAIL_STATE.${type}`) || t('EMAIL_LOG.EMAIL_STATE.Unknown')
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center' as const,
      width: 70,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, __: any, index: number) =>
        index + 1 + (filter.pageNumber - 1) * filter.pageSize,
    },
    {
      title: t('EMAIL_LOG.TABLE.SUBJECT'),
      width: 170,
      dataIndex: 'subject',
      align: 'center' as const,
      key: 'subject' as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: any, record: any) => (
        <Tooltip title={text || '-'}>
          <Button
            style={{
              color: '#1890ff',
              textDecoration: 'underline',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
            onClick={() => handleRowClick(record)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRowClick(record)
              }
            }}
            tabIndex={0}
          >
            {text || '-'}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: t('EMAIL_LOG.TABLE.RECIPIENT_EMAIL'),
      dataIndex: 'recipientEmail',
      width: 200,
      align: 'center' as const,
      key: 'recipientEmail',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: any, record: any) => (
        <Tooltip title={text || '-'}>
          <Button
            style={{
              color: '#1890ff',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'hidden',
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
            onClick={() => handleRecipientClick(record)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRecipientClick(record)
              }
            }}
            tabIndex={0}
          >
            <HideValueSensitive data={text} />
          </Button>
        </Tooltip>
      ),
    },
    {
      title: t('EMAIL_LOG.TABLE.EMAIL_TYPE'),
      dataIndex: 'emailType',
      align: 'center' as const,
      key: 'emailType',
      render: (type: string | null | undefined) =>
        t(`EMAILTEMPLATES.EMAILTEMPLATES_OPTIONS.${type?.toUpperCase() || 'UNKNOWN'}`),
    },
    // {
    //   title: 'Bcc',
    //   dataIndex: 'bccEmails',
    //   align: 'center' as const,
    //   key: 'bccEmails',
    // },
    // {
    //   title: 'Cc',
    //   dataIndex: 'ccEmails',
    //   align: 'center' as const,
    //   key: 'ccEmails',
    // },
    {
      title: t('EMAIL_LOG.TABLE.SEMESTER'),
      dataIndex: 'semesterName',
      align: 'center' as const,
      key: 'semesterName',
    },
    {
      title: t('EMAIL_LOG.TABLE.EMAIL_STATE'),
      dataIndex: 'emailState',
      align: 'center' as const,
      render: (type: string) => getEmailStateLabel(type, t),
    },
    {
      title: t('EMAIL_LOG.TABLE.CREATED_AT'),
      dataIndex: 'createdAt',
      align: 'center' as const,
      key: 'createdAt',
      render: (text: string) => convertToLocalDate(text),
    },
  ]

  return (
    <div>
      <Table
        dataSource={data?.items || []}
        columns={columns}
        pagination={{
          current: filter.pageNumber,
          onChange: handlePageChange,
          total: data?.totalItems,
          pageSize: filter.pageSize,
          showSizeChanger: true,
          position: ['bottomCenter'],
          showTotal: (total: number) => t('COMMON.TOTAL_RECORDS', { total }),
          align: 'start',
        }}
        scroll={{ y: '48vh' }}
        sticky={{ offsetHeader: 64 }}
        rowKey='id'
        bordered
        loading={isLoading}
        size='large'
      />
      {selectedId && (
        <EmailLogModal visible={modalVisible} onClose={handleModalClose} id={selectedId} />
      )}
      {selectedStudentEmail && (
        <StudentEmailLogModal
          visible={studentModalVisible}
          onClose={handleStudentModalClose}
          emailData={selectedStudentEmail}
        />
      )}
    </div>
  )
}

export default EmailLogTable
