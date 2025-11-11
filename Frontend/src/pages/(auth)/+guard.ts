import type { GuardAsync } from 'vike/types'
import { redirect } from 'vike/abort'
import { LOGIN_PATH } from '#utils/constants/path.js'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (!pageContext.user) {
    throw redirect(LOGIN_PATH)
  }
}

export { guard }
