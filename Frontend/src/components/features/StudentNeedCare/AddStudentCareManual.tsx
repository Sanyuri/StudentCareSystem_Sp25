import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import React, { useRef, useState, ChangeEvent } from 'react'
import { StudentsService } from '#src/services/StudentsService.js'
import { Modal, Form, Input, Button, Space, Typography, Spin } from 'antd'
import { StudentResponse } from '#src/types/ResponseModel/StudentResponse.js'
import { StudentCareAddManualRequest } from '#src/types/RequestModel/StudentNeedCareRequest.js'
import { useAddStudentCareManualMutation } from '#hooks/api/studentNeedCare/useStudentNeedCareMutation.js'

interface AddStudentCareManualProps {
  isOpen: boolean
  onClose: () => void
}

export interface StudentCareFormValues {
  studentId: string
  studentName: string
  reason: string
}

const AddStudentCareManual: React.FC<AddStudentCareManualProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm<StudentCareFormValues>()
  const [student, setStudent] = useState<StudentResponse>()
  const [searching, setSearching] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { mutate: handleAddManualStudent } = useAddStudentCareManualMutation()

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const newStudent: StudentCareAddManualRequest = {
          studentCode: values.studentId.toUpperCase(),
        }
        handleAddManualStudent(newStudent, {
          onError: (error: unknown) => {
            if (error instanceof AxiosError && error.status === 409) {
              toast.error(t('STUDENT_NEED_CARE.ADD_MANUAL.STUDENT_ALREADY_EXIST'))
            } else {
              toast.error(t('COMMON.ERROR'))
            }
          },
        })
        form.resetFields()
        onClose()
      })
      .catch(() => {})
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  const handleStudentCodeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value: string = event.target.value

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!value) {
      setStudent(undefined)
      form.setFieldsValue({ studentName: '' })
      return
    }

    setSearching(true)
    timeoutRef.current = setTimeout(async (): Promise<void> => {
      const student: StudentResponse = await StudentsService.getStudentById(value)

      if (student == null) {
        setStudent(undefined)
        form.setFieldsValue({ studentName: '' })
      } else {
        setStudent(student)
        form.setFieldsValue({ studentName: student.studentName })
      }

      setSearching(false)
    }, 500)
  }

  return (
    <Modal
      title={t('STUDENT_NEED_CARE.ADD_MANUAL.TITLE')}
      open={isOpen}
      footer={
        <Space className='w-full justify-end'>
          <Button onClick={handleCancel}>{t('COMMON.CANCEL')}</Button>
          <Button onClick={handleSubmit} type='primary' htmlType='submit'>
            {t('COMMON.CONFIRM')}
          </Button>
        </Space>
      }
      maskClosable={false}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout='vertical' name='addStudentCareForm' preserve={false}>
        <Form.Item
          name='studentId'
          label={t('STUDENT_NEED_CARE.ADD_MANUAL.STUDENT_ID')}
          rules={[
            {
              required: true,
              message: t('STUDENT_NEED_CARE.ADD_MANUAL.STUDENT_ID_REQUIRED'),
            },
          ]}
        >
          <Input
            placeholder={t('STUDENT_NEED_CARE.ADD_MANUAL.STUDENT_ID')}
            onChange={handleStudentCodeChange}
            suffix={searching ? <Spin size='small' /> : <SearchOutlined />}
          />
        </Form.Item>

        {student && (
          <div className='mb-3 bg-gray-50 p-3 rounded-md border border-gray-200 shadow-sm'>
            <div className='flex justify-between items-start mb-2'>
              <div>
                <Typography.Text strong className='text-lg'>
                  {student.studentName}
                </Typography.Text>
                <div className='text-gray-500 text-sm flex items-center gap-2'>
                  <span className='font-medium'>{student.studentCode}</span>
                  {student.class && <span>• {student.class}</span>}
                </div>
              </div>
              <div
                className='px-2 py-1 rounded-full text-xs font-medium'
                style={{
                  backgroundColor: student.isCurrentSemester ? '#e6f7ff' : '#fff7e6',
                  color: student.isCurrentSemester ? '#1890ff' : '#fa8c16',
                }}
              >
                {student.progress}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-2 mt-3 text-sm'>
              <div>
                <div className='text-gray-500'>
                  {t('STUDENT_NEED_CARE.ADD_MANUAL.SPECIALIZATION')}
                </div>
                <div>
                  {student.major} {student.specialization && `(${student.specialization})`}
                </div>
              </div>
              <div>
                <div className='text-gray-500'>
                  {t('STUDENT_NEED_CARE.ADD_MANUAL.CURRENT_TERM_NO')}
                </div>
                <div>{student.currentTermNo}</div>
              </div>
              <div>
                <div className='text-gray-500'>{t('STUDENT_NEED_CARE.ADD_MANUAL.PROGRESS')}</div>
                <div>{student.progress || 'N/A'}</div>
              </div>
              <div>
                <div className='text-gray-500'>{t('STUDENT_NEED_CARE.ADD_MANUAL.GENDER')}</div>
                <div>{student.gender || 'N/A'}</div>
              </div>
              <div className='col-span-2'>
                <div className='text-gray-500'>{t('STUDENT_NEED_CARE.ADD_MANUAL.EMAIL')}</div>
                <div className='truncate'>{student.email}</div>
              </div>
            </div>
          </div>
        )}
      </Form>
    </Modal>
  )
}

export default AddStudentCareManual
