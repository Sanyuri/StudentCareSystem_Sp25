import { GetAllRolesResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { GET_ALL_ROLES_URL } from '#utils/constants/api.js'
import { UpdateRolePermission } from '#types/RequestModel/ApiRequest.js'
import { GetRolePermissionResponse } from '#types/ResponseModel/ApiResponse.js'

export const RoleService = {
  getAllRoles(): Promise<GetAllRolesResponse> {
    return BaseService.get<GetAllRolesResponse>(GET_ALL_ROLES_URL)
  },
  getRolePermission(param: string | undefined): Promise<GetRolePermissionResponse> {
    return BaseService.get<GetRolePermissionResponse>(GET_ALL_ROLES_URL + `/${param}`)
  },
  updateRolePermission(param: string, body: UpdateRolePermission): Promise<void> {
    return BaseService.put<void>(GET_ALL_ROLES_URL + `/${param}`, body)
  },
}
