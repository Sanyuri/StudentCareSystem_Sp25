import SideBarOfficer from './SideBarOfficer'
import useAuthStore from '#stores/authState.js'
import SideBarAdmin from './SideBarAdmin'
import SideBarManager from './SideBarManager'
import { RoleValue } from '#utils/constants/role.js'
import { SideBarProps } from '#types/Props/SidebarProp.js'

const SidebarComponent = ({ darkMode, collapsed, activeKey }: SideBarProps) => {
  const { role } = useAuthStore()
  switch (role) {
    case RoleValue.OFFICER:
      return <SideBarOfficer darkMode={darkMode} activeKey={activeKey} collapsed={collapsed} />
    case RoleValue.MANAGER:
      return <SideBarManager darkMode={darkMode} activeKey={activeKey} collapsed={collapsed} />
    case RoleValue.ADMIN:
      return <SideBarAdmin darkMode={darkMode} activeKey={activeKey} collapsed={collapsed} />
    default:
      return <></>
  }
}
export default SidebarComponent
