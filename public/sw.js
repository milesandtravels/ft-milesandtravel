// Service Worker personalizado para Miles and Travel

// Importar workbox se necessário
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js')

if (workbox) {
  console.log('Workbox carregado com sucesso')
  
  // Configurações do workbox
  workbox.setConfig({ debug: false })
  
  // Estratégias de cache personalizadas
  
  // Cache para imagens
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
        }),
      ],
    })
  )
  
  // Cache para API calls
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutos
        }),
      ],
    })
  )
  
  // Cache para recursos estáticos
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'script' ||
      request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  )
  
} else {
  console.log('Workbox não pôde ser carregado')
}

// Event listeners personalizados
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado')
  event.waitUntil(self.clients.claim())
})

// Notificações push personalizadas
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body || 'Nova notificação do Miles and Travel',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
        ...data
      },
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/pwa-192x192.png'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Miles and Travel',
        options
      )
    )
  }
})

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/'
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        // Verificar se já existe uma janela aberta
        for (const client of clients) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Abrir nova janela se não existir
        if (self.clients.openWindow) {
          return self.clients.openWindow(url)
        }
      })
    )
  }
})