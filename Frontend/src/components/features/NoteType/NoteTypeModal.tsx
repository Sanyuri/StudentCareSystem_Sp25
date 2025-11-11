import { debounce } from 'lodash'
import { toast } from 'react-toastify'
import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { NoteType } from '#types/Data/NoteType.js'
import { Modal, Form, Input, Table, Button, Space } from 'antd'
import { useNoteTypeData } from '#hooks/api/noteType/useNoteTypeData.js'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import { CreateNoteTypeRequest, UpdateNoteTypeRequest } from '#types/RequestModel/ApiRequest.js'
import {
  useAddNoteTypeMutation,
  useDeleteNoteTypeMutation,
  useUpdateNoteTypeMutation,
} from '#hooks/api/noteType/useNoteTypeMutation.js'
import AddWhiteIcon from '#assets/icon/Add.svg?react'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
import usePagination from '#hooks/usePagination.js'
interface NoteTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

const NoteTypeModal: FC<NoteTypeModalProps> = ({
  isOpen,
  onClose,
}: NoteTypeModalProps): ReactNode => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isInnerModalOpen, setIsInnerModalOpen] = useState(false)
  const [searchTerm] = useState('')
  const [searchTermDelayed, setSearchTermDelayed] = useState(searchTerm)

  const debouncedSetSearchTermDelayed = useMemo(() => debounce(setSearchTermDelayed, 2000), [])

  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()

  const { data: notesTypeList, isLoading } = useNoteTypeData(searchTermDelayed)
  const { mutate: addMutate } = useAddNoteTypeMutation()
  const { mutate: updateMutate } = useUpdateNoteTypeMutation()
  const { mutate: deleteMutate } = useDeleteNoteTypeMutation()

  const columns: ColumnsType<NoteType> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (_: unknown, __: NoteType, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('NOTE_TYPE.TABLE_COLUMN.NAME'),
      dataIndex: 'vietnameseName',
      key: 'vietnameseName',
    },
    {
      title: t('NOTE_TYPE.TABLE_COLUMN.TIME_CREATE'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: unknown, record: NoteType): string => {
        return convertToLocalDateTime(record.createdAt.toString())
      },
    },
    {
      title: t('NOTE_TYPE.TABLE_COLUMN.TIME_UPDATE'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_: unknown, record: NoteType): string => {
        return record.updatedAt ? convertToLocalDateTime(record.updatedAt.toString()) : '-'
      },
    },
    {
      title: t('NOTE_TYPE.TABLE_COLUMN.ACTION'),
      key: 'action',
      width: 120,
      render: (_, record: NoteType): ReactNode => {
        return (
          <Space>
            <Button type='text' icon={<EditIcon />} onClick={(): void => handleEdit(record)} />
            <Button
              type='text'
              icon={<DeleteIcon />}
              onClick={(): void => handleDelete(record.id)}
              disabled={!!record.defaultNoteType && record.defaultNoteType !== 'Unknown'}
            />
          </Space>
        )
      },
    },
  ]

  const handleEdit: (record: NoteType) => void = (record: NoteType): void => {
    setEditingId(record.id)
    form.setFieldsValue({
      englishName: record.englishName,
      vietnameseName: record.vietnameseName,
    })
    setIsInnerModalOpen(true)
  }

  const handleDelete: (id: string) => void = (id: string): void => {
    Modal.confirm({
      title: t('NOTE_TYPE.DELETE.TITLE'),
      content: t('NOTE_TYPE.DELETE.CONTENT'),
      okText: t('COMMON.CONFIRM'),
      cancelText: t('COMMON.CANCEL'),
      onOk: (): void => {
        deleteMutate(id, {})
      },
    })
  }

  const handleAdd: () => void = (): void => {
    setEditingId(null)
    form.resetFields()
    setIsInnerModalOpen(true)
  }

  const handleSubmit: () => Promise<void> = async (): Promise<void> => {
    try {
      const values: NoteType = await form.validateFields()
      if (editingId === null) {
        const createNoteType: CreateNoteTypeRequest = {
          vietnameseName: values.vietnameseName,
          englishName: values.englishName,
        }
        addMutate(createNoteType)
      } else {
        const updateNoteType: UpdateNoteTypeRequest = {
          id: editingId,
          vietnameseName: values.vietnameseName,
          englishName: values.englishName,
        }
        updateMutate(updateNoteType)
      }
      setIsInnerModalOpen(false)
    } catch (error) {
      toast.error(t('NOTE_TYPE.CREATE.FAIL'))
    }
  }

  useEffect(() => {
    debouncedSetSearchTermDelayed(searchTerm)

    return () => {
      debouncedSetSearchTermDelayed.cancel()
    }
  }, [searchTerm, debouncedSetSearchTermDelayed])

  return (
    <Modal
      centered
      title={t('NOTE_TYPE.MODAL.TITLE')}
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <div className='mb-4 flex justify-between'>
        <Button type='primary' icon={<AddWhiteIcon />} onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={notesTypeList}
        rowKey='id'
        loading={isLoading}
        pagination={{
          current: page,
          onChange: handlePageChange,
          total: notesTypeList?.length,
          defaultPageSize: pageSizeRef.current,
          showSizeChanger: true,
          position: ['bottomCenter'],
          showTotal: (total: number): string => t('COMMON.TOTAL_RECORDS', { total }),
          align: 'start',
        }}
      />

      <Modal
        title={editingId === null ? t('NOTE_TYPE.MODAL.ADD') : t('NOTE_TYPE.MODAL.EDIT')}
        open={isInnerModalOpen}
        onOk={handleSubmit}
        onCancel={(): void => setIsInnerModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout='vertical' className='mt-4'>
          <Form.Item
            name='englishName'
            label={t('NOTE_TYPE.MODAL.ENGLISH_CONTENT')}
            rules={[{ required: true, message: t('NOTE_TYPE.MODAL.REQUIRE_CONTENT') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='vietnameseName'
            label={t('NOTE_TYPE.MODAL.VIETNAMESE_CONTENT')}
            rules={[{ required: true, message: t('NOTE_TYPE.MODAL.REQUIRE_CONTENT') }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  )
}

export default NoteTypeModal
