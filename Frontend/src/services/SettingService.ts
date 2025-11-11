import { BaseService } from '#src/services/BaseService.js'
import { BACKGROUND_REMOVE_SETTINGS_URL, BACKGROUND_SETTING_URL } from '#utils/constants/api.js'

export const SettingService = {
  updateBackground: (body: FormData): Promise<void> => {
    return BaseService.postFile<void>(BACKGROUND_SETTING_URL, body)
  },
  removeBackground: (type: string): Promise<void> => {
    return BaseService.delete<void>(`${BACKGROUND_REMOVE_SETTINGS_URL}/${type}`)
  },
}
