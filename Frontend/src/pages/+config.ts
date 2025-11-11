import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import vikeReactQuery from 'vike-react-query/config'
import Wrapper from '#utils/providers/Wrapper.js'
import Head from '#src/layout/HeadDefault.js'
import { TIME_CACHE_API, WEB_NAME } from '#src/configs/WebConfig.js'
// Default configs (can be overridden by pages)
export default {
  Wrapper,
  Head,
  title: WEB_NAME,
  ssr: false,
  passToClient: ['user', 'nonce', 'isProduction', 'googleId', 'googleReCaptchaKey'],

  // config react query
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: TIME_CACHE_API,
        refetchOnWindowFocus: false,
      },
    },
  },
  extends: [vikeReactQuery, vikeReact],
} satisfies Config
