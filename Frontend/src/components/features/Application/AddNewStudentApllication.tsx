import ReactQuill from 'react-quill'
import { useTranslation } from 'react-i18next'
import AddIcon from '#assets/icon/Add.svg?react'
import EmailInput from '../EmailTemplate/EmailInput'
import { ChangeEvent, FC, MutableRefObject, ReactNode, useRef, useState } from 'react'
import { StudentsService } from '#src/services/StudentsService.js'
import { Modal, Button, Form, Input, Radio, Select, Card, RadioChangeEvent } from 'antd'
import { EmailTemplateService } from '#src/services/EmailTemplateService.js'
import { StudentResponse } from '#src/types/ResponseModel/StudentResponse.js'
import { ApplicationTypeService } from '#src/services/ApplicationTypeService.js'
import { EmailTemplateListResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { ApplicationTypeResp } from '#src/types/ResponseModel/ApplicationTypeResponse.js'
import { useAddApplicationMutation } from '#hooks/api/application/useApplicationMutation.js'
import { CreateApplicationRequest } from '#src/types/RequestModel/CreateApplicationRequest.js'
import {
  useReactQuill,
  convertToParam,
  convertToHtml,
} from '#components/common/react-quill/React-Quill.js'
import { EmailType } from '#src/types/Enums/EmailType.js'

const { Option } = Select
const AddStudentApplicationModal: FC = (): ReactNode => {
  const [form] = Form.useForm()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [applicationTypesState, setApplicationTypesState] = useState<ApplicationTypeResp[]>([])

  const [createApplicationRequest, setCreateApplicationRequest] =
    useState<CreateApplicationRequest>({})
  const { mutate: addApplicationMutation } = useAddApplicationMutation()

  const [emailTemplateState, setEmailTemplateState] = useState<EmailTemplateListResponse>()
  const [selectedEmailTemplateId, setSelectedEmailTemplateId] = useState('default')
  const { quillRef } = useReactQuill()
  const [emailContent, setEmailContent] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [status, setStatus] = useState('receive')
  const [student, setStudent] = useState<StudentResponse>()

  const ccEmailsInputRef = useRef<{
    getEmails: () => string[]
    setEmails: (newEmails: string[]) => void
  }>(null)
  const [ccEmailsInputError, setCcEmailsInputError] = useState<string | null>(null)
  const bccEmailsInputRef = useRef<{
    getEmails: () => string[]
    setEmails: (newEmails: string[]) => void
  }>(null)
  const [bccEmailsInputError, setBccEmailsInputError] = useState<string | null>(null)

  const { t } = useTranslation()

  const timeoutRef: MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null)

  /*
  TODO: use react query
  */
  const showModal = async (): Promise<void> => {
    setIsModalVisible(true)
    const applicationTypes = await ApplicationTypeService.getApplicationTypes()
    setApplicationTypesState(applicationTypes)
    const emailTemplates = await EmailTemplateService.list({
      emailType: EmailType.ApplicationNotification.toString(),
    })
    setEmailTemplateState(emailTemplates)
  }

  const handleCancel = (): void => {
    setIsModalVisible(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmailTemplateChange = (value: any) => {
    setSelectedEmailTemplateId(value)
    if (value !== 'default') {
      const selectedTemplate = emailTemplateState?.items.find((template) => template.id === value)
      let content = ''
      if (selectedTemplate) {
        content = convertToHtml(selectedTemplate?.content, false) ?? ''
      }
      setEmailContent(content)
      setEmailSubject(selectedTemplate?.subject ?? '')

      form.setFieldsValue({
        replyToEmail: selectedTemplate?.replyToEmail ?? '',
      })

      ccEmailsInputRef.current?.setEmails(
        selectedTemplate?.ccEmails ? selectedTemplate.ccEmails : [],
      )
      bccEmailsInputRef.current?.setEmails(
        selectedTemplate?.bccEmails ? selectedTemplate.bccEmails : [],
      )
    } else {
      setEmailContent('')
      setEmailSubject('')

      form.setFieldsValue({
        replyToEmail: '',
      })

      ccEmailsInputRef.current?.setEmails([])
      setCcEmailsInputError(null)
      bccEmailsInputRef.current?.setEmails([])
      setBccEmailsInputError(null)
    }
  }

  const handleSubjectChange = (value: string): void => {
    setEmailSubject(value)
  }

  const handleCcEmailsChange = (value: string[]) => {
    if (JSON.stringify(value) !== JSON.stringify(ccEmailsInputRef.current?.getEmails()))
      ccEmailsInputRef.current?.setEmails(value)
  }

  const handleBccEmailsChange = (value: string[]): void => {
    if (JSON.stringify(value) !== JSON.stringify(bccEmailsInputRef.current?.getEmails()))
      bccEmailsInputRef.current?.setEmails(value)
  }

  const handleEmailContentChange = (value: string): void => {
    setEmailContent(value)
  }

  const handleStatusChange = (value: string): void => {
    setStatus(value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof CreateApplicationRequest, value: any) => {
    setCreateApplicationRequest((prev) => {
      const updatedRequest = {
        ...prev,
        [field]: value,
      }
      return updatedRequest
    })
  }

  const handleStudentCodeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value: string = event.target.value

    setCreateApplicationRequest((prev) => ({
      ...prev,
      studentCode: value,
    }))

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async (): Promise<void> => {
      const student: StudentResponse = await StudentsService.getStudentById(value)

      if (student == null) {
        setStudent(undefined)
        return
      }

      setStudent(student)
    }, 500)
  }

  // Handle form submission
  const handleSubmit = (): void => {
    if (bccEmailsInputError || ccEmailsInputError) return

    if (emailContent === '' || emailSubject === '') return

    if (!createApplicationRequest.applicationTypeId) return

    if (!form.getFieldValue('replyToEmail')) return

    const newCreateApplicationRequest: CreateApplicationRequest = {
      ...createApplicationRequest,
      status: status,
      emailSubject: emailSubject,
      ccEmails: ccEmailsInputRef.current?.getEmails(),
      bccEmails: bccEmailsInputRef.current?.getEmails(),
      replyToEmail: form.getFieldValue('replyToEmail'),
      emailContent: convertToParam(emailContent),
      studentCode: student?.studentCode || '',
    }

    addApplicationMutation(newCreateApplicationRequest, {
      onSuccess: (): void => {
        setIsModalVisible(false)
      },
    })
  }

  return (
    <div className='p-2'>
      <Button type='primary' size={'large'} onClick={showModal} icon={<AddIcon />}>
        {t('APPLICATION.CREATE_FORM.TITLE')}
      </Button>
      <Modal
        title={t('APPLICATION.CREATE_FORM.TITLE')}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className='max-w-lg'
        styles={{
          body: {
            maxHeight: '70vh',
            overflowY: 'auto',
          },
        }}
      >
        <Form layout='vertical' form={form}>
          <Card
            title={
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3'>
                  1
                </div>
                <span>{t('APPLICATION.CREATE_FORM.EMAIL_SECTION_TITLE')}</span>
              </div>
            }
            className='mb-4'
          >
            <Form.Item label={t('APPLICATION.CREATE_FORM.FORM.DOCUMENT_TYPE')} required>
              <Radio.Group
                onChange={(e: RadioChangeEvent): void => handleStatusChange(e.target.value)}
                defaultValue={status}
              >
                <Radio value='receive' checked>
                  {t('APPLICATION.CREATE_FORM.RADIO.RECEIVE')}
                </Radio>
                <Radio value='return'>{t('APPLICATION.CREATE_FORM.RADIO.RETURN')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={t('APPLICATION.CREATE_FORM.FORM.DOCUMENT_TYPE')} required>
              <Select
                placeholder={t('APPLICATION.CREATE_FORM.FORM.DOCUMENT_TYPE_PLACEHOLDER')}
                onChange={(value): void => handleInputChange('applicationTypeId', value)}
              >
                {applicationTypesState.map((applicationType) => (
                  <Option key={applicationType.id} value={applicationType.id}>
                    {applicationType.vietnameseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={t('APPLICATION.CREATE_FORM.FORM.EMAIL_TEMPLATE')} required>
              <Select
                placeholder={t('APPLICATION.CREATE_FORM.FORM.EMAIL_TEMPLATE_PLACEHOLDER')}
                value={selectedEmailTemplateId}
                onChange={handleEmailTemplateChange}
              >
                <Option value='default'>
                  {t('APPLICATION.CREATE_FORM.FORM.EMAIL_TEMPLATE_PLACEHOLDER')}
                </Option>
                {emailTemplateState?.items.map((template) => (
                  <Option key={template.id} value={template.id}>
                    {template.subject}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={t('APPLICATION.CREATE_FORM.FORM.EMAIL_SUBJECT')} required>
              <Input
                placeholder={t('APPLICATION.CREATE_FORM.FORM.EMAIL_SUBJECT_PLACEHOLDER')}
                value={emailSubject}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e: any) => handleSubjectChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name='ccEmails'
              label={<span>{t('EMAILTEMPLATES.FORM.LABEL.CC_EMAILS')}</span>}
              validateStatus={ccEmailsInputError ? 'error' : 'success'}
              help={ccEmailsInputError}
            >
              <EmailInput
                ref={ccEmailsInputRef}
                onChange={handleCcEmailsChange}
                setValidationError={setCcEmailsInputError}
              ></EmailInput>
            </Form.Item>
            <Form.Item
              name='bccEmails'
              label={<span>{t('EMAILTEMPLATES.FORM.LABEL.BCC_EMAILS')}</span>}
              validateStatus={bccEmailsInputError ? 'error' : 'success'}
              help={bccEmailsInputError}
            >
              <EmailInput
                ref={bccEmailsInputRef}
                onChange={handleBccEmailsChange}
                setValidationError={setBccEmailsInputError}
              ></EmailInput>
            </Form.Item>
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
            <Form.Item label={t('APPLICATION.CREATE_FORM.FORM.EMAIL_CONTENT')} required>
              <ReactQuill
                ref={quillRef}
                value={emailContent}
                placeholder={`${t('EMAILTEMPLATES.FORM.PLACEHOLDER.CONTENT')}`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e: any) => handleEmailContentChange(e)}
                theme='snow'
              />
            </Form.Item>
          </Card>

          <Card
            title={
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3'>
                  2
                </div>
                <span>{t('APPLICATION.CREATE_FORM.STUDENT_INFO_TITLE')}</span>
              </div>
            }
          >
            <Form.Item label={t('APPLICATION.CREATE_FORM.FORM.STUDENT_ID')} required>
              <Input
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(event: any) => handleStudentCodeChange(event)}
              />
            </Form.Item>

            <Form.Item label={t('APPLICATION.CREATE_FORM.FORM.STUDENT_NAME')} required>
              <Input
                placeholder={t('APPLICATION.CREATE_FORM.FORM.STUDENT_NAME_PLACEHOLDER')}
                value={student?.studentName}
                readOnly
              />
            </Form.Item>

            <Form.Item label={t('APPLICATION.CREATE_FORM.FORM.STUDENT_EMAIL')} required>
              <Input
                placeholder={t('APPLICATION.CREATE_FORM.FORM.STUDENT_EMAIL_PLACEHOLDER')}
                value={student?.email}
                readOnly
              />
            </Form.Item>
            <div className='flex justify-end gap-2'>
              <Button onClick={handleCancel}>
                {t('APPLICATION.CREATE_FORM.FORM.CANCEL_BUTTON')}
              </Button>
              <Button onClick={handleSubmit} type='primary'>
                {t('APPLICATION.CREATE_FORM.FORM.CONFIRM_BUTTON')}
              </Button>
            </div>
          </Card>
        </Form>
      </Modal>
    </div>
  )
}

export default AddStudentApplicationModal
