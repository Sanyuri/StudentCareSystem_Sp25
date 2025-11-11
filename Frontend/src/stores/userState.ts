import { CurrentUserResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { create, StoreApi, UseBoundStore } from 'zustand'

type UserStore = {
  user: CurrentUserResponse | null
  setUser: (user: CurrentUserResponse) => void
  clearUser: () => void
}

export const useUserStore: UseBoundStore<StoreApi<UserStore>> = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
