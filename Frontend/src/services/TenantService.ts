import { TenantsListResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { GET_ALL_TENANT_URL } from '#utils/constants/api.js'

export const TenantService = {
  getAllTenants: () => BaseService.get<TenantsListResponse>(GET_ALL_TENANT_URL),
}
