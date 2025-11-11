import { navigate } from 'vike/client/router'
import { VerifyStudentPsychologyRequest } from '#src/types/RequestModel/StudentPsychologyRequest.js'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import { t } from 'i18next'
import { useVerifyStudentPsychologyMutation } from '#hooks/api/studentPsychology/useStudentPsychologyMutation.js'
import { PSYCHOLOGY_MANAGEMENT_PATH } from '#utils/constants/path.js'

interface VerifyStudentPsychologyProps {
  id: string
  setIsModalVisible: (value: boolean) => void
  refetch: () => void
}

export default function VerifyStudentPsychology({
  id,
  setIsModalVisible,
  refetch,
}: Readonly<VerifyStudentPsychologyProps>) {
  const [form] = Form.useForm()
  const { mutate } = useVerifyStudentPsychologyMutation()

  const handleSubmit = (value: VerifyStudentPsychologyRequest) => {
    value.id = id
    mutate(value, {
      onSuccess: (data) => {
        localStorage.setItem('StudentPsychology', data.accessToken)
        setIsModalVisible(false)
        refetch()
      },
      onError: () => {},
    })
  }

  const handleCancel = async () => {
    setIsModalVisible(false)
    await navigate(PSYCHOLOGY_MANAGEMENT_PATH)
  }

  const handleSubmitForm = () => {
    form.submit()
  }

  return (
    <Modal
      title={t(`STUDENT_PSYCHOLOGY.VERIFY.TITLE`)}
      open={true}
      onClose={() => {}}
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
              label={t(`STUDENT_PSYCHOLOGY.VERIFY.LABEL.ACCESS_PASSWORD`)}
              name='accessPassword'
              rules={[
                {
                  required: true,
                  message: t(`STUDENT_PSYCHOLOGY.VERIFY.REQUIRED_ACCESS_PASSWORD`),
                },
              ]}
            >
              <Input.Password />
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
