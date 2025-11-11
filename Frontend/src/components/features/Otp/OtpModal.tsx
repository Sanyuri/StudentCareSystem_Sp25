import { useVerify2FaMutation } from '#hooks/api/2fa/use2FaMutation.js'
import { TwoFactorAuthenticationResponse } from '#src/types/ResponseModel/2FaResponse.js'
import { Button, Form, Input, Modal, QRCode } from 'antd'
import { t } from 'i18next'

interface OtpModalProps {
  twoFaAuth: TwoFactorAuthenticationResponse | undefined
  isModalVisible: boolean
  setIsModalVisible: (value: boolean) => void
}

export default function OtpModal({
  twoFaAuth,
  isModalVisible,
  setIsModalVisible,
}: Readonly<OtpModalProps>) {
  const [form] = Form.useForm()
  const { mutate: verify2Fa } = useVerify2FaMutation()

  const handleSubmit = (values: { otp: string }) => {
    verify2Fa(
      { otp: values.otp },
      {
        onSuccess: () => {
          form.resetFields()
          setIsModalVisible(false)
        },
      },
    )
  }

  return (
    <Modal
      open={isModalVisible}
      closable={true}
      footer={null}
      onCancel={() => setIsModalVisible(false)}
    >
      <div className='flex flex-col items-center'>
        <QRCode value={twoFaAuth?.uri ?? ''} size={200} />
        <p className='mt-4'>Secret key: {twoFaAuth?.secret}</p>
        <p>{t('SETTINGS.TOTP_USE_GUIDE')}</p>
      </div>
      <Form form={form} className='mt-4' onFinish={handleSubmit}>
        <Form.Item name='otp' rules={[{ required: true, message: t('SETTINGS.OTP_REQUIRED') }]}>
          <Input placeholder={t('SETTINGS.ENTER_OTP')} />
        </Form.Item>
        <Button type='primary' htmlType='submit' className='w-full'>
          {t('SETTINGS.SUBMIT')}
        </Button>
      </Form>
    </Modal>
  )
}
