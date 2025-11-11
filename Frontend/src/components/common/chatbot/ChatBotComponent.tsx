import _ from 'lodash'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import useAuthStore from '#stores/authState.js'
import { FC, ReactNode, useEffect } from 'react'
import MarkdownRenderer, { MarkdownRendererBlock } from '@rcb-plugins/markdown-renderer'
import { useCurrentUserData } from '#hooks/api/auth/useUserData.js'
import { useChatBotData } from '#hooks/api/chatbot/useChatBotData.js'
import { ChatBotResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { useChatBotMutation } from '#hooks/api/chatbot/useChatBotMutation.js'
import ChatBot, { ChatBotProvider, Message, useChatHistory, useChatWindow } from 'react-chatbotify'
import { UserGuideUrl } from '#utils/constants/userGuide.js'

type ParamsType = {
  userInput: string
  injectMessage: (message: string) => void
  goToPath: (path: string) => void
}

const ChatBotComponent: FC = (): ReactNode => {
  const { t } = useTranslation()
  const { image } = useAuthStore()
  const plugins = [MarkdownRenderer()]
  const { data: user } = useCurrentUserData()

  const { mutateAsync: sendMessage } = useChatBotMutation()

  const helpOptions = [t('CHATBOT.SEARCH_STUDENT'), t('CHATBOT.USER_GUIDE')]

  const flow = {
    start: {
      message: t('CHATBOT.START'),
      transition: { duration: 1000 },
      path: 'showOptions',
    } as MarkdownRendererBlock,
    showOptions: {
      message: t('CHATBOT.HELP'),
      options: helpOptions,
      path: async (params: ParamsType) => {
        if (params.userInput === t('CHATBOT.SEARCH_STUDENT')) {
          return 'askStudentCode'
        }
        return 'loop'
      },
    },
    askStudentCode: {
      message: t('CHATBOT.SEARCH_STUDENT_GUIDE'),
      path: 'getStudentData',
    } as MarkdownRendererBlock,

    getStudentData: {
      message: async (params: ParamsType) => {
        return await handleSendMessage(params, t('CHATBOT.GET_DATA'))
      },
    },

    loop: {
      transition: { duration: 0 },
      message: async (params: ParamsType) => {
        return await handleUserMessage(params)
      },
    },
  }

  const settings = {
    chatWindow: { showScrollbar: true, autoJumpToBottom: false },
    tooltip: {
      mode: 'NEVER',
      text: 'SCS Chatbot',
    },
    chatButton: {
      // Using a data URL of your SVG
      icon: 'chat_icon.png',
    },
    header: {
      avatar: 'chat_icon.png',
      title: (
        <Typography.Title level={4} style={{ color: 'white' }}>
          SCS Chatbot
        </Typography.Title>
      ),
    },
    botBubble: {
      showAvatar: true,
      simStream: true,
      streamSpeed: 50,
      avatar: 'chat_icon.png',
    },
    userBubble: { showAvatar: true, avatar: image },

    chatHistory: {
      storageKey: 'conversations_summary',
      viewChatHistoryButtonText: t('CHATBOT.VIEW_HISTORY'),
    },
    event: {
      rcbLoadChatHistory: true,
    },
    footer: {
      text: t('CHATBOT.FOOTER_TEXT'),
    },
  }

  const styles = {
    headerStyle: {
      background: '#42b0c5',
      color: '#ffffff',
      padding: '10px',
    },
    chatWindowStyle: {
      backgroundColor: '#f2f2f2',
    },
  }
  const handleUserMessage = async (params: ParamsType) => {
    switch (params.userInput) {
      case t('CHATBOT.SEARCH_STUDENT'):
        return t('CHATBOT.SEARCH_STUDENT_GUIDE')
      case t('CHATBOT.USER_GUIDE'):
        params.injectMessage(t('CHATBOT.WAITING'))
        window.open(UserGuideUrl)
        return

      default:
        return await handleSendMessage(params)
    }
  }
  const handleSendMessage = async (params: ParamsType, subMessage?: string) => {
    await sendMessage(
      {
        // eslint-disable-next-line camelcase
        user_id: user?.id ?? '',
        message: subMessage ? subMessage + ' ' + params.userInput : params.userInput,
      },
      {
        onSuccess: (data: ChatBotResponse): void => {
          params.injectMessage(_.last(data)?.content ?? '')
          params.goToPath('showOptions')
        },
        onError: () => {
          params.injectMessage(t('CHATBOT.ERROR_MESSAGE'))
          params.goToPath('showOptions')
        },
      },
    )
  }

  return (
    <ChatBotProvider>
      <MyNestedComponent />
      <ChatBot plugins={plugins} flow={flow} settings={settings} styles={styles} />
    </ChatBotProvider>
  )
}

export default ChatBotComponent

const MyNestedComponent: FC = () => {
  const { data: user } = useCurrentUserData()
  const { data: chatData } = useChatBotData(user?.id)

  const { toggleChatWindow } = useChatWindow()
  const { setHistoryMessages } = useChatHistory()
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      // check if ctrl + m is pressed
      if (event.ctrlKey && event.key === 'm') {
        // open chat window
        void toggleChatWindow()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [toggleChatWindow])

  useEffect(() => {
    const messages: Message[] =
      chatData?.messages?.map((chat) => ({
        content: chat.content || '',
        id: chat.id || '',
        type: 'string',
        timestamp: Date.now().toString() || '',
        sender: chat.type === 'AIMessage' ? 'BOT' : 'USER',
      })) || []
    // Set the formatted messages to the chat history
    if (messages) {
      setHistoryMessages(messages)
    }
  }, [chatData, setHistoryMessages])

  return null
}
