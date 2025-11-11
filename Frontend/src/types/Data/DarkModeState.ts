export interface TemplateState {
  darkMode: boolean
  fontStyle: string
  toggleDarkMode: () => void
  setDarkMode: (value: boolean) => void
  setFontStyle: (value: string) => void
}
