// stores/loading.ts
import { defineStore } from 'pinia'

interface LoadingState {
  isLoading: boolean
  loadingText: string
  loadingProgress: number
  showProgress: boolean
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    isLoading: false,
    loadingText: 'Carregando...',
    loadingProgress: 0,
    showProgress: false,
  }),

  actions: {
    startLoading(
      text: string = 'Carregando...',
      showProgress: boolean = false
    ) {
      this.isLoading = true
      this.loadingText = text
      this.showProgress = showProgress
      this.loadingProgress = 0

      // Bloqueia o scroll da página
      if (process.client) {
        document.body.style.overflow = 'hidden'
      }
    },

    stopLoading() {
      this.isLoading = false
      this.loadingText = 'Carregando...'
      this.loadingProgress = 0
      this.showProgress = false

      // Restaura o scroll da página
      if (process.client) {
        document.body.style.overflow = 'auto'
      }
    },

    updateProgress(progress: number) {
      if (this.showProgress) {
        this.loadingProgress = Math.min(100, Math.max(0, progress))
      }
    },

    updateText(text: string) {
      this.loadingText = text
    },
  },
})
