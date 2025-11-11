import { useTranslation } from 'react-i18next'
import { Button, Modal, InputNumber, Switch, Popconfirm, FormInstance, Tooltip, Alert } from 'antd'
import { FC, Key, MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import { AttendanceRateBoundary } from '#types/Data/AbsenceRateBoundary.js'
import { EmailTemplateResponse } from '#types/ResponseModel/ApiResponse.js'
import { useEmailTemplateData } from '#hooks/api/emailTemplate/useEmailTemplateData.js'
import {
  ActionType,
  EditableFormInstance,
  EditableProTable,
  ProColumns,
  ProCoreActionType,
} from '@ant-design/pro-components'
import { useAttendanceRateBoundariesData } from '#hooks/api/attendanceRateBoundary/useAttendanceRateBoundaries.js'
import {
  AttendanceRateBoundaryRequest,
  UpdateAttendanceRateBoundaryRequest,
} from '#types/RequestModel/AttendanceRateBoundaryRequest.js'
import {
  useAddAttendanceRateBoundariesMutation,
  useDeleteAttendanceRateBoundariesMutation,
  useUpdateAttendanceRateBoundariesMutation,
} from '#hooks/api/attendanceRateBoundary/useAttendanceRateBoundariesMutation.js'
import { EmailType } from '#types/Enums/EmailType.js'
import SettingIcon from '#assets/icon/Setting.svg?react'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
const AttendanceRate: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading } = useEmailTemplateData('', EmailType.AttendanceNotification, 1, 20)
  const [dataSource, setDataSource] = useState<readonly AttendanceRateBoundary[]>([])
  const [keys, setKeys] = useState<Key[]>([])

  const { data: absenceRateBoundaries } = useAttendanceRateBoundariesData()
  const editableFormRef: MutableRefObject<EditableFormInstance | undefined> =
    useRef<EditableFormInstance>()
  const actionRef: MutableRefObject<ActionType | undefined> = useRef<ActionType>()

  const { mutate: addMutate } = useAddAttendanceRateBoundariesMutation()
  const { mutate: editMutate } = useUpdateAttendanceRateBoundariesMutation()
  const { mutate: deleteMutate } = useDeleteAttendanceRateBoundariesMutation()

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteAbsenceRateBoundary)

  useEffect(() => {
    setDataSource(absenceRateBoundaries ?? [])
  }, [absenceRateBoundaries])

  const columns: ProColumns<AttendanceRateBoundary>[] = [
    {
      title: t('ATTENDANCES.RATE_BOUNDARY.TABLE.NO'),
      dataIndex: 'id',
      editable: false,
      render: (_: ReactNode, __: AttendanceRateBoundary, index: number): number => index + 1,
      width: '5%',
    },
    {
      title: t('ATTENDANCES.RATE_BOUNDARY.TABLE.MIN_RATE'),
      dataIndex: 'minAbsenceRate',
      renderFormItem: (): ReactNode => (
        <InputNumber
          min={0}
          max={100}
          style={{ width: '100%' }}
          placeholder={t('ATTENDANCES.RATE_BOUNDARY.TABLE.ENTER_MIN')}
        />
      ),
      formItemProps: {
        rules: [
          {
            required: true,
            message: t('ATTENDANCES.RATE_BOUNDARY.TABLE.MIN_REQUIRE'),
          },
        ],
      },
    },
    {
      title: t('ATTENDANCES.RATE_BOUNDARY.TABLE.MAX_RATE'),
      dataIndex: 'maxAbsenceRate',
      renderFormItem: (): ReactNode => (
        <InputNumber
          min={0}
          max={100}
          style={{ width: '100%' }}
          placeholder={t('ATTENDANCES.RATE_BOUNDARY.TABLE.ENTER_MAX')}
        />
      ),
      formItemProps: {
        rules: [
          {
            required: true,
            message: t('ATTENDANCES.RATE_BOUNDARY.TABLE.MAX_REQUIRE'),
          },
        ],
      },
    },
    {
      title: t('ATTENDANCES.RATE_BOUNDARY.TABLE.SELECT_EMAIL_SAMPLE'),
      dataIndex: ['emailSample', 'vietnameseEmailSubject'],
      valueType: 'select',
      formItemProps: {
        rules: [
          { required: true, message: t('ATTENDANCES.RATE_BOUNDARY.TABLE.SELECT_MAIL_REQUIRE') },
        ],
      },
      valueEnum: data?.items?.reduce(
        (
          acc: Record<string, { text: string; status: string }>,
          template: EmailTemplateResponse,
        ): Record<string, { text: string; status: string }> => {
          acc[template.id] = {
            text: template.subject,
            status: 'Default',
          }
          return acc
        },
        {},
      ),
      fieldProps: (_: FormInstance<never>, { rowIndex }) => {
        return {
          onSelect: (value: string): void => {
            const selectedEmailSample: EmailTemplateResponse | undefined = data?.items?.find(
              (item: EmailTemplateResponse): boolean => item.id === value,
            )

            if (selectedEmailSample) {
              editableFormRef.current?.setRowData?.(rowIndex, {
                emailSample: selectedEmailSample,
              })
            }
          },
        }
      },
      render: (_: ReactNode, row: AttendanceRateBoundary): ReactNode => (
        <Tooltip title={row.emailSample?.subject}>
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '300px',
            }}
          >
            {row.emailSample?.subject}
          </div>
        </Tooltip>
      ),
    },
    {
      title: t('ATTENDANCES.RATE_BOUNDARY.TABLE.IS_ACTIVE'),
      dataIndex: 'isActive',
      valueType: 'switch',
      width: '15%',
      render: (text: ReactNode, record: AttendanceRateBoundary): ReactNode => (
        <Switch
          disabled={true}
          checked={record.isActive}
          onChange={(checked: boolean): void => {
            const newData: AttendanceRateBoundary[] = dataSource?.map(
              (item: AttendanceRateBoundary): AttendanceRateBoundary => {
                if (item.id === record.id) {
                  return { ...item, isActive: checked }
                }
                return item
              },
            )
            setDataSource(newData)
          }}
        />
      ),
    },
    {
      title: t('ATTENDANCES.RATE_BOUNDARY.TABLE.ACTION'),
      valueType: 'option',
      width: '10%',
      render: (
        _: ReactNode,
        record: AttendanceRateBoundary,
        __: number,
        action: ProCoreActionType<object> | undefined,
      ): ReactNode => [
        hasEditPermission && (
          <Button
            key='editable'
            onClick={(): void => {
              action?.startEditable?.(record.id)
            }}
          >
            Edit
          </Button>
        ),
        hasEditPermission && (
          <Button key='delete'>
            <Popconfirm
              title={t('COMMON.CONFIRM_DELETE')}
              onConfirm={(): void => {
                deleteMutate(record.id)
              }}
              okText={t('COMMON.CONFIRM')}
              cancelText={t('COMMON.CANCEL')}
            >
              {t('COMMON.DELETE')}
            </Popconfirm>
          </Button>
        ),
      ],
    },
  ]

  return (
    <>
      <Button
        size='large'
        color='default'
        variant='outlined'
        icon={<SettingIcon />}
        onClick={(): void => setIsOpen(true)}
      >
        <span className='font-semibold'>
          {t('ATTENDANCES.RATE_BOUNDARY.MODAL.SETTING_SEND_MAIL')}
        </span>
      </Button>
      <Modal
        title={
          <h2 className='text-2xl font-medium'>
            {t('ATTENDANCES.RATE_BOUNDARY.MODAL.SETTING_SEND_MAIL')}
          </h2>
        }
        open={isOpen}
        onCancel={(): void => setIsOpen(false)}
        width={1000}
        footer={[
          <div key='footer' className='flex gap-4 px-4 py-2'>
            <Button
              onClick={(): void => setIsOpen(false)}
              className='flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              {t('COMMON.CLOSE')}
            </Button>
          </div>,
        ]}
        className='rounded-2xl overflow-hidden'
      >
        <Alert
          type='info'
          message={t('ATTENDANCES.RATE_BOUNDARY.GUIDE_NOTE')}
          showIcon
          style={{ marginBottom: 16 }}
        />
        <EditableProTable<AttendanceRateBoundary>
          rowKey='id'
          loading={isLoading}
          editableFormRef={editableFormRef}
          actionRef={actionRef}
          maxLength={5}
          recordCreatorProps={{
            style: {
              display: `${!hasEditPermission && 'none'}`,
            },
            position: 'bottom',
            record: () => ({
              id: 'new_id',
              minAbsenceRate: 0,
              maxAbsenceRate: 100,
              emailSample: data?.items?.[0] || undefined,
              isActive: true,
            }),
            creatorButtonText: t('COMMON.ADD_NEW'),
          }}
          columns={columns}
          request={async () => ({
            data: [...dataSource],
            total: dataSource?.length,
            success: true,
          })}
          value={dataSource}
          editable={{
            type: 'single',
            editableKeys: keys,
            onlyAddOneLineAlertMessage: t('COMMON.ONLY_ADĐ_ONE_LINE_EDITOR'),
            onlyOneLineEditorAlertMessage: t('COMMON.ONLY_ONE_LINE_EDITOR'),
            saveText: t('COMMON.SAVE'),
            actionRender: (
              row: AttendanceRateBoundary,
              config,
              dom: {
                save: ReactNode
                cancel: ReactNode
              },
            ): ReactNode[] => [dom.save, dom.cancel],
            onSave: async (_rowKey, data): Promise<void> => {
              if (!data.emailSample) {
                return
              }
              if (data.id === 'new_id' || !data.id) {
                const newData: AttendanceRateBoundaryRequest = {
                  minAbsenceRate: data.minAbsenceRate,
                  maxAbsenceRate: data.maxAbsenceRate,
                  emailSampleId: data.emailSample?.id,
                  isActive: data.isActive,
                }

                // add new data
                addMutate(newData)
              } else {
                const updatedData: UpdateAttendanceRateBoundaryRequest = {
                  id: data.id,
                  minAbsenceRate: data.minAbsenceRate,
                  maxAbsenceRate: data.maxAbsenceRate,
                  emailSampleId: data.emailSample?.id,
                  isActive: data.isActive,
                }

                //update data
                editMutate(updatedData)
              }
            },
            onChange: setKeys,
          }}
        />
      </Modal>
    </>
  )
}

export default AttendanceRate
