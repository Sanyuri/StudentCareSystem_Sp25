import { Button, Form, Modal, Select, Space } from 'antd'
import { FC, Fragment, useState } from 'react'
import EmailSend from '#assets/icon/email send.svg?react'
import EmailDeferPreview from '../Defer/EmailDeferPreview'
import { EyeOutlined } from '@ant-design/icons'
import { EmailTemplateResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { useEmailTemplateData } from '#hooks/api/emailTemplate/useEmailTemplateData.js'
import { EmailType } from '#src/types/Enums/EmailType.js'
import { useAddEmailFailedMutation } from '#hooks/api/email/useEmailMutation.js'
import { AddNewEmailFailRequest } from '#src/types/RequestModel/ApiRequest.js'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { Semester } from '#src/types/Data/Semester.js'

const { Option } = Select
const EmailStudentFailed: FC = () => {
  const { t } = useTranslation()

  const [form] = Form.useForm()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateResponse | null>(null)

  const { data: emailTemplates } = useEmailTemplateData(
    '',
    EmailType.FailedSubjectNotification,
    1,
    100,
  )
  const { data: semesterData } = useSemesterData()
  const { mutate: addEmailDefer } = useAddEmailFailedMutation()

  const showModal = () => {
    setModalVisible(true)
  }

  const hideModal = () => {
    setModalVisible(false)
  }
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const emailDefer: AddNewEmailFailRequest = {
          emailSampleId: values.templateId,
          semesterName: values.semester,
        }
        addEmailDefer(emailDefer)
        form.resetFields()
        hideModal()
      })
      .catch(() => {
        toast.error(t('EMAIL_STUDENT_FAILED.TOAST.ERROR'))
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
    <Fragment>
      <Button
        size='large'
        color='default'
        variant='outlined'
        onClick={showModal}
        icon={<EmailSend />}
      >
        <span className='font-semibold'>{t('DEFERS.DEFER_BUTTON')}</span>
      </Button>
      <Modal
        title={t('EMAIL_STUDENT_FAILED.MODAL.TITLE')}
        open={modalVisible}
        onCancel={hideModal}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            name='semester'
            label={t('EMAIL_STUDENT_FAILED.FORM.SEMESTER')}
            rules={[{ required: true, message: t('EMAIL_STUDENT_FAILED.FORM.SEMESTER_REQUIRED') }]}
          >
            <Select
              placeholder={t('EMAIL_STUDENT_FAILED.FORM.PLACEHOLDER_SEMESTER')}
              onChange={handleTemplateChange}
            >
              {semesterData?.map((semester: Semester) => (
                <Option key={semester.id} value={semester.semesterName}>
                  {semester.semesterName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='templateId'
            label={t('EMAIL_STUDENT_FAILED.FORM.EMAIL_TEMPLATE')}
            rules={[
              { required: true, message: t('EMAIL_STUDENT_FAILED.FORM.EMAIL_TEMPLATE_REQUIRED') },
            ]}
          >
            <Select
              placeholder={t('EMAIL_STUDENT_FAILED.FORM.PLACEHOLDER_EMAIL_TEMPLATE')}
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
    </Fragment>
  )
}

export default EmailStudentFailed
