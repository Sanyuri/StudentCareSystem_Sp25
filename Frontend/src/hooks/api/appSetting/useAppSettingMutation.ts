import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { AppSetting } from '#types/Data/AppSetting.js'
import { AppSettingService } from '#src/services/AppSettingService.js'

export const useAppSettingMutation = () => {
  return useGenericMutation<
    {
      id: string
      appSettingRequest: AppSetting
    },
    unknown
  >(
    async ({
      id,
      appSettingRequest,
    }: {
      id: string
      appSettingRequest: AppSetting
    }): Promise<unknown> => {
      return await AppSettingService.update(id, appSettingRequest)
    },
    'SETTINGS.TOAST.SUCCESS', // Success toast translation key
    'SETTINGS.TOAST.ERROR', // Error toast translation key
    ['app-settings'], // Query keys to invalidate
  )
}
