export type CreatePsychologyNoteDetailRequest = {
  content: string
  psychologyNoteId: string
  psychologyNoteTypeId: string
}

export type UpdatePsychologyNoteDetailRequest = {
  id: string
  content: string
}

export type PsychologyNoteDetail = {
  id: string
}

export type DeletePsychologyNoteDetailRequest = {
  id: string
  content: string
  psychologyNoteTypeId: string
}
