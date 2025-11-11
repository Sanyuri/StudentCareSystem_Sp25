export type DriveRequest = {
  dataReq: DataDriveRequest
  fname: string
}

export type DataDriveRequest = {
  data: string
  name: string
  type: string
  token: string
  isSystem: boolean
  subFolder: string
  parentId: string
}
