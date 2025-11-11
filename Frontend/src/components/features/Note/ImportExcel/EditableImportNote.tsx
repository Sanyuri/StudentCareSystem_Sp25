import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Semester } from '#types/Data/Semester.js'
import { NoteType } from '#types/Data/NoteType.js'
import { useNoteTypeData } from '#hooks/api/noteType/useNoteTypeData.js'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { EditableImportNoteProps, TableRow, ValidationError } from '#types/Data/Note.js'
import React, { FC, Key, MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import { useImportNoteColumns } from '#components/features/Note/ImportExcel/ImportNoteColumns.js'
import {
  ActionType,
  EditableFormInstance,
  EditableProTable,
  ProColumns,
} from '@ant-design/pro-components'

const EditableImportNote: FC<EditableImportNoteProps> = ({
  dataSource,
  setData,
  setCountError,
}: EditableImportNoteProps): ReactNode => {
  const [keys, setKeys] = useState<Key[]>([])
  const editableFormRef: MutableRefObject<EditableFormInstance | undefined> =
    useRef<EditableFormInstance>()
  const actionRef: MutableRefObject<ActionType | undefined> = useRef<ActionType>()

  const { t } = useTranslation()

  const { data: noteTypeList } = useNoteTypeData('')
  const { data: semesterList } = useSemesterData()

  const validateRow = (
    row: TableRow,
    fieldKey: keyof Omit<TableRow, 'key' | 'index'> | null = null,
  ): ValidationError | null => {
    const fieldSchemas = {
      studentCode: z.string().regex(/^[A-Za-z]{2}\d{6}$/),
      studentName: z.string().regex(/^[A-Za-zÀ-ỹ\s]+$/),
      careContent: z.string().min(6),
      careType: z
        .string()
        .refine((val: string): boolean | undefined =>
          noteTypeList?.some(
            (t: NoteType): boolean => t.vietnameseName === val || t.englishName === val,
          ),
        ),
      semester: z
        .string()
        .refine((val: string): boolean | undefined =>
          semesterList?.some((t: Semester): boolean => t.semesterName.trim() === val.trim()),
        ),
      officer: z.string().email(),
      channel: z.any(),
      processingTime: z.any(),
    }
    const validateField = (key: keyof typeof fieldSchemas): string | null => {
      const schema = fieldSchemas[key]
      if (!schema) return null

      const result = schema.safeParse(row[key])
      return result.success ? null : result.error.errors[0].message
    }

    if (fieldKey) {
      if (fieldKey === 'errors') return {} // Handle 'errors' separately if needed
      return { [fieldKey]: validateField(fieldKey) }
    }

    return Object.keys(fieldSchemas).reduce((errors: ValidationError, key: string) => {
      const error: string | null = validateField(key as keyof typeof fieldSchemas)
      if (error) errors[key as keyof Omit<TableRow, 'key' | 'index'>] = error
      return errors
    }, {})
  }

  const validateAll = (): void => {
    const updatedData = dataSource.map((row) => {
      const errors = validateRow(row)
      return { ...row, errors }
    })

    const totalErrors: number = updatedData.reduce((count: number, row) => {
      // Count non-empty error values in the 'errors' field
      const errorCount: number = Object.values(row.errors || {}).filter(Boolean).length
      return count + errorCount
    }, 0)

    setData((prevData: readonly TableRow[]) => {
      const isDataChanged: boolean = !updatedData.every(
        (newRow, index: number): boolean =>
          JSON.stringify(newRow) === JSON.stringify(prevData[index]),
      )
      return isDataChanged ? updatedData : prevData
    })
    setCountError(totalErrors)
  }

  useEffect(() => {
    if (dataSource) {
      validateAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, semesterList, noteTypeList])

  const handleDelete = (key: Key): void => {
    const newData: TableRow[] = dataSource.filter((item: TableRow): boolean => item.key !== key)
    setData(newData)
  }

  const columns: ProColumns<TableRow>[] = useImportNoteColumns({
    handleDelete,
    validateRow,
    editableFormRef,
  })
  return (
    <EditableProTable
      rowKey='key'
      bordered
      editableFormRef={editableFormRef}
      actionRef={actionRef}
      columns={columns}
      value={dataSource}
      onChange={(value: readonly TableRow[]): void => setData([...value])}
      editable={{
        type: 'single',
        editableKeys: keys,
        onlyOneLineEditorAlertMessage: t('COMMON.ONLY_ONE_LINE_EDITOR'),
        saveText: t('COMMON.SAVE'),
        onChange: setKeys,
        onSave: async (key, record) => {
          const newData: TableRow[] = dataSource.map((item: TableRow) =>
            item.key === key
              ? {
                  ...item,
                  ...record,
                }
              : item,
          )
          setData(newData)
        },
        actionRender: (
          row: TableRow,
          config,
          dom: {
            save: ReactNode
            cancel: ReactNode
          },
        ): ReactNode[] => [dom.save, dom.cancel],
      }}
      recordCreatorProps={false}
    />
  )
}

export default EditableImportNote
