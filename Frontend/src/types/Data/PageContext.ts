declare global {
  namespace Vike {
    interface PageContext {
      // Type of pageContext.user
      user?: {
        role: string
        permission: string[]
      }
      nonce: string
      isProduction: boolean
      googleId: string
      googleReCaptchaKey: string
      abortStatusCode?: number
    }
  }
}

export {}
