import { useTranslation } from 'react-i18next'
import { NoteType } from '#types/Data/NoteType.js'
import { FC, useState, useRef, ReactNode, ChangeEvent, useEffect } from 'react'
import { AddNoteProps } from '#types/Props/NoteProp.js'
import { Modal, Form, Input, Button, Select, Collapse } from 'antd'
import { StudentsService } from '#src/services/StudentsService.js'
import { useNoteStudentData } from '#hooks/api/note/useNoteData.js'
import { useAddNoteMutation } from '#hooks/api/note/useNoteMutation.js'
import { useNoteTypeData } from '#hooks/api/noteType/useNoteTypeData.js'
import { StudentResponse } from '#src/types/ResponseModel/StudentResponse.js'
import { CreateNoteRequest } from '#types/RequestModel/ApiRequest.js'
import { PlusCircleOutlined } from '@ant-design/icons'

const { Option } = Select
const { Panel } = Collapse
const AddNoteModal: FC<AddNoteProps> = ({
  studentCodeProp,
  mode,
  noteTypeIdDefault,
}: AddNoteProps): ReactNode => {
  const [form] = Form.useForm()
  const { t, i18n } = useTranslation()
  const currentLanguage: string = i18n.language
  const [visible, setVisible] = useState(false)
  const [student, setStudent] = useState<StudentResponse | null>(null)
  const [noteTypeId, setNoteTypeId] = useState<string>(noteTypeIdDefault ?? '')
  const [studentCode, setStudentCode] = useState<string>(studentCodeProp)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { refetch } = useNoteStudentData(studentCodeProp)
  const { data: notesTypeList } = useNoteTypeData('')
  const { mutateAsync: addNote } = useAddNoteMutation()

  useEffect(() => {
    if (noteTypeIdDefault) {
      setNoteTypeId(noteTypeIdDefault)
      form.setFieldsValue({ noteTypeId: noteTypeIdDefault })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteTypeIdDefault])

  const handleOpen = async (): Promise<void> => {
    setVisible(true)
    await fetchStudentInfo(studentCodeProp)
    setStudentCode(studentCodeProp)
    form.setFieldsValue({ studentCode: studentCodeProp })
  }

  const handleClose = (): void => {
    setVisible(false)
    setStudentCode('')
    setStudent(null)
    form.resetFields()
    if (noteTypeIdDefault) {
      form.setFieldsValue({ noteTypeId: noteTypeIdDefault })
    } else {
      setNoteTypeId('')
    }
  }

  const fetchStudentInfo = async (code: string): Promise<void> => {
    try {
      const response: StudentResponse = await StudentsService.getStudentById(code)
      if (response) {
        setStudent(response)
      } else {
        setStudent(null)
        form.setFieldsValue({ entityId: '' })
      }
    } catch (error: unknown) {
      setStudent(null)
    }
  }

  const handleStudentCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setStudentCode(value)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout((): void => {
      void fetchStudentInfo(value) // Explicitly ignore the promise
    }, 500) // Debounce 500ms
  }

  // Xử lý lưu thông tin
  const handleSave = async (): Promise<void> => {
    const values = await form.validateFields()

    const createNoteRequest: CreateNoteRequest = {
      content: values.content,
      noteTypeId: noteTypeIdDefault ?? noteTypeId,
      entityId: null,
      studentCode: studentCode.toUpperCase(),
      channel: values.channel,
      processingTime: values.processingTime,
    }

    await addNote(createNoteRequest, {
      onSuccess: (): void => {
        if (mode === 'manage-student') {
          void refetch()
        }
      },
    })
    handleClose()
  }

  return (
    <div>
      <Button icon={<PlusCircleOutlined />} size='large' type={'primary'} onClick={handleOpen}>
        <span className='font-semibold'>{t('NOTES.ADD_FORM.CREATE')}</span>
      </Button>

      <Modal
        title={t('NOTES.ADD_FORM.TITLE')}
        open={visible}
        onCancel={handleClose}
        footer={null}
        centered
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='noteTypeId'
            label={t('NOTES.ADD_FORM.SELECT_NOTE_TYPE')}
            rules={[{ required: true, message: t('NOTES.ADD_FORM.REQUIRE_NOTE_TYPE') }]}
          >
            <Select
              defaultValue={noteTypeIdDefault}
              disabled={!!noteTypeIdDefault}
              placeholder={t('NOTES.ADD_FORM.PLACEHOLDER_SELECT_NOTE_TYPE')}
              onChange={(value): void => setNoteTypeId(value)}
            >
              {notesTypeList?.map(
                (type: NoteType): ReactNode => (
                  <Option key={type.id} value={type.id}>
                    {currentLanguage === 'vi' ? type.vietnameseName : type.englishName}
                  </Option>
                ),
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name='studentCode'
            label={t('NOTES.ADD_FORM.STUDENT_CODE')}
            rules={[{ required: true, message: t('NOTES.ADD_FORM.REQUIRE_STUDENT_CODE') }]}
          >
            <Input
              placeholder={t('NOTES.ADD_FORM.PLACEHOLDER_STUDENT_CODE')}
              value={studentCode}
              onChange={handleStudentCodeChange}
              disabled={mode === 'manage-student'}
            />
          </Form.Item>

          <div className='mb-4'>
            <p>
              <strong>{t('NOTES.ADD_FORM.STUDENT_NAME')}:</strong> {student?.studentName}
            </p>
            <p>
              <strong>{t('NOTES.ADD_FORM.STUDENT_EMAIL')}:</strong> {student?.email}
            </p>
          </div>

          <Form.Item
            name='content'
            label={t('NOTES.ADD_FORM.CONTENT')}
            rules={[
              { required: true, message: t('NOTES.ADD_FORM.REQUIRE_CONTENT') },
              { min: 1, message: t('NOTES.ADD_FORM.MIN_LENGTH_CONTENT') },
            ]}
          >
            <Input.TextArea rows={4} placeholder={t('NOTES.ADD_FORM.PLACEHOLDER_CONTENT')} />
          </Form.Item>

          <Collapse defaultActiveKey={[]}>
            <Panel header={t('NOTE.ADD_FORM.ADDITIONAL_INFO')} key='1'>
              <Form.Item name='channel' label={t('NOTES.ADD_FORM.CHANNEL')}>
                <Input placeholder={t('NOTE.ADD_FORM.CHANNEL_PLACEHOLDER')} />
              </Form.Item>

              <Form.Item name='processingTime' label={t('NOTES.ADD_FORM.PROCESSING_TIME')}>
                <Input placeholder={t('NOTE.ADD_FORM.PROCESSING_TIME_PLACEHOLDER')} />
              </Form.Item>
            </Panel>
          </Collapse>

          <div className='flex justify-end space-x-2 mt-4'>
            <Button onClick={handleClose} className='bg-gray-200 hover:bg-gray-300 text-gray-700'>
              {t('COMMON.CANCEL')}
            </Button>
            <Button
              type='primary'
              onClick={handleSave}
              className='bg-blue-500 hover:bg-blue-600 text-white'
            >
              {t('COMMON.SAVE')}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default AddNoteModal
