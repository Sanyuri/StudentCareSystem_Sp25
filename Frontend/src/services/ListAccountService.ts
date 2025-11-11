import { AccountListRequest } from '#src/types/RequestModel/AccountListRequest.js'
import { AccountListResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { convertParamsGeneric } from '#utils/helper/convertParams.js'
import { LIST_ACCOUNTS_URL } from '#utils/constants/api.js'

export const ListAccountsService = {
  list(params?: AccountListRequest): Promise<AccountListResponse> {
    return BaseService.get<AccountListResponse>(LIST_ACCOUNTS_URL, convertParamsGeneric(params))
  },
}
