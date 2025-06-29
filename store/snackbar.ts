// stores/snackbar.ts
import { defineStore } from 'pinia'

interface SnackbarAction {
  text: string
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  color?: string
  handler?: () => void
  keepOpen?: boolean
}

interface SnackbarOptions {
  message: string
  color?: string
  timeout?: number
  actions?: SnackbarAction[] | null
}

interface SnackbarState {
  show: boolean
  message: string
  color: string
  timeout: number
  actions: SnackbarAction[] | null
}

export const useSnackbarStore = defineStore('snackbar', {
  state: (): SnackbarState => ({
    show: false,
    message: '',
    color: 'success',
    timeout: 4000,
    actions: null,
  }),

  actions: {
    // Método genérico para mostrar snackbar
    showSnackbar({
      message,
      color = 'success',
      timeout = 4000,
      actions = null,
    }: SnackbarOptions): void {
      this.message = message
      this.color = color
      this.timeout = timeout
      this.actions = actions
      this.show = true
    },

    // Métodos de conveniência para diferentes tipos
    showSuccess(message: string, timeout: number = 4000): void {
      this.showSnackbar({
        message,
        color: 'success',
        timeout,
      })
    },

    showError(message: string, timeout: number = 6000): void {
      this.showSnackbar({
        message,
        color: 'error',
        timeout,
      })
    },

    showWarning(message: string, timeout: number = 5000): void {
      this.showSnackbar({
        message,
        color: 'warning',
        timeout,
      })
    },

    showInfo(message: string, timeout: number = 4000): void {
      this.showSnackbar({
        message,
        color: 'info',
        timeout,
      })
    },

    // Método para fechar o snackbar
    hide(): void {
      this.show = false
    },

    // Método para snackbar com ações customizadas
    showWithActions({
      message,
      color = 'info',
      timeout = 0,
      actions,
    }: Required<Pick<SnackbarOptions, 'message' | 'actions'>> &
      Partial<Pick<SnackbarOptions, 'color' | 'timeout'>>): void {
      this.showSnackbar({
        message,
        color,
        timeout, // 0 = não fecha automaticamente
        actions,
      })
    },
  },
})
