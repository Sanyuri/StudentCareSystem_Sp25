import i18n from '#src/plugins/i18n.js'
import { Breakpoint, Flex, Spin } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import HandleFunctionApplication from './HandleFunctionApplication'
import { ApplicationList } from '#src/types/ResponseModel/ApiResponse.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import NoteComponent from '#components/common/note/NoteComponent.js'
import { useNoteTypeDefaultData } from '#hooks/api/noteType/useNoteTypeData.js'
import { DefaultNoteType } from '#utils/constants/Note/index.js'
import { StudentNoteModel } from '#types/Data/StudentModel.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

const useApplicationColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  showModal: (applicationId: string, type: 'delete') => void,
): ColumnProps<ApplicationList>[] => {
  const { t } = useTranslation()
  const currentLanguage = i18n.language

  const { data: applicationNoteType, isLoading } = useNoteTypeDefaultData(
    DefaultNoteType.Application,
  )

  const { hasPermission } = useCheckPermission()
  const hasEditApplicationPermission = hasPermission(PermissionType.WriteStudentApplication)
  return [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center',
      fixed: !screens.xs ? 'left' : false,
      render: (_: unknown, __: ApplicationList, index: number) => (page - 1) * pageSize + index + 1,
    },

    {
      title: t('APPLICATIONS.TABLE_COLUMN.STUDENT_CODE'),
      dataIndex: 'studentCode',
      key: 'studentCode',
      align: 'center',
      width: 110,
    },
    {
      title: t('APPLICATIONS.TABLE_COLUMN.STUDENT_NAME'),
      key: 'studentName',
      dataIndex: 'studentName',
      align: 'center',
      width: 200,
      render: (_: unknown, record: ApplicationList) => (
        <div>
          <div>{record.studentName}</div>
          <div>{record.studentEmail}</div>
        </div>
      ),
    },
    {
      title: t('APPLICATIONS.TABLE_COLUMN.APPLICATION_TYPE'),
      dataIndex:
        currentLanguage === 'vi'
          ? ['applicationType', 'vietnameseName']
          : ['applicationType', 'englishName'],
      key: 'applicationType',
      align: 'center',
      width: 150,
      render: (text: string) => <span>{text || 'N/A'}</span>,
    },
    {
      title: t('APPLICATIONS.TABLE_COLUMN.DATE_RECEIVED'),
      key: 'createdAt',
      dataIndex: 'createdAt',
      align: 'center',
      width: 110,
      fixed: !screens.xs ? 'left' : false,
      render: (_: Date, record: ApplicationList) => {
        if (record.createdAt == null) {
          return '-'
        }
        return convertToLocalDateTime(record.createdAt)
      },
    },
    {
      title: t('APPLICATIONS.TABLE_COLUMN.APPLICATION_STATUS'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status: string) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium ${
            status === 'Receive'
              ? 'text-green-700 bg-green-100 border-green-400'
              : 'text-blue-700 bg-blue-100 border-blue-400'
          } rounded-full`}
        >
          {status === 'Receive'
            ? t(`APPLICATIONS.APPLICATION_STATUS_OPTIONS.RECEIVE`)
            : t(`APPLICATIONS.APPLICATION_STATUS_OPTIONS.RETURN`)}
        </span>
      ),
    },
    {
      title: t('ACCOUNTS.FORM.LABEL.ACTION'),
      key: 'action',
      width: 110,
      fixed: !screens.xs ? 'right' : false,
      align: 'center',
      render: (_: unknown, record: ApplicationList) => {
        if (isLoading) {
          return <Spin />
        }
        const studentData: StudentNoteModel = {
          studentName: record.studentName,
          studentCode: record.studentCode,
        }
        return (
          <Flex justify={'space-evenly'}>
            <NoteComponent
              noteType={applicationNoteType}
              studentRecord={studentData}
              entityId={record.id}
            />
            {hasEditApplicationPermission && (
              <HandleFunctionApplication
                ApplicationData={record}
                type={'Delete'}
                showModal={showModal}
              />
            )}
          </Flex>
        )
      },
    },
  ]
}

export default useApplicationColumn
