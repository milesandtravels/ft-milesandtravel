// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: false,
  devtools: { enabled: true },
  modules: [
    'vuetify-nuxt-module',
    'nuxt-auth-sanctum',
  ],
  sanctum: {
    mode: 'token',
    baseUrl: 'https://api-dev.milesandtravels.com', // Laravel API
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true,
    endpoints : {
      login: '/api/login',
      logout: '/api/logout'
    },
  },
})