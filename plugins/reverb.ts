import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Configure Pusher
  window.Pusher = Pusher

  // Create Echo instance
  const echo = new Echo({
    broadcaster: 'reverb',
    key: config.public.reverbAppKey || 'app-key',
    wsHost: config.public.reverbHost || 'localhost',
    wsPort: config.public.reverbPort || 8080,
    wssPort: config.public.reverbPort || 8080,
    forceTLS: (config.public.reverbScheme ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
  })

  // Make Echo available globally
  return {
    provide: {
      echo
    }
  }
})