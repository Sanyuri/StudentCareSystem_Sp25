import { FC, ReactElement } from 'react'
import { Switch } from 'antd'
import useTemplateStore from '#stores/templateState.js'

const DarkModeSwitch: FC = (): ReactElement => {
  const { darkMode, toggleDarkMode } = useTemplateStore()

  return (
    <Switch
      checked={darkMode}
      onChange={toggleDarkMode}
      checkedChildren='🌙'
      unCheckedChildren='☀️'
    />
  )
}

export default DarkModeSwitch
