import { ListAccountsService } from '#src/services/ListAccountService.js'
import { FilterStatus } from '#src/types/RequestModel/AccountListRequest.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { UserDetailsRequest } from '#types/RequestModel/ApiRequest.js'
import { UserService } from '#src/services/UserService.js'
import { RoleValue } from '#utils/constants/role.js'

export const useAccountData = (
  status: FilterStatus,
  role?: RoleValue,
  query?: string,
  pageNumber?: number,
  pageSize?: number,
) => {
  return useQuery({
    queryKey: ['AccountData', status, role, query, pageNumber, pageSize],
    queryFn: () => ListAccountsService.list({ status, role, query, pageNumber, pageSize }),
    placeholderData: keepPreviousData,
  })
}

export const useUserData = (request: UserDetailsRequest) => {
  return useQuery({
    queryKey: ['userDetails', request.id],
    queryFn: () => UserService.getUserDetail(request),
    enabled: !!request.id,
  })
}
