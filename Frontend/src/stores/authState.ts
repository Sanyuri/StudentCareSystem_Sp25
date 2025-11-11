import { persist } from 'zustand/middleware'
import { create } from 'zustand'
import { encryptStorage } from '#utils/helper/storage.js'

interface AuthState {
  accessToken: string | null
  campusCode: string | null
  campusName: string | null
  refreshToken: string | null
  role: string | null
  name: string | null
  email: string | null
  image: string
  setAuthData: (
    accessToken: string,
    refreshToken: string,
    role: string,
    name: string,
    email: string,
    image: string,
  ) => void
  clearTokens: () => void
  setCampusCode: (campusCode: string, campusName: string) => void
  updateToken: (accessToken: string, refreshToken: string) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      campusCode: null,
      campusName: '',
      refreshToken: null,
      role: null,
      name: null,
      email: null,
      image: '',
      setCampusCode: (campusCode: string, campusName: string): void =>
        set({ campusCode, campusName }),
      setAuthData: (
        accessToken: string,
        refreshToken: string,
        role: string,
        name: string,
        email: string,
        image: string,
      ): void =>
        set({
          accessToken,
          refreshToken,
          role,
          name,
          email,
          image,
        }),
      clearTokens: (): void =>
        set({
          accessToken: null,
          campusCode: null,
          campusName: '',
          refreshToken: null,
          role: null,
          name: null,
          email: null,
          image: '',
        }),
      getRole: (): string | null => get().role,
      updateToken: (accessToken: string, refreshToken: string): void =>
        set({
          accessToken,
          refreshToken,
        }),
    }),
    {
      name: 'app-storage',
      serialize: (state): string => encryptStorage.encryptValue(JSON.stringify(state)),
      deserialize: (encryptedState) => JSON.parse(encryptStorage.decryptValue(encryptedState)),
    },
  ),
)
export default useAuthStore
