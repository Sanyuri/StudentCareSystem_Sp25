import { UserService } from '#src/services/UserService.js'
import { CurrentUserResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { useUserStore } from '#stores/userState.js'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useCurrentUserData = () => {
  const setUser = useUserStore((state) => state.setUser)

  return useQuery<CurrentUserResponse, Error>({
    queryKey: ['currentUser'],
    queryFn: () => UserService.getCurrentUser(),
    onSuccess: (data: CurrentUserResponse) => {
      // Set the user data in Zustand store on successful fetch
      setUser(data)
    },
    onError: (error: unknown) => {
      toast.error(String(error))
    },
    staleTime: Infinity, // Cache the user data for 5 minutes
  } as UseQueryOptions<CurrentUserResponse, Error>)
}
