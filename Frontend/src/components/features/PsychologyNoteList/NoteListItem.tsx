import React, { useMemo, useState } from 'react'
import {
  Card,
  List,
  Typography,
  Space,
  Collapse,
  Empty,
  Button,
  Modal,
  Input,
  Form,
  Select,
  Tooltip,
} from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, LinkOutlined } from '@ant-design/icons'
import { SemesterNote } from '#src/types/Data/PsychologyNote.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import {
  useAddPsychologyNoteDetailMutation,
  useUpdatePsychologyNoteDetailMutation,
  useDeletePsychologyNoteDetailMutation,
} from '#hooks/api/psychologyNoteDetail/usePsychologyDetailMutation.js'
import VerifyStudentPsychology from '#components/features/StudentPsychology/VerifyStudentPsychology.js'
import { useTranslation } from 'react-i18next'
import { StudentModel } from '#src/types/Data/StudentModel.js'
import UploadPsychologyNote from './UploadPsychologyNote'

const { Panel } = Collapse
const { Text, Title } = Typography
const { Option } = Select

interface SemesterNotesListProps {
  notes: SemesterNote[]
  noteTypes: { id: string; vietnameseName: string; englishName: string }[]
  refetchNotes: () => void
  id: string
  studentInfo: StudentModel | undefined
}

