import { RoleValue } from '#utils/constants/role.js'

export type AccountListRequest = {
  status: FilterStatus
  query?: string
  role?: RoleValue
  pageNumber?: number
  pageSize?: number
}

export type FilterStatus = '' | 'Inactive' | 'Active'
