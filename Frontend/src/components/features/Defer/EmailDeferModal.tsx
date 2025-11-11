import { FC, ReactNode, useState } from 'react'
import { Button, DatePicker, Form, Modal, Select, Space } from 'antd'
import EmailDeferPreview from '#components/features/Defer/EmailDeferPreview.js'
import { EyeOutlined } from '@ant-design/icons'
import { EmailTemplateResponse } from '#types/ResponseModel/ApiResponse.js'
import { useEmailTemplateData } from '#hooks/api/emailTemplate/useEmailTemplateData.js'
import { AddNewEmailDeferRequest } from '#types/RequestModel/ApiRequest.js'
import { useAddEmailDeferMutation } from '#hooks/api/email/useEmailMutation.js'
import { EmailType } from '#types/Enums/EmailType.js'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const { RangePicker } = DatePicker
const { Option } = Select

interface EmailScheduleModalProps {
  visible: boolean
  onClose: () => void
}

const EmailDeferModal: FC<EmailScheduleModalProps> = ({
  visible,
  onClose,
}: EmailScheduleModalProps): ReactNode => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [previewVisible, setPreviewVisible] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateResponse | null>(null)

  const { data: emailTemplates } = useEmailTemplateData('', EmailType.DeferNotification, 1, 100)
  const { mutate: addEmailDefer } = useAddEmailDeferMutation()
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const [startDate, endDate] = values.dateRange

        const emailDefer: AddNewEmailDeferRequest = {
          emailSampleId: values.templateId,
          fromDate: startDate,
          toDate: endDate,
        }
        addEmailDefer(emailDefer)
        form.resetFields()
        onClose()
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra')
      })
  }

  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates?.items.find((t) => t.id === templateId)
    setSelectedTemplate(template || null)
  }

  const showPreview = () => {
    setPreviewVisible(true)
  }

  return (
    <>
      <Modal title='Gửi email' open={visible} onCancel={onClose} footer={null}>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            name='dateRange'
            label={t('COMMON.SELECT_DATE_RANGE')}
            rules={[{ required: true, message: t('COMMON.FIELD_REQUIRED') }]}
          >
            <RangePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item
            name='templateId'
            label={t('EMAIL_STUDENT_FAILED.FORM.EMAIL_TEMPLATE')}
            rules={[
              { required: true, message: t('EMAIL_STUDENT_FAILED.FORM.REQUIRED_EMAIL_TEMPLATE') },
            ]}
          >
            <Select
              placeholder={t('EMAIL_STUDENT_FAILED.FORM.EMAIL_TEMPLATE')}
              onChange={handleTemplateChange}
            >
              {emailTemplates?.items.map((template: EmailTemplateResponse) => (
                <Option key={template.id} value={template.id}>
                  {template.subject}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button icon={<EyeOutlined />} onClick={showPreview} disabled={!selectedTemplate}>
                {t('COMMON.PREVIEW')}
              </Button>
              <Button type='primary' htmlType='submit'>
                {t('COMMON.SCHEDULE')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {selectedTemplate && (
        <EmailDeferPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          template={selectedTemplate}
        />
      )}
    </>
  )
}

export default EmailDeferModal
