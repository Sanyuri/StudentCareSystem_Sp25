import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Form, Modal, Button, Spin, Col, Row, Input } from 'antd'
import { ApplicationTypeResponse } from '#src/types/ResponseModel/ApplicationTypeResponse.js'
import { UpdateApplicationTypeRequest } from '#src/types/RequestModel/ApplicationTypeRequest.js'
import { useUpdateApplicationTypeMutation } from '#hooks/api/applicationType/useApplicationTypeMutation.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  staffDetails: ApplicationTypeResponse | undefined
  loading: boolean
}

const EditApplicationType: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  staffDetails,
  loading,
}: Readonly<StaffModalProps>): ReactNode => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { mutate, isPending } = useUpdateApplicationTypeMutation()

  // When `staffDetails` changes, update the form values
  useEffect(() => {
    if (staffDetails) {
      form.setFieldsValue({
        englishName: staffDetails.englishName,
        vietnameseName: staffDetails.vietnameseName,
      })
    }
  }, [staffDetails, form])

  const handleSubmitForm = (): void => {
    form.submit()
  }

  const handleSubmit = (value: UpdateApplicationTypeRequest): void => {
    value.englishName = form.getFieldValue('englishName')
    value.vietnameseName = form.getFieldValue('vietnameseName')

    mutate(
      {
        ApplicationTypeId: { id: staffDetails?.id ?? '' },
        updateApplicationTypeRequest: {
          englishName: value.englishName,
          vietnameseName: value.vietnameseName,
          id: staffDetails?.id ?? '',
        },
      },
      {
        onSuccess: (): void => {
          onClose()
        },
      },
    )
  }

  return (
    <Modal
      forceRender
      title={t('APPLICATION_TYPE.FORM.EDIT_APPLICATION_TYPE')}
      open={isVisible}
      onCancel={onClose}
      centered
      width={600}
      closeIcon={<CloseOutlined />}
      footer={(): ReactNode => (
        <div className='flex gap-2.5'>
          <Button onClick={onClose} style={{ flex: 1, padding: '0 8px', height: '45px' }}>
            {t('COMMON.CANCEL')}
          </Button>
          <Button
            type='primary'
            onClick={handleSubmitForm}
            style={{ flex: 1, padding: '0 8px', height: '45px' }}
            loading={isPending || loading}
          >
            {t('COMMON.CONFIRM')}
          </Button>
        </div>
      )}
    >
      {isPending || loading || !staffDetails ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : (
        <Form form={form} layout='vertical' onFinish={handleSubmit} className='p-2'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='vietnameseName'
                label={t('APPLICATION_TYPE.FORM.LABEL.VIETNAMESE_NAME')}
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
                label={t('APPLICATION_TYPE.FORM.LABEL.ENGLISH_NAME')}
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
      )}
    </Modal>
  )
}

export default EditApplicationType
