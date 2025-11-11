import { render } from 'vike/abort'
import { GuardAsync } from 'vike/types'
import { getPermissionTypeName, PermissionType } from '#src/types/Enums/PermissionType.js'
import { RoleValue } from '#utils/constants/role.js'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (pageContext.user?.role === RoleValue.ADMIN) {
    return
  }
  if (!pageContext.user?.permission.includes(getPermissionTypeName(PermissionType.ReadEmailLog))) {
    throw render(403)
  }
}
export { guard }