const SemesterNotesList: React.FC<SemesterNotesListProps> = ({
  notes,
  noteTypes,
  refetchNotes,
  id,
  studentInfo,
}) => {
  const [form] = Form.useForm()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState('')
  const [editingDetailId, setEditingDetailId] = useState('')
  const [editingContent, setEditingContent] = useState('')
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false)
  const [availableNoteTypes, setAvailableNoteTypes] = useState(noteTypes)

  const addMutation = useAddPsychologyNoteDetailMutation()
  const updateMutation = useUpdatePsychologyNoteDetailMutation()
  const deleteMutation = useDeletePsychologyNoteDetailMutation()

  const { t } = useTranslation()

  const getIconForNoteType = (noteType: string) => {
    switch (noteType.toLowerCase()) {
      case 'academic':
        return '📚'
      case 'relationships':
        return '👥'
      case 'career':
        return '💼'
      case 'emotional':
        return '😊'
      case 'love':
        return '❤️'
      case 'learning':
        return '📖'
      default:
        return '📝'
    }
  }

  const groupedNotes = useMemo(() => {
    if (notes.length === 0) {
      return {}
    }

    const grouped: { [key: string]: { [key: string]: SemesterNote[] } } = {}
    notes.forEach((note) => {
      const match = /^(Spring|Summer|Fall)(\d{4})$/.exec(note.semesterName)
      if (match) {
        const [, semester, year] = match
        grouped[year] = grouped[year] || {}
        grouped[year][semester] = grouped[year][semester] || []
        grouped[year][semester].push(note)
      }
    })

    return Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .reduce(
        (acc, year) => {
          acc[year] = grouped[year]
          return acc
        },
        {} as { [key: string]: { [key: string]: SemesterNote[] } },
      )
  }, [notes])

  if (notes.length === 0) {
    return <Empty description={t('SEMESTER_NOTES.EMPTY_STATE')} />
  }

  const semesterOrder = ['Fall', 'Summer', 'Spring']

  const areAllNoteTypesFilled = (note: SemesterNote) => {
    const filledNoteTypes = new Set(
      note.psychologyNoteDetails.map((detail) => detail.psychologyNoteType.id),
    )
    return filledNoteTypes.size === noteTypes.length
  }

  const handleAdd = (noteId: string) => {
    setEditingNoteId(noteId)
    const currentNote = notes.find((note) => note.id === noteId)
    if (currentNote) {
      const filledNoteTypes = new Set(
        currentNote.psychologyNoteDetails.map((detail) => detail.psychologyNoteType.id),
      )
      const availableNoteTypes = noteTypes.filter((type) => !filledNoteTypes.has(type.id))
      setAvailableNoteTypes(availableNoteTypes)
    }
    setAddModalVisible(true)
  }

  const handleAddSave = async () => {
    try {
      const values = await form.validateFields()
      await addMutation.mutateAsync({
        content: values.content,
        psychologyNoteId: editingNoteId,
        psychologyNoteTypeId: values.psychologyNoteTypeId,
      })
      setAddModalVisible(false)
      form.resetFields()
      setAvailableNoteTypes(noteTypes)
      refetchNotes()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setEditingNoteId(editingNoteId)
        setIsVerifyModalVisible(true)
      }
    }
  }

  const handleEdit = (noteId: string, detailId: string, content: string) => {
    setEditingNoteId(noteId)
    setEditingDetailId(detailId)
    setEditingContent(content)
    setEditModalVisible(true)
  }

  const handleEditSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: editingDetailId,
        content: editingContent,
      })
      setEditModalVisible(false)
      refetchNotes()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setEditingNoteId(editingNoteId)
        setIsVerifyModalVisible(true)
      }
    }
  }

  const handleDelete = (noteId: string, detailId: string) => {
    setEditingNoteId(noteId)
    setEditingDetailId(detailId)
    setDeleteModalVisible(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(editingDetailId)
      setDeleteModalVisible(false)
      refetchNotes()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setEditingNoteId(editingNoteId)
        setIsVerifyModalVisible(true)
      }
    }
  }

  const handleAddModalClose = () => {
    setAddModalVisible(false)
    setAvailableNoteTypes(noteTypes)
    form.resetFields()
  }

  return (
    <div style={{ padding: '20px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {Object.entries(groupedNotes).map(([year, semesters]) => (
          <div key={year}>
            <Title level={3} style={{ marginBottom: '16px' }}>
              {t('SEMESTER_NOTES.YEAR')} {year}
            </Title>
            {semesterOrder.map((semester) => {
              if (!semesters[semester]) return null

              return (
                <Card
                  key={`${semester}${year}`}
                  title={
                    <Space>
                      {semester === 'Spring' && '🌸'}
                      {semester === 'Summer' && '☀️'}
                      {semester === 'Fall' && '🍂'}
                      {t(`SEMESTER_NOTES.SEMESTER.${semester.toUpperCase()}`)}
                    </Space>
                  }
                  style={{ marginBottom: '16px' }}
                >
                  <Collapse>
                    {semesters[semester].map((note) => (
                      <Panel
                        key={note.id}
                        header={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Space>
                              <Text strong>{note.subject}</Text>
                              <Text type='secondary'>
                                {t('SEMESTER_NOTES.NOTE.CREATED_AT')}:{' '}
                                {convertToLocalDateTime(note.createdAt.toString())}
                              </Text>
                            </Space>
                            <Space>
                              <UploadPsychologyNote
                                id={id}
                                notes={notes}
                                studentInfo={studentInfo}
                                note={note}
                              />
                              <Tooltip
                                title={
                                  note.driveURL
                                    ? t('STUDENT_PSYCHOLOGY.OPEN_DRIVE')
                                    : t('STUDENT_PSYCHOLOGY.UPLOAD_DRIVE')
                                }
                              >
                                {note.driveURL && (
                                  <Button
                                    type='default'
                                    size='small'
                                    icon={<LinkOutlined />}
                                    onClick={async (e) => {
                                      e.stopPropagation()
                                      window.open(note.driveURL, '_blank')
                                    }}
                                  >
                                    {t('COMMON.DRIVE')}
                                  </Button>
                                )}
                              </Tooltip>
                              {!areAllNoteTypesFilled(note) && (
                                <Button
                                  type='primary'
                                  size='small'
                                  icon={<PlusOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAdd(note.id)
                                  }}
                                >
                                  {t('SEMESTER_NOTES.NOTE.ADD')}
                                </Button>
                              )}
                            </Space>
                          </div>
                        }
                      >
                        <List
                          itemLayout='vertical'
                          dataSource={note.psychologyNoteDetails}
                          renderItem={(detail) => (
                            <List.Item
                              key={detail.id}
                              style={{ position: 'relative', paddingRight: '100px' }}
                            >
                              <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                <Button
                                  key='edit'
                                  icon={<EditOutlined />}
                                  onClick={() => handleEdit(note.id, detail.id, detail.content)}
                                  style={{ marginRight: '8px' }}
                                >
                                  {t('SEMESTER_NOTES.NOTE.EDIT')}
                                </Button>
                                <Button
                                  key='delete'
                                  icon={<DeleteOutlined />}
                                  danger
                                  onClick={() => handleDelete(note.id, detail.id)}
                                >
                                  {t('SEMESTER_NOTES.NOTE.DELETE')}
                                </Button>
                              </div>
                              <List.Item.Meta
                                avatar={getIconForNoteType(
                                  detail.psychologyNoteType.englishName.toLowerCase(),
                                )}
                                title={
                                  <Space>
                                    <Text strong>{detail.psychologyNoteType.vietnameseName}</Text>
                                    <Text strong>({detail.psychologyNoteType.englishName})</Text>
                                  </Space>
                                }
                              />
                              {detail.content}
                            </List.Item>
                          )}
                        />
                      </Panel>
                    ))}
                  </Collapse>
                </Card>
              )
            })}
          </div>
        ))}
      </Space>
      <Modal
        title={t('SEMESTER_NOTES.MODAL.EDIT_TITLE')}
        visible={editModalVisible}
        onOk={handleEditSave}
        onCancel={() => setEditModalVisible(false)}
      >
        <Input.TextArea
          value={editingContent}
          onChange={(e) => setEditingContent(e.target.value)}
          rows={4}
        />
      </Modal>

      <Modal
        title={t('SEMESTER_NOTES.MODAL.ADD_TITLE')}
        visible={addModalVisible}
        onOk={handleAddSave}
        onCancel={handleAddModalClose}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='content'
            label={t('SEMESTER_NOTES.MODAL.CONTENT_LABEL')}
            rules={[{ required: true, message: t('SEMESTER_NOTES.MODAL.CONTENT_REQUIRED') }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name='psychologyNoteTypeId'
            label={t('SEMESTER_NOTES.MODAL.NOTE_TYPE_LABEL')}
            rules={[{ required: true, message: t('SEMESTER_NOTES.MODAL.NOTE_TYPE_REQUIRED') }]}
          >
            <Select>
              {availableNoteTypes.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.vietnameseName} ({type.englishName})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={t('SEMESTER_NOTES.NOTE.CONFIRM_DELETE')}
        visible={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>{t('SEMESTER_NOTES.MODAL.CONTENT_REQUIRED')}</p>
      </Modal>

      {isVerifyModalVisible && (
        <VerifyStudentPsychology
          id={id}
          setIsModalVisible={setIsVerifyModalVisible}
          refetch={refetchNotes}
        />
      )}
    </div>
  )
}

export default SemesterNotesList
