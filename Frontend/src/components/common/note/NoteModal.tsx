import { FC, useState } from 'react'
import { Button, Form, Input, List, Modal, Space, Card, Collapse } from 'antd'
import { NoteModalProps } from '#types/Props/NoteProp.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import { Note } from '#types/Data/Note.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import { CreateNoteRequest, UpdateNoteRequest } from '#types/RequestModel/ApiRequest.js'
import { useTranslation } from 'react-i18next'
import { useCurrentSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { useNoteData } from '#hooks/api/note/useNoteData.js'
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from '#hooks/api/note/useNoteMutation.js'
import AddNoteModal from '#components/common/note/AddNoteModal.js'
import DeleteIcon from '#assets/icon/Delete.svg?react'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
const { Panel } = Collapse
const NoteModal: FC<NoteModalProps> = ({
  noteType,
  studentRecord,
  entityId,
  visible,
  onClose,
}: NoteModalProps) => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [form] = Form.useForm()
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const { data: currentSemester } = useCurrentSemesterData()
  const { data: notesList, isLoading, refetch } = useNoteData(entityId)
  const { mutate: addMutate } = useAddNoteMutation()
  const { mutate: updateMutate } = useUpdateNoteMutation()
  const { mutate: deleteMutate } = useDeleteNoteMutation()

  const { hasPermission } = useCheckPermission()
  const hasEditNotePermission = hasPermission(PermissionType.WriteStudentNote)

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    form.setFieldsValue(note)
  }

  const handleDeleteNote = (noteId: string) => {
    Modal.confirm({
      title: t('NOTE.MANAGE_NOTE.DELETE.TITLE'),
      content: t('NOTE.MANAGE_NOTE.DELETE.CONTENT'),
      okText: t('COMMON.CONFIRM'),
      cancelText: t('COMMON.CANCEL'),
      onOk: (): void => {
        deleteMutate(noteId, {
          onSuccess: (): void => {
            void refetch()
          },
        })
      },
    })
  }

  const handleSaveNote: (values: {
    content: string
    channel: string
    processingTime: string
  }) => Promise<void> = async (values: {
    content: string
    channel: string
    processingTime: string
  }): Promise<void> => {
    if (!editingNote?.id) {
      return
    }
    const updatedNote: UpdateNoteRequest = {
      id: editingNote.id,
      content: values.content,
      noteTypeId: noteType.id,
      entityId: entityId,
      studentCode: studentRecord.studentCode,
      channel: values.channel,
      processingTime: values.processingTime,
    }

    updateMutate(updatedNote, {
      onSuccess: () => {
        setEditingNote(null)
        form.resetFields()
        void refetch()
      },
    })
  }

  const handleAddNote: (values: {
    content: string
    channel: string
    processingTime: string
  }) => void = (values: { content: string; channel: string; processingTime: string }): void => {
    const newNote: CreateNoteRequest = {
      content: values.content,
      noteTypeId: noteType.id,
      entityId: entityId,
      studentCode: studentRecord.studentCode,
      channel: values.channel,
      processingTime: values.processingTime,
    }

    addMutate(newNote, {
      onSuccess: () => {
        form.resetFields()
        void refetch()
      },
    })

    setIsAddModalVisible(false)
  }

  return (
    <>
      <Modal
        title={`${t('NOTE.MANAGE_NOTE.VIEW.MODAL_TITLE')} ${studentRecord.studentName} - ${studentRecord.studentCode} (${
          currentLanguage === 'vi' ? noteType.vietnameseName : noteType.englishName
        })`}
        open={visible}
        centered
        styles={{
          body: {
            overflowX: 'hidden',
            maxHeight: '500px',
            paddingBottom: '20px',
            paddingRight: '20px',
          },
        }}
        onCancel={onClose}
        footer={null}
        width={1000}
      >
        <Space direction='vertical' className='w-full'>
          {hasEditNotePermission && (
            <Button
              type='primary'
              className='mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'
              onClick={() => setIsAddModalVisible(true)}
            >
              {t('NOTE.MANAGE_NOTE.VIEW.ADD_BUTTON')}
            </Button>
          )}
          <List
            dataSource={notesList}
            loading={isLoading}
            renderItem={(note: Note) => (
              <Card className='shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow'>
                {/* If editing */}
                {editingNote?.id === note.id ? (
                  <div className='p-4  rounded-md'>
                    <Form
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      labelAlign='left'
                      form={form}
                      initialValues={{
                        content: note.content,
                        studentCode: note.studentCode,
                        semesterName: note.semesterName,
                        channel: note.channel,
                        processingTime: note.processingTime,
                      }}
                      onFinish={handleSaveNote}
                    >
                      <Form.Item
                        name='content'
                        label={t('NOTE.ADD_FORM.LABEL')}
                        rules={[
                          { required: true, message: t('NOTE.ADD_FORM.REQUIRE_CONTENT') },
                          {
                            min: 1,
                            message: t('NOTE.ADD_FORM.REQUIRE_MIN__CONTENT'),
                          },
                        ]}
                      >
                        <Input.TextArea
                          placeholder={t('NOTE.ADD_FORM.PLACEHOLDER')}
                          rows={4}
                          className='rounded-md border-gray-300'
                        />
                      </Form.Item>
                      <Form.Item name='studentCode' label={t('NOTE.ADD_FORM.STUDENT_CODE')}>
                        <Input disabled={true} className='rounded-md border-gray-300' />
                      </Form.Item>
                      <Form.Item name='semesterName' label={t('NOTE.ADD_FORM.SEMESTER')}>
                        <Input disabled={true} className='rounded-md border-gray-300' />
                      </Form.Item>
                      <Collapse>
                        <Panel header={t('NOTE.ADD_FORM.ADDITIONAL_INFO')} key='1'>
                          <Form.Item name='channel' label={t('NOTE.ADD_FORM.CHANNEL')}>
                            <Input placeholder={t('NOTE.ADD_FORM.CHANNEL_PLACEHOLDER')} />
                          </Form.Item>

                          <Form.Item
                            name='processingTime'
                            label={t('NOTE.ADD_FORM.PROCESSING_TIME')}
                          >
                            <Input placeholder={t('NOTE.ADD_FORM.PROCESSING_TIME_PLACEHOLDER')} />
                          </Form.Item>
                        </Panel>
                      </Collapse>
                      <div className='mt-4 flex justify-end space-x-2'>
                        <Button
                          onClick={(): void => {
                            form.resetFields()
                            setEditingNote(null)
                          }}
                          className='bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md'
                        >
                          {t('COMMON.CANCEL')}
                        </Button>
                        <Button
                          type='primary'
                          htmlType='submit'
                          className='bg-blue-500 hover:bg-blue-600 text-white rounded-md'
                        >
                          {t('COMMON.CONFIRM')}
                        </Button>
                      </div>
                    </Form>
                  </div>
                ) : (
                  <>
                    <div className='flex justify-between items-start'>
                      <div className='font-bold w-3/4'>
                        {note.content.length > 100 ? (
                          <>
                            <p>{note.content.substring(0, 100)}...</p>
                            <Button
                              type='link'
                              className='p-0 text-blue-500'
                              onClick={() =>
                                Modal.info({
                                  title: t('NOTE.ADD_FORM.DETAIL_CONTENT'),
                                  content: <p>{note.content}</p>,
                                  okText: t('COMMON.CLOSE'),
                                  maskClosable: true,
                                })
                              }
                            >
                              {t('COMMON.VIEW_MORE')}
                            </Button>
                          </>
                        ) : (
                          <p>{note.content}</p>
                        )}
                      </div>
                      {hasEditNotePermission && (
                        <div className='flex flex-col space-y-2'>
                          <Button
                            key='edit'
                            className='text-blue-500 hover:text-blue-600'
                            icon={<EditIcon />}
                            onClick={() => handleEditNote(note)}
                          />

                          <Button
                            key='delete'
                            className='text-red-500 hover:text-red-600'
                            icon={<DeleteIcon />}
                            onClick={() => handleDeleteNote(note.id)}
                          />
                        </div>
                      )}
                    </div>
                    <div className='text-sm mt-2'>
                      {t('NOTE.ADD_FORM.CREATE_AT')}{' '}
                      {convertToLocalDateTime(note.createdAt?.toString())} -{' '}
                      {t('NOTE.ADD_FORM.SEMESTER')} {note.semesterName}
                    </div>
                  </>
                )}
              </Card>
            )}
          />
        </Space>
      </Modal>
      <AddNoteModal
        visible={isAddModalVisible}
        semester={currentSemester?.semesterName}
        studentCode={studentRecord.studentCode}
        studentName={studentRecord.studentName}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleAddNote}
      />
    </>
  )
}

export default NoteModal
