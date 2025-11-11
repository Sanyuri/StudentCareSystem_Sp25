import { useDeleteNoteMutation } from '#hooks/api/note/useNoteMutation.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { NoteModel } from '#src/types/Data/NoteModel.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import useTemplateStore from '#stores/templateState.js'
import { formatDate } from '#utils/helper/exportExcel.js'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, List, Popconfirm, Typography } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface NotePhoneListProps {
  note: NoteModel
  showModal: (note: NoteModel) => void
}

const NotePhoneList: FC<NotePhoneListProps> = ({ note, showModal }: NotePhoneListProps) => {
  const { t } = useTranslation()
  const { darkMode } = useTemplateStore()

  const { hasPermission } = useCheckPermission()
  const hasEditPermission = hasPermission(PermissionType.WriteStudentNote)

  const { mutateAsync: deleteNote } = useDeleteNoteMutation()

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId)
  }
  return (
    <List.Item
      key={note?.id}
      className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-0`}
      actions={
        hasEditPermission
          ? [
              <Button
                key='edit'
                type='text'
                icon={<EditOutlined />}
                onClick={() => showModal(note)}
                className={darkMode ? 'text-blue-400' : 'text-blue-600'}
              >
                {t('COMMON.EDIT')}
              </Button>,
              <Popconfirm
                key='delete'
                title={t('PHONE.NOTES.CONFIRM_DELETE')}
                onConfirm={() => handleDeleteNote(note.id)}
                okText={t('COMMON.CONFIRM')}
                cancelText={t('COMMON.CANCEL')}
              >
                <Button type='text' danger icon={<DeleteOutlined />}>
                  {t('COMMON.DELETE')}
                </Button>
              </Popconfirm>,
            ]
          : []
      }
    >
      <div className='mb-2'>
        <Typography.Paragraph className={`mb-1 ${darkMode ? 'text-gray-200' : ''}`}>
          {note.content}
        </Typography.Paragraph>
        <Typography.Text type='secondary' className={`text-xs ${darkMode ? 'text-gray-400' : ''}`}>
          {t('PHONE.NOTES.UPDATED_AT')}: {formatDate(note.updatedAt?.toString() ?? '')}
        </Typography.Text>
      </div>
    </List.Item>
  )
}
export default NotePhoneList
