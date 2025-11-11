import ReactQuill from 'react-quill'
import EmailInput from './EmailInput'
import { useTranslation } from 'react-i18next'
import { CloseOutlined } from '@ant-design/icons'
import { FC, ReactNode, useEffect, useState } from 'react'
import { EmailTemplateResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { Form, Modal, Button, Spin, Col, Row, Input, Select, Popover } from 'antd'
import { useEmailTemplateTypeOptions } from '#utils/constants/EmailTemplate/index.js'
import { EmailTemplateContentRight } from '#utils/constants/EmailTemplate/contentRight.js'
import { UpdateEmailTemplateRequest } from '#src/types/RequestModel/EmailTemplateRequest.js'
import { useUpdateEmailTemplateMutation } from '#hooks/api/emailTemplate/useEmailTemplateMutation.js'
import {
  useReactQuill,
  convertToParam,
  convertToHtml,
  convertToHtmlCluster,
  convertToParamCluster,
} from '#components/common/react-quill/React-Quill.js'
import {
  StudentVariableButtons,
  AttendanceVariableButton,
  StudentDeferVariableButton,
} from '#utils/constants/EmailTemplate/variableButton.js'
import ClusterParameterComponent from '../SubEmail/ClusterParameterButton'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  staffDetails: EmailTemplateResponse | undefined
  loading: boolean
  onRefetch: () => void
}

