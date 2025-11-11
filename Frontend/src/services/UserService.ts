// src/services/UserService.ts
import { CreateUserRequest, UserDetailsRequest } from '#src/types/RequestModel/ApiRequest.js'
import { CurrentUserResponse, GetUserDetailResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { BaseService } from './BaseService'
import { CURRENT_USER_URL, NORMAL_USER_URL, USER_API_URL } from '#utils/constants/api.js'

export const UserService = {
  getCurrentUser(): Promise<CurrentUserResponse> {
    return BaseService.get<CurrentUserResponse>(CURRENT_USER_URL)
  },

  createUser(value: CreateUserRequest): Promise<void> {
    return BaseService.post<void>(NORMAL_USER_URL, value)
  },

  getUserDetail(params: UserDetailsRequest): Promise<GetUserDetailResponse> {
    return BaseService.get<GetUserDetailResponse>(`${USER_API_URL}/${params.id}`)
  },

  updateUser(params: UserDetailsRequest, body: CreateUserRequest): Promise<void> {
    return BaseService.put<void>(`${NORMAL_USER_URL}/${params.id}`, body)
  },

  deleteUser(params: UserDetailsRequest): Promise<void> {
    return BaseService.delete<void>(`${NORMAL_USER_URL}/${params.id}`)
  },
}
