import { FC } from 'react'
import { Modal, Form, Input, Button, Collapse } from 'antd'
import { useTranslation } from 'react-i18next'

const { Panel } = Collapse

interface AddNoteModalProps {
  visible: boolean
  semester: string | undefined
  studentCode: string | undefined
  studentName: string | undefined
  onClose: () => void
  onSave: (values: { content: string; channel: string; processingTime: string }) => void
}

const AddNoteModal: FC<AddNoteModalProps> = ({
  visible,
  semester,
  studentCode,
  studentName,
  onClose,
  onSave,
}: AddNoteModalProps) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const handleSave = async (): Promise<void> => {
    await form.validateFields().then((values) => {
      onSave(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title={`${t('NOTE.ADD_FORM.CREATE')} ${studentName} - ${studentCode} (${semester})`}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='content'
          label={t('NOTE.ADD_FORM.LABEL')}
          rules={[
            { required: true, message: t('NOTE.ADD_FORM.LABEL') },
            { min: 1, message: t('NOTE.ADD_FORM.REQUIRE_MIN__CONTENT') },
          ]}
        >
          <Input.TextArea rows={4} placeholder={t('NOTE.ADD_FORM.PLACEHOLDER')} />
        </Form.Item>
        <Collapse defaultActiveKey={[]}>
          <Panel header={t('NOTE.ADD_FORM.ADDITIONAL_INFO')} key='1'>
            <Form.Item name='channel' label={t('NOTE.ADD_FORM.CHANNEL')}>
              <Input placeholder={t('NOTE.ADD_FORM.CHANNEL_PLACEHOLDER')} />
            </Form.Item>

            <Form.Item name='processingTime' label={t('NOTE.ADD_FORM.PROCESSING_TIME')}>
              <Input placeholder={t('NOTE.ADD_FORM.PROCESSING_TIME_PLACEHOLDER')} />
            </Form.Item>
          </Panel>
        </Collapse>
        <div className='flex justify-end space-x-2'>
          <Button
            onClick={onClose}
            className='bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md'
          >
            {t('COMMON.CANCEL')}
          </Button>
          <Button
            type='primary'
            onClick={handleSave}
            className='bg-blue-500 hover:bg-blue-600 text-white rounded-md'
          >
            {t('COMMON.CONFIRM')}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AddNoteModal