const EditEmailTemplate: FC<Readonly<StaffModalProps>> = ({
  isVisible,
  onClose,
  staffDetails,
  loading,
  onRefetch,
}: Readonly<StaffModalProps>): ReactNode => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const [emailType, setEmailType] = useState<string | undefined>(staffDetails?.emailType)
  const [ccEmails, setCcEmails] = useState<string[]>(staffDetails?.ccEmails ?? [])
  const [ccEmailsInputError, setCcEmailsInputError] = useState<string | null>(null)
  const [bccEmails, setBccEmails] = useState<string[]>(staffDetails?.bccEmails ?? [])
  const [bccEmailsInputError, setBccEmailsInputError] = useState<string | null>(null)

  const { quillRef, insertVariable, insertClusterVariable } = useReactQuill()
  const [popoverContent, setPopoverContent] = useState<ReactNode>(
    <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
      <StudentVariableButtons insertVariable={insertVariable} />
    </div>,
  )

  const { mutate, isPending } = useUpdateEmailTemplateMutation()
  const { emailTemplateTypeOptions } = useEmailTemplateTypeOptions()
  const [quillContent, setQuillContent] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (staffDetails) {
      setBccEmails(staffDetails.bccEmails ? staffDetails.bccEmails : [])
      setCcEmails(staffDetails.ccEmails ? staffDetails.ccEmails : [])
      setEmailType(staffDetails.emailType)
      form.setFieldsValue({
        emailType: staffDetails.emailType,
        subject: staffDetails.subject,
        ccEmails: staffDetails.ccEmails ? staffDetails.ccEmails : [],
        bccEmails: staffDetails.bccEmails ? staffDetails.bccEmails : [],
        replyToEmail: staffDetails.replyToEmail,
        content: convertToHtmlCluster(convertToHtml(staffDetails.content, false), false),
      })
    }
  }, [form, staffDetails, quillRef])

  const handleCcEmailsChange = (newEmails: string[]): void => {
    setCcEmails(newEmails)
  }

  const handleBccEmailsChange = (newEmails: string[]): void => {
    setBccEmails(newEmails)
  }

  const handleSubmitForm = (): void => {
    form.submit()
  }

  const handleDataChange = (value: string): void => {
    setQuillContent(value)
    form.setFieldsValue({ content: value })
  }

  const handleParameterChange = (value: string): void => {
    setEmailType(value)
    form.setFieldsValue({ emailType: value })
    handlePopoverContent(value)
    EmailTemplateContentRight(value)
  }

  const handlePopoverContent = (value: string): void => {
    if (value === 'attendanceNotification' || value === 'FailedSubjectNotification') {
      setPopoverContent(
        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
          <StudentVariableButtons insertVariable={insertVariable} />
          <AttendanceVariableButton insertVariable={insertVariable} />
        </div>,
      )
    } else if (value === 'deferNotification') {
      setPopoverContent(
        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
          <StudentVariableButtons insertVariable={insertVariable} />
          <StudentDeferVariableButton insertVariable={insertVariable} />
        </div>,
      )
    } else {
      setPopoverContent(
        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
          <StudentVariableButtons insertVariable={insertVariable} />
        </div>,
      )
    }
  }

  const handleSubmit = async (value: UpdateEmailTemplateRequest): Promise<void> => {
    if (ccEmailsInputError || bccEmailsInputError) {
      return
    }
    const quill = quillRef.current ? quillRef.current.getEditor() : null
    if (quill) {
      value.content = convertToParamCluster(convertToParam(quill.root.innerHTML))
    }
    value.subject = form.getFieldValue('subject')
    value.bccEmails = bccEmails
    value.ccEmails = ccEmails
    value.replyToEmail = form.getFieldValue('replyToEmail')
    mutate(
      {
        emailTemplateId: { id: staffDetails?.id ?? '' },
        updateEmailTemplateRequest: {
          content: value.content,
          subject: value.subject,
          emailType: value.emailType,
          id: staffDetails?.id ?? '',
          bccEmails: value.bccEmails,
          ccEmails: value.ccEmails,
          replyToEmail: value.replyToEmail,
        },
      },
      {
        onSuccess: async (): Promise<void> => {
          onRefetch()
          onClose()
        },
      },
    )
  }

  return (
    <Modal
      forceRender
      title={t(`EMAILTEMPLATES.MODAL.TITLE.EDIT`)}
      open={isVisible}
      onCancel={onClose}
      onClose={onClose}
      centered
      styles={{
        body: {
          overflowX: 'hidden',
          maxHeight: '500px',
          overflowY: 'scroll', // Enable vertical scroll
          paddingBottom: '20px', // Avoid content being hidden behind the footer
        },
      }}
      closeIcon={<CloseOutlined />}
      width={600}
      footer={(): ReactNode => (
        <div className='flex gap-2.5'>
          <Button onClick={onClose} style={{ flex: 1, padding: '0 8px', height: '45px' }}>
            {t(`COMMON.CANCEL`)}
          </Button>
          <Button
            type='primary'
            onClick={handleSubmitForm}
            style={{ flex: 1, padding: '0 8px', height: '45px' }}
          >
            {t(`COMMON.CONFIRM`)}
          </Button>
        </div>
      )}
    >
      {!staffDetails || isPending || loading ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : (
        <Form form={form} layout='vertical' onFinish={handleSubmit} className='p-2'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='subject'
                label={<span>{t('EMAILTEMPLATES.FORM.LABEL.SUBJECT')}</span>}
                rules={[
                  {
                    required: true,
                    message: t('EMAILTEMPLATES.FORM.VALIDATION_MESSAGE.REQUIRED.SUBJECT'),
                  },
                ]}
              >
                <Input placeholder={`${t('EMAILTEMPLATES.FORM.PLACEHOLDER.SUBJECT')}`} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='ccEmails'
                label={<span>{t('EMAILTEMPLATES.FORM.LABEL.CC_EMAILS')}</span>}
                validateStatus={ccEmailsInputError ? 'error' : 'success'}
                help={ccEmailsInputError}
              >
                <EmailInput
                  initialEmails={staffDetails?.ccEmails ? staffDetails.ccEmails : []}
                  onChange={handleCcEmailsChange}
                  setValidationError={setCcEmailsInputError}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='bccEmails'
                label={<span>{t('EMAILTEMPLATES.FORM.LABEL.BCC_EMAILS')}</span>}
                validateStatus={bccEmailsInputError ? 'error' : 'success'}
                help={bccEmailsInputError}
              >
                <EmailInput
                  initialEmails={staffDetails?.bccEmails ? staffDetails.bccEmails : []}
                  onChange={handleBccEmailsChange}
                  setValidationError={setBccEmailsInputError}
                ></EmailInput>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='replyToEmail'
                label={<span>{t('EMAILTEMPLATES.FORM.LABEL.REPLY_TO_EMAIL')}</span>}
                rules={[
                  {
                    required: true,
                    message: t('EMAILTEMPLATES.FORM.VALIDATION_MESSAGE.REQUIRED.REPLY_TO_EMAIL'),
                  },
                  { type: 'email', message: t('EMAILS_INPUT.FORM.INVALID') },
                ]}
              >
                <Input placeholder={`${t('EMAILTEMPLATES.FORM.PLACEHOLDER.REPLY_TO_EMAIL')}`} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24} className='flex justify-between'>
              <Form.Item
                name='emailType'
                label={<span>{t('EMAILTEMPLATES.FORM.LABEL.TYPE')}</span>}
                rules={[
                  {
                    required: true,
                    message: t('EMAILTEMPLATES.FORM.VALIDATION_MESSAGE.REQUIRED.TYPE'),
                  },
                ]}
              >
                <Select
                  size='large'
                  style={{ width: 200 }}
                  options={emailTemplateTypeOptions}
                  value={emailType}
                  onChange={handleParameterChange}
                />
              </Form.Item>
              <div className='flex justify-end'>
                <ClusterParameterComponent
                  emailType={emailType ?? ''}
                  insertClusterVariable={insertClusterVariable}
                />
                <Popover content={popoverContent} placement='bottom' trigger='click'>
                  <Popover
                    content={EmailTemplateContentRight(emailType ?? '')}
                    placement='right'
                    trigger='hover'
                  >
                    <Button>+ {t('EMAILTEMPLATES.FORM.BUTTON.PARAMETERS')}</Button>
                  </Popover>
                </Popover>
              </div>
            </Col>
            <Col span={24}></Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div className='flex flex-col justify-between'>
                <Form.Item
                  name='content'
                  label={<span>{t('EMAILTEMPLATES.FORM.LABEL.CONTENT')}</span>}
                  rules={[
                    {
                      required: true,
                      message: t('EMAILTEMPLATES.FORM.VALIDATION_MESSAGE.REQUIRED.CONTENT'),
                      min: 1,
                    },
                  ]}
                >
                  <ReactQuill
                    ref={quillRef}
                    value={quillContent}
                    placeholder={`${t('EMAILTEMPLATES.FORM.PLACEHOLDER.CONTENT')}`}
                    onChange={handleDataChange}
                    theme='snow'
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  )
}
export default EditEmailTemplate
