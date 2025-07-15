import { ref, computed } from 'vue'

export const usePwa = () => {
  const isInstalled = ref(false)
  const isOnline = ref(true)
  const updateAvailable = ref(false)
  const registration = ref<ServiceWorkerRegistration | null>(null)

  // Verificar se está instalado como PWA
  const checkInstallStatus = () => {
    if (process.client) {
      isInstalled.value = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
    }
  }

  // Verificar status online/offline
  const checkOnlineStatus = () => {
    if (process.client) {
      isOnline.value = navigator.onLine
      
      window.addEventListener('online', () => {
        isOnline.value = true
      })
      
      window.addEventListener('offline', () => {
        isOnline.value = false
      })
    }
  }

  // Registrar service worker
  const registerServiceWorker = async () => {
    if (process.client && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
        registration.value = reg
        
        // Verificar atualizações
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                updateAvailable.value = true
              }
            })
          }
        })
        
        console.log('Service Worker registrado com sucesso')
        return reg
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error)
        return null
      }
    }
    return null
  }

  // Atualizar aplicação
  const updateApp = async () => {
    if (registration.value?.waiting) {
      registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  // Compartilhar conteúdo (Web Share API)
  const shareContent = async (data: {
    title?: string
    text?: string
    url?: string
  }) => {
    if (process.client && navigator.share) {
      try {
        await navigator.share(data)
        return true
      } catch (error) {
        console.error('Erro ao compartilhar:', error)
        return false
      }
    }
    return false
  }

  // Verificar se Web Share API está disponível
  const canShare = computed(() => {
    return process.client && 'share' in navigator
  })

  // Solicitar permissão para notificações
  const requestNotificationPermission = async () => {
    if (process.client && 'Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // Enviar notificação local
  const showNotification = (title: string, options?: NotificationOptions) => {
    if (process.client && 'Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      })
    }
    return null
  }

  // Verificar capacidades do dispositivo
  const deviceCapabilities = computed(() => {
    if (!process.client) return {}
    
    return {
      hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      hasGeolocation: 'geolocation' in navigator,
      hasVibration: 'vibrate' in navigator,
      hasShare: 'share' in navigator,
      hasNotifications: 'Notification' in window,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasStorage: 'localStorage' in window,
      hasIndexedDB: 'indexedDB' in window
    }
  })

  // Inicializar PWA
  const initPwa = () => {
    if (process.client) {
      checkInstallStatus()
      checkOnlineStatus()
      registerServiceWorker()
    }
  }

  return {
    // Estados
    isInstalled: readonly(isInstalled),
    isOnline: readonly(isOnline),
    updateAvailable: readonly(updateAvailable),
    canShare,
    deviceCapabilities,
    
    // Métodos
    initPwa,
    updateApp,
    shareContent,
    requestNotificationPermission,
    showNotification,
    checkInstallStatus,
    registerServiceWorker
  }
}