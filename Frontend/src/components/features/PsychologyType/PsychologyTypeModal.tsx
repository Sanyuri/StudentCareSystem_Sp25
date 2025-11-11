import { debounce } from 'lodash'
import { toast } from 'react-toastify'
import { ColumnsType } from 'antd/es/table'
import AddIcon from '#assets/icon/Add.svg?react'
import { useTranslation } from 'react-i18next'
import { Modal, Form, Input, Table, Button, Space } from 'antd'
import { PsychologyNoteType } from '#types/Data/PsychologyNoteType.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { usePsychologyNoteTypeData } from '#hooks/api/psychologyNoteType/usePsychologyNoteTypeData.js'
import {
  CreatePsychologyNoteTypeRequest,
  UpdatePsychologyNoteTypeRequest,
} from '#types/RequestModel/ApiRequest.js'
import {
  useAddPsychologyNoteTypeMutation,
  useDeletePsychologyNoteTypeMutation,
  useUpdatePsychologyNoteTypeMutation,
} from '#hooks/api/psychologyNoteType/usePsychologyTypeMutation.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import usePagination from '#hooks/usePagination.js'
interface PsychologyTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

const PsychologyTypeModal: FC<PsychologyTypeModalProps> = ({
  isOpen,
  onClose,
}: PsychologyTypeModalProps): ReactNode => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isInnerModalOpen, setIsInnerModalOpen] = useState(false)
  const [searchTerm] = useState('')
  const [searchTermDelayed, setSearchTermDelayed] = useState(searchTerm)

  const debouncedSetSearchTermDelayed = useMemo(() => debounce(setSearchTermDelayed, 2000), [])

  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()

  const { data: notesTypeList, isLoading } = usePsychologyNoteTypeData(searchTermDelayed)
  const { mutate: addMutate } = useAddPsychologyNoteTypeMutation()
  const { mutate: updateMutate } = useUpdatePsychologyNoteTypeMutation()
  const { mutate: deleteMutate } = useDeletePsychologyNoteTypeMutation()

  const { hasPermission } = useCheckPermission()
  const hasEditPermission = hasPermission(PermissionType.WriteNoteType)

  const columns: ColumnsType<PsychologyNoteType> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (_: unknown, __: PsychologyNoteType, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('PSYCHOLOGY_NOTE.ADD_MODAL.PSYCHOLOGY_QUESTION'),
      dataIndex: 'vietnameseName',
      key: 'vietnameseName',
    },
    {
      title: t('NOTE_TYPE.TABLE_COLUMN.TIME_CREATE'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: unknown, record: PsychologyNoteType): string => {
        return convertToLocalDateTime(record.createdAt.toString())
      },
    },
    {
      title: t('NOTE_TYPE.TABLE_COLUMN.TIME_UPDATE'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_: unknown, record: PsychologyNoteType): string => {
        return record.updatedAt ? convertToLocalDateTime(record.updatedAt.toString()) : '-'
      },
    },
    {
      title: t('NOTE_TYPE.TABLE_COLUMN.ACTION'),
      key: 'action',
      width: 120,
      hidden: !hasEditPermission,
      render: (_, record: PsychologyNoteType): ReactNode => {
        return (
          <Space>
            <Button type='text' icon={<EditIcon />} onClick={(): void => handleEdit(record)} />
            <Button
              type='text'
              icon={<DeleteIcon />}
              onClick={(): void => handleDelete(record.id)}
              danger
            />
          </Space>
        )
      },
    },
  ]

  const handleEdit: (record: PsychologyNoteType) => void = (record: PsychologyNoteType): void => {
    setEditingId(record.id)
    form.setFieldsValue({
      englishName: record.englishName,
      vietnameseName: record.vietnameseName,
    })
    setIsInnerModalOpen(true)
  }

  const handleDelete: (id: string) => void = (id: string): void => {
    Modal.confirm({
      title: t('PSYCHOLOGY_MANAGEMENT.EDIT.CONFIRM_DELETE_TITLE'),
      content: t('PSYCHOLOGY_MANAGEMENT.EDIT.CONFIRM_DELETE_CONTENT'),
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
      const values: PsychologyNoteType = await form.validateFields()
      if (editingId === null) {
        const createNoteType: CreatePsychologyNoteTypeRequest = {
          vietnameseName: values.vietnameseName,
          englishName: values.englishName,
        }
        addMutate(createNoteType)
      } else {
        const updateNoteType: UpdatePsychologyNoteTypeRequest = {
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
      title={t('PSYCHOLOGY_MANAGEMENT.MODAL.TITLE')}
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <div className='mb-4 flex justify-between'>
        {hasEditPermission && (
          <Button type='primary' icon={<AddIcon />} onClick={handleAdd}>
            {t('COMMON.ADD_NEW')}
          </Button>
        )}
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
        title={
          editingId === null
            ? t('PSYCHOLOGY_MANAGEMENT.EDIT.ADD_QUESTION')
            : t('PSYCHOLOGY_MANAGEMENT.EDIT.EDIT_QUESTION')
        }
        open={isInnerModalOpen}
        onOk={handleSubmit}
        onCancel={(): void => setIsInnerModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout='vertical' className='mt-4'>
          <Form.Item
            name='englishName'
            label={t('NOTE_TYPE.MODAL.ENGLISH_CONTENT')}
            rules={[
              { required: true, message: t('NOTE_TYPE.MODAL.REQUIRE_CONTENT') },
              { min: 1, message: t('NOTE_TYPE.MODAL.REQUIRE_CONTENT') },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='vietnameseName'
            label={t('NOTE_TYPE.MODAL.VIETNAMESE_CONTENT')}
            rules={[
              { required: true, message: t('NOTE_TYPE.MODAL.REQUIRE_CONTENT') },
              { min: 1, message: t('NOTE_TYPE.MODAL.REQUIRE_CONTENT') },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  )
}

export default PsychologyTypeModal
