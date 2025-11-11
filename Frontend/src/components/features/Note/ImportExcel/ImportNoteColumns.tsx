import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { NoteType } from '#types/Data/NoteType.js'
import { Semester } from '#types/Data/Semester.js'
import React, { Key, MutableRefObject, ReactNode } from 'react'
import { TableRow, ValidationError } from '#types/Data/Note.js'
import { Button, Popconfirm, Popover, Tag, Typography } from 'antd'
import { useNoteTypeData } from '#hooks/api/noteType/useNoteTypeData.js'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { EditableFormInstance, ProColumns } from '@ant-design/pro-components'

interface ImportNoteColumnsProps {
  handleDelete: (key: Key) => void
  validateRow: (
    row: TableRow,
    fieldKey: keyof Omit<TableRow, 'key' | 'index'> | null,
  ) => ValidationError | null
  editableFormRef: MutableRefObject<EditableFormInstance<TableRow> | undefined>
}

export const useImportNoteColumns = ({
  handleDelete,
  validateRow,
  editableFormRef,
}: ImportNoteColumnsProps): ProColumns<TableRow>[] => {
  const { t } = useTranslation()
  const { data: noteTypeList } = useNoteTypeData('')
  const { data: semesterList } = useSemesterData()

  return [
    {
      title: t('NOTE.IMPORT.TABLE.INDEX'),
      dataIndex: 'index',
      key: 'index',
      editable: false,
      width: 50,
    },
    {
      title: t('NOTE.IMPORT.TABLE.STUDENT_CODE'),
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: 120,
      formItemProps: {
        rules: [{ required: true, message: t('NOTE.IMPORT.TABLE.RULE.STUDENT_CODE') }],
      },
      render: (_: ReactNode, row: TableRow): ReactNode => (
        <span style={row.errors?.studentCode ? { color: 'red' } : {}}>{row.studentCode}</span>
      ),
    },
    {
      title: t('NOTE.IMPORT.TABLE.STUDENT_NAME'),
      dataIndex: 'studentName',
      key: 'studentName',
      width: 200,
      render: (_: ReactNode, row: TableRow): ReactNode => (
        <span style={row.errors?.studentName ? { color: 'red' } : {}}>{row.studentName}</span>
      ),
    },
    {
      title: t('NOTE.IMPORT.TABLE.CARE_TYPE'),
      dataIndex: ['careType'],
      valueType: 'select',
      width: 200,
      valueEnum: noteTypeList?.reduce(
        (acc: Record<string, { text: string }>, type: NoteType) => {
          acc[type.vietnameseName] = { text: type.vietnameseName }
          return acc
        },
        {} as Record<string, { text: string }>,
      ),
      formItemProps: {
        rules: [{ required: true, message: t('NOTE.IMPORT.TABLE.RULE.CARE_TYPE') }],
      },
      fieldProps: (data, { rowIndex }) => {
        return {
          placeholder: t('NOTE.IMPORT.TABLE.PLACEHOLDER.CARE_TYPE'),
          onSelect: (value: string) => {
            const selectedType = _.find(noteTypeList, (item) =>
              _.some([item.vietnameseName, item.englishName], (name) => name === value),
            )

            editableFormRef.current?.setRowData?.(rowIndex, {
              careType: selectedType?.vietnameseName,
            } as unknown as Partial<TableRow>)
          },
        }
      },
      render: (_: ReactNode, row: TableRow): ReactNode => {
        const errors = validateRow(row, 'careType')

        return !errors?.careType ? (
          <span>{row.careType}</span>
        ) : (
          <Tag color='red'>
            {t('NOTE.IMPORT.TABLE.RULE.INVALID_TYPE')} {row.careType || t('COMMON.EMPTY')}
          </Tag>
        )
      },
    },
    {
      title: t('NOTE.IMPORT.TABLE.CARE_CONTENT'),
      dataIndex: 'careContent',
      key: 'careContent',
      width: 300,
      formItemProps: {
        rules: [{ required: true, message: t('NOTE.IMPORT.TABLE.RULE.CARE_CONTENT') }],
      },
      render: (_: ReactNode, row: TableRow): ReactNode => {
        return (
          <Popover
            content={
              <Typography.Text
                style={{
                  width: 300,
                  display: 'block',
                }}
              >
                {row.careContent}
              </Typography.Text>
            }
            trigger='click'
          >
            <Typography.Paragraph
              ellipsis={{ rows: 1, tooltip: false }}
              style={{
                maxWidth: 300,
                cursor: 'pointer',
                color: row.errors?.careContent ? 'red' : 'inherit',
              }}
            >
              {row.careContent}
            </Typography.Paragraph>
          </Popover>
        )
      },
    },
    {
      title: t('NOTE.IMPORT.TABLE.SEMESTER'),
      dataIndex: ['semester'],
      key: 'semester',
      width: 150,
      valueType: 'select',
      valueEnum: semesterList?.reduce(
        (
          acc: Record<string, { text: string }>,
          type: Semester,
        ): Record<string, { text: string }> => {
          acc[type.semesterName] = { text: type.semesterName }
          return acc
        },
        {} as Record<string, { text: string }>,
      ),
      formItemProps: {
        rules: [{ required: true, message: t('NOTE.IMPORT.TABLE.RULE.SEMESTER') }],
      },
      fieldProps: (data, { rowIndex }) => {
        return {
          placeholder: t('NOTE.IMPORT.TABLE.PLACEHOLDER.SEMESTER'),
          onSelect: (value: string) => {
            const selectedType = _.find(semesterList, (item) => item.semesterName === value)
            editableFormRef.current?.setRowData?.(rowIndex, {
              semester: selectedType?.semesterName,
            })
          },
        }
      },
      render: (_: ReactNode, row: TableRow): ReactNode => {
        const errors = validateRow(row, 'semester')

        return !errors?.semester ? (
          <span>{row.semester}</span>
        ) : (
          <Tag color='red'>
            {t('NOTE.IMPORT.TABLE.RULE.INVALID_SEMESTER')} {row.semester || t('COMMON.EMPTY')}
          </Tag>
        )
      },
    },
    {
      title: t('NOTE.IMPORT.TABLE.CARE_OFFICER'),
      dataIndex: 'officer',
      width: 150,
      key: 'officer',
      formItemProps: {
        rules: [{ required: true, message: t('NOTE.IMPORT.TABLE.RULE.OFFICER') }],
      },
      render: (_: ReactNode, row: TableRow): ReactNode => (
        <span style={row.errors?.officer ? { color: 'red' } : {}}>{row.officer}</span>
      ),
    },
    {
      title: t('NOTE.IMPORT.TABLE.CHANNEL'),
      dataIndex: 'channel',
      width: 150,
      key: 'channel',
    },
    {
      title: t('NOTE.IMPORT.TABLE.PROCESS_TIME'),
      dataIndex: 'processingTime',
      width: 150,
      key: 'processingTime',
    },
    {
      title: t('COMMON.ACTION'),
      valueType: 'option',
      width: 150,
      render: (_: ReactNode, record: TableRow, __: number, action): ReactNode[] => [
        <Button
          key='editable'
          onClick={(): void => {
            action?.startEditable?.(record.key)
          }}
        >
          Edit
        </Button>,

        <Button key='delete' danger>
          <Popconfirm
            title={t('COMMON.CONFIRM_DELETE')}
            onConfirm={(): void => handleDelete(record.key)}
            okText={t('COMMON.DELETE')}
            cancelText={t('COMMON.CLOSE')}
          >
            {t('COMMON.DELETE')}
          </Popconfirm>
        </Button>,
      ],
    },
  ]
}
