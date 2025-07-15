// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: false,
  devtools: { enabled: true },
  vite: {
    server: {
      hmr: {
        port: 24678,
      },
    },
    define: {
      __VUE_PROD_DEVTOOLS__: false,
    },
  },
  modules: [
    'vuetify-nuxt-module',
    'nuxt-auth-sanctum',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],
  runtimeConfig: {
    public: {
      appCallbackRedirectUrl: process.env.APP_CALLBACK_REDIRECT_URL,
      appEnv: process.env.APP_ENV || 'local',
      googleTagCode: process.env.GOOGLE_TAG_CODE || '',
      onesignalAppId: process.env.ONESIGNAL_APP_ID,
      onesignalSafariWebId: process.env.ONESIGNAL_SAFARI_WEB_ID,
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#0F2B46',
            },
          },
        },
      },
    },
  },
  sanctum: {
    mode: 'token',
    baseUrl: process.env.API_URL, // Laravel API
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true,
    endpoints: {
      login: '/api/login',
      logout: '/api/logout',
    },
  },
  pwa: {
    registerType: 'prompt',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      type: 'module',
    },
    manifest: {
      name: 'Miles and Travel',
      short_name: 'M&T',
      description: 'Aplicativo de milhas e viagens',
      theme_color: '#0F2B46',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  },
})
