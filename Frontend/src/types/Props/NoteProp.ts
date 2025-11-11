import { NoteType } from '#types/Data/NoteType.js'
import { StudentNoteModel } from '#types/Data/StudentModel.js'

export interface NoteModalProps {
  noteType: NoteType
  studentRecord: StudentNoteModel
  entityId: string
  visible: boolean
  onClose: () => void
}

export interface NoteStudentModalProps {
  studentRecord: StudentNoteModel
  visible: boolean
  onClose: () => void
}

export interface NoteState {
  noteType: NoteType | undefined
  studentRecord: StudentNoteModel
  entityId: string
}

export interface NoteStudentComponentProp {
  studentRecord: StudentNoteModel
}

export interface AddNoteProps {
  studentCodeProp: string
  // manage-student for note in attendance, fail, defer
  // manage-note for manage note screen
  mode: 'manage-note' | 'manage-student'
  noteTypeIdDefault?: string
}
