import type { GuardAsync } from 'vike/types'
import { RoleValue } from '#utils/constants/role.js'
import { render } from 'vike/abort'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (pageContext.user?.role === RoleValue.ADMIN) {
    return
  }

  throw render(403)
}
export { guard }
