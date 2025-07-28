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
    redirect: {
      keepRequestedRoute: true, // ✅ Preserva rota solicitada
      onLogin: '/', // Fallback se não houver redirect
      onLogout: '/login',
      onAuthOnly: '/login', // Para rotas protegidas
      onGuestOnly: '/', // Se já logado tenta acessar login
    },
    endpoints: {
      login: '/api/login',
      logout: '/api/logout',
    },
  },
})
