import { navigate } from 'vike/client/router'
import useLoadingStore from '#stores/loadingState.js'
import { NAVIGATE_DELAY } from '#src/configs/WebConfig.js'

interface NavigateSiderProps {
  path: string
  loadingKey: string
}

export function useNavigateWithLoading() {
  const { setLoadingSider } = useLoadingStore()

  const navigateWithLoading = async ({ path, loadingKey }: NavigateSiderProps) => {
    setLoadingSider(loadingKey)
    const navigationPromise: Promise<void> = navigate(path)

    // Delay to show the loading spinner
    await new Promise<void>((resolve) => setTimeout(resolve, NAVIGATE_DELAY))

    await navigationPromise
    setLoadingSider(null)
  }

  return { navigateWithLoading }
}
