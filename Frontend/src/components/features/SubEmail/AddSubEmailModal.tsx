import ReactQuill from 'react-quill'
import { useTranslation } from 'react-i18next'
import { FC, ReactElement, ReactNode, useState } from 'react'
import ModalFooter from '#components/common/modal/ModalFooter.js'
import { Button, Col, Form, Input, Modal, Popover, Row, Select } from 'antd'
import { useAddSubEmailMutation } from '#hooks/api/subEmail/useSubEmailMutation.js'
import { useEmailTemplateTypeOptions } from '#utils/constants/EmailTemplate/index.js'
import { EmailTemplateContentRight } from '#utils/constants/EmailTemplate/contentRight.js'
import { convertToParam, useReactQuill } from '#components/common/react-quill/React-Quill.js'
import {
  AttendanceVariableButton,
  StudentDeferVariableButton,
  StudentFailedSubjectVariableButton,
  StudentVariableButtons,
} from '#utils/constants/EmailTemplate/variableButton.js'

interface SubEmailModalProps {
  visible: boolean
  onClose: () => void
}

const AddSubEmailModal: FC<SubEmailModalProps> = ({
  visible,
  onClose,
}: SubEmailModalProps): ReactElement => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { quillRef, insertVariable } = useReactQuill()
  const [content, setContent] = useState<string | undefined>(undefined)
  const [popoverContent, setPopoverContent] = useState<ReactNode>()
  const [emailType, setEmailType] = useState<string | undefined>(undefined)
  const { emailTemplateTypeOptions } = useEmailTemplateTypeOptions()
  const { mutate } = useAddSubEmailMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (value: any): void => {
    const quill = quillRef.current ? quillRef.current.getEditor() : null
    if (quill) {
      value.content = convertToParam(quill.root.innerHTML)
    }

    value.name = form.getFieldValue('name')
    value.vietnameseDescription = form.getFieldValue('vietnameseDescription')
    value.englishDescription = form.getFieldValue('englishDescription')
    mutate(value, {
      onSuccess: (): void => {
        onClose()
        form.resetFields()
      },
    })
  }

  const updatePopoverContent = (value: string): void => {
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

  const handleParameterChange = (value: string): void => {
    setEmailType(value)
    form.setFieldsValue({ emailType: value })
    updatePopoverContent(value)
  }

  const handleSubmitForm = (): void => {
    form.submit()
  }
  const handleDataChange = (value: string): void => {
    setContent(value)
    form.setFieldsValue({ content: value })
  }

  return (
    <Modal
      title={t('SUB_EMAIL.MODAL.BUTTON.ADD')}
      centered
      open={visible}
      onCancel={onClose}
      footer={<ModalFooter handleCancel={onClose} handleSubmitForm={handleSubmitForm} />}
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
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
  )
}

export default AddSubEmailModal
