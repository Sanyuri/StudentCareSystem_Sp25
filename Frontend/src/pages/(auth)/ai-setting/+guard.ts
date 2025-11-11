import type { GuardAsync } from 'vike/types'
import { render } from 'vike/abort'
import { RoleValue } from '#utils/constants/role.js'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (pageContext.user?.role !== RoleValue.ADMIN) {
    throw render(403)
  }
}
export { guard }
