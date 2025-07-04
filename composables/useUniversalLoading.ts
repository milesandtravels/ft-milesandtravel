import { useLoadingStore } from '../store/loading'

export const useUniversalLoading = () => {
  const loadingStore = useLoadingStore()

  const showLoading = (
    text: string = 'Carregando...',
    showProgress: boolean = false
  ) => {
    loadingStore.startLoading(text, showProgress)
  }

  const hideLoading = () => {
    loadingStore.stopLoading()
  }

  const updateLoadingText = (text: string) => {
    loadingStore.updateText(text)
  }

  const updateLoadingProgress = (progress: number) => {
    loadingStore.updateProgress(progress)
  }

  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    loadingText: string = 'Carregando...',
    showProgress: boolean = false
  ): Promise<T> => {
    try {
      showLoading(loadingText, showProgress)
      const result = await asyncFn()
      return result
    } finally {
      hideLoading()
    }
  }

  return {
    showLoading,
    hideLoading,
    updateLoadingText,
    updateLoadingProgress,
    withLoading,
    isLoading: readonly(toRef(loadingStore, 'isLoading')),
  }
}
