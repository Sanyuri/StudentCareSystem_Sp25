import type { GuardAsync, PageContextServer } from 'vike/types'
import { render } from 'vike/abort'
import { getPermissionTypeName, PermissionType } from '#src/types/Enums/PermissionType.js'

const guard: GuardAsync = async (pageContext: PageContextServer): ReturnType<GuardAsync> => {
  if (
    !pageContext.user?.permission.includes(
      getPermissionTypeName(PermissionType.ReadPsychologicalNote),
    )
  ) {
    throw render(403)
  }
}
export { guard }
