import { t } from 'i18next'
import ReactQuill from 'react-quill'
import EmailInput from './EmailInput'
import '#assets/css/EditorStyles.scss'
import { FC, ReactNode, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal, Form, Row, Col, Popover, Select, Input } from 'antd'
import { useEmailTemplateTypeOptions } from '#utils/constants/EmailTemplate/index.js'
import { AddEmailTemplateRequest } from '#src/types/RequestModel/EmailTemplateRequest.js'
import { EmailTemplateContentRight } from '#utils/constants/EmailTemplate/contentRight.js'
import { useReactQuill, convertToParam } from '#components/common/react-quill/React-Quill.js'
import {
  StudentVariableButtons,
  AttendanceVariableButton,
  StudentDeferVariableButton,
} from '#utils/constants/EmailTemplate/variableButton.js'
import { useAddEmailTemplateMutation } from '#hooks/api/emailTemplate/useEmailTemplateMutation.js'
import ModalFooter from '#components/common/modal/ModalFooter.js'
import ClusterParameterComponent from '../SubEmail/ClusterParameterButton'
import AddIcon from '#assets/icon/Add.svg?react'

const AddEmailTemplate: FC = (): ReactNode => {
  const { quillRef, insertVariable, insertClusterVariable } = useReactQuill()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [content, setContent] = useState<string | undefined>(undefined)
  const [popoverContent, setPopoverContent] = useState<ReactNode>(
    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
      <StudentVariableButtons insertVariable={insertVariable} />
    </div>,
  )
  const [emailType, setEmailType] = useState<string | undefined>(undefined)
  const [ccEmails, setCcEmails] = useState<string[]>([])
  const [ccEmailsInputError, setCcEmailsInputError] = useState<string | null>(null)
  const [bccEmails, setBccEmails] = useState<string[]>([])
  const [bccEmailsInputError, setBccEmailsInputError] = useState<string | null>(null)
  const [form] = Form.useForm()
  const { emailTemplateTypeOptions } = useEmailTemplateTypeOptions()
  const { mutate } = useAddEmailTemplateMutation()

  const handleCcEmailsChange = (newEmails: string[]): void => {
    setCcEmails(newEmails)
  }

  const handleBccEmailsChange = (newEmails: string[]): void => {
    setBccEmails(newEmails)
  }

  const handleVisibleModal = (): void => {
    setIsModalVisible(true)
  }

  const handleCancel = (): void => {
    setIsModalVisible(false)
  }

  const handleSubmitForm = (): void => {
    form.submit()
  }

  const handleSubmit = (value: AddEmailTemplateRequest): void => {
    if (ccEmailsInputError || bccEmailsInputError) {
      return
    }
    const quill = quillRef.current ? quillRef.current.getEditor() : null
    if (quill) {
      value.content = convertToParam(quill.root.innerHTML)
    }
    value.bccEmails = bccEmails
    value.ccEmails = ccEmails
    value.subject = form.getFieldValue('subject')
    value.replyToEmail = form.getFieldValue('replyToEmail')
    mutate(value, {
      onSuccess: (): void => {
        handleCancel()
        form.resetFields()
      },
    })
  }

  const handleDataChange = (value: string): void => {
    setContent(value)
    form.setFieldsValue({ content: value })
  }

  const updatePopoverContent = (value: string): void => {
    if (value === 'AttendanceNotification' || value === 'FailSubjectNotification') {
      setPopoverContent(
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          <StudentVariableButtons insertVariable={insertVariable} />
          <AttendanceVariableButton insertVariable={insertVariable} />
        </div>,
      )
    } else if (value === 'DeferNotification') {
      setPopoverContent(
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          <StudentVariableButtons insertVariable={insertVariable} />
          <StudentDeferVariableButton insertVariable={insertVariable} />
        </div>,
      )
    } else {
      setPopoverContent(
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          <StudentVariableButtons insertVariable={insertVariable} />
        </div>,
      )
    }
  }

  const handleParameterChange = (value: string): void => {
    setEmailType(value)
    form.setFieldsValue({ emailType: value })
    updatePopoverContent(value)
  }

  return (
    <div>
      <Button
        type='primary'
        size='large'
        icon={<AddIcon />}
        onClick={(): void => handleVisibleModal()}
      >
        {t('EMAILTEMPLATES.ADD_TEMPLATE')}
      </Button>
      <Modal
        title={t('EMAILTEMPLATES.MODAL.TITLE.ADD')}
        open={isModalVisible}
        onCancel={handleCancel}
        centered
        styles={{
          body: {
            overflowX: 'hidden',
            maxHeight: '500px',
            paddingBottom: '20px', // Avoid content being hidden behind the footer
            paddingRight: '20px', // Avoid content being hidden behind the scrollbar
          },
        }}
        closeIcon={<CloseOutlined />}
        width={600}
        footer={<ModalFooter handleCancel={handleCancel} handleSubmitForm={handleSubmitForm} />}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
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
                  onChange={handleCcEmailsChange}
                  setValidationError={setCcEmailsInputError}
                ></EmailInput>
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
                <Input
                  type='email'
                  placeholder={`${t('EMAILTEMPLATES.FORM.PLACEHOLDER.REPLY_TO_EMAIL')}`}
                />
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
                    value={content}
                    placeholder={`${t('EMAILTEMPLATES.FORM.PLACEHOLDER.CONTENT')}`}
                    onChange={handleDataChange}
                    theme='snow'
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default AddEmailTemplate
