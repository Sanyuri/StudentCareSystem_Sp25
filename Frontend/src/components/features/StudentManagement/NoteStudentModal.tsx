import { Note } from '#types/Data/Note.js'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import { NoteStudentModalProps } from '#types/Props/NoteProp.js'
import { useNoteStudentData } from '#hooks/api/note/useNoteData.js'
import { Button, Form, Input, List, Modal, Space, Card } from 'antd'
import AddNoteModal from '#components/features/Note/AddNoteModal.js'
import { UpdateNoteRequest } from '#types/RequestModel/ApiRequest.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import { useDeleteNoteMutation, useUpdateNoteMutation } from '#hooks/api/note/useNoteMutation.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
const NoteStudentModal: FC<NoteStudentModalProps> = ({
  studentRecord,
  visible,
  onClose,
}: NoteStudentModalProps): ReactNode => {
  const { t } = useTranslation()
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [form] = Form.useForm()
  const { data: notesList, isLoading, refetch } = useNoteStudentData(studentRecord.studentCode)
  const { mutate: updateMutate } = useUpdateNoteMutation()
  const { mutate: deleteMutate } = useDeleteNoteMutation()

  const handleEditNote = (note: Note): void => {
    setEditingNote(note)
    form.setFieldsValue(note)
  }

  const handleDeleteNote = (noteId: string): void => {
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

  const handleSaveNote: (values: { content: string }) => Promise<void> = async (values: {
    content: string
  }): Promise<void> => {
    if (!editingNote?.id) {
      return
    }
    const formValues = form.getFieldsValue()
    const updatedNote: UpdateNoteRequest = {
      id: editingNote.id,
      content: values.content,
      noteTypeId: formValues.noteTypeId,
      entityId: formValues.entityId,
      studentCode: studentRecord.studentCode,
    }

    updateMutate(updatedNote, {
      onSuccess: (): void => {
        setEditingNote(null)
        form.resetFields()
        void refetch()
      },
    })
  }

  return (
    <Modal
      title={`${t('NOTE.MANAGE_NOTE.VIEW.MODAL_TITLE')} ${studentRecord.studentName} - ${studentRecord.studentCode}`}
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
        <AddNoteModal studentCodeProp={studentRecord.studentCode} mode={'manage-student'} />
        <List
          dataSource={notesList}
          loading={isLoading}
          renderItem={(note: Note): ReactNode => (
            <Card className='shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow'>
              {/* If editing */}
              {editingNote?.id === note.id ? (
                <div className='p-4  rounded-md'>
                  <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    form={form}
                    initialValues={{
                      content: note.content,
                      studentCode: note.studentCode,
                      semesterName: note.semesterName,
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
                    <div className='flex justify-end space-x-2'>
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
                  </div>
                  <div className='text-sm mt-2'>
                    {t('NOTE.ADD_FORM.CREATE_AT')}{' '}
                    {convertToLocalDateTime(note.createdAt.toString())} -{' '}
                    {t('NOTE.ADD_FORM.SEMESTER')}
                    {note.semesterName}
                  </div>
                </>
              )}
            </Card>
          )}
        />
      </Space>
    </Modal>
  )
}

export default NoteStudentModal
