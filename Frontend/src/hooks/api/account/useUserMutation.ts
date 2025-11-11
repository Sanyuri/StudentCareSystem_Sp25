import { CreateUserRequest, UserDetailsRequest } from '#src/types/RequestModel/ApiRequest.js'
import { UserService } from '#src/services/UserService.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

export const useUserMutation = () => {
  return useGenericMutation<CreateUserRequest, unknown>(
    async (createUserRequest: CreateUserRequest): Promise<unknown> => {
      return await UserService.createUser(createUserRequest)
    },
    'TOAST.SUCCESS.ACCOUNT.ADD', // Success toast translation key
    'TOAST.ERROR.ACCOUNT.ADD', // Error toast translation key
    ['AccountData'], // Query keys to invalidate
  )
}
export const useUpdateUserMutation = () => {
  return useGenericMutation<
    { userId: UserDetailsRequest; createUserRequest: CreateUserRequest },
    unknown
  >(
    async ({
      userId,
      createUserRequest,
    }: {
      userId: UserDetailsRequest
      createUserRequest: CreateUserRequest
    }): Promise<void> => {
      return await UserService.updateUser(userId, createUserRequest)
    },
    'TOAST.SUCCESS.ACCOUNT.UPDATE',
    'TOAST.ERROR.ACCOUNT.UPDATE',
    ['AccountData', 'userDetails'],
  )
}

export const useDeleteUserMutation = () => {
  return useGenericMutation<{ userId: UserDetailsRequest }, unknown>(
    async ({ userId }: { userId: UserDetailsRequest }) => {
      return await UserService.deleteUser(userId)
    },
    'TOAST.SUCCESS.ACCOUNT.DELETE', // Success toast key
    'TOAST.ERROR.ACCOUNT.DELETE', // Error toast key
    ['AccountData'], // Query keys to invalidate
  )
}
