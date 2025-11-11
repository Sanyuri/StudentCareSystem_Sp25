import { PSYCHOLOGY_NOTE_BASE_URL, PSYCHOLOGY_NOTE_DETAIL_URL } from '#utils/constants/api.js'

export const TokenManagerService = {
  shouldCheckToken(url: string): boolean {
    const apiRequiresToken: string[] = [
      //   '_proxy/api/PsychologyNotes',
      PSYCHOLOGY_NOTE_BASE_URL,
      PSYCHOLOGY_NOTE_DETAIL_URL,
    ]
    return apiRequiresToken.some((path) => url.includes(path))
  },

  getToken(): string | null {
    return localStorage.getItem('StudentPsychology')
  },

  checkTokenValid(): boolean {
    const token: string | null = TokenManagerService.getToken()
    return token !== null && token.length > 0
  },
}
