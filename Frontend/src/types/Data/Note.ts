import React, { Key } from 'react'

export interface Note {
  id: string
  content: string
  studentCode: string
  semesterName: string
  noteTypeId: string
  entityId?: string
  createdAt: Date
  createdBy: string
  channel: string | undefined
  processingTime: string | undefined
}

export interface TableRow {
  key: Key
  index: number
  studentCode: string
  studentName: string
  careType: string
  careContent: string
  semester: string
  officer: string
  channel: string | undefined
  processingTime: string | undefined
  errors?: Partial<
    Record<
      | 'studentCode'
      | 'studentName'
      | 'careType'
      | 'careContent'
      | 'semester'
      | 'officer'
      | 'channel'
      | 'processingTime',
      string
    >
  > | null
}

export type ValidationError = Partial<Record<keyof Omit<TableRow, 'key' | 'index'>, string>>

export interface EditableImportNoteProps {
  dataSource: readonly TableRow[]
  setData: React.Dispatch<React.SetStateAction<readonly TableRow[]>>
  setCountError: React.Dispatch<React.SetStateAction<number>>
}
