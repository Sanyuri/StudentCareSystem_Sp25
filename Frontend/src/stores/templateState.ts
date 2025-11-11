import { encryptStorage } from '#utils/helper/storage.js'
import { create, StoreApi, UseBoundStore } from 'zustand'
import { TemplateState } from '#types/Data/DarkModeState.js'
import { reload } from 'vike/client/router'

const useTemplateStore: UseBoundStore<StoreApi<TemplateState>> = create<TemplateState>((set) => ({
  darkMode: JSON.parse(encryptStorage.getItem('darkMode') ?? 'false'), // Initialize from encryptStorage
  fontStyle: encryptStorage.getItem('fontStyle') ?? 'Roboto, sans-serif',
  toggleDarkMode: async (): Promise<void> => {
    const storedMode: string | undefined = encryptStorage.getItem('darkMode') // Remove redundant await
    const currentMode: string = JSON.parse(storedMode ?? 'false') // JSON.parse works synchronously
    const newMode: boolean = !currentMode

    set(() => ({ darkMode: newMode }))

    encryptStorage.setItem('darkMode', JSON.stringify(newMode))

    await reload()
  },

  setDarkMode: (value: boolean): void => {
    encryptStorage.setItem('darkMode', JSON.stringify(value)) // Sync with encryptStorage
    set({ darkMode: value })
  },
  setFontStyle: (value: string): void => {
    encryptStorage.setItem('fontStyle', value) // Sync with encryptStorage
    set({ fontStyle: value })
  },
}))

export default useTemplateStore
