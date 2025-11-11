import { BaseService } from '#src/services/BaseService.js'
import { AppSettingResponse } from '#types/ResponseModel/ApiResponse.js'
import { APP_SETTINGS_URL } from '#utils/constants/api.js'
import { AppSetting } from '#types/Data/AppSetting.js'

export const AppSettingService = {
  getAll: (): Promise<AppSettingResponse> => {
    return BaseService.get<AppSettingResponse>(APP_SETTINGS_URL)
  },
  update: (id: string, body: AppSetting): Promise<AppSettingResponse> => {
    return BaseService.put<AppSettingResponse>(`${APP_SETTINGS_URL}/${id}`, body)
  },
}
