import { toast } from 'react-toastify'
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import useLoadingStore from '#stores/loadingState.js'
import { useTranslation } from 'react-i18next'

export const useGenericMutation = <TRequest, TResponse>(
  mutationFn: (request: TRequest) => Promise<TResponse>,
  successMessageKey: string | null,
  errorMessageKey: string | null,
  queryKeysToInvalidate: string | string[], // Hỗ trợ mảng query keys
  options?: Omit<UseMutationOptions<TResponse, unknown, TRequest>, 'mutationFn'>,
  needLoading: boolean = true,
): UseMutationResult<TResponse, unknown, TRequest, unknown> => {
  const { setLoading } = useLoadingStore()
  const { t } = useTranslation()
  const queryClient: QueryClient = useQueryClient()

  return useMutation<TResponse, unknown, TRequest>({
    mutationFn,
    onMutate: (variables: TRequest) => {
      if (needLoading) setLoading(true)
      options?.onMutate?.(variables)
    },
    onSuccess: async (data: TResponse, variables: TRequest, context: unknown): Promise<void> => {
      // delay 1s
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (needLoading) setLoading(false)
      if (successMessageKey) {
        toast.success(t(successMessageKey))
      }

      const queryKeys: string[] = Array.isArray(queryKeysToInvalidate)
        ? queryKeysToInvalidate
        : [queryKeysToInvalidate]

      queryKeys.forEach((key: string) => {
        void queryClient.invalidateQueries({ queryKey: [key] })
      })

      options?.onSuccess?.(data, variables, context)
    },
    onError: (error: unknown, variables: TRequest, context: unknown): void => {
      if (needLoading) setLoading(false)

      if (errorMessageKey) {
        toast.error(t(errorMessageKey))
      }
      options?.onError?.(error, variables, context)
    },
    ...options,
  })
}
