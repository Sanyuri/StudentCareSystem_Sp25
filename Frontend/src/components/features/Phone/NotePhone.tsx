import { useState, FC } from 'react'
import EditNote from '../Note/EditNote'
import NotePhoneList from './NotePhoneList'
import { Card, List, Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import AddNoteModal from '../Note/AddNoteModal'
import { SearchOutlined } from '@ant-design/icons'
import usePagination from '#hooks/usePagination.js'
import useTemplateStore from '#stores/templateState.js'
import { NoteModel } from '#src/types/Data/NoteModel.js'
import { DefaultNoteType } from '#utils/constants/Note/index.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { useDetailStudentNoteData, useNoteManagementData } from '#hooks/api/note/useNoteData.js'
import { useNoteTypeData, useNoteTypeDefaultData } from '#hooks/api/noteType/useNoteTypeData.js'

interface NotePhoneProps {
  phoneCallId: string
}

const NotePhone: FC<NotePhoneProps> = () => {
  const { t } = useTranslation()
  const { darkMode } = useTemplateStore()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteStudentNote)

  const {
    data: selectedNote,
    isLoading: loadingNoteDetail,
    refetch: refetchNoteDetail,
  } = useDetailStudentNoteData(editingNote ?? '')

  const { data: notesTypeList } = useNoteTypeData('')
  const { data: callNoteType } = useNoteTypeDefaultData(DefaultNoteType.Call)

  const { data: notesList, refetch } = useNoteManagementData(
    searchKeyword,
    callNoteType?.id,
    page,
    pageSize,
  )

  const showModal = (note?: NoteModel) => {
    if (note) {
      setEditingNote(note.id)
      form.setFieldsValue({ content: note.content })
    } else {
      setEditingNote(null)
      form.resetFields()
    }
    setModalVisible(true)
  }

  const handleCloseModal = (): void => {
    setModalVisible(false)
    setEditingNote(null)
    form.resetFields()
    void refetchNoteDetail()
  }

  return (
    <Card
      title={
        <div className='flex items-center justify-between'>
          <span>{t('PHONE.NOTES.TITLE')}</span>
          {hasEditPermission && (
            <AddNoteModal
              studentCodeProp={''}
              mode={'manage-note'}
              noteTypeIdDefault={callNoteType?.id}
            />
          )}
        </div>
      }
      className={`shadow-md ${darkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}
    >
      <div className='mb-4'>
        <Input
          placeholder={t('PHONE.NOTES.SEARCH')}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>

      <List
        itemLayout='vertical'
        dataSource={notesList?.items}
        pagination={{
          current: page,
          onChange: handlePageChange,
          total: notesList?.totalItems,
          defaultPageSize: pageSizeRef.current,
          showSizeChanger: true,
          showTotal: (total: number): string => t('COMMON.TOTAL_RECORDS', { total }),
          align: 'center',
        }}
        renderItem={(note) => <NotePhoneList note={note} showModal={showModal} />}
      />

      <EditNote
        isVisible={modalVisible}
        onClose={handleCloseModal}
        staffDetails={selectedNote}
        loading={loadingNoteDetail}
        onRefetch={refetch}
        notesTypeList={notesTypeList}
      />
    </Card>
  )
}

export default NotePhone
