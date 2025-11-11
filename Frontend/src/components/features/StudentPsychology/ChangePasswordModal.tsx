import { useChangePasswordMutation } from '#hooks/api/studentPsychology/useStudentPsychologyMutation.js'
import { ChangePasswordRequest } from '#src/types/RequestModel/StudentPsychologyRequest.js'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import { t } from 'i18next'
import { FC, useState } from 'react'

interface ChangePasswordModalProps {
  id: string
}

const ChangePasswordModal: FC<ChangePasswordModalProps> = ({ id }) => {
  const [form] = Form.useForm()
  const { mutate } = useChangePasswordMutation()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleSubmit = (value: ChangePasswordRequest) => {
    value.id = id
    //check if new password and re-new password are the same
    if (value.newAccessPassword !== value.reNewAccessPassword) {
      form.setFields([
        {
          name: 'reNewAccessPassword',
          errors: [t('STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.ERROR.PASSWORD_NOT_MATCH')],
        },
      ])
      return Promise.reject(
        new Error(t('STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.ERROR.PASSWORD_NOT_MATCH')),
      )
    }
    mutate(value, {
      onSuccess: () => {
        setIsModalVisible(false)
      },
      onError: () => {},
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleSubmitForm = () => {
    form.submit()
  }

  return (
    <div>
      <Button
        className='px-2 py-1 bg-blue-500 text-white rounded'
        onClick={() => setIsModalVisible(true)}
      >
        {t(`STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.TITLE`)}
      </Button>
      <Modal
        title={t(`STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.TITLE`)}
        open={isModalVisible}
        onClose={handleCancel}
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
                name='oldAccessPassword'
                label={t(`STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.OLD_PASSWORD`)}
                rules={[
                  {
                    required: true,
                    message: t(
                      `STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.VALIDATION.REQUIRED.OLD_PASSWORD`,
                    ),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t(`STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.OLD_PASSWORD`)}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='newAccessPassword'
                label={t(`STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.NEW_PASSWORD`)}
                rules={[
                  {
                    required: true,
                    message: t(
                      `STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.VALIDATION.REQUIRED.NEW_PASSWORD`,
                    ),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t(`STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.NEW_PASSWORD`)}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='reNewAccessPassword'
                label={t(`STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.RE_NEW_PASSWORD`)}
                rules={[
                  {
                    required: true,
                    message: t(
                      `STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.VALIDATION.REQUIRED.RE_NEW_PASSWORD`,
                    ),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t(`STUDENT_PSYCHOLOGY.CHANGE_PASSWORD.RE_NEW_PASSWORD`)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default ChangePasswordModal

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
