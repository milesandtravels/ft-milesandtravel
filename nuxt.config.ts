// https://nuxt.com/docs/api/configuration/nuxt-config
// Removido import de VCalendar aqui para evitar erro de CSS no Node

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
      reverbAppKey: process.env.VITE_REVERB_APP_KEY,
      reverbHost: process.env.VITE_REVERB_HOST,
      reverbPort: process.env.VITE_REVERB_PORT,
      reverbScheme: process.env.VITE_REVERB_SCHEME,
    },
  },
  vuetify: {
    vuetifyOptions: {
      // Componentes Labs serão registrados localmente onde necessários
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
    redirectIfAuthenticated: false, // Desabilita redirecionamento automático
    redirectIfUnauthenticated: true,
    redirect: {
      keepRequestedRoute: true, // ✅ Preserva rota solicitada
      onLogin: false, // Desabilita redirecionamento automático após login
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
