// src/services/PermissionService.ts
import { GetAllPermissionResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { AUTO_SET_PERMISSION_URL, GET_ALL_PERMISSION_URL } from '#utils/constants/api.js'

export const PermissionService = {
  getAllPermission(): Promise<GetAllPermissionResponse> {
    return BaseService.get<GetAllPermissionResponse>(GET_ALL_PERMISSION_URL)
  },

  getPermissionByRole(param: string | undefined): Promise<GetAllPermissionResponse> {
    return BaseService.get<GetAllPermissionResponse>(GET_ALL_PERMISSION_URL + `/${param}`)
  },
  autoSetPermission(): Promise<void> {
    return BaseService.post<void>(AUTO_SET_PERMISSION_URL)
  },
}

export default PermissionService
