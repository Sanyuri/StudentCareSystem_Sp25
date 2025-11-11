import { FC } from 'react'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { CloseOutlined } from '@ant-design/icons'
import { t } from 'i18next'
import { navigate } from 'vike/client/router'
import { toast } from 'react-toastify'
import { useStudentPsychologyMutation } from '#hooks/api/studentPsychology/useStudentPsychologyMutation.js'

interface AddStudentPsychologyModalProps {
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  studentCode: string
}

const AddStudentPsychologyModal: FC<AddStudentPsychologyModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  studentCode,
}) => {
  const { t } = useTranslation()
  const { mutate } = useStudentPsychologyMutation()

  const [form] = Form.useForm()

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleSubmitForm = () => {
    form.submit()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    const studentPsychology = {
      studentCode: studentCode,
      accessPassword: values.accessPassword,
    }
    if (values.accessPassword === values.reAccessPassword) {
      mutate(studentPsychology, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (data: any) => {
          setIsModalVisible(false)
          void navigate(`/psychology-note/${data.id}`)
        },
        onError: () => {},
      })
    } else {
      toast.error(t('STUDENT_PSYCHOLOGY.TOAST.ERROR.PASSWORD_NOT_MATCH'))
    }
  }

  return (
    <Modal
      title={t('STUDENT_PSYCHOLOGY.MODAL.TITLE.ADD')}
      open={isModalVisible}
      onCancel={handleCancel}
      centered
      styles={{
        body: {
          overflowX: 'hidden',
          maxHeight: '500px',
          paddingBottom: '20px',
          paddingRight: '20px',
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
              name='accessPassword'
              label={<span>{t('STUDENT_PSYCHOLOGY.FORM.LABEL.ACCESS_PASSWORD')}</span>}
              rules={[
                {
                  required: true,
                  message: t('STUDENT_PSYCHOLOGY.FORM.VALIDATION_MESSAGE.REQUIRED.ACCESS_PASSWORD'),
                },
              ]}
            >
              <Input.Password
                placeholder={`${t('STUDENT_PSYCHOLOGY.FORM.PLACEHOLDER.ACCESS_PASSWORD')}`}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='reAccessPassword'
              label={<span>{t('STUDENT_PSYCHOLOGY.FORM.LABEL.RE_ACCESS_PASSWORD')}</span>}
              rules={[
                {
                  required: true,
                  message: t(
                    'STUDENT_PSYCHOLOGY.FORM.VALIDATION_MESSAGE.REQUIRED.RE_ACCESS_PASSWORD',
                  ),
                },
              ]}
            >
              <Input.Password
                placeholder={`${t('STUDENT_PSYCHOLOGY.FORM.PLACEHOLDER.RE_ACCESS_PASSWORD')}`}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

const ModalFooter = ({
  handleCancel,
  handleSubmitForm,
}: {
  handleCancel: () => void
  handleSubmitForm: () => void
}) => (
  <div className='flex gap-2.5'>
    <Button onClick={handleCancel} style={{ flex: 1, padding: '0 8px', height: '45px' }}>
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
)

export default AddStudentPsychologyModal
