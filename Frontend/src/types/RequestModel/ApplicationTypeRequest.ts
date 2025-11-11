export type ApplicationTypeRequest = {
  pageNumber?: number
  pageSize?: number
  subject?: string
}

export type AddApplicationTypeRequest = {
  englishName: string
  vietnameseName: string
}

export type UpdateApplicationTypeRequest = {
  id: string
  englishName: string
  vietnameseName: string
}

export type ApplicationType = {
  id: string
}

export type DeleteApplicationTypeRequest = {
  id: string
  vietnameseName: string
  englishName: string
}
