import { AISettingRequest } from '#src/types/RequestModel/AISettingRequest.js'
import { ChatBotRequest } from '#src/types/RequestModel/ChatBotRequest.js'
import {
  ChatBotResponse,
  GetAISettingResponse,
  GetChatBotResponse,
} from '#src/types/ResponseModel/ApiResponse.js'
import { CHATBOT_SETTINGS, CHATBOT_URL } from '#utils/constants/api.js'
import { BaseAIService } from './BaseAIService'

export const AIService = {
  getChat: (params?: string): Promise<GetChatBotResponse> => {
    return BaseAIService.get<GetChatBotResponse>(`${CHATBOT_URL}/?user_id=${params}`)
  },
  postChat: (body: ChatBotRequest): Promise<ChatBotResponse> => {
    return BaseAIService.post<ChatBotResponse>(`${CHATBOT_URL}/`, body)
  },
  getCurrentAgent: (): Promise<GetAISettingResponse> => {
    return BaseAIService.get<GetAISettingResponse>(`${CHATBOT_SETTINGS}/`)
  },
  updateAgent: (body: AISettingRequest): Promise<GetAISettingResponse> => {
    return BaseAIService.post<GetAISettingResponse>(`${CHATBOT_SETTINGS}/`, body)
  },
}
