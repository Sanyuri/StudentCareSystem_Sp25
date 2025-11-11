import useLoadingStore from '#stores/loadingState.js'
import { logout } from '#utils/helper/authenHelper.js'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'

export const useLogoutMutation = () => {
  const { setLoading } = useLoadingStore()
  const queryClient: QueryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onMutate: () => {
      setLoading(true) // Set loading to true when the API call starts
    },
    onError: () => {
      setLoading(false)
    },
    onSuccess: () => {
      queryClient.clear()
      localStorage.clear()
      setLoading(false)
    },
  })
}
