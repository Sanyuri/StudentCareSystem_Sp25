import { create, StoreApi, UseBoundStore } from 'zustand'

interface LoadingState {
  loading: boolean
  setLoading: (loading: boolean) => void
  loadingSider: string | null
  setLoadingSider: (loading: string | null) => void
}

const useLoadingStore: UseBoundStore<StoreApi<LoadingState>> = create<LoadingState>()((set) => ({
  loading: false,
  setLoading: (loading: boolean): void =>
    set({
      loading,
    }),

  // this loading is to manage the loading state when navigating between pages from sider
  loadingSider: null,
  setLoadingSider: (loading: string | null): void =>
    set({
      loadingSider: loading,
    }),
}))
export default useLoadingStore
