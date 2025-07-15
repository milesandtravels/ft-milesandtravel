export default defineNuxtPlugin(() => {
  // Plugin para garantir que o PWA funcione corretamente
  if (process.client) {
    // Aguardar o DOM estar pronto
    document.addEventListener('DOMContentLoaded', () => {
      // Verificar se há service worker registrado
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          console.log('Service Workers registrados:', registrations.length)
        })
      }
    })

    // Prevenir múltiplas atualizações simultâneas
    let updateInProgress = false

    window.addEventListener('beforeunload', () => {
      updateInProgress = true
    })

    // Monitorar mudanças no service worker sem interceptar reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!updateInProgress) {
          console.log('Service Worker atualizado')
        }
      })
    }
  }
})
