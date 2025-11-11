import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useEffect, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Form, Modal, Button, Spin, Col, Row, Input, Select, Popover } from 'antd'
import ReactQuill from 'react-quill'
import { SubEmailResponse } from '#types/ResponseModel/ApiResponse.js'
import { useUpdateSubEmailMutation } from '#hooks/api/subEmail/useSubEmailMutation.js'
import { EmailTemplateContentRight } from '#utils/constants/EmailTemplate/contentRight.js'
import { useEmailTemplateTypeOptions } from '#utils/constants/EmailTemplate/index.js'
import {
  convertToHtml,
  convertToParam,
  useReactQuill,
} from '#components/common/react-quill/React-Quill.js'
import { UpdateSubEmailRequest } from '#types/RequestModel/SubEmailRequest.js'
import {
  AttendanceVariableButton,
  StudentDeferVariableButton,
  StudentFailedSubjectVariableButton,
  StudentVariableButtons,
} from '#utils/constants/EmailTemplate/variableButton.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  subEmail: SubEmailResponse | undefined
  loading: boolean
}

const EditSubEmail: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  subEmail,
  loading,
}: Readonly<StaffModalProps>): ReactNode => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { quillRef, insertVariable } = useReactQuill()
  const [quillContent, setQuillContent] = useState<string | undefined>(undefined)

  const [emailType, setEmailType] = useState<string | undefined>(subEmail?.emailType)
  const [popoverContent, setPopoverContent] = useState<ReactNode>(
    <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
      <StudentVariableButtons insertVariable={insertVariable} />
    </div>,
  )
  const { mutate, isPending } = useUpdateSubEmailMutation()

  const { emailTemplateTypeOptions } = useEmailTemplateTypeOptions()

  useEffect(() => {
    if (subEmail) {
      setEmailType(subEmail?.emailType)
      form.setFieldsValue({
        emailType: subEmail.emailType,
        name: subEmail.name,
        content: convertToHtml(subEmail.content, false),
        vietnameseDescription: subEmail.vietnameseDescription,
        englishDescription: subEmail.englishDescription,
      })
    }
  }, [form, subEmail, quillRef])

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
    if (value === 'AttendanceNotification') {
      setPopoverContent(
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          <AttendanceVariableButton insertVariable={insertVariable} />
        </div>,
      )
    } else if (value === 'DeferNotification') {
      setPopoverContent(
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          <StudentDeferVariableButton insertVariable={insertVariable} />
        </div>,
      )
    } else if (value === 'FailedSubjectNotification') {
      setPopoverContent(
        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
          <StudentFailedSubjectVariableButton insertVariable={insertVariable} />
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

  const handleSubmit = async (value: UpdateSubEmailRequest): Promise<void> => {
    const quill = quillRef.current ? quillRef.current.getEditor() : null
    if (quill) {
      value.content = convertToParam(quill.root.innerHTML)
    }
    value.name = form.getFieldValue('name')
    mutate(
      {
        subEmailId: { id: subEmail?.id ?? '' },
        updateSubEmailRequest: {
          content: value.content,
          name: value.name,
          emailType: value.emailType,
          id: subEmail?.id ?? '',
          vietnameseDescription: value.vietnameseDescription ?? '',
          englishDescription: value.englishDescription ?? '',
        },
      },
      {
        onSuccess: async (): Promise<void> => {
          onClose()
        },
      },
    )
  }
  return (
    <Modal
      forceRender
      title={t(`SUB_EMAIL.MODAL.BUTTON.EDIT`)}
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
      {!subEmail || isPending || loading ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : (
        <Form form={form} layout='vertical' onFinish={handleSubmit} className='p-2'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='name'
                label={<span>{t('SUB_EMAIL.NAME.LABEL')}</span>}
                rules={[
                  {
                    required: true,
                    message: t('SUB_EMAIL.NAME.ERROR'),
                  },
                ]}
              >
                <Input placeholder={t('SUB_EMAIL.NAME.PLACEHOLDER')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='vietnameseDescription'
                label={<span>{t('SUB_EMAIL.DESCRIPTION_VIETNAM.LABEL')} </span>}
                rules={[
                  {
                    required: true,
                    message: t('SUB_EMAIL.DESCRIPTION_VIETNAM.ERROR'),
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
                name='englishDescription'
                label={<span>{t('SUB_EMAIL.DESCRIPTION_ENGLISH.LABEL')}</span>}
                rules={[
                  {
                    required: true,
                    message: t('SUB_EMAIL.DESCRIPTION_ENGLISH.ERROR'),
                  },
                ]}
              >
                <Input placeholder={t('SUB_EMAIL.DESCRIPTION_ENGLISH.PLACEHOLDER')} />
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
                      message: t('SUB_EMAIL.CONTENT.ERROR'),
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

export default EditSubEmail
