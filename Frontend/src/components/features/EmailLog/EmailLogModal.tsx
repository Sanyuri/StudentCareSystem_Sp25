import { FC } from 'react'
import { Modal, Typography, Spin, Alert } from 'antd'
import { useEmailLogById } from '#hooks/api/emailLog/useEmailLogData.js'
import { convertToHtml } from '#components/common/react-quill/React-Quill.js'
import ReactQuill from 'react-quill'

const { Text } = Typography

interface EmailLogModalProps {
  visible: boolean
  onClose: () => void
  id: string
}

const EmailLogModal: FC<EmailLogModalProps> = ({ visible, onClose, id }) => {
  const { data, isLoading, isError, error } = useEmailLogById(id) // Fetch khi modal mở

  if (isError) {
    return <Alert message='Error' description={error?.message} type='error' showIcon />
  }

  return (
    <Modal
      title={data?.subject ?? 'Email Log'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {isLoading ? (
        <Spin tip='Loading email details...' />
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>Recipient: </Text>
            <Text>{data?.recipientEmail ?? 'N/A'}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>Cc emails: </Text>
            <Text>{data?.ccEmails ?? 'N/A'}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>Bcc emails: </Text>
            <Text>{data?.bccEmails ?? 'N/A'}</Text>
          </div>
          <div className='flex' style={{ marginBottom: '16px' }}>
            <Text strong>ReplyTo: </Text>
            <Text>{data?.replyToEmail ?? 'N/A'}</Text>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>Content:</Text>
            <ReactQuill
              value={convertToHtml(data?.content ?? 'No content provided.', false)}
              readOnly
              style={{ marginTop: '8px' }}
            />
          </div>
        </>
      )}
    </Modal>
  )
}

export default EmailLogModal
