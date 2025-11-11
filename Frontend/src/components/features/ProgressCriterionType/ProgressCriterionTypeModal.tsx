import { FC, Fragment, ReactNode, useState } from 'react'
import { Button, Form, Input, Modal, Space, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table/index.js'
import AddIcon from '#assets/icon/Add.svg?react'
import {
  useAddProgressCriterionTypeDataMutation,
  useDeleteProgressCriterionTypeMutation,
  useUpdateProgressCriterionTypeMutation,
} from '#hooks/api/progressCriterionType/useProgressCriterionTypeMutation.js'
import { useProgressCriterionTypeData } from '#hooks/api/progressCriterionType/useProgressCriterionTypeData.js'
import { ProgressCriterionType } from '#types/Data/ProgressCriterionType.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import {
  CreateProgressCriterionTypeRequest,
  UpdateProgressCriterionTypeRequest,
} from '#types/RequestModel/ProgressCriterionTypeRequest.js'
import EditIcon from '#assets/icon/Edit.svg?react'
import DeleteIcon from '#assets/icon/Delete.svg?react'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import usePagination from '#hooks/usePagination.js'

interface ProgressCriterionTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProgressCriterionTypeModal: FC<ProgressCriterionTypeModalProps> = ({
  isOpen,
  onClose,
}: ProgressCriterionTypeModalProps): ReactNode => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isInnerModalOpen, setIsInnerModalOpen] = useState(false)

  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()

  const { data: progressCriterionList, isLoading } = useProgressCriterionTypeData()

  const { mutate: addMutate } = useAddProgressCriterionTypeDataMutation()
  const { mutate: updateMutate } = useUpdateProgressCriterionTypeMutation()
  const { mutate: deleteMutate } = useDeleteProgressCriterionTypeMutation()

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteProgressCriterionType)

  const columns: ColumnsType<ProgressCriterionType> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (_: unknown, __: ProgressCriterionType, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('PROGRESS_CRITERION.MODAL.TABLE.TITLE'),
      dataIndex: 'vietnameseName',
      key: 'vietnameseName',
    },
    {
      title: t('PROGRESS_CRITERION.MODAL.TABLE.CREATED_AT'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: unknown, record: ProgressCriterionType): string => {
        return convertToLocalDateTime(record.createdAt.toString())
      },
    },
    {
      title: t('PROGRESS_CRITERION.MODAL.TABLE.UPDATED_AT'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_: unknown, record: ProgressCriterionType): string => {
        return record.updatedAt ? convertToLocalDateTime(record.updatedAt.toString()) : '-'
      },
    },
    {
      title: t('PROGRESS_CRITERION.MODAL.TABLE.ACTION'),
      key: 'action',
      width: 120,
      render: (_, record: ProgressCriterionType): ReactNode => {
        return (
          <Space>
            {hasEditPermission && (
              <Fragment>
                <Button type='text' icon={<EditIcon />} onClick={(): void => handleEdit(record)} />
                <Button
                  type='text'
                  icon={<DeleteIcon />}
                  onClick={(): void => handleDelete(record.id)}
                  danger
                />
              </Fragment>
            )}
          </Space>
        )
      },
    },
  ]

  const handleEdit: (record: ProgressCriterionType) => void = (
    record: ProgressCriterionType,
  ): void => {
    setEditingId(record.id)
    form.setFieldsValue({
      englishName: record.englishName,
      vietnameseName: record.vietnameseName,
      englishDescription: record.englishDescription,
      vietnameseDescription: record.vietnameseDescription,
    })
    setIsInnerModalOpen(true)
  }

  const handleDelete: (id: string) => void = (id: string): void => {
    Modal.confirm({
      title: t('PROGRESS_CRITERION.MODAL.DELETE_CONFIRM.TITLE'),
      content: t('PROGRESS_CRITERION.MODAL.DELETE_CONFIRM.CONTENT'),
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
    const values: ProgressCriterionType = await form.validateFields()
    if (editingId === null) {
      const createNoteType: CreateProgressCriterionTypeRequest = {
        vietnameseName: values.vietnameseName,
        englishName: values.englishName,
        vietnameseDescription: values.vietnameseDescription,
        englishDescription: values.englishDescription,
      }
      addMutate(createNoteType)
    } else {
      const updateProgressCriterionType: UpdateProgressCriterionTypeRequest = {
        id: editingId,
        vietnameseName: values.vietnameseName,
        englishName: values.englishName,
        vietnameseDescription: values.vietnameseDescription,
        englishDescription: values.englishDescription,
      }
      updateMutate(updateProgressCriterionType)
    }
    setIsInnerModalOpen(false)
  }

  return (
    <Modal
      title={t('PROGRESS_CRITERION.MODAL.TITLE')}
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <div className='mb-4 flex justify-between'>
        {hasEditPermission && (
          <Button type='primary' icon={<AddIcon />} onClick={handleAdd}>
            {t('PROGRESS_CRITERION.MODAL.ADD')}
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={progressCriterionList}
        rowKey='id'
        loading={isLoading}
        pagination={{
          current: page,
          onChange: handlePageChange,
          total: progressCriterionList?.length,
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
            ? t('PROGRESS_CRITERION.UPDATE_MODAL.TITLE.ADD')
            : t('PROGRESS_CRITERION.UPDATE_MODAL.TITLE.EDIT')
        }
        open={isInnerModalOpen}
        onOk={handleSubmit}
        onCancel={(): void => setIsInnerModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout='vertical' className='mt-4'>
          {/* English name */}
          <Form.Item
            name='englishName'
            label={t('PROGRESS_CRITERION.UPDATE_MODAL.FORM.ENGLISH_CONTENT')}
            rules={[
              {
                required: true,
                message: t('PROGRESS_CRITERION.UPDATE_MODAL.FORM.REQUIRE_CONTENT'),
              },
              { min: 1, message: t('NOTE_TYPE.MODAL.REQUIRE_CONTENT') },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Vietnamese name */}
          <Form.Item
            name='vietnameseName'
            label={t('PROGRESS_CRITERION.UPDATE_MODAL.FORM.VIETNAMESE_CONTENT')}
            rules={[
              { required: true, message: t('COMMON.REQUIRE_CONTENT') },
              { min: 1, message: t('COMMON.MODAL.MIN_INPUT') },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Vietnamese description */}
          <Form.Item
            name='vietnameseDescription'
            label={t('PROGRESS_CRITERION.UPDATE_MODAL.FORM.VIETNAMESE_DESCRIPTION')}
            rules={[
              { required: true, message: t('COMMON.REQUIRE_CONTENT') },
              { min: 1, message: t('COMMON.MODAL.MIN_INPUT') },
            ]}
          >
            <Input />
          </Form.Item>

          {/* English description */}
          <Form.Item
            name='englishDescription'
            label={t('PROGRESS_CRITERION.UPDATE_MODAL.FORM.ENGLISH_DESCRIPTION')}
            rules={[
              { required: true, message: t('COMMON.REQUIRE_CONTENT') },
              { min: 1, message: t('COMMON.MODAL.MIN_INPUT') },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  )
}

export default ProgressCriterionTypeModal
