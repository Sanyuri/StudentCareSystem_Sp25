import { useVerify2FaMutation } from '#hooks/api/2fa/use2FaMutation.js'
import { useForgetPasswordMutation } from '#hooks/api/studentPsychology/useStudentPsychologyMutation.js'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import { t } from 'i18next'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'

interface ChangePasswordModalProps {
  id: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ForgetPasswordModal: FC<ChangePasswordModalProps> = ({ id }) => {
  const [form] = Form.useForm()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const { mutate: verify2Fa } = useVerify2FaMutation()
  const { mutate: forgetPassword } = useForgetPasswordMutation()

  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  const handleSubmitForm = () => {
    form.submit()
  }

  const handleSubmit = (value: { password: string; confirmPassword: string; otp: string }) => {
    verify2Fa(
      { otp: value.otp },
      {
        onSuccess: () => {
          if (value.password !== value.confirmPassword) {
            form.setFields([
              {
                name: 'confirmPassword',
                errors: [t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.PASSWORD_NOT_MATCH')],
              },
            ])
            toast.error(t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.PASSWORD_NOT_MATCH'))
          } else {
            forgetPassword(
              {
                id: id,
                password: value.password,
              },
              {
                onSuccess: () => {
                  form.resetFields()
                  setIsModalVisible(false)
                },
              },
            )
          }
        },
      },
    )
  }

  return (
    <div>
      <Button
        className='px-2 py-1 bg-blue-500 text-white rounded'
        onClick={() => setIsModalVisible(true)}
      >
        Reset Password
      </Button>
      <Modal
        title='Reset Password'
        open={isModalVisible}
        onCancel={handleCancel}
        closeIcon={<></>}
        centered
        styles={{
          body: {
            overflowX: 'hidden',
            maxHeight: '500px',
            paddingBottom: '20px', // Avoid content being hidden behind the footer
            paddingRight: '20px', // Avoid content being hidden behind the scrollbar
          },
        }}
        width={600}
        footer={<ModalFooter handleCancel={handleCancel} handleSubmitForm={handleSubmitForm} />}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='password'
                label={t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.PASSWORD')}
                rules={[
                  {
                    required: true,
                    message: t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.REQUIRED_PASSWORD'),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.PLACEHOLDER_PASSWORD')}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='confirmPassword'
                label={t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.CONFIRM_PASSWORD')}
                rules={[
                  {
                    required: true,
                    message: t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.REQUIRED_CONFIRM_PASSWORD'),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.PLACEHOLDER_CONFIRM_PASSWORD')}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='otp'
                label={t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.OTP')}
                rules={[
                  { required: true, message: t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.REQUIRED_OTP') },
                ]}
              >
                <Input placeholder={t('STUDENT_PSYCHOLOGY.FORGET_PASSWORD.PLACEHOLDER_OTP')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default ForgetPasswordModal

const ModalFooter = ({
  handleCancel,
  handleSubmitForm,
}: {
  handleCancel: () => void
  handleSubmitForm: () => void
}) => (
  <div className='flex justify-end space-x-2'>
    <Button className='px-2 py-1 bg-blue-500 text-white rounded' onClick={handleCancel}>
      {t('COMMON.CANCEL')}
    </Button>
    <Button className='px-2 py-1 bg-blue-500 text-white rounded' onClick={handleSubmitForm}>
      {t('COMMON.SAVE')}
    </Button>
  </div>
)
