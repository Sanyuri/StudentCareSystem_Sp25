import { UseMutationResult } from '@tanstack/react-query'
import { SettingService } from '#src/services/SettingService.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'

export const useSettingMutation = (): UseMutationResult<unknown, unknown, FormData, unknown> =>
  useGenericMutation(
    SettingService.updateBackground,
    null, // Success toast translation key
    null, // Error toast translation key
    [], // Query keys to invalidate
  )

export const useDeleteSettingMutation = () => {
  return useGenericMutation<{ type: string }, unknown>(
    async ({ type }: { type: string }) => {
      return await SettingService.removeBackground(type)
    },
    null, // Success toast key
    null, // Error toast key
    [], // Query keys to invalidate
  )
}
