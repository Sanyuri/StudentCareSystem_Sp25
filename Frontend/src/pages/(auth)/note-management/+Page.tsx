import { Select } from 'antd'
import { useState, useMemo, ReactNode, FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import TableNote from '#components/features/Note/TableNote.js'
import NoteTypeManage from '#components/features/NoteType/NoteTypeManage.js'
import i18n from '#src/plugins/i18n.js'
import AddNoteModal from '#components/features/Note/AddNoteModal.js'
import DetailNote from '#components/features/Note/DetailNote.js'
import EditNote from '#components/features/Note/EditNote.js'
import DeleteNote from '#components/features/Note/DeleteNote.js'
import ImportExcelNote from '#components/features/Note/ImportExcel/ImportExcelNote.js'
import { useNoteTypeData } from '#hooks/api/noteType/useNoteTypeData.js'
import { useDetailStudentNoteData } from '#hooks/api/note/useNoteData.js'
import { NoteType } from '#types/Data/NoteType.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import ExportNote from '#components/features/Note/ExportNote.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

const { Option } = Select

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const currentLanguage: string = i18n.language
  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [filter, setFilter] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [modalType, setModalType] = useState<'detail' | 'edit' | 'delete' | null>(null) // Biến để theo dõi loại modal
  const [noteRequest, setNoteRequest] = useState<string | null>(null)
  const { data: notesTypeList } = useNoteTypeData('')
  const memoizedFilter: string = useMemo(() => filter, [filter])
  const { data: selectedNote, isLoading, refetch } = useDetailStudentNoteData(noteRequest || '')

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteStudentNote)
  const hasReadNoteTypePermission = hasPermission(PermissionType.ReadNoteType)

  const showModal = (Id: string, type: 'detail' | 'edit' | 'delete') => {
    setIsModalVisible(true)
    setModalType(type)
    setNoteRequest(Id)
  }

  const handleCloseModal = (): void => {
    setIsModalVisible(false)
    setNoteRequest(null)
    setModalType(null)
  }

  const handleRefetch = async (): Promise<void> => {
    await refetch()
  }

  const handleFilterChange = (value: string): void => {
    setFilter(value) // Just set the string value directly
  }
  const handleStudentCodeClick = (studentCode: string): void => {
    setSearchTermDelayed(studentCode) // Update the search bar
    setSearchTermDelayed(studentCode) // Trigger search immediately
  }

  return (
    <Fragment>
      <section className='flex justify-between items-center w-full text-sm leading-6 max-md:max-w-full'>
        {/* Container for Input and Select */}
        <div className='flex items-center gap-4 w-full max-md:w-full'>
          <div className='flex items-center min-w-[280px]'>
            <InputDebounce
              value={searchTermDelayed}
              onDebouncedChange={setSearchTermDelayed}
              placeholder={t('NOTES.NOTES_SEARCH_TERM')}
              style={{ width: 350 }}
              variant='filled'
              className='h-10'
              prefix={<GlassIcon />}
            />
          </div>
          <div className='flex items-center min-w-[220px]'>
            <label htmlFor='AccountFilter' className='font-medium mr-2'>
              {t('NOTES.FILTER_NOTE_TYPE')}:
            </label>
            <Select
              placeholder={t('NOTES.FILTER_ALL')}
              size='large'
              style={{ width: 180 }}
              onChange={handleFilterChange}
            >
              <Option value=''>{t('NOTES.FILTER_ALL')}</Option>
              {notesTypeList?.map(
                (template: NoteType): ReactNode => (
                  <Option key={template.id} value={template.id}>
                    {currentLanguage === 'vi' ? template.vietnameseName : template.englishName}
                  </Option>
                ),
              )}
            </Select>
          </div>
        </div>

        {/* Container for Buttons */}
        <div className='flex items-center gap-4'>
          {/* Increase the size of the Import Excel button */}

          <ImportExcelNote />

          <ExportNote />
          {hasReadNoteTypePermission && <NoteTypeManage />}
          {hasEditPermission && <AddNoteModal studentCodeProp={''} mode={'manage-note'} />}
        </div>
      </section>

      <div className='mt-4'>
        <TableNote
          searchTerm={searchTermDelayed}
          filter={memoizedFilter}
          onStudentCodeClick={handleStudentCodeClick}
          showModal={showModal}
        />
      </div>
      {modalType === 'detail' && (
        <DetailNote
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          showModal={showModal}
          staffDetails={selectedNote}
          loading={isLoading}
        />
      )}
      {modalType === 'edit' && hasEditPermission && (
        <EditNote
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffDetails={selectedNote}
          loading={isLoading}
          onRefetch={handleRefetch}
          notesTypeList={notesTypeList}
        />
      )}
      {modalType === 'delete' && hasEditPermission && (
        <DeleteNote
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffDetails={selectedNote}
          loading={isLoading}
        />
      )}
    </Fragment>
  )
}
