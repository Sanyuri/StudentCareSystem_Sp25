import { ChangeEvent, FC, ReactNode, useState } from 'react'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Modal, Form, Input, Select, Button, Row, Col, Card, Steps, Spin } from 'antd'
import {
  CreatePsychologyNoteRequest,
  PsychologyNoteDetailInput,
} from '#types/RequestModel/ApiRequest.js'
import PsychologyTypeManage from '#components/features/PsychologyType/PsychologyTypeManage.js'
import VerifyStudentPsychology from '../StudentPsychology/VerifyStudentPsychology'
import { usePsychologyNoteTypeData } from '#hooks/api/psychologyNoteType/usePsychologyNoteTypeData.js'
import { useAddPsychologyNoteMutation } from '#hooks/api/psychologyNotes/usePsychologyNoteMutation.js'
import { PsychologyNoteType } from '#src/types/Data/PsychologyNoteType.js'
import { usePsychologyNoteData } from '#hooks/api/psychologyNotes/usePsychologyNoteData.js'
import { useTranslation } from 'react-i18next'

const { Step } = Steps

interface AddNoteModalProps {
  studentPsychologyId: string
}
const AddPsychologyNoteModal: FC<AddNoteModalProps> = ({
  studentPsychologyId,
}: AddNoteModalProps): ReactNode => {
  const { t } = useTranslation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [noteTypeInputs, setNoteTypeInputs] = useState<
    (PsychologyNoteDetailInput & { tempId: number })[]
  >([])
  const [subject, setSubject] = useState('')
  const [form] = Form.useForm()
  const { refetch } = usePsychologyNoteData(studentPsychologyId)
  const { data: psychologyNoteType } = usePsychologyNoteTypeData('')
  const { mutate: addPsychologyNote } = useAddPsychologyNoteMutation()
  const [nextId, setNextId] = useState(1) // Sử dụng counter để tạo ID tạm thời
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false)

  // Hiển thị Modal
  const showModal = (): void => setIsModalVisible(true)

  // Đóng Modal và reset trạng thái
  const handleCancel = (): void => {
    setIsModalVisible(false)
    setCurrentStep(0)
    form.resetFields()
    setNoteTypeInputs([])
    setSubject('')
    setNextId(1)
  }

  // Chuyển bước tiếp theo
  const next = (): void => {
    form
      .validateFields()
      .then((): void => {
        setCurrentStep(currentStep + 1)
      })
      .catch((): void => {})
  }

  const prev = (): void => {
    setCurrentStep(currentStep - 1)
  }

  const handleOk = (): void => {
    form
      .validateFields()
      .then((): void => {
        const psychologyNoteDetails = noteTypeInputs.map((input) => ({
          psychologyNoteTypeId: input.psychologyNoteTypeId,
          content: input.content,
        }))
        const newPsychologyNote: CreatePsychologyNoteRequest = {
          studentPsychologyId: studentPsychologyId,
          psychologyNoteDetails,
          subject,
        }
        addPsychologyNote(newPsychologyNote, {
          onSuccess: () => {
            handleCancel()
            void refetch()
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            if (error.response?.status === 403) {
              setIsVerifyModalVisible(true)
            }
          },
        })
      })
      .catch((): void => {})
  }

  // Thêm một mục mới
  const addNoteTypeInput = (): void => {
    setNoteTypeInputs([
      ...noteTypeInputs,
      { tempId: nextId, psychologyNoteTypeId: '', content: '' },
    ])
    setNextId(nextId + 1)
  }

  // Xóa một mục theo tempId
  const removeNoteTypeInput = (tempId: number): void => {
    form.setFieldsValue({
      [`noteInputs[${tempId}].psychologyNoteTypeId`]: undefined,
      [`noteInputs[${tempId}].content`]: undefined,
    })
    setNoteTypeInputs(noteTypeInputs.filter((input): boolean => input.tempId !== tempId))
  }

  // Cập nhật giá trị của một trường
  const updateInput = (
    tempId: number,
    key: keyof PsychologyNoteDetailInput,
    value: string,
  ): void => {
    setNoteTypeInputs(
      noteTypeInputs.map((input) => (input.tempId === tempId ? { ...input, [key]: value } : input)),
    )
  }

  // Lấy danh sách NoteType khả dụng
  const getAvailableNoteTypes = (currentTempId: number) => {
    const selectedIds = noteTypeInputs.map((input) => input.psychologyNoteTypeId)
    return psychologyNoteType?.filter(
      (type): boolean =>
        !selectedIds.includes(type.id) ||
        noteTypeInputs.find((input): boolean => input.tempId === currentTempId)
          ?.psychologyNoteTypeId === type.id,
    )
  }

  const allNoteTypesSelected: boolean = noteTypeInputs.length >= (psychologyNoteType?.length || 0)

  if (!psychologyNoteType) {
    return <Spin />
  }

  return (
    <div>
      <Button type='primary' onClick={showModal} icon={<PlusOutlined />}>
        {t('COMMON.ADD_NEW')}
      </Button>
      <Modal
        maskClosable={false}
        title={t('LAYOUT.PSYCHOLOGY_MANAGEMENT')}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title={t('PSYCHOLOGY_NOTE.ADD_MODAL.SUBJECT')} />
          <Step title={t('PSYCHOLOGY_NOTE.ADD_MODAL.DETAIL')} />
        </Steps>

        {currentStep === 0 && (
          <Form form={form} layout='vertical' name='subjectForm'>
            <Form.Item
              name='subject'
              label={t('PSYCHOLOGY_NOTE.ADD_MODAL.SUBJECT')}
              rules={[
                { required: true, message: t('PSYCHOLOGY_NOTE.ADD_MODAL.REQUIRED_SUBJECT') },
                { min: 1, message: t('PSYCHOLOGY_NOTE.ADD_MODAL.MIN_SUBJECT') },
              ]}
            >
              <Input
                placeholder={t('PSYCHOLOGY_NOTE.ADD_MODAL.PLACEHOLDER_SUBJECT')}
                value={subject}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => setSubject(e.target.value)}
              />
            </Form.Item>
            <Button type='primary' onClick={next} style={{ width: '100%' }}>
              {t('PSYCHOLOGY_NOTE.ADD_MODAL.NEXT_BUTTON')}
            </Button>
          </Form>
        )}

        {currentStep === 1 && (
          <Form form={form} layout='vertical' name='noteForm'>
            {noteTypeInputs.map(
              (input): ReactNode => (
                <Card key={input.tempId} style={{ marginBottom: 16 }} bordered>
                  <Row gutter={16}>
                    <Col span={10}>
                      <Form.Item
                        name={`noteInputs[${input.tempId}].psychologyNoteTypeId`}
                        label={t('PSYCHOLOGY_NOTE.ADD_MODAL.PSYCHOLOGY_QUESTION')}
                        rules={[
                          {
                            required: true,
                            message: t('PSYCHOLOGY_NOTE.ADD_MODAL.REQUIRED_QUESTION'),
                          },
                          { min: 1, message: t('PSYCHOLOGY_NOTE.ADD_MODAL.MIN_QUESTION') },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder={t('PSYCHOLOGY_NOTE.ADD_MODAL.SELECT_QUESTION')}
                          value={input.psychologyNoteTypeId}
                          onChange={(value: string): void =>
                            updateInput(input.tempId, 'psychologyNoteTypeId', value)
                          }
                          disabled={getAvailableNoteTypes(input.tempId)?.length === 0}
                          filterOption={(input: string, option): boolean =>
                            (option?.children ?? '')
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {getAvailableNoteTypes(input.tempId)?.map(
                            (type: PsychologyNoteType): ReactNode => (
                              <Select.Option key={type.id} value={type.id}>
                                {type.vietnameseName}
                              </Select.Option>
                            ),
                          )}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name={`noteInputs[${input.tempId}].content`}
                        label={t('PSYCHOLOGY_NOTE.ADD_MODAL.ANSWER_CONTENT')}
                        rules={[
                          {
                            required: true,
                            message: t('PSYCHOLOGY_NOTE.ADD_MODAL.REQUIRED_CONTENT'),
                          },
                          { min: 1, message: t('PSYCHOLOGY_NOTE.ADD_MODAL.MIN_CONTENT') },
                        ]}
                      >
                        <Input
                          placeholder={t('PSYCHOLOGY_NOTE.ADD_MODAL.PLACEHOLDER_CONTENT')}
                          value={input.content}
                          onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                            updateInput(input.tempId, 'content', e.target.value)
                          }
                          disabled={!input.psychologyNoteTypeId}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                      <MinusCircleOutlined
                        style={{ fontSize: 20, color: 'red' }}
                        onClick={(): void => removeNoteTypeInput(input.tempId)}
                      />
                    </Col>
                  </Row>
                </Card>
              ),
            )}

            <Button
              type='dashed'
              onClick={addNoteTypeInput}
              icon={<PlusOutlined />}
              style={{ width: '100%' }}
              disabled={allNoteTypesSelected}
            >
              Thêm câu hỏi mới
            </Button>
            <PsychologyTypeManage />
            <Row gutter={16}>
              <Col span={12}>
                <Button type='default' onClick={prev} style={{ width: '100%' }}>
                  Quay lại
                </Button>
              </Col>
              <Col span={12}>
                <Button type='primary' onClick={handleOk} style={{ width: '100%' }}>
                  Thêm mới
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
      {isVerifyModalVisible && (
        <VerifyStudentPsychology
          id={studentPsychologyId}
          setIsModalVisible={setIsVerifyModalVisible}
          refetch={() => {}}
        />
      )}
    </div>
  )
}

export default AddPsychologyNoteModal
