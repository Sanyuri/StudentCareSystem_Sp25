import { Modal, Typography, Space } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { FC } from 'react'
import { EmailTemplateResponse } from '#types/ResponseModel/ApiResponse.js'
import { convertToHtml } from '#components/common/react-quill/React-Quill.js'

const { Text } = Typography

interface EmailTemplatePreviewProps {
  visible: boolean
  onClose: () => void
  template: EmailTemplateResponse
}

const EmailDeferPreview: FC<EmailTemplatePreviewProps> = ({ visible, onClose, template }) => {
  return (
    <Modal
      title={
        <div className='flex justify-between items-center'>
          <span>Chi tiết mẫu email</span>
        </div>
      }
      open={visible}
      footer={null}
      onCancel={onClose}
      width={600}
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <div className='flex items-center gap-2'>
          <CalendarOutlined />
          <Text>Thời gian tạo: {template.createdAt.toString()}</Text>
        </div>

        <div className='flex items-center gap-2'>
          <CalendarOutlined />
          <Text>Thời gian cập nhật lần cuối: {template.updatedAt?.toString()}</Text>
        </div>

        <div>
          <Text strong>Chủ đề</Text>
          <div className='mt-1 p-2  rounded'>{template.subject}</div>
        </div>

        <div>
          <Text strong>Cc</Text>
          <div className='mt-1 p-2  rounded'>{template.ccEmails || ''}</div>
        </div>

        <div>
          <Text strong>Bcc</Text>
          <div className='mt-1 p-2 rounded'>{template.bccEmails}</div>
        </div>

        <div>
          <Text strong>Nội dung</Text>
          <div className='mt-1 p-2  rounded'>
            <div
              dangerouslySetInnerHTML={{
                __html: convertToHtml(template.content, true),
              }}
            />
          </div>
        </div>
      </Space>
    </Modal>
  )
}

export default EmailDeferPreview
