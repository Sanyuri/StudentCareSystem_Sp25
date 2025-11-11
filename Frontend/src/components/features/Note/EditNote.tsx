import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { UpdateNoteRequest } from '#types/RequestModel/ApiRequest.js'
import { Form, Modal, Button, Spin, Col, Row, Input, Select, Collapse } from 'antd'
import { NoteTypeListResponse } from '#types/ResponseModel/ApiResponse.js'
import { useUpdateNoteMutation } from '#hooks/api/note/useNoteMutation.js'
import { StudentNoteResponse } from '#src/types/ResponseModel/StudentNoteResponse.js'

const { Panel } = Collapse

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  staffDetails: StudentNoteResponse | undefined
  loading: boolean
  onRefetch: () => void
  notesTypeList: NoteTypeListResponse | undefined // Danh sách loại đơn
}

const EditNote: FC<Readonly<StaffModalProps>> = ({
  isVisible,
  onClose,
  staffDetails,
  loading,
  onRefetch,
  notesTypeList,
}: Readonly<StaffModalProps>): ReactNode => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { mutate, isPending } = useUpdateNoteMutation()
  const { Option } = Select

  // Cập nhật giá trị form khi staffDetails thay đổi
  useEffect(() => {
    if (staffDetails) {
      form.setFieldsValue({
        content: staffDetails.content,
        entityId: staffDetails.entityId,
        studentCode: staffDetails.studentCode,
        noteTypeId: staffDetails.noteType.id,
        channel: staffDetails.channel,
        processingTime: staffDetails.processingTime,
      })
    }
  }, [staffDetails, form])

  const handleSubmitForm = (): void => {
    form.submit()
  }

  const handleSubmit = (values: {
    content: string
    channel: string
    processingTime: string
  }): void => {
    const updatedRequest: UpdateNoteRequest = {
      id: staffDetails?.id ?? '',
      content: values.content,
      noteTypeId: staffDetails?.noteType.id ?? '',
      entityId: staffDetails?.entityId ?? null,
      studentCode: staffDetails?.studentCode ?? '',
      channel: values.channel,
      processingTime: values.processingTime,
    }

    mutate(updatedRequest, {
      onSuccess: (): void => {
        onRefetch()
        onClose()
      },
    })
  }

  return (
    <Modal
      forceRender
      title={t('NOTES.EDIT_FORM.EDIT_NOTES')}
      open={isVisible}
      onCancel={onClose}
      centered
      width={600}
      closeIcon={<CloseOutlined />}
      footer={<NoteModalFooter onClose={onClose} handleSubmitForm={handleSubmitForm} />}
    >
      {isPending || loading || !staffDetails ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : (
        <Form form={form} layout='vertical' onFinish={handleSubmit} className='p-2'>
          {/* Trường Content */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='content'
                label={t('NOTES.EDIT_FORM.LABEL.CONTENT')}
                rules={[
                  {
                    required: true,
                    message: t('NOTES.EDIT_FORM.VALIDATION_MESSAGE'),
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={t('NOTES.EDIT_FORM.PLACEHOLDER_CONTENT')}
                  rows={4}
                  className='rounded-md border-gray-300'
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Trường Note Type ID (Disabled) */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name='noteTypeId' label={t('NOTES.EDIT_FORM.LABEL.NOTE_TYPE')}>
                <Select placeholder={t('NOTES.EDIT_FORM.PLACEHOLDER.NOTE_TYPE')} disabled>
                  {notesTypeList?.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.vietnameseName || type.englishName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Trường Student Code (Disabled) */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name='studentCode' label={t('NOTES.EDIT_FORM.LABEL.STUDENT_CODE')}>
                <Input placeholder={t('NOTES.EDIT_FORM.PLACEHOLDER.STUDENT_CODE')} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Collapse defaultActiveKey={[]}>
            <Panel header='Ghi chú bổ sung' key='1'>
              <Form.Item name='channel' label='Kênh '>
                <Input placeholder='Nhập kênh' />
              </Form.Item>

              <Form.Item name='processingTime' label='Thời gian xử lí '>
                <Input placeholder='Nhập thời gian xử lý' />
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      )}
    </Modal>
  )
}
export default EditNote

type NoteModalProps = {
  onClose: () => void
  handleSubmitForm: () => void
}
const NoteModalFooter: FC<NoteModalProps> = ({
  onClose,
  handleSubmitForm,
}: NoteModalProps): ReactNode => {
  const { t } = useTranslation()
  return (
    <div className='flex gap-2.5'>
      <Button onClick={onClose} style={{ flex: 1, padding: '0 8px', height: '45px' }}>
        {t('COMMON.CANCEL')}
      </Button>
      <Button
        type='primary'
        onClick={handleSubmitForm}
        style={{ flex: 1, padding: '0 8px', height: '45px' }}
      >
        {t('COMMON.CONFIRM')}
      </Button>
    </div>
  )
}
