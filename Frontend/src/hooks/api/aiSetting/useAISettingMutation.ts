import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { AIService } from '#src/services/AIService.js'
import { AISettingRequest } from '#src/types/RequestModel/AISettingRequest.js'

export const useAISettingMutation = () => {
  return useGenericMutation<AISettingRequest, unknown>(
    async (aiSettingRequest: AISettingRequest): Promise<unknown> => {
      return await AIService.updateAgent(aiSettingRequest)
    },
    'SETTINGS.TOAST.SUCCESS', // Success toast translation key
    'SETTINGS.TOAST.ERROR', // Error toast translation key
    ['ai-settings'], // Query keys to invalidate
  )
}
