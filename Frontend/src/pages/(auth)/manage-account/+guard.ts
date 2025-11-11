import type { GuardAsync } from 'vike/types'
import { render } from 'vike/abort'
import { RoleValue } from '#utils/constants/role.js'
import { getPermissionTypeName, PermissionType } from '#src/types/Enums/PermissionType.js'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (pageContext.user?.role === RoleValue.ADMIN) {
    return
  }
  if (!pageContext.user?.permission.includes(getPermissionTypeName(PermissionType.ReadUser))) {
    throw render(403)
  }
}
export { guard }
