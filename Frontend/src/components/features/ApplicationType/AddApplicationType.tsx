import { t } from 'i18next'
import { FC, ReactNode, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import AddWhiteIcon from '#assets/icon/Add.svg?react'
import { Button, Modal, Form, Row, Col, Input } from 'antd'
import { ApplicationTypeResponse } from '#src/types/ResponseModel/ApplicationTypeResponse.js'
import { useAddApplicationTypeMutation } from '#hooks/api/applicationType/useApplicationTypeMutation.js'

const AddApplicationType: FC = (): ReactNode => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const { mutate } = useAddApplicationTypeMutation()

  const handleVisibleModal = (): void => {
    setIsModalVisible(true)
  }

  const handleCancel = (): void => {
    setIsModalVisible(false)
  }

  const handleSubmitForm = (): void => {
    form.submit()
  }

  const handleSubmit = (value: ApplicationTypeResponse): void => {
    const newRequest = {
      vietnameseName: value.vietnameseName,
      englishName: value.englishName,
    }
    mutate(newRequest, {
      onSuccess: (): void => {
        handleCancel()
        form.resetFields()
      },
    })
  }

  return (
    <div>
      <Button type='primary' size='middle' icon={<AddWhiteIcon />} onClick={handleVisibleModal}>
        {t('APPLICATION_TYPE.ADD_APPLICATION_TYPE')}
      </Button>
      <Modal
        title={t('APPLICATION_TYPE.FORM.ADD_NEW_APPLICATION_TYPE')}
        open={isModalVisible}
        onCancel={handleCancel}
        centered
        closeIcon={<CloseOutlined />}
        width={800}
        footer={<ModalFooter handleCancel={handleCancel} handleSubmitForm={handleSubmitForm} />}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit} className='p-2'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='vietnameseName'
                label={<span>{t('APPLICATION_TYPE.FORM.LABEL.VIETNAMESE_NAME')}</span>}
                rules={[
                  {
                    required: true,
                    message: t('APPLICATION_TYPE.FORM.VALIDATION_MESSAGE.REQUIRED.VIETNAMESE_NAME'),
                  },
                ]}
              >
                <Input placeholder={t('APPLICATION_TYPE.FORM.PLACEHOLDER.VIETNAMESE_NAME')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='englishName'
                label={<span>{t('APPLICATION_TYPE.FORM.LABEL.ENGLISH_NAME')}</span>}
                rules={[
                  {
                    required: true,
                    message: t('APPLICATION_TYPE.FORM.VALIDATION_MESSAGE.REQUIRED.ENGLISH_NAME'),
                  },
                ]}
              >
                <Input placeholder={t('APPLICATION_TYPE.FORM.PLACEHOLDER.ENGLISH_NAME')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
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

export default AddApplicationType
