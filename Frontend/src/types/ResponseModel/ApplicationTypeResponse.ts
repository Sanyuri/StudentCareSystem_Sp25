export type ApplicationTypeResp = {
  id: string
  englishName?: string
  vietnameseName?: string
}
export type ApplicationTypeResponse = {
  id: string
  englishName: string
  vietnameseName: string
  totalApplications: number
  createdAt: Date
  updatedAt: Date
}

export type ApplicationTypeListResponse = {
  totalItems: number
  pageSize: number
  totalPages: number
  pageIndex: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: ApplicationTypeResponse[]
}
